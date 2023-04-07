import { type Options } from "$fresh/plugins/twindv1.ts";
import { defineConfig } from "twind";
import presetTailWind from "twind-preset-tailwind";
import presetTypography from "twind-preset-typography";

const presets = [presetTailWind(), presetTypography()];

const twindConfig: Options = {
  ...defineConfig({ presets }),
  selfURL: import.meta.url,
};

export default twindConfig;
