<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { iconAssets } from '../data/assets';
  import { uiText } from '../data/translations';
  import {
    clampWindowPosition,
    getInitialSettingWindowPosition,
    SETTINGS_WINDOW_SIZE,
    type Theme,
    type WindowPosition,
    type WindowSize
  } from '../lib/settings';

  export let open = false;
  export let theme: Theme = 'light';

  const dispatch = createEventDispatcher<{
    close: void;
    themeChange: Theme;
  }>();

  let position: WindowPosition = { x: 0, y: 0 };
  let dragOffset: WindowPosition = { x: 0, y: 0 };
  let dragging = false;
  let mounted = false;
  let wasOpen = false;

  $: themeIcons = iconAssets[theme];
  $: text = uiText;

  function viewport() {
    return { width: window.innerWidth, height: window.innerHeight };
  }

  function currentWindowSize(): WindowSize {
    const { width, height } = viewport();
    return {
      width: Math.min(SETTINGS_WINDOW_SIZE.width, Math.max(280, width - 32)),
      height: Math.min(SETTINGS_WINDOW_SIZE.height, Math.max(180, height - 32))
    };
  }

  function resetPosition() {
    position = getInitialSettingWindowPosition(currentWindowSize(), viewport());
  }

  function startDrag(event: PointerEvent) {
    if (event.button !== 0) return;
    dragging = true;
    dragOffset = {
      x: event.clientX - position.x,
      y: event.clientY - position.y
    };
    window.addEventListener('pointermove', onDrag);
    window.addEventListener('pointerup', stopDrag, { once: true });
  }

  function onDrag(event: PointerEvent) {
    if (!dragging) return;
    position = clampWindowPosition(
      {
        x: event.clientX - dragOffset.x,
        y: event.clientY - dragOffset.y
      },
      currentWindowSize(),
      viewport()
    );
  }

  function stopDrag() {
    dragging = false;
    window.removeEventListener('pointermove', onDrag);
  }

  onMount(() => {
    mounted = true;
    resetPosition();
    const resize = () => {
      position = clampWindowPosition(position, currentWindowSize(), viewport());
    };
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  });

  $: if (mounted && open && !wasOpen) {
    resetPosition();
    wasOpen = true;
  } else if (!open) {
    wasOpen = false;
  }
</script>

{#if open}
  <div
    class="settings-window"
    class:dragging
    style={`left:${position.x}px; top:${position.y}px;`}
    role="dialog"
    aria-label={text.settingsDialogLabel}
  >
    <button class="settings-window__drag" type="button" on:pointerdown={startDrag} aria-label={text.settingsMoveLabel}></button>
    <button class="settings-window__close" type="button" aria-label={text.settingsCloseLabel} on:click={() => dispatch('close')}>
      <img src={themeIcons.close} alt="" aria-hidden="true" />
    </button>

    <div class="settings-window__rows">
      <div class="settings-window__row">
        <img class="figma-icon figma-icon--28" src={themeIcons.moon} alt="" aria-hidden="true" />
        <div class="segmented" role="group" aria-label={text.themeGroupLabel}>
          <button class:active={theme === 'light'} type="button" on:click={() => dispatch('themeChange', 'light')}>{text.lightTheme}</button>
          <button class:active={theme === 'dark'} type="button" on:click={() => dispatch('themeChange', 'dark')}>{text.darkTheme}</button>
        </div>
      </div>
    </div>
  </div>
{/if}
