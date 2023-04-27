import { type Options } from "$fresh/plugins/twindv1.ts";
import { defineConfig, type Rule } from "twind";
import presetTailWind from "twind-preset-tailwind";
import presetTypography from "twind-preset-typography";

const typographyExtend = {
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

const rules: Rule[] = [
  [/^rotate-y-(\d+)$/, ([_, match]) => ({ transform: `rotateY(${match}deg)` })],
  [
    /^backface-(\w+)$/,
    ([_, match]) => ({ "backface-visibility": match as any }),
  ],
  [
    /^perspective-(\d+)$/,
    ([_, match]) => ({ "perspective": `${parseInt(match) * 100}px` }),
  ],
  ["preserve-3d", { "transform-style": "preserve-3d" }],
];

const twindConfig: Options = {
  ...defineConfig({
    presets: [presetTailWind(), presetTypography({ extend: typographyExtend })],
    variants: [["children", "&>*"]],
    rules,
  }),
  selfURL: import.meta.url,
};

export default twindConfig;
