import { Template } from "../types.d.ts";

export function createTemplate(src: string): Template {
  const regex = /\$\{(.+?)\}/;
  const parts = src.split(regex);
  return (args: Record<string, string>) => {
    return parts
      .map((part, index) => index % 2 == 0 ? part : args[part])
      .join("");
  };
}

export function slug(text: string): string {
  return text.toLowerCase().replace(/\s/, "-")
}
