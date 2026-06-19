import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function padZero(num: number): string {
    return num.toString().padStart(3, '0');
}

export function formatRecitationUrl(reciterId: string, chapter: number, verse: number) {
    const folders: Record<string, string> = {
        'alafasy': 'Alafasy_128kbps',
        'abdulbasit': 'Abdul_Basit_Murattal_192kbps',
        'husary': 'Husary_128kbps',
        'minshawy': 'Minshawy_Mujawwad_192kbps',
        'maher': 'MaherAlMuaiqly128kbps',
        'shatri': 'Abu_Bakr_Ash-Shaatree_128kbps',
    };
    const reciterFolder = folders[reciterId] || 'Alafasy_128kbps';
    return `https://everyayah.com/data/${reciterFolder}/${padZero(chapter)}${padZero(verse)}.mp3`;
}

export async function fetchRecitationAsBlobUrl(reciterId: string, chapter: number, verse: number): Promise<string> {
    const folders: Record<string, string> = {
        'alafasy': 'Alafasy_128kbps',
        'abdulbasit': 'Abdul_Basit_Murattal_192kbps',
        'husary': 'Husary_128kbps',
        'minshawy': 'Minshawy_Mujawwad_192kbps',
        'maher': 'MaherAlMuaiqly128kbps',
        'shatri': 'Abu_Bakr_Ash-Shaatree_128kbps',
    };
    const reciterFolder = folders[reciterId] || 'Alafasy_128kbps';
    const url = `https://everyayah.com/data/${reciterFolder}/${padZero(chapter)}${padZero(verse)}.mp3`;
    
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Audio not found");
        const blob = await res.blob();
        return URL.createObjectURL(blob);
    } catch (e) {
        throw e;
    }
}
