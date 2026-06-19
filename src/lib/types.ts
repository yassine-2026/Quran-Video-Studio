export interface Ayah {
  chapter: number;
  verse: number;
  text: string;
}

export interface QuranData {
  [chapterId: string]: Ayah[];
}

export interface Reciter {
  id: string;
  name: string;
  language?: string;
  isExampleOnly?: boolean;
}

export interface Background {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'color';
  color?: string;
}

export type DesignStyle = 'luxury' | 'modern' | 'mecca' | 'medina' | 'cinematic' | 'nature' | 'night';

export interface VideoConfig {
  surah: number;
  startAyah: number;
  endAyah: number;
  reciter: string;
  backgroundId: string;
  designStyle: DesignStyle;
  fontSize: number;
  textColor: string;
  durationPerAyah?: number; // fallback if no audio is loaded
}
