export type Theme = "light" | "dark";

export interface WindowPosition {
  x: number;
  y: number;
}

export interface WindowSize {
  width: number;
  height: number;
}

export interface ViewportSize {
  width: number;
  height: number;
}

export const SETTINGS_WINDOW_SIZE: WindowSize = {
  width: 400,
  height: 180,
};

export const DRAG_MARGIN = 16;

export function clampWindowPosition(
  position: WindowPosition,
  size: WindowSize,
  viewport: ViewportSize,
  margin = DRAG_MARGIN,
): WindowPosition {
  const maxX = Math.max(margin, viewport.width - size.width - margin);
  const maxY = Math.max(margin, viewport.height - size.height - margin);

  return {
    x: Math.min(Math.max(position.x, margin), maxX),
    y: Math.min(Math.max(position.y, margin), maxY),
  };
}

export function getInitialSettingWindowPosition(
  size: WindowSize,
  viewport: ViewportSize,
  margin = DRAG_MARGIN,
): WindowPosition {
  return clampWindowPosition(
    {
      x: Math.round((viewport.width - size.width) / 2),
      y: Math.round((viewport.height - size.height) / 2),
    },
    size,
    viewport,
    margin,
  );
}

export function toggleTheme(theme: Theme): Theme {
  return theme === "light" ? "dark" : "light";
}

export function getThemeLabel(theme: Theme): string {
  return theme === "light" ? "라이트" : "다크";
}
