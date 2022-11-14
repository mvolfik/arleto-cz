import type { ImageInfo } from "./utils";

export type Theme = { banner: ImageInfo; error_image: ImageInfo };
export type IndexContent = { image: ImageInfo; text: string };
export type VopContent = { vop: string };

export type SectionItem = {
  order: number;
  title: string;
  body: string;
};
