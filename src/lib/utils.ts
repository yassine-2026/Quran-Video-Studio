import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function padZero(num: number): string {
    return num.toString().padStart(3, '0');
}

export function formatRecitationUrl(reciterId: string, chapter: number, verse: number) {
    const reciterFolder = reciterId === 'alafasy' ? 'Alafasy_128kbps' : 'Abdul_Basit_Murattal_192kbps';
    return `https://everyayah.com/data/${reciterFolder}/${padZero(chapter)}${padZero(verse)}.mp3`;
}
