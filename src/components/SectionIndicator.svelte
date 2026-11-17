<script lang="ts">
  import type { SectionMeta } from '../data/portfolio';

  export let sections: SectionMeta[] = [];
  export let activeId = 'hero';

  $: activeSection = sections.find((section) => section.id === activeId) ?? sections[0];
  $: activeIndex = sections.findIndex((section) => section.id === activeId);
</script>

<nav class="section-indicator" class:hidden={activeId === 'hero'} aria-label="페이지 섹션">
  <div class="section-indicator__container">
    {#if activeSection && activeIndex !== -1}
      <span
        class="section-indicator__label"
        style="transform: translateY({activeIndex * 15}px);"
      >
        {activeSection.label}
      </span>
    {/if}
    <div class="section-indicator__dots" aria-hidden="true">
      {#each sections as section}
        <a
          class:active={section.id === activeId}
          href={`#${section.id}`}
          aria-label={section.label}
        ></a>
      {/each}
    </div>
  </div>
</nav>
