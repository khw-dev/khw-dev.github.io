<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { slide } from 'svelte/transition';
  import { flip } from 'svelte/animate';
  import { quintOut } from 'svelte/easing';
  import SectionIndicator from './components/SectionIndicator.svelte';
  import SettingsWindow from './components/SettingsWindow.svelte';
  import Mascot from './components/Mascot.svelte';
  import { iconAssets } from './data/assets';
  import { uiText } from './data/translations';
  import {
    contacts,
    databaseStacks,
    devRatio,
    externalButtons,
    programmingStacks,
    projects,
    sections,
    timeline,
    topics
  } from './data/portfolio';
  import type { Theme } from './lib/settings';

  let theme: Theme = 'light';
  let settingsOpen = false;
  let activeSection = 'hero';
  let mascotTone = 0;
  let sliderValue = 0;
  let isDragging = false;

  const mascotEyeColors = ['#ffffff', '#ffc848', '#60ff48', '#48ffd1'];

  // Keep sliderValue synchronized when mascotTone changes from other buttons
  $: if (!isDragging) {
    sliderValue = mascotTone;
  }

  function handleSliderInput(e: Event) {
    const target = e.target as HTMLInputElement;
    sliderValue = parseFloat(target.value);
  }

  function handleSliderChange(e: Event) {
    const target = e.target as HTMLInputElement;
    const rounded = Math.round(parseFloat(target.value));
    mascotTone = rounded;
    sliderValue = rounded;
  }

  function stopDragging() {
    if (isDragging) {
      isDragging = false;
      const rounded = Math.round(sliderValue);
      mascotTone = rounded;
      sliderValue = rounded;
    }
  }

  // Timeline & Project navigation states
  let expandedTimelineIndex: number | null = null;
  let currentProjectIndex = 0;
  let isNameHovered = false;
  let hoverNameOriginalEl: HTMLSpanElement;
  let hoverNameReplacementEl: HTMLSpanElement;
  let hoverNameWidth = 0;
  let hoverNameHitWidth = 0;
  let hoverNameLeaveTimeout: ReturnType<typeof setTimeout>;

  function timelineMonthKey(date: string) {
    const normalized = date.trim().replace(/[.\s]+$/, '');
    const match = normalized.match(/^(\d{4})[./-](\d{1,2}|xx)/i);

    if (!match) return normalized.toLowerCase();

    const month = match[2].toLowerCase() === 'xx' ? 'xx' : match[2].padStart(2, '0');
    return `${match[1]}-${month}`;
  }

  const timelineMonthKeys = timeline.map((item) => timelineMonthKey(item.date));

  function shouldDisplayTimelineDate(index: number) {
    const monthKey = timelineMonthKeys[index];
    return timelineMonthKeys.indexOf(monthKey) === index;
  }

  $: document.documentElement.dataset.theme = theme;
  $: activeEyeColor = mascotEyeColors[Math.min(Math.round(sliderValue), mascotEyeColors.length - 1)];
  $: themeIcons = iconAssets[theme];
  $: text = uiText;

  // Carousel actions
  function prevProject() {
    currentProjectIndex = (currentProjectIndex - 1 + projects.length) % projects.length;
  }

  function nextProject() {
    currentProjectIndex = (currentProjectIndex + 1) % projects.length;
  }

  function toggleTimelineItem(index: number) {
    expandedTimelineIndex = expandedTimelineIndex === index ? null : index;
  }

  async function updateHoverNameWidth() {
    await tick();
    const originalWidth = hoverNameOriginalEl?.offsetWidth ?? 0;
    const replacementWidth = hoverNameReplacementEl?.offsetWidth ?? 0;
    const activeName = isNameHovered ? hoverNameReplacementEl : hoverNameOriginalEl;
    hoverNameWidth = activeName?.offsetWidth ?? 0;
    hoverNameHitWidth = Math.max(originalWidth, replacementWidth);
  }

  function handleHoverNameEnter() {
    clearTimeout(hoverNameLeaveTimeout);
    isNameHovered = true;
  }

  function handleHoverNameLeave() {
    clearTimeout(hoverNameLeaveTimeout);
    hoverNameLeaveTimeout = setTimeout(() => {
      isNameHovered = false;
    }, 120);
  }

  $: if (hoverNameOriginalEl && hoverNameReplacementEl) {
    isNameHovered;
    updateHoverNameWidth();
  }

  onMount(() => {
    // Theme Settings
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) theme = savedTheme;

    // Intersection Observer
    const observedSections = [...document.querySelectorAll<HTMLElement>('[data-section]')];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target instanceof HTMLElement) {
          activeSection = visible.target.dataset.section ?? activeSection;
        }
      },
      {
        rootMargin: '-35% 0px -40% 0px',
        threshold: [0.05, 0.2, 0.45, 0.7]
      }
    );

    observedSections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  });
</script>

<svelte:window on:mouseup={stopDragging} on:touchend={stopDragging} />

<main class="portfolio theme-{theme}">
  <section id="hero" class="portfolio-section hero-section" data-section="hero">
    <div class="section-stage">
      <div class="hero-mark">
        <Mascot variant="default" {theme} />
        <h1>khw-dev</h1>
      </div>
      <p class="scroll-copy">{text.scrollCopy}</p>
    </div>
  </section>

  <section id="intro" class="portfolio-section intro-section" data-section="intro">
    <div class="section-stage">

      <article class="intro-copy">
        <p class="intro-copy__hello">{text.greeting}</p>
        <h2>
          {text.introPrefix}
          <strong
            class="hover-name"
            class:hovered={isNameHovered}
            style={hoverNameWidth ? `--hover-name-width:${hoverNameWidth}px;--hover-name-hit-width:${hoverNameHitWidth}px;` : undefined}
            aria-label={text.realName}
            on:mouseenter={handleHoverNameEnter}
            on:mouseleave={handleHoverNameLeave}
          >
            <span class="hover-name-original" bind:this={hoverNameOriginalEl} aria-hidden="true">khw-dev</span>
            <span class="hover-name-replacement" bind:this={hoverNameReplacementEl} aria-hidden="true">{text.realName}</span>
          </strong>
          {text.introSuffix}
        </h2>
        <div class="section-rule"></div>
        <p class="intro-copy__role">{@html text.introRoleHtml}</p>



        <div class="ratio-bar" style="grid-template-columns: {devRatio}% {100 - devRatio}%" aria-label={`${text.ratioDeveloper} ${devRatio}%, ${text.ratioDesigner} ${100 - devRatio}%`}>
          <span class="ratio-bar__developer">{text.ratioDeveloper} {devRatio}%</span>
          <span class="ratio-bar__designer">{100 - devRatio}% {text.ratioDesigner}</span>
        </div>
      </article>

      <article class="interest-block">
        <div class="section-rule"></div>
        <h3>{text.interestTitle}</h3>
        
        <div class="topic-list">
          {#each topics as topic}
            <span style={`--topic-width:${topic.width}px`}>{topic.label}</span>
          {/each}
        </div>
      </article>

      <article class="stack-block">
        <div class="section-rule"></div>
        <h3>{text.stackTitle}</h3>
        <div class="stack-charts">
          <div class="donut-card">
            <div class="donut donut--programming">
              <span>{@html text.programmingLabelHtml}</span>
            </div>
            <ul class="stack-legend stack-legend--programming">
              {#each programmingStacks as stack}
                <li>
                  <span class="stack-legend__item">
                    <i style={`background:${stack.color}`}></i>
                    <span>{stack.label}</span>
                  </span>
                </li>
              {/each}
            </ul>
          </div>
          <div class="donut-card">
            <div class="donut donut--database">
              <span>{text.databases}</span>
            </div>
            <ul class="stack-legend stack-legend--database">
              {#each databaseStacks as stack}
                <li>
                  <span class="stack-legend__item">
                    <i style={`background:${stack.color}`}></i>
                    <span>{stack.label}</span>
                  </span>
                </li>
              {/each}
            </ul>
          </div>
        </div>
      </article>

    </div>
  </section>

  <section id="history" class="portfolio-section history-section" data-section="history">
    <div class="section-stage">
      <ol class="timeline">
        {#each timeline as item, index (item.date + '-' + index)}
          <li
            class:muted={item.muted}
            class:important={!item.muted}
            class:featured={item.detail}
            class:expanded={expandedTimelineIndex === index}
            class:timeline-date-hidden={!shouldDisplayTimelineDate(index)}
            animate:flip={{ duration: 260, easing: quintOut }}
          >
            <button
              class="timeline-row-click"
              class:clickable={Boolean(item.detail)}
              type="button"
              disabled={!item.detail}
              aria-expanded={item.detail ? expandedTimelineIndex === index : undefined}
              on:click={() => toggleTimelineItem(index)}
            >
              <time
                class:timeline-date--hidden={!shouldDisplayTimelineDate(index)}
                aria-hidden={shouldDisplayTimelineDate(index) ? undefined : 'true'}
              >
                {shouldDisplayTimelineDate(index) ? item.date : ''}
              </time>
              <div class="timeline__content">
                <p class="timeline-title-wrapper">
                  <span>{item.title}</span>
                </p>
              </div>
            </button>
            {#if item.detail && expandedTimelineIndex === index}
              <div class="timeline-expanded-row" transition:slide={{ duration: 260, easing: quintOut }}>
                <div class="history-card">
                  {#each item.detail ?? [] as paragraph}
                    <p>{paragraph}</p>
                  {/each}
                  {#if item.links?.length}
                    <div class="history-card__links">
                      {#each item.links as link}
                        {#if link.href}
                          <!-- svelte-ignore a11y_click_events_have_key_events -->
                          <!-- svelte-ignore a11y_no_static_element_interactions -->
                          <a href={link.href} target="_blank" rel="noreferrer" on:click|stopPropagation>
                            <img class="figma-icon figma-icon--20" src={link.type === 'github' ? themeIcons.github : themeIcons.external} alt="" aria-hidden="true" />
                            {link.label}
                          </a>
                        {:else}
                          <span>
                            <img class="figma-icon figma-icon--20" src={link.type === 'github' ? themeIcons.github : themeIcons.external} alt="" aria-hidden="true" />
                            {link.label}
                          </span>
                        {/if}
                      {/each}
                    </div>
                  {/if}
                </div>
              </div>
            {/if}
          </li>
        {/each}
      </ol>
    </div>
  </section>

  <section id="projects" class="portfolio-section projects-section" data-section="projects">
    <div class="section-stage">
      <div class="project-pager" aria-label={text.projectCarouselLabel}>
        <button type="button" aria-label={text.previousProject} on:click={prevProject}></button>
        <span><strong>{currentProjectIndex + 1}</strong>/{projects.length}</span>
        <button type="button" aria-label={text.nextProject} on:click={nextProject}></button>
      </div>
      <div class="project-layout">
        <div 
          class="project-image" 
          aria-hidden="true"
          style={projects[currentProjectIndex].image ? `background-image: url(${projects[currentProjectIndex].image})` : ''}
        ></div>
        <article class="project-copy">
          <h2>{projects[currentProjectIndex]?.title ?? ''}</h2>
          <time>{projects[currentProjectIndex].date}</time>
          {#each projects[currentProjectIndex]?.description ?? [] as paragraph}
            <p>{paragraph}</p>
          {/each}
          {#if projects[currentProjectIndex].links?.length}
            <div class="project-links">
              {#each projects[currentProjectIndex].links ?? [] as link}
                <a href={link.href} target="_blank" rel="noreferrer">
                  <img class="figma-icon figma-icon--20" src={link.type === 'github' ? themeIcons.github : themeIcons.external} alt="" aria-hidden="true" />
                  {link.label}
                </a>
              {/each}
            </div>
          {/if}
        </article>
      </div>
    </div>
  </section>

  <section id="character" class="portfolio-section character-section" data-section="character">
    <div class="section-stage">
      <div class="character-play">
        <Mascot variant="default" {theme} eyeColor={activeEyeColor} />
        <h2>{@html text.characterHeadingHtml}</h2>
        <div
          class="character-slider"
          role="group"
          aria-label={text.characterSliderLabel}
        >
          <div class="character-slider-track">
            {#each [0, 1, 2, 3] as i}
              <span 
                class="slider-dot" 
                class:active={mascotTone === i} 
                style="left: calc(12.5px + (100% - 25px) * {i / 3});"
              ></span>
            {/each}
          </div>
          <div 
            class="slider-thumb" 
            class:dragging={isDragging} 
            style="left: calc(3px + (100% - 25px) * {sliderValue / 3});"
          ></div>
          <input 
            type="range" 
            min="0" 
            max="3" 
            step="0.01" 
            value={sliderValue} 
            on:mousedown={() => isDragging = true}
            on:touchstart={() => isDragging = true}
            on:input={handleSliderInput}
            on:change={handleSliderChange}
            aria-label={text.characterSliderLabel}
          />
        </div>
      </div>

    </div>
  </section>

  <section id="contact" class="portfolio-section contact-section" data-section="contact">
    <div class="section-stage">
      <article class="contact-copy">
        <h2>{text.contactTitle}</h2>
        <p>{text.contactDescription}</p>
      </article>

      <ul class="contact-links">
        {#each contacts as contact}
          <li>
            <img class="figma-icon figma-icon--32" src={themeIcons[contact.icon]} alt="" aria-hidden="true" />
            <a href={contact.href} target="_blank" rel="noreferrer">{contact.label}</a>
          </li>
        {/each}
      </ul>

      <div class="external-buttons">
        {#each externalButtons as button}
          <a href={button.href} target="_blank" rel="noreferrer">
            {button.label}
            <img class="figma-icon figma-icon--20" src={themeIcons.external} alt="" aria-hidden="true" />
          </a>
        {/each}
      </div>

      <p class="copyright">© 2026. khw-dev. All rights reserved.</p>
    </div>
  </section>

  <SectionIndicator {sections} activeId={activeSection} />

  <button class="settings-fab" class:active={settingsOpen} type="button" aria-label={text.settingsOpenLabel} on:click={() => (settingsOpen = true)}>
    <img class="figma-icon figma-icon--32" src={themeIcons.settings} alt="" aria-hidden="true" />
  </button>

  <SettingsWindow
    open={settingsOpen}
    {theme}
    on:close={() => (settingsOpen = false)}
    on:themeChange={(event) => {
      theme = event.detail;
      localStorage.setItem('theme', theme);
    }}
  />
</main>
