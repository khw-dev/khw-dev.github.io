import iconCloseDark from "../assets/dark/close.svg";
import iconCloseLight from "../assets/light/close.svg";
import iconExternalDark from "../assets/dark/external.svg";
import iconExternalLight from "../assets/light/external.svg";
import iconGithubDark from "../assets/dark/github.svg";
import iconGithubLight from "../assets/light/github.svg";
import iconInfoDark from "../assets/dark/info.svg";
import iconInfoLight from "../assets/light/info.svg";
import iconInstagramDark from "../assets/dark/instagram.svg";
import iconInstagramLight from "../assets/light/instagram.svg";
import iconLinkedinDark from "../assets/dark/linkedin.svg";
import iconLinkedinLight from "../assets/light/linkedin.svg";
import iconMailDark from "../assets/dark/mail.svg";
import iconMailLight from "../assets/light/mail.svg";
import iconMoonDark from "../assets/dark/moon.svg";
import iconMoonLight from "../assets/light/moon.svg";
import iconSettingsDark from "../assets/dark/settings.svg";
import iconSettingsLight from "../assets/light/settings.svg";

import type { Theme } from "../lib/settings";

export type CharacterVariant = "sleepy" | "default" | "wide" | "mint" | "green";

export const iconAssets = {
  light: {
    close: iconCloseLight,
    external: iconExternalLight,
    github: iconGithubLight,
    info: iconInfoLight,
    instagram: iconInstagramLight,
    linkedin: iconLinkedinLight,
    mail: iconMailLight,
    moon: iconMoonLight,
    settings: iconSettingsLight,
  },
  dark: {
    close: iconCloseDark,
    external: iconExternalDark,
    github: iconGithubDark,
    info: iconInfoDark,
    instagram: iconInstagramDark,
    linkedin: iconLinkedinDark,
    mail: iconMailDark,
    moon: iconMoonDark,
    settings: iconSettingsDark,
  },
} satisfies Record<
  Theme,
  Record<
    | "close"
    | "external"
    | "github"
    | "info"
    | "instagram"
    | "linkedin"
    | "mail"
    | "moon"
    | "settings",
    string
  >
>;
