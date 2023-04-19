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

const twindConfig: Options = {
  ...defineConfig({
    presets: [presetTailWind(), presetTypography({ extend: typographyExtend })],
    variants: [["children", "&>*"]],
  }),
  selfURL: import.meta.url,
};

export default twindConfig;
