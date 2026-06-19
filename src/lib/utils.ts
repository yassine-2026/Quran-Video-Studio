import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function padZero(num: number): string {
    return num.toString().padStart(3, '0');
}

export function formatRecitationUrl(reciterId: string, chapter: number, verse: number) {
    // We only have Al-Fatiha stored locally to stay within repo limits as an offline capability test.
    // Assuming local structure: public/recitations/{reciterId}_{chapterPad}{versePad}.mp3
    return `/recitations/${reciterId}_${padZero(chapter)}${padZero(verse)}.mp3`;
}
