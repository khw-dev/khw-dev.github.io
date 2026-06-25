document.addEventListener('DOMContentLoaded', () => {
  // 테마 토글
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeMeta = document.querySelector('meta[name="color-scheme"]');

  // Mascot 요소
  const container = document.querySelector('.character-container');
  const svg = document.querySelector('.blob-svg');
  const leftEye = document.getElementById('left-eye');
  const rightEye = document.getElementById('right-eye');
  const leftPupil = document.getElementById('left-pupil');
  const rightPupil = document.getElementById('right-pupil');
  const leftEar = document.getElementById('left-ear');
  const rightEar = document.getElementById('right-ear');
  const leftSlantPath = document.getElementById('left-slant-path');
  const rightSlantPath = document.getElementById('right-slant-path');

  // 1. 테마 및 언어 데이터 정의
  const translations = {
    ko: {
      title: 'khw-dev : 개발 준비 중',
      status: '개발 준비 중입니다',
      desc: '개발 준비 중인 포트폴리오 웹사이트입니다.',
      themeToggle: '테마 전환',
      langToggle: '언어 전환',
      themes: {
        light: '라이트 테마',
        ocean: '오션 테마',
        dark: '다크 테마',
        black: '블랙 테마'
      },
      langs: {
        ko: '한국어',
        en: '영어'
      },
      bubbleQuotes: [
        'Github를 구경해 보세요! <a href="https://github.com/khw-dev" target="_blank">khw-dev</a> 🚀',
        '포트폴리오 페이지를 개발 중입니다... 🚧',
        '돈을 벌어야만 해',
        'DM on <a href="https://www.instagram.com/khw.dev" target="_blank">Instagram</a>'
      ]
    },
    en: {
      title: 'khw-dev : Coming Soon',
      status: 'Under Development',
      desc: 'Portfolio website under development.',
      themeToggle: 'Switch Theme',
      langToggle: 'Switch Language',
      themes: {
        light: 'Light Theme',
        ocean: 'Ocean Theme',
        dark: 'Dark Theme',
        black: 'Black Theme'
      },
      langs: {
        ko: 'Korean',
        en: 'English'
      },
      bubbleQuotes: [
        'Check out Github! <a href="https://github.com/khw-dev" target="_blank">khw-dev</a> 🚀',
        'Website is currently under construction... 🚧',
        'I need to make money',
        'DM on <a href="https://www.instagram.com/khw.dev" target="_blank">Instagram</a>'
      ]
    }
  };

  const themeOptBtns = document.querySelectorAll('.theme-opt-btn');
  const langOptBtns = document.querySelectorAll('.lang-opt-btn');
  const langToggleBtn = document.getElementById('lang-toggle');
  const metaDesc = document.querySelector('meta[name="description"]');
  const statusText = document.querySelector('.status-text');

  // 1.0 슬라이딩 인디케이터 관리 로직
  const updateSliderIndicator = (panel, immediate = false) => {
    const activeBtn = panel.querySelector('.control-opt-btn.active');
    let indicator = panel.querySelector('.active-indicator');
    
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.classList.add('active-indicator');
      panel.appendChild(indicator);
    }
    
    if (activeBtn) {
      if (immediate) {
        indicator.style.transition = 'none';
      }
      
      indicator.style.width = `${activeBtn.offsetWidth}px`;
      indicator.style.height = `${activeBtn.offsetHeight}px`;
      indicator.style.left = `${activeBtn.offsetLeft}px`;
      indicator.style.top = `${activeBtn.offsetTop}px`;
      
      if (immediate) {
        indicator.offsetHeight; // 강제 reflow
        indicator.style.transition = '';
      }
    } else {
      indicator.style.width = '0px';
      indicator.style.height = '0px';
    }
  };

  // 1.1 테마 관련 로직
  const getSystemTheme = () => window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  
  const updateThemeActiveState = (activeTheme) => {
    themeOptBtns.forEach(btn => {
      if (btn.getAttribute('data-theme-val') === activeTheme) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  };

  const setTheme = (theme, immediate = false) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('color-scheme', theme);
    if (themeMeta) {
      themeMeta.content = theme === 'light' ? 'light' : 'dark';
    }
    updateThemeActiveState(theme);

    const themePanel = document.querySelector('.theme-options-panel');
    if (themePanel) {
      updateSliderIndicator(themePanel, immediate);
    }
  };

  // 개별 테마 버튼 이벤트 리스너
  themeOptBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      setTheme(btn.getAttribute('data-theme-val'));
    });
  });

  // 메인 테마 버튼 클릭 시 라이트/다크 토글
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || getSystemTheme();
      const targetTheme = currentTheme === 'light' ? 'dark' : 'light';
      setTheme(targetTheme);
    });
  }

  // 1.2 언어 관련 로직
  const updateLangActiveState = (activeLang) => {
    langOptBtns.forEach(btn => {
      if (btn.getAttribute('data-lang-val') === activeLang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  };

  // 1.2.1 text scattering 애니메이션
  const splitTextIntoSpans = (text) => {
    return text.split('').map((char, index) => {
      if (char === ' ') {
        return `<span class="char space" style="--index: ${index}; --delay: 0s;">&nbsp;</span>`;
      }
      
      let displayChar = char;
      if (char === '<') displayChar = '&lt;';
      else if (char === '>') displayChar = '&gt;';
      else if (char === '&') displayChar = '&amp;';
      
      // 무작위 날아갈 방향/거리/회전값 계산
      const rx = (Math.random() - 0.5) * 120; // -60px ~ 60px
      const ry = (Math.random() - 0.5) * 120; // -60px ~ 60px
      const rot = (Math.random() - 0.5) * 90;  // -45deg ~ 45deg
      const delay = Math.random() * 0.15;     // 0s ~ 0.15s
      
      return `<span class="char" style="--index: ${index}; --rx: ${rx}px; --ry: ${ry}px; --rot: ${rot}deg; --delay: ${delay}s;">${displayChar}</span>`;
    }).join('');
  };

  let currentLangAnimation = null;
  let isInitialLoad = true; // 최초 로드 flag

  const setLanguage = (lang, immediate = false) => {
    document.documentElement.setAttribute('lang', lang);
    localStorage.setItem('portfolio-lang', lang);

    const t = translations[lang] || translations.ko;
    document.title = t.title;
    if (metaDesc) metaDesc.content = t.desc;

    // aria-label 및 title 다국어 적용
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute('title', t.themeToggle);
      themeToggleBtn.setAttribute('aria-label', t.themeToggle);
    }
    if (langToggleBtn) {
      langToggleBtn.setAttribute('title', t.langToggle);
      langToggleBtn.setAttribute('aria-label', t.langToggle);
    }

    themeOptBtns.forEach(btn => {
      const themeVal = btn.getAttribute('data-theme-val');
      const themeLabel = t.themes[themeVal];
      btn.setAttribute('title', themeLabel);
      btn.setAttribute('aria-label', themeLabel);
    });

    langOptBtns.forEach(btn => {
      const langVal = btn.getAttribute('data-lang-val');
      const langLabel = t.langs[langVal];
      btn.setAttribute('title', langLabel);
      btn.setAttribute('aria-label', langLabel);
    });

    updateLangActiveState(lang);

    const langPanel = document.querySelector('.lang-options-panel');
    if (langPanel) {
      updateSliderIndicator(langPanel, immediate);
    }

    if (statusText) {
      if (!isInitialLoad) {
        // 이전 실행 중인 애니메이션 정리
        if (currentLangAnimation) {
          clearTimeout(currentLangAnimation.timer1);
          clearTimeout(currentLangAnimation.timer2);
          statusText.classList.remove('scattering-out', 'scattering-in');
        }

        // 1. 텍스트 분할 및 scattering 시작
        statusText.innerHTML = splitTextIntoSpans(statusText.textContent);
        statusText.offsetHeight; // 강제 reflow
        statusText.classList.add('scattering-out');

        const animationObj = {};
        currentLangAnimation = animationObj;

        // 2. scattering 완료 대기 (transition 0.5s + max delay 0.15s = 0.65s)
        animationObj.timer1 = setTimeout(() => {
          // 3. 시작
          statusText.innerHTML = splitTextIntoSpans(t.status);
          statusText.classList.remove('scattering-out');
          statusText.classList.add('scattering-in');

          // 4. 완료 대기 (animation 0.6s + max delay 0.15s = 0.75s)
          animationObj.timer2 = setTimeout(() => {
            // 5. 원본 복원
            statusText.textContent = t.status;
            statusText.classList.remove('scattering-in');
            if (currentLangAnimation === animationObj) {
              currentLangAnimation = null;
            }
          }, 750);
        }, 650);
      } else {
        // 최초 로드 시에는 애니메이션 x
        statusText.textContent = t.status;
      }
    }
  };

  // 개별 언어 버튼 이벤트 리스너
  langOptBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      setLanguage(btn.getAttribute('data-lang-val'));
    });
  });

  // 메인 언어 버튼 클릭 시 한국어/영어 토글
  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
      const currentLang = document.documentElement.getAttribute('lang') || 'ko';
      const targetLang = currentLang === 'ko' ? 'en' : 'ko';
      setLanguage(targetLang);
    });
  }

  // 1.3 초기화 실행
  const savedTheme = localStorage.getItem('color-scheme') || getSystemTheme();
  setTheme(savedTheme, true);

  const getBrowserLanguage = () => {
    const systemLang = navigator.language || navigator.userLanguage;
    return systemLang.startsWith('ko') ? 'ko' : 'en';
  };
  const savedLang = localStorage.getItem('portfolio-lang') || getBrowserLanguage();
  setLanguage(savedLang, true);
  isInitialLoad = false;

  // 시스템 테마 설정 변경 실시간 동기화
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const activeOverride = localStorage.getItem('color-scheme');
    if (!activeOverride) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });

  // 창 크기 변경 시 인디케이터 위치 재정렬
  window.addEventListener('resize', () => {
    const themePanel = document.querySelector('.theme-options-panel');
    const langPanel = document.querySelector('.lang-options-panel');
    if (themePanel) updateSliderIndicator(themePanel, true);
    if (langPanel) updateSliderIndicator(langPanel, true);
  });

  const panels = document.querySelectorAll('.sliding-panel');
  panels.forEach(panel => {
    const container = panel.closest('.floating-control-container');
    if (container) {
      container.addEventListener('mouseenter', () => {
        updateSliderIndicator(panel);
      });
      container.addEventListener('click', () => {
        setTimeout(() => updateSliderIndicator(panel), 50);
      });
    }
  });

  
  // 2. 마우스 추적 및 눈 찡그림 계산용 좌표
  const leftEyeCenter = { x: 62.5, y: 53.5 };
  const rightEyeCenter = { x: 102.5, y: 53.5 };
  const maxDistX = 7.0; 
  const maxDistY = 4.5;

  // LERP 보간용 offset 및 crop값 변수
  let leftOffset = { x: 0, y: 0 };
  let rightOffset = { x: 0, y: 0 };
  let targetLeftOffset = { x: 0, y: 0 };
  let targetRightOffset = { x: 0, y: 0 };
  let currentCrop = -15;
  let targetCrop = -15;

  const svgPoint = svg.createSVGPoint();

  // 10초 이상 반응이 없을 경우 눈을 채움
  let idleTimeout;

  const resetIdleTimer = () => {
    leftEye?.classList.remove('eyes-filled');
    rightEye?.classList.remove('eyes-filled');
    
    clearTimeout(idleTimeout);
    idleTimeout = setTimeout(() => {
      leftEye?.classList.add('eyes-filled');
      rightEye?.classList.add('eyes-filled');
      
      // 대기 상태가 되면 눈동자를 정중앙으로 이동
      targetLeftOffset = { x: 0, y: 0 };
      targetRightOffset = { x: 0, y: 0 };
      currentCrop = -15;
      targetCrop = -15;
    }, 10000);
  };

  resetIdleTimer();

  // 마우스 이동 시 눈동자 이동 및 찡그림 수치 계산
  const handleMouseMove = (e) => {
    resetIdleTimer();

    // 마우스 거리 계산 (찡그림 세기 결정)
    const rect = svg.getBoundingClientRect();
    const mascotCenterX = rect.left + rect.width / 2;
    const mascotCenterY = rect.top + rect.height / 2;
    const screenDist = Math.hypot(e.clientX - mascotCenterX, e.clientY - mascotCenterY);

    // 거리별 눈 찡그림 비율
    const maxInfluenceDist = 350;
    const minInfluenceDist = 50;
    let narrowFactor = (screenDist - minInfluenceDist) / (maxInfluenceDist - minInfluenceDist);
    narrowFactor = Math.max(0, Math.min(1, narrowFactor));
    
    // Y축 crop 범위 지정 (-15px : 뜸 ~ 8px : 찡그림)
    targetCrop = (1 - narrowFactor) * 23 - 15;

    // 마우스 좌표를 svg 내부 로컬 좌표계로 변환
    svgPoint.x = e.clientX;
    svgPoint.y = e.clientY;
    
    try {
      const ctm = svg.getScreenCTM();
      if (!ctm) return;
      
      const localPt = svgPoint.matrixTransform(ctm.inverse());

      // 왼쪽 눈 위치 계산
      const dxLeft = localPt.x - leftEyeCenter.x;
      const dyLeft = localPt.y - leftEyeCenter.y;
      const distLeft = Math.hypot(dxLeft, dyLeft);
      const angleLeft = Math.atan2(dyLeft, dxLeft);

      // 오른쪽 눈 위치 계산
      const dxRight = localPt.x - rightEyeCenter.x;
      const dyRight = localPt.y - rightEyeCenter.y;
      const distRight = Math.hypot(dxRight, dyRight);
      const angleRight = Math.atan2(dyRight, dxRight);

      // 눈동자 이동 배율 계산
      const pupilInfluenceDist = 180;
      const scaleLeft = Math.min(distLeft / pupilInfluenceDist, 1);
      const scaleRight = Math.min(distRight / pupilInfluenceDist, 1);

      targetLeftOffset.x = Math.cos(angleLeft) * scaleLeft * maxDistX;
      targetLeftOffset.y = Math.sin(angleLeft) * scaleLeft * maxDistY;

      targetRightOffset.x = Math.cos(angleRight) * scaleRight * maxDistX;
      targetRightOffset.y = Math.sin(angleRight) * scaleRight * maxDistY;
    } catch (err) {
      console.error("Error transforming coordinates:", err);
    }
  };

  const handleMouseLeave = () => {
    targetLeftOffset = { x: 0, y: 0 };
    targetRightOffset = { x: 0, y: 0 };
    targetCrop = -15;
  };

  window.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseleave', handleMouseLeave);

  // LERP render
  const animateMascot = () => {
    const lerpFactor = 0.12;

    leftOffset.x += (targetLeftOffset.x - leftOffset.x) * lerpFactor;
    leftOffset.y += (targetLeftOffset.y - leftOffset.y) * lerpFactor;

    rightOffset.x += (targetRightOffset.x - rightOffset.x) * lerpFactor;
    rightOffset.y += (targetRightOffset.y - rightOffset.y) * lerpFactor;

    currentCrop += (targetCrop - currentCrop) * lerpFactor;

    if (leftPupil && rightPupil) {
      leftPupil.setAttribute('transform', `translate(${leftOffset.x.toFixed(2)}, ${leftOffset.y.toFixed(2)})`);
      rightPupil.setAttribute('transform', `translate(${rightOffset.x.toFixed(2)}, ${rightOffset.y.toFixed(2)})`);
    }

    if (leftSlantPath && rightSlantPath) {
      leftSlantPath.setAttribute('transform', `translate(0, ${currentCrop.toFixed(2)})`);
      rightSlantPath.setAttribute('transform', `translate(0, ${currentCrop.toFixed(2)})`);
    }

    requestAnimationFrame(animateMascot);
  };
  
  requestAnimationFrame(animateMascot);


  // 3. flinch 애니메이션 트리거
  const triggerFlinch = () => {
    if (!svg) return;
    resetIdleTimer();
    
    svg.classList.add('flinch');
    setTimeout(() => {
      svg.classList.remove('flinch');
    }, 500);

    // 귀 flinch
    wiggleEar('left');
    setTimeout(() => wiggleEar('right'), 120);
  };

  container?.addEventListener('mouseenter', triggerFlinch);
  container?.addEventListener('mousedown', triggerFlinch);


  // 4. blinking 예약 및 호출
  const triggerBlink = () => {
    const isFilled = leftEye?.classList.contains('eyes-filled');
    const isFullySquinted = targetCrop > -5;
    
    if (leftEye && rightEye && !isFilled && !isFullySquinted) {
      leftEye.classList.add('blinking');
      rightEye.classList.add('blinking');

      setTimeout(() => {
        leftEye.classList.remove('blinking');
        rightEye.classList.remove('blinking');
        scheduleNextBlink();
      }, 120);
    } else {
      scheduleNextBlink();
    }
  };

  const scheduleNextBlink = () => {
    const randomDelay = 3000 + Math.random() * 5000;
    setTimeout(triggerBlink, randomDelay);
  };
  
  scheduleNextBlink();


  // 5. wiggling 로직
  const wiggleEar = (side) => {
    const ear = side === 'left' ? leftEar : rightEar;
    const className = side === 'left' ? 'wiggle-left' : 'wiggle-right';
    if (!ear) return;

    ear.classList.add(className);
    setTimeout(() => {
      ear.classList.remove(className);
    }, 500);
  };

  const triggerEarWiggle = () => {
    const isLeftWiggling = leftEar?.classList.contains('wiggle-left');
    const isRightWiggling = rightEar?.classList.contains('wiggle-right');
    if (isLeftWiggling || isRightWiggling) {
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
  };

  const scheduleNextWiggle = () => {
    const randomDelay = 4000 + Math.random() * 6000;
    setTimeout(triggerEarWiggle, randomDelay);
  };

  scheduleNextWiggle();


  // 6. 말풍선
  const speechBubble = document.getElementById('speech-bubble');
  let bubbleTimeout;

  const getBubbleQuote = () => {
    const lang = document.documentElement.getAttribute('lang') || 'ko';
    const quotes = translations[lang]?.bubbleQuotes || translations.ko.bubbleQuotes;
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  };

  const showBubble = () => {
    if (!speechBubble) return;
    clearTimeout(bubbleTimeout);
    
    // 이미 노출된 상태가 아닐 때만 텍스트를 무작위로 교체
    if (!speechBubble.classList.contains('show')) {
      speechBubble.innerHTML = getBubbleQuote();
      speechBubble.classList.add('show');
    }
  };

  const hideBubble = () => {
    if (!speechBubble) return;
    clearTimeout(bubbleTimeout);
    bubbleTimeout = setTimeout(() => {
      speechBubble.classList.remove('show');
    }, 300); // 적당한 딜레이
  };

  // svg hover 시 노출
  svg?.addEventListener('mouseenter', showBubble);

  // 컨테이너 영역 밖으로 나가면 숨김
  container?.addEventListener('mouseleave', hideBubble);

  // 말풍선 자체에 hover 시 노출 상태 유지
  speechBubble?.addEventListener('mouseenter', () => {
    clearTimeout(bubbleTimeout);
  });
  speechBubble?.addEventListener('mouseleave', hideBubble);
});
