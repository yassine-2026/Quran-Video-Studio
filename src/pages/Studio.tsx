import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, Play, Pause, RefreshCw, Settings2, Image as ImageIcon, Music, Type } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuran } from '../lib/useQuran';
import { surahs } from '../lib/quranData';
import type { Background, Reciter, DesignStyle, Ayah } from '../lib/types';
import { formatRecitationUrl, cn, padZero } from '../lib/utils';
import { toCanvas } from 'html-to-image';

// Local Static Data for Studio
const backgrounds: Background[] = [
  { id: '1', name: 'سماء مرصعة بالنجوم', url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1920&q=80', type: 'image' },
  { id: '2', name: 'غروب هادئ', url: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?auto=format&fit=crop&w=1920&q=80', type: 'image' },
  { id: '3', name: 'جبال ضبابية', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80', type: 'image' },
  { id: '4', name: 'مسجد الشيخ زايد', url: 'https://images.unsplash.com/photo-1585036156171-384164a8c675?auto=format&fit=crop&w=1920&q=80', type: 'image' },
  { id: '5', name: 'طبيعة خضراء', url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=1920&q=80', type: 'image' },
  { id: '6', name: 'مجرة وكواكب', url: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1920&q=80', type: 'image' },
  { id: '7', name: 'غيوم داكنة', url: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=1920&q=80', type: 'image' },
  { id: '8', name: 'أشجار النخيل', url: 'https://images.unsplash.com/photo-1502484080614-25e1a1edaa7e?auto=format&fit=crop&w=1920&q=80', type: 'image' },
  { id: '9', name: 'صحراء ذهبية', url: 'https://images.unsplash.com/photo-1682687982501-1e58f8145c22?auto=format&fit=crop&w=1920&q=80', type: 'image' },
  { id: '10', name: 'أضواء الشفق', url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1920&q=80', type: 'image' },
];

const reciters: Reciter[] = [
  { id: 'alafasy', name: 'مشاري العفاسي', language: 'ar', isExampleOnly: false },
  { id: 'abdulbasit', name: 'عبدالباسط عبدالصمد', language: 'ar', isExampleOnly: false },
  { id: 'husary', name: 'محمود خليل الحصري', language: 'ar', isExampleOnly: false },
  { id: 'minshawy', name: 'محمد صديق المنشاوي', language: 'ar', isExampleOnly: false },
  { id: 'maher', name: 'ماهر المعيقلي', language: 'ar', isExampleOnly: false },
  { id: 'shatri', name: 'أبو بكر الشاطري', language: 'ar', isExampleOnly: false },
];

const designStyles: { id: DesignStyle; name: string; classes: string }[] = [
  { id: 'luxury', name: 'الذهبي الفاخر', classes: 'font-quran' },
  { id: 'modern', name: 'الإسلامي الحديث', classes: 'font-tajawal' },
  { id: 'cinematic', name: 'سينمائي', classes: 'font-cairo' }
];

const colors = ['#ffffff', '#fbbf24', '#34d399', '#38bdf8'];

export default function Studio() {
  const { data, loading, getAyahs } = useQuran();
  
  // Selection State
  const [selectedSurah, setSelectedSurah] = useState(1); // Al-Fatiha default
  const [startAyah, setStartAyah] = useState(1);
  const [endAyah, setEndAyah] = useState(7);
  
  const [selectedBg, setSelectedBg] = useState<Background>(backgrounds[0]);
  const [selectedStyle, setSelectedStyle] = useState<DesignStyle>('luxury');
  const [selectedReciter, setSelectedReciter] = useState<Reciter>(reciters[0]);
  const [fontSize, setFontSize] = useState(48);
  const [textColor, setTextColor] = useState(colors[1]); // Preset gold
  const [textEffect, setTextEffect] = useState('text-glow');
  
  // Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAyahIndex, setCurrentAyahIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Active Data
  const activeSurahMeta = surahs.find(s => s.number === selectedSurah);
  const activeAyahs = getAyahs(selectedSurah, startAyah, endAyah);
  const currentAyah = activeAyahs[currentAyahIndex];

  // Video Export State
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const previewRef = useRef<HTMLDivElement>(null);

  // Playback sync 
  useEffect(() => {
    if (isPlaying && currentAyah) {
        if (audioRef.current) {
            audioRef.current.src = formatRecitationUrl(selectedReciter.id, selectedSurah, currentAyah.verse);
            audioRef.current.play().catch(e => {
                console.warn("Audio file missing for this ayah.");
                alert(`خطأ: تلاوة الآية رقم ${currentAyah.verse} من سورة ${activeSurahMeta?.name} غير مطابقة أو مفقودة للشيخ ${selectedReciter.name}. لقد تم إيقاف المعاينة.`);
                setIsPlaying(false);
                setCurrentAyahIndex(0);
            });
        }
    }
  }, [isPlaying, currentAyahIndex, currentAyah]);

  const handleAudioEnded = () => {
    if (currentAyahIndex < activeAyahs.length - 1) {
        setCurrentAyahIndex(prev => prev + 1);
    } else {
        setIsPlaying(false);
        setCurrentAyahIndex(0);
    }
  };

  const handleTogglePlay = () => {
      if (isPlaying) {
          setIsPlaying(false);
          audioRef.current?.pause();
      } else {
          setIsPlaying(true);
      }
  };

  const exportVideo = async () => {
    // Advanced Canvas + MediaRecorder export simulating professional video rendering
    if (!previewRef.current || isExporting) return;
    
    // Strict Pre-flight Validation
    if (!activeSurahMeta || selectedSurah < 1 || selectedSurah > 114) {
        alert("سورة غير صالحة. يرجى التحقق من اختيارك.");
        return;
    }
    
    if (!activeAyahs || activeAyahs.length === 0 || startAyah < 1 || endAyah > activeSurahMeta.ayahCount) {
        alert("نطاق الآيات غير صحيح. يرجى تحديد آيات ضمن حدود السورة مختارة.");
        return;
    }
    
    // Validate Ayah Sequence
    for (let i = 1; i < activeAyahs.length; i++) {
        if (activeAyahs[i].verse !== activeAyahs[i-1].verse + 1) {
            alert(`تسلسل الآيات غير صحيح (انقطاع بين الآية ${activeAyahs[i-1].verse} و ${activeAyahs[i].verse}). يرجى التأكد من تسلسل البيانات.`);
            return;
        }
    }

    setIsExporting(true);
    setExportProgress(1); // Indicate start
    setIsPlaying(false); // Stop playback
    setCurrentAyahIndex(0); // Reset

    // Audio pre-flight check function
    const validateAudio = (url: string) => {
        return new Promise<boolean>((resolve) => {
            const audio = new Audio(url);
            audio.oncanplaythrough = () => resolve(true);
            audio.onerror = () => resolve(false);
            audio.src = url;
            audio.load();
        });
    };

    // Strict validation mapping
    for (const ayah of activeAyahs) {
        const audioUrl = formatRecitationUrl(selectedReciter.id, selectedSurah, ayah.verse);
        const isValid = await validateAudio(audioUrl);
        if (!isValid) {
            alert(`خطأ: تلاوة الآية رقم ${ayah.verse} من سورة ${activeSurahMeta?.name} غير مطابقة أو مفقودة للشيخ ${selectedReciter.name}. لقد تم إيقاف إنشاء الفيديو.`);
            setIsExporting(false);
            setExportProgress(0);
            return;
        }
    }

    try {
        // We will render frames to a canvas and record them.
        const width = 1080;
        const height = 1920; // 9:16 Tiktok/Reels format internally
        
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d')!;
        
        // Prepare combined audio + video stream
        const canvasStream = canvas.captureStream(30);
        let combinedStream = canvasStream;
        
        let audioCtx: AudioContext | null = null;
        let dest: MediaStreamAudioDestinationNode | null = null;
        
        try {
            audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
            dest = audioCtx.createMediaStreamDestination();
            combinedStream = new MediaStream([ ...canvasStream.getTracks(), ...dest.stream.getAudioTracks() ]);
        } catch (e) {
            console.warn("Audio Context not supported, generating silent video", e);
        }

        const getSupportedMimeType = () => {
            const types = [
                'video/mp4',
                'video/webm;codecs=vp9,opus',
                'video/webm;codecs=h264,opus',
                'video/webm;codecs=vp8,opus',
                'video/webm'
            ];
            for (const t of types) {
                if (MediaRecorder.isTypeSupported(t)) return t;
            }
            return '';
        };

        const mimeType = getSupportedMimeType();
        const mediaRecorder = new MediaRecorder(combinedStream, { 
            mimeType, 
            videoBitsPerSecond: 8000000 
        });
        
        const chunks: Blob[] = [];
        mediaRecorder.ondataavailable = e => {
            if (e.data && e.data.size > 0) chunks.push(e.data);
        };
        
        const recordingPromise = new Promise<void>(resolve => {
            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: mimeType || 'video/mp4' });
                const ext = mimeType.includes('mp4') ? 'mp4' : 'webm';
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Quran_Video_${selectedSurah}_${startAyah}-${endAyah}.${ext}`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                resolve();
            };
        });

        mediaRecorder.start(100);
        
        let isCancelled = false;
        
        for (let i = 0; i < activeAyahs.length; i++) {
            if (isCancelled) break;
            
            setCurrentAyahIndex(i);
            // Allow React to re-render the DOM for this ayah
            await new Promise(r => setTimeout(r, 200)); 
            
            // Capture static frame via html-to-image
            const frameCanvas = await toCanvas(previewRef.current, { 
               backgroundColor: null, 
               pixelRatio: 2 
            });
            
            const audioUrl = formatRecitationUrl(selectedReciter.id, selectedSurah, activeAyahs[i].verse);
            const ayahAudio = new Audio(audioUrl);
            ayahAudio.crossOrigin = "anonymous";
            
            const ayahPlaybackPromise = new Promise<void>((resolveAyah) => {
                let intervalId: any;
                let sourceNode: MediaElementAudioSourceNode | null = null;
                
                const finishAyah = () => {
                    clearInterval(intervalId);
                    if (sourceNode) {
                        try { sourceNode.disconnect(); } catch (e) {}
                    }
                    resolveAyah();
                };

                const startLoop = (durationMs: number) => {
                    let elapsed = 0;
                    intervalId = setInterval(() => {
                        elapsed += 33;
                        const progress = elapsed / durationMs;
                        
                        // Slow dramatic zoom effect (1.0 -> 1.05)
                        const scale = 1 + progress * 0.05;
                        
                        ctx.fillStyle = "#020617";
                        ctx.fillRect(0, 0, width, height);
                        
                        ctx.save();
                        ctx.translate(width/2, height/2);
                        ctx.scale(scale, scale);
                        ctx.translate(-width/2, -height/2);
                        ctx.drawImage(frameCanvas, 0, 0, width, height);
                        ctx.restore();
                        
                        if (elapsed >= durationMs) {
                            finishAyah();
                        }
                    }, 33);
                };

                ayahAudio.oncanplaythrough = async () => {
                    if (audioCtx && dest) {
                        if (audioCtx.state === 'suspended') await audioCtx.resume();
                        try {
                            sourceNode = audioCtx.createMediaElementSource(ayahAudio);
                            sourceNode.connect(dest);
                        } catch(e) {
                            console.warn("Could not connect audio node", e);
                        }
                    }
                    
                    ayahAudio.play().catch(e => console.warn("Audio play blocked", e));
                    
                    intervalId = setInterval(() => {
                        const duration = Math.max(ayahAudio.duration || 1, 1);
                        const progress = ayahAudio.currentTime / duration;
                        const scale = 1 + progress * 0.05;
                        
                        ctx.fillStyle = "#020617";
                        ctx.fillRect(0, 0, width, height);
                        
                        ctx.save();
                        ctx.translate(width/2, height/2);
                        ctx.scale(scale, scale);
                        ctx.translate(-width/2, -height/2);
                        ctx.drawImage(frameCanvas, 0, 0, width, height);
                        ctx.restore();
                    }, 33);
                };
                
                ayahAudio.onended = finishAyah;
                
                ayahAudio.onerror = () => {
                    console.error(`Audio error during generation for verse ${activeAyahs[i].verse}`);
                    finishAyah();
                    throw new Error("Audio verification failed during generation.");
                };
                
                ayahAudio.load();
                
                // Safety timeout
                setTimeout(() => {
                    if (!intervalId && ayahAudio.readyState === 0) {
                         console.error(`Safety timeout for verse ${activeAyahs[i].verse}`);
                         finishAyah();
                         // Reject but we can't easily throw inside setTimeout to global catch, 
                         // we will just let it finish with an error state.
                    }
                }, 10000); // give it more time since we already validated
            });
            
            await ayahPlaybackPromise;
            setExportProgress(Math.floor(((i + 1) / activeAyahs.length) * 100));
        }

        mediaRecorder.stop();
        await recordingPromise;
        
        setIsExporting(false);
        setExportProgress(100);
        setCurrentAyahIndex(0);
        
    } catch (error) {
        console.error("Export failed", error);
        alert("حدث خطأ أثناء التصدير - يرجى التأكد من استقرار المتصفح ومحاولة تقليل عدد الآيات.");
        setIsExporting(false);
        setCurrentAyahIndex(0);
    }
  };

  if (loading) {
      return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-amber-500 font-cairo">جاري تحميل البيانات...</div>
  }

  const activeStyleConfig = designStyles.find(s => s.id === selectedStyle);

  return (
    <div className="w-full min-h-screen lg:h-screen lg:overflow-hidden bg-[#020617] text-white flex flex-col relative font-cairo select-none overflow-x-hidden" dir="rtl">
      {/* SPIRITUAL ATMOSPHERE BACKGROUND */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#0f172a] to-[#1e1b4b]"></div>
        {/* STARS */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-10 left-20 w-1 h-1 bg-white rounded-full shadow-[0_0_8px_white]"></div>
          <div className="absolute top-40 left-60 w-1.5 h-1.5 bg-amber-100 rounded-full shadow-[0_0_10px_amber]"></div>
          <div className="absolute top-20 right-40 w-1 h-1 bg-white rounded-full"></div>
          <div className="absolute bottom-80 left-1/4 w-1 h-1 bg-blue-200 rounded-full"></div>
          <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-white rounded-full opacity-20"></div>
        </div>
        {/* CRESCENT */}
        <div className="absolute top-12 left-12 w-24 h-24 rounded-full border-r-[12px] border-t-[4px] border-white/80 opacity-60 blur-[1px] rotate-[35deg]"></div>
        {/* MOSQUE SILHOUETTE */}
        <div className="absolute bottom-0 w-full opacity-20 flex justify-center items-end">
           <svg viewBox="0 0 1024 300" className="w-full h-auto fill-current text-slate-900 pointer-events-none">
              <path d="M0 300 V250 Q100 240 200 250 T400 220 T600 260 T800 240 T1024 280 V300 Z" />
              <path d="M150 250 V180 Q150 140 200 140 Q250 140 250 180 V250 Z M400 220 V120 Q400 60 512 60 Q624 60 624 120 V220 Z M800 240 V190 Q800 160 850 160 Q900 160 900 190 V240 Z" />
           </svg>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="relative z-10 flex flex-col sm:flex-row items-center justify-between px-4 sm:px-10 py-4 sm:py-6 backdrop-blur-md bg-white/5 border-b border-white/10 shrink-0 gap-4">
         <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
           <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.4)] shrink-0">
             <Play className="w-6 h-6 text-slate-900 fill-current" />
           </div>
           <span className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-l from-amber-200 to-white bg-clip-text text-transparent truncate block">Quran Video Pro Studio</span>
         </div>
         <div className="flex gap-4 sm:gap-8 text-sm font-medium opacity-80 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 hide-scrollbar justify-center">
           <Link to="/" className="hover:text-amber-400 transition-colors whitespace-nowrap">الرئيسية</Link>
           <a href="#" className="hover:text-amber-400 transition-colors whitespace-nowrap">المعرض</a>
         </div>
         <button className="hidden md:block px-6 py-2 bg-white text-slate-900 rounded-full text-sm font-bold shadow-xl hover:scale-105 transition-transform shrink-0">
           المعرض المميز
         </button>
      </nav>

      {/* MAIN CONTENT SPLIT */}
      <main className="relative z-10 flex-1 flex flex-col lg:flex-row p-4 lg:p-6 gap-4 lg:gap-6 min-h-0 container mx-auto max-w-[1600px]">
         {/* LEFT SIDEBAR */}
         <aside className="w-full lg:w-80 flex flex-col gap-4 shrink-0 lg:overflow-y-auto lg:pr-1">
            {/* Surah Select Container */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shrink-0">
               <label className="text-[10px] uppercase tracking-widest text-amber-500 font-bold mb-2 block">اختيار السورة والآية</label>
               <div className="flex flex-col gap-3">
                  <select 
                     className="bg-slate-900/50 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-500"
                     value={selectedSurah}
                     onChange={e => {
                        setSelectedSurah(Number(e.target.value));
                        setStartAyah(1);
                        const newSurah = surahs.find(s => s.number === Number(e.target.value));
                        setEndAyah(newSurah ? Math.min(newSurah.ayahCount, 7) : 1);
                     }}
                  >
                     {surahs.map(s => (
                        <option key={s.number} value={s.number}>{padZero(s.number)}. سورة {s.name}</option>
                     ))}
                  </select>
                  <div className="flex gap-2">
                     <input type="number" min={1} max={activeSurahMeta?.ayahCount} 
                        value={startAyah} onChange={e => setStartAyah(Number(e.target.value))}
                        className="w-1/2 bg-slate-900/50 border border-white/10 rounded-lg px-3 py-2 text-sm" placeholder="من" />
                     <input type="number" min={startAyah} max={activeSurahMeta?.ayahCount} 
                        value={endAyah} onChange={e => setEndAyah(Number(e.target.value))}
                        className="w-1/2 bg-slate-900/50 border border-white/10 rounded-lg px-3 py-2 text-sm" placeholder="إلى" />
                  </div>
               </div>
            </div>

            {/* RECITER */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shrink-0">
               <label className="text-[10px] uppercase tracking-widest text-amber-500 font-bold mb-2 block">التلاوة</label>
               <div className="flex flex-col gap-3">
                  <select 
                     className="bg-slate-900/50 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-500"
                     value={selectedReciter.id}
                     onChange={e => setSelectedReciter(reciters.find(r => r.id === e.target.value)!)}
                  >
                     {reciters.map(r => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                     ))}
                  </select>
               </div>
            </div>

            {/* STYLE GALLERY */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shrink-0">
               <label className="text-[10px] uppercase tracking-widest text-amber-500 font-bold mb-3 block">نمط التصميم</label>
               <div className="grid grid-cols-2 gap-2 max-h-[160px] overflow-y-auto pr-1">
                  {designStyles.map(s => (
                     <div 
                        key={s.id}
                        onClick={() => setSelectedStyle(s.id)}
                        className={cn(
                           "group relative rounded-lg overflow-hidden border cursor-pointer",
                           selectedStyle === s.id ? "border-amber-500" : "border-white/10"
                        )}
                     >
                        <div className={cn(
                           "aspect-video",
                           s.id === 'luxury' && "bg-gradient-to-br from-amber-600 to-amber-900",
                           s.id === 'modern' && "bg-gradient-to-br from-teal-800 to-emerald-950",
                           s.id === 'cinematic' && "bg-gradient-to-br from-indigo-900 to-slate-950",
                           s.id === 'mecca' && "bg-gradient-to-br from-orange-800 to-red-950"
                        )}></div>
                        <span className={cn(
                           "absolute bottom-1 right-2 text-[10px]",
                           selectedStyle === s.id ? "font-bold text-amber-100" : "opacity-70 text-white"
                        )}>{s.name}</span>
                     </div>
                  ))}
               </div>
            </div>

            <div className="mt-auto shrink-0 pt-2">
               <button 
                  onClick={exportVideo}
                  disabled={isExporting}
                  className="w-full py-4 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:hover:bg-amber-500 text-slate-950 font-black rounded-2xl shadow-[0_10px_30px_rgba(245,158,11,0.3)] transition-all flex items-center justify-center gap-2"
               >
                  <span>{isExporting ? `جاري التصدير ${exportProgress}%` : 'تصدير فيديو عالي الجودة'}</span>
                  {isExporting ? <RefreshCw className="w-5 h-5 animate-spin" /> : (
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                  )}
               </button>
            </div>
         </aside>

         {/* CENTER: LIVE PREVIEW */}
         <div className="flex-1 flex flex-col gap-4 lg:gap-6 min-w-0">
            <div className="flex-1 relative bg-black/40 rounded-[1.5rem] md:rounded-[2.5rem] border-[4px] md:border-[12px] border-white/5 shadow-2xl flex items-center justify-center overflow-hidden min-h-[400px] md:min-h-[500px] p-2 md:p-6">
               {/* The Actual Canvas constraints inside the visually rounded box */}
               <div 
                  ref={previewRef}
                  className="relative overflow-hidden isolate shadow-xl rounded-xl ring-1 ring-white/10 w-full max-w-[400px] mx-auto"
                  style={{ aspectRatio: '9/16' }}
               >
                  {/* Phone Background */}
                  <img src={selectedBg.url} className="absolute inset-0 w-full h-full object-cover z-0" crossOrigin="anonymous" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/60 z-10"></div>
                  {selectedStyle === 'luxury' && (
                     <div className="absolute inset-0 z-10 mix-blend-screen opacity-50 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/20 to-transparent pointer-events-none"></div>
                  )}

                  {/* VERSE OVERLAY */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center z-20">
                     {/* Decorative element from HTML */}
                     <div className="mb-8 opacity-40">
                        <svg width="60" height="60" viewBox="0 0 100 100" className="fill-amber-500">
                           <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="5 5" />
                           <path d="M50 20 L55 45 L80 50 L55 55 L50 80 L45 55 L20 50 L45 45 Z" />
                        </svg>
                     </div>
                     
                     <motion.div 
                        key={currentAyah?.verse}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.8 }}
                        className={cn("w-full leading-relaxed flex flex-col items-center", activeStyleConfig?.classes)}
                     >
                        <p style={{ fontSize: `${fontSize}px`, lineHeight: '1.6', color: textColor }} dir="rtl" className={textEffect}>
                           {currentAyah ? currentAyah.text : "الرجاء تحديد الآيات"}
                        </p>
                        {currentAyah && (
                           <div className="mt-8 px-4 py-1.5 rounded-full bg-slate-900/50 backdrop-blur-sm border border-white/10 text-sm font-tajawal text-slate-300 flex items-center gap-2">
                              <span>سورة {activeSurahMeta?.name}</span>
                              <span className="w-1 h-1 rounded-full bg-amber-500"></span>
                              <span>الآية {currentAyah.verse}</span>
                           </div>
                        )}
                     </motion.div>
                  </div>
                  {/* Progress Bar (Visual) */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-30">
                        <motion.div 
                           className="h-full bg-amber-500"
                           initial={{ width: 0 }}
                           animate={{ width: `${((currentAyahIndex + 1) / (activeAyahs.length || 1)) * 100}%` }}
                           transition={{ duration: 3, ease: "linear" }}
                           key={`progress-${currentAyah?.verse}`}
                        />
                  </div>
               </div>

               {/* PLAYER UI OVERLAY (Floating in the black preview box) */}
               <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 md:gap-6 px-4 md:px-8 py-2 md:py-3 bg-white/10 backdrop-blur-2xl rounded-full border border-white/20 z-40 w-[90%] md:w-auto justify-center max-w-[400px]">
                  <button className="opacity-60 hover:opacity-100 shrink-0" onClick={() => setCurrentAyahIndex(Math.max(0, currentAyahIndex - 1))}>
                        <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
                  </button>
                  <button className="w-10 h-10 md:w-12 md:h-12 bg-white text-slate-900 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform shrink-0" onClick={handleTogglePlay}>
                        {isPlaying ? <Pause className="w-5 h-5 md:w-6 md:h-6 fill-current text-slate-900" /> : <Play className="w-5 h-5 md:w-6 md:h-6 fill-current text-slate-900 ml-1" />}
                  </button>
                  <button className="opacity-60 hover:opacity-100 shrink-0" onClick={() => setCurrentAyahIndex(Math.min(activeAyahs.length - 1, currentAyahIndex + 1))}>
                        <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M16 6h2v12h-2zm-10.5 6l8.5 6V6z"/></svg>
                  </button>
                  <div className="text-[9px] md:text-[10px] font-mono opacity-60 ml-2 md:ml-0 whitespace-nowrap">
                    الآية {currentAyah ? currentAyah.verse : 0} من {activeSurahMeta?.ayahCount || 0}
                  </div>
               </div>
            </div>

            {/* STATS & FEATURES */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 shrink-0">
               <div className="bg-white/5 backdrop-blur-md p-3 md:p-4 rounded-2xl border border-white/5 flex flex-col">
                  <span className="text-amber-500 text-[9px] md:text-[10px] font-bold uppercase mb-1 truncate">الدقة</span>
                  <span className="text-base md:text-lg font-semibold truncate">4K Ultra HD</span>
               </div>
               <div className="bg-white/5 backdrop-blur-md p-3 md:p-4 rounded-2xl border border-white/5 flex flex-col">
                  <span className="text-amber-500 text-[9px] md:text-[10px] font-bold uppercase mb-1 truncate">سرعة المعالجة</span>
                  <span className="text-base md:text-lg font-semibold truncate">60 ثانية</span>
               </div>
               <div className="bg-white/5 backdrop-blur-md p-3 md:p-4 rounded-2xl border border-white/5 flex flex-col">
                  <span className="text-amber-500 text-[9px] md:text-[10px] font-bold uppercase mb-1 truncate">التوافق</span>
                  <span className="text-base md:text-lg font-semibold truncate">جميع الهواتف</span>
               </div>
               <div className="bg-white/5 backdrop-blur-md p-3 md:p-4 rounded-2xl border border-white/5 flex flex-col">
                  <span className="text-amber-500 text-[9px] md:text-[10px] font-bold uppercase mb-1 truncate">السعر</span>
                  <span className="text-base md:text-lg font-semibold text-emerald-400 truncate">مجاني بالكامل</span>
               </div>
            </div>
         </div>

         {/* RIGHT SIDEBAR: FORMATTING & LIBRARY */}
         <aside className="w-full lg:w-64 flex flex-col gap-4 shrink-0 lg:overflow-y-auto lg:pr-1">
            {/* Formatting */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shrink-0">
               <label className="text-[10px] uppercase tracking-widest text-amber-500 font-bold mb-4 block">تنسيق النص</label>
               <div className="space-y-6">
                  <div className="flex flex-col gap-2">
                     <span className="text-[11px] opacity-60">حجم الخط</span>
                     <input type="range" min="20" max="80" value={fontSize} onChange={e => setFontSize(Number(e.target.value))} className="accent-amber-500 bg-white/10 h-1 rounded-lg appearance-none w-full" />
                  </div>
                  <div className="flex flex-col gap-2">
                     <span className="text-[11px] opacity-60">لون الآية</span>
                     <div className="flex gap-2">
                        {colors.map(c => (
                           <div key={c} onClick={() => setTextColor(c)} className={cn("w-6 h-6 rounded-full border cursor-pointer", textColor === c ? "border-white shadow-[0_0_8px_rgba(255,255,255,0.4)]" : "border-white/10")} style={{ backgroundColor: c }}></div>
                        ))}
                     </div>
                  </div>
                  <div className="flex flex-col gap-2">
                     <span className="text-[11px] opacity-60">المؤثرات</span>
                     <div className="flex flex-wrap gap-2">
                        <button onClick={() => setTextEffect('drop-shadow-md')} className={cn("px-2 py-1 rounded text-[10px] border transition-colors", textEffect === 'drop-shadow-md' ? "bg-amber-500/20 text-amber-200 border-amber-500/30" : "bg-white/10 border-white/10")}>ظل ناعم</button>
                        <button onClick={() => setTextEffect('text-glow')} className={cn("px-2 py-1 rounded text-[10px] border transition-colors", textEffect === 'text-glow' ? "bg-amber-500/20 text-amber-200 border-amber-500/30" : "bg-white/10 border-white/10")}>توهج (Glow)</button>
                        <button onClick={() => setTextEffect('drop-shadow-2xl opacity-90')} className={cn("px-2 py-1 rounded text-[10px] border transition-colors", textEffect === 'drop-shadow-2xl opacity-90' ? "bg-amber-500/20 text-amber-200 border-amber-500/30" : "bg-white/10 border-white/10")}>إسقاط ظل عميق</button>
                     </div>
                  </div>
               </div>
            </div>

            {/* Background Library */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shrink-0 lg:flex-1 flex flex-col min-h-[300px] lg:min-h-0">
               <label className="text-[10px] uppercase tracking-widest text-amber-500 font-bold mb-3 block shrink-0">مكتبة الخلفيات</label>
               <div className="space-y-2 overflow-y-auto pr-2 flex-1">
                  {backgrounds.map(bg => (
                     <div 
                        key={bg.id}
                        onClick={() => setSelectedBg(bg)}
                        className={cn(
                           "flex items-center gap-3 p-2 rounded-lg border transition-colors cursor-pointer",
                           selectedBg.id === bg.id ? "bg-amber-500/10 border-amber-500" : "bg-white/5 border-white/5 hover:border-amber-500/50"
                        )}
                     >
                        <div className="w-12 h-12 shrink-0 bg-slate-800 rounded-md overflow-hidden relative">
                           <img src={bg.url} className="w-full h-full object-cover absolute inset-0" crossOrigin="anonymous" />
                        </div>
                        <div className="flex flex-col min-w-0">
                           <span className="text-xs font-bold truncate">{bg.name}</span>
                           <span className="text-[9px] opacity-40 truncate">مشهد جاهز</span>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </aside>
      </main>

      {/* FOOTER STATUS BAR */}
      <footer className="relative z-10 px-4 md:px-10 py-3 bg-black/40 backdrop-blur-md border-t border-white/10 flex flex-col sm:flex-row justify-between items-center shrink-0 gap-3">
         <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 md:gap-4 text-[9px] md:text-[10px] opacity-60 font-mono tracking-widest text-center sm:text-right">
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_5px_emerald] shrink-0"></div>
             <span className="whitespace-nowrap">SYSTEM READY</span>
           </div>
           <span className="hidden sm:inline border-r border-white/20 h-3"></span>
           <span className="whitespace-nowrap">OFFLINE PROCESSING</span>
         </div>
         <div className="text-[10px] md:text-[11px] font-medium opacity-80 text-center">
           تصميم احترافي • Quran Video Pro Studio • جميع الحقوق محفوظة {new Date().getFullYear()}
         </div>
      </footer>

      {/* Hidden Audio Player */}
      <audio ref={audioRef} onEnded={handleAudioEnded} />
    </div>
  );
}
