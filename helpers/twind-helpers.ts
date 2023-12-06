import { type Options } from "$fresh/plugins/twindv1.ts";
import presetTailWind from "twind-preset-tailwind";
import presetTypography, { type TypographyOptions } from "twind-preset-typography";

const typographyExtend: TypographyOptions["extend"] = {
  h1: {
    textAlign: "center",
    marginBottom: ".5em",
  },
  a: {
    "&:hover": {
      textDecorationStyle: "dashed",
    },
  },
};

const rules = [
  [/^rotate-y-(\d+)$/, ([_, match]: string[]) => ({ transform: `rotateY(${match}deg)` })],
  [
    /^backface-(\w+)$/,
    ([_, match]: string[]) => ({ "backface-visibility": match as "visible" | "hidden" }),
  ],
  [
    /^perspective-(\d+)$/,
    ([_, match]: string[]) => ({ "perspective": `${parseInt(match) * 100}px` }),
  ],
  ["preserve-3d", { "transform-style": "preserve-3d" }],
];

const fontFamily: Record<string, string[]> = {
  cursive: ["cursive"],
  monospace: ["monospace"],
};

const twindConfig = {
  presets: [presetTailWind(), presetTypography({ extend: typographyExtend })],
  variants: [["children", "&>*"]],
  theme: { fontFamily },
  rules,
  selfURL: import.meta.url,
} as unknown as Options;

export default twindConfig;
