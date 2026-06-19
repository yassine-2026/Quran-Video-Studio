import { useState, useEffect } from 'react';
import type { QuranData, Ayah } from './types';
import { surahs } from './quranData';

export function useQuran() {
  const [data, setData] = useState<QuranData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch local json file dynamically
    const fetchData = async () => {
      try {
        const response = await fetch('/data/quran_ar.json');
        if (!response.ok) throw new Error('Failed to load local Quran data.');
        const json = await response.json();
        setData(json);
      } catch (err: any) {
        setError(err.message || 'Error loading data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getAyahs = (chapter: number, start: number, end: number): Ayah[] => {
    if (!data || !data[chapter]) return [];
    
    // Quran JSON verse numbering usually starts at 1, but check indices
    return data[chapter].filter(a => a.verse >= start && a.verse <= end);
  };

  return { surahs, data, getAyahs, loading, error };
}
