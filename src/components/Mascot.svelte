<script lang="ts">
  import { onMount } from 'svelte';
  import type { Theme } from '../lib/settings';
  import type { CharacterVariant } from '../data/assets';

  export let variant: CharacterVariant = 'default';
  export let theme: Theme = 'light';
  export let interactive = true;
  export let eyeColor: string | null = null;

  // Mascot Elements
  let svgEl: SVGSVGElement;

  // Unique ID suffix to prevent SVG clip-path sharing across multiple instances
  const uid = Math.random().toString(36).substring(2, 9);

  // Eye centers (relative to SVG viewBox 0 0 140 107)
  const leftEyeCenter = { x: 62.5, y: 53.5 };
  const rightEyeCenter = { x: 102.5, y: 53.5 };
  const maxDistX = 7.0;
  const maxDistY = 4.5;

  // Interaction States (Offsets updated via LERP)
  let leftX = 0;
  let leftY = 0;
  let rightX = 0;
  let rightY = 0;
  let currentCrop = -15;

  let targetLeftX = 0;
  let targetLeftY = 0;
  let targetRightX = 0;
  let targetRightY = 0;
  let targetCrop = -15;

  // State flags for animations
  let isIdle = false;
  let isBlinking = false;
  let isFlinching = false;
  let isJumping = false;
  let leftEarWiggling = false;
  let rightEarWiggling = false;

  // Real-time ear tracking states
  let leftEarRot = 0;
  let rightEarRot = 0;
  let targetLeftEarRot = 0;
  let targetRightEarRot = 0;

  // Timers
  let idleTimeout: any;
  let animFrameId: number;
  let blinkTimeout: any;
  let wiggleTimeout: any;

  // Dynamic eye coloring and pupil dimensions based on variant/tone
  $: eyeBgColor = (() => {
    if (eyeColor) return eyeColor;
    if (variant === 'sleepy') return '#f1f1f1';
    if (variant === 'default') {
      return theme === 'light' ? '#ffffff' : '#ffb938';
    }
    if (variant === 'wide') return '#60ff48';
    if (variant === 'mint') return '#48ffd1';
    if (variant === 'green') return '#60ff48';
    return theme === 'light' ? '#ffffff' : '#ffb938';
  })();

  $: pupilRx = (() => {
    if (isIdle) return 12.5;
    if (variant === 'sleepy') return 6.5;
    if (variant === 'default') return 6.5;
    if (variant === 'wide') return 5.0;
    if (variant === 'mint') return 6.5;
    if (variant === 'green') return 12.5;
    return 6.5;
  })();

  $: pupilRy = (() => {
    if (isIdle) return 12.5;
    if (variant === 'sleepy') return 10.0;
    if (variant === 'default') return 10.0;
    if (variant === 'wide') return 10.0;
    if (variant === 'mint') return 10.0;
    if (variant === 'green') return 12.5;
    return 10.0;
  })();

  $: baseCrop = variant === 'sleepy' ? 5.5 : -15;

  // Handle Mascot Tone / Variant changes
  $: {
    if (variant) {
      targetCrop = baseCrop;
      resetIdleTimer();
      // 슬라이더바 클릭/드래그 변경으로 인한 variant 전환 시에는 진동 버그 방지를 위해 flinch 트리거를 생략
    }
  }

  function handleMascotClick(e: MouseEvent) {
    if (!interactive) return;
    e.stopPropagation();

    // Trigger physical jump animation
    if (!isJumping) {
      isJumping = true;
      setTimeout(() => (isJumping = false), 600);
    }
  }

  function handleMascotKeydown(e: KeyboardEvent) {
    if (!interactive || (e.key !== 'Enter' && e.key !== ' ')) return;
    e.preventDefault();
    handleMascotClick(e as unknown as MouseEvent);
  }

  // Blinking animation
  function triggerBlink() {
    const isFullySquinted = targetCrop > -5;
    if (!isIdle && !isFullySquinted) {
      isBlinking = true;
      setTimeout(() => {
        isBlinking = false;
        scheduleNextBlink();
      }, 120);
    } else {
      scheduleNextBlink();
    }
  }

  function scheduleNextBlink() {
    clearTimeout(blinkTimeout);
    const randomDelay = 3000 + Math.random() * 5000;
    blinkTimeout = setTimeout(triggerBlink, randomDelay);
  }

  // Ear wiggling animation
  function wiggleEar(side: 'left' | 'right') {
    if (side === 'left') {
      leftEarWiggling = true;
      setTimeout(() => (leftEarWiggling = false), 500);
    } else {
      rightEarWiggling = true;
      setTimeout(() => (rightEarWiggling = false), 500);
    }
  }

  function triggerEarWiggle() {
    if (leftEarWiggling || rightEarWiggling) {
      scheduleNextWiggle();
      return;
    }
    const rand = Math.random();
    if (rand < 0.45) {
      wiggleEar('left');
    } else if (rand < 0.9) {
      wiggleEar('right');
    } else {
      wiggleEar('left');
      wiggleEar('right');
    }
    scheduleNextWiggle();
  }

  function scheduleNextWiggle() {
    clearTimeout(wiggleTimeout);
    const randomDelay = 4000 + Math.random() * 6000;
    wiggleTimeout = setTimeout(triggerEarWiggle, randomDelay);
  }

  // Flinch animation (on container enter or mousedown)
  function triggerFlinch() {
    if (!interactive) return;
    resetIdleTimer();
    isFlinching = true;
    setTimeout(() => (isFlinching = false), 500);
    setTimeout(() => {
      targetLeftEarRot = 0;
      targetRightEarRot = 0;
    }, 700);

    wiggleEar('left');
    setTimeout(() => wiggleEar('right'), 120);
  }

  // Idle Timer
  function resetIdleTimer() {
    isIdle = false;
    clearTimeout(idleTimeout);
    idleTimeout = setTimeout(() => {
      isIdle = true;
      targetLeftX = 0;
      targetLeftY = 0;
      targetRightX = 0;
      targetRightY = 0;
      targetCrop = baseCrop;
    }, 10000);
  }

  // Mouse / Touch Tracking
  function handleMouseMove(e: MouseEvent) {
    if (!interactive || !svgEl) return;
    resetIdleTimer();

    // 1. Calculate screen distance for squinting and interactive glow
    const rect = svgEl.getBoundingClientRect();
    const mascotCenterX = rect.left + rect.width / 2;
    const mascotCenterY = rect.top + rect.height / 2;
    const screenDist = Math.hypot(e.clientX - mascotCenterX, e.clientY - mascotCenterY);

    const maxInfluenceDist = 180;
    const minInfluenceDist = 30;
    let narrowFactor = (screenDist - minInfluenceDist) / (maxInfluenceDist - minInfluenceDist);
    narrowFactor = Math.max(0, Math.min(1, narrowFactor));

    // Squint angle crop (찡그림)
    if (variant === 'sleepy') {
      targetCrop = 5.5;
    } else {
      targetCrop = (1 - narrowFactor) * 23 - 15;
    }

    // 2. Transform mouse pointer to local SVG coordinates
    try {
      const svgPoint = svgEl.createSVGPoint();
      svgPoint.x = e.clientX;
      svgPoint.y = e.clientY;
      const ctm = svgEl.getScreenCTM();
      if (!ctm) return;

      const localPt = svgPoint.matrixTransform(ctm.inverse());

      // Ear Rotation (마우스가 다가오거나 움직이는 방향에 따라 귀가 미세하게 쫑긋할 수 있도록)
      const centerMassX = 82.5; // Mascot middle X
      const relativeX = (localPt.x - centerMassX) / 60; // scale down
      const clampedRelX = Math.max(-1, Math.min(1, relativeX));
      targetLeftEarRot = clampedRelX * 2;
      targetRightEarRot = clampedRelX * 2;

      // Left eye offset
      const dxLeft = localPt.x - leftEyeCenter.x;
      const dyLeft = localPt.y - leftEyeCenter.y;
      const distLeft = Math.hypot(dxLeft, dyLeft);
      const angleLeft = Math.atan2(dyLeft, dxLeft);

      // Right eye offset
      const dxRight = localPt.x - rightEyeCenter.x;
      const dyRight = localPt.y - rightEyeCenter.y;
      const distRight = Math.hypot(dxRight, dyRight);
      const angleRight = Math.atan2(dyRight, dxRight);

      // Pupil influence range
      const pupilInfluenceDist = 180;
      const scaleLeft = Math.min(distLeft / pupilInfluenceDist, 1);
      const scaleRight = Math.min(distRight / pupilInfluenceDist, 1);

      targetLeftX = isIdle ? 0 : Math.cos(angleLeft) * scaleLeft * maxDistX;
      targetLeftY = isIdle ? 0 : Math.sin(angleLeft) * scaleLeft * maxDistY;

      targetRightX = isIdle ? 0 : Math.cos(angleRight) * scaleRight * maxDistX;
      targetRightY = isIdle ? 0 : Math.sin(angleRight) * scaleRight * maxDistY;
    } catch (err) {
      console.error('Error transforming coordinates:', err);
    }
  }

  function handleMouseLeave() {
    targetLeftX = 0;
    targetLeftY = 0;
    targetRightX = 0;
    targetRightY = 0;
    targetCrop = baseCrop;
    targetLeftEarRot = 0;
    targetRightEarRot = 0;
  }

  function handleTouch(e: TouchEvent) {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      handleMouseMove({
        clientX: touch.clientX,
        clientY: touch.clientY
      } as MouseEvent);
    }
  }

  // Animation Loop (LERP)
  function animate() {
    const lerpFactor = 0.12;

    leftX += (targetLeftX - leftX) * lerpFactor;
    leftY += (targetLeftY - leftY) * lerpFactor;
    rightX += (targetRightX - rightX) * lerpFactor;
    rightY += (targetRightY - rightY) * lerpFactor;
    currentCrop += (targetCrop - currentCrop) * lerpFactor;
    leftEarRot += (targetLeftEarRot - leftEarRot) * lerpFactor;
    rightEarRot += (targetRightEarRot - rightEarRot) * lerpFactor;

    animFrameId = requestAnimationFrame(animate);
  }

  onMount(() => {
    if (!interactive) return;

    // Listeners
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchstart', handleTouch, { passive: true });
    window.addEventListener('touchmove', handleTouch, { passive: true });
    window.addEventListener('touchend', handleMouseLeave);

    // Initial triggers
    resetIdleTimer();
    scheduleNextBlink();
    scheduleNextWiggle();

    // Start loop
    animFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchstart', handleTouch);
      window.removeEventListener('touchmove', handleTouch);
      window.removeEventListener('touchend', handleMouseLeave);
      cancelAnimationFrame(animFrameId);
      clearTimeout(idleTimeout);
      clearTimeout(blinkTimeout);
      clearTimeout(wiggleTimeout);
    };
  });
</script>

<div class="character-container" role="presentation">
  <!-- SVG Mascot -->
  <svg
    class="blob-svg"
    class:flinch={isFlinching}
    class:jump={isJumping}
    viewBox="0 0 140 107"
    xmlns="http://www.w3.org/2000/svg"
    bind:this={svgEl}
    role="button"
    tabindex="0"
    aria-label="상호작용 캐릭터"
    on:mouseenter={triggerFlinch}
    on:mousedown={triggerFlinch}
    on:click={handleMascotClick}
    on:keydown={handleMascotKeydown}
  >
    <defs>
      <!-- Eye area clip paths -->
      <clipPath id="left-eye-clip-{uid}">
        <circle cx="62.5" cy="53.5" r="15.5" />
      </clipPath>
      <clipPath id="right-eye-clip-{uid}">
        <circle cx="102.5" cy="53.5" r="15.5" />
      </clipPath>

      <!-- Eye squinting slant crop paths -->
      <clipPath id="left-angry-slant-{uid}">
        <rect x="30" y="48" width="65" height="100" transform="translate(0, {currentCrop.toFixed(2)})" />
      </clipPath>
      <clipPath id="right-angry-slant-{uid}">
        <rect x="70" y="48" width="65" height="100" transform="translate(0, {currentCrop.toFixed(2)})" />
      </clipPath>
    </defs>

    <!-- Left Ear -->
    <g
      id="left-ear"
      class="ear-group"
      class:wiggle-left={leftEarWiggling}
      style="transform: rotate({leftEarRot.toFixed(1)}deg); transform-origin: 48px 22px;"
    >
      <path d="M45.2483 2.52571C55.7238 0.791314 62.9185 13.3046 64.1504 22.0698L33.6538 27.119C32.825 17.5235 34.7728 4.26011 45.2483 2.52571Z" />
    </g>

    <!-- Right Ear -->
    <g
      id="right-ear"
      class="ear-group"
      class:wiggle-right={rightEarWiggling}
      style="transform: rotate({rightEarRot.toFixed(1)}deg); transform-origin: 84px 22px;"
    >
      <path d="M87.9087 2.52571C77.4332 0.791314 70.2385 13.3046 69.0066 22.0698L99.5031 27.119C100.332 17.5235 98.3842 4.26011 87.9087 2.52571Z" />
    </g>

    <!-- Cat Body -->
    <path class="blob-body" d="M140 63.2597C140 96.5799 108.66 107 70 107C31.3401 107 0 96.5799 0 63.2597C0 29.9395 31.3401 16 70 16C108.66 16 140 29.9395 140 63.2597Z" />

    <!-- Left Eye -->
    <g class="eye-group" class:blinking={isBlinking} id="left-eye" clip-path="url(#left-eye-clip-{uid})">
      <g clip-path="url(#left-angry-slant-{uid})">
        <circle class="eye-bg" style="fill: {eyeBgColor}" cx="62.5" cy="53.5" r="15.5" />
        <ellipse id="left-pupil" class="pupil" transform="translate({leftX.toFixed(2)}, {leftY.toFixed(2)})" cx="62.5" cy="53.5" rx={pupilRx} ry={pupilRy} />
      </g>
    </g>

    <!-- Right Eye -->
    <g class="eye-group" class:blinking={isBlinking} id="right-eye" clip-path="url(#right-eye-clip-{uid})">
      <g clip-path="url(#right-angry-slant-{uid})">
        <circle class="eye-bg" style="fill: {eyeBgColor}" cx="102.5" cy="53.5" r="15.5" />
        <ellipse id="right-pupil" class="pupil" transform="translate({rightX.toFixed(2)}, {rightY.toFixed(2)})" cx="102.5" cy="53.5" rx={pupilRx} ry={pupilRy} />
      </g>
    </g>
  </svg>
</div>
