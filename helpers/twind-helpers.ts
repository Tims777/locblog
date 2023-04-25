import { type Options } from "$fresh/plugins/twindv1.ts";
import { defineConfig } from "twind";
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

const rules = [
  [/^rotate-y-(\d+)$/, ([_, match]: any) => ({ transform:  `rotateY(${match}deg)` })],
  [/^backface-(\w+)$/, ([_, match]: any) => ({ "backface-visibility": match })],
  [/^perspective-(\d+)$/, ([_, match]: any) => ({ "perspective": `${match * 100}px` })],
  ["preserve-3d", { "transform-style": "preserve-3d" }],
]

const twindConfig: Options = {
  ...defineConfig({
    presets: [presetTailWind(), presetTypography({ extend: typographyExtend })],
    variants: [["children", "&>*"]],
    rules: rules as any,
  }),
  selfURL: import.meta.url,
};

export default twindConfig;
