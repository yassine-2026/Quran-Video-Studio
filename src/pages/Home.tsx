import React from 'react';
import { motion } from 'framer-motion';
import { Play, Sparkles, Video, Settings, FastForward } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 flex flex-col items-center justify-center pt-20">
      
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 max-w-full overflow-hidden pointer-events-none">
        
        {/* Night Sky Core */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black z-0"></div>

        {/* Crescent Moon */}
        <motion.div 
          animate={{ y: [0, -10, 0], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-1/4 w-32 h-32 rounded-full shadow-[0_0_80px_20px_rgba(212,175,55,0.15)] z-10"
          style={{ background: 'radial-gradient(circle at 30% 30%, transparent 40%, rgba(212,175,55,0.9) 80%)' }}
        />

        {/* Floating Light Particles */}
        <div className="absolute inset-0 z-10 opacity-30">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-amber-200 rounded-full"
              initial={{ 
                x: Math.random() * 100 + "%", 
                y: Math.random() * 100 + "%",
                opacity: Math.random()
              }}
              animate={{ 
                y: [null, "-100%"],
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: Math.random() * 5 + 5, 
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * 5
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-20 flex flex-col items-center text-center px-4 max-w-5xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="glass-panel px-4 md:px-6 py-2 rounded-full mb-6 flex items-center gap-2 md:gap-3 max-w-full"
        >
          <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-amber-400 shrink-0" />
          <span className="text-amber-50 text-sm md:text-base font-medium tracking-wide truncate">أول استوديو قرآني متكامل ومجاني</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-7xl font-cairo font-bold text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 mb-4 md:mb-6 drop-shadow-lg leading-tight py-2 md:py-4 w-full break-words"
        >
          أنشئ فيديوهات قرآنية احترافية <br className="hidden sm:block"/> خلال دقائق
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-base sm:text-lg md:text-2xl text-slate-300 font-tajawal max-w-3xl mb-8 md:mb-12 leading-relaxed px-2"
        >
          منصة عالمية لإنشاء الفيديوهات القرآنية تصميماً وإنتاجاً من متصفحك مباشرة بدون برامج. دمج الآيات، التلاوات الحقيقية، والخلفيات الإسلامية مجاناً ومحلياً 100%.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 md:gap-6 w-full max-w-md sm:max-w-none justify-center items-center"
        >
          <Link to="/studio" className="w-full sm:w-auto">
            <button className="group relative w-full px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-400 hover:to-amber-600 rounded-2xl font-cairo font-bold text-lg md:text-xl text-white shadow-[0_0_40px_rgba(212,175,55,0.4)] transition-all flex items-center justify-center gap-3 overflow-hidden">
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <Video className="w-5 h-5 md:w-6 md:h-6 shrink-0" />
              ابدأ إنشاء فيديو الآن
            </button>
          </Link>

          <a href="#features" className="w-full sm:w-auto">
            <button className="w-full px-6 md:px-8 py-3 md:py-4 glass-panel hover:bg-slate-800/80 rounded-2xl font-cairo font-bold text-lg md:text-xl text-slate-200 transition-all flex items-center justify-center gap-3">
              <Play className="w-5 h-5 md:w-6 md:h-6 shrink-0" />
              شاهد نموذجاً
            </button>
          </a>
        </motion.div>
      </div>
      
      {/* Wave Divider connecting to next section */}
      <div className="absolute bottom-0 w-full overflow-hidden leading-none rotate-180 pointer-events-none opacity-50 z-10">
          <svg className="relative block w-full h-[100px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-slate-900"></path>
          </svg>
      </div>
    </div>
  );
};

const Features = () => {
  return (
    <div id="features" className="py-24 bg-slate-900 relative z-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-cairo font-bold text-white mb-4">مميزات الاستوديو</h2>
          <div className="w-24 h-1 bg-amber-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: FastForward, title: 'سريع وسلس', desc: 'تصدير حصري عبر المتصفح دون الحاجة لبرامج مونتاج ثقيلة.' },
            { icon: Sparkles, title: 'تصاميم فاخرة', desc: 'أنماط جاهزة مصممة خصيصاً للقرآن (فضائي، طبيعة، الكعبة، ليلي).' },
            { icon: Settings, title: 'مستقل تماماً', desc: 'يعمل محلياً بدون أي خدمات مدفوعة أو تخزين سحابي يهدد خصوصيتك.' }
          ].map((feat, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.6, delay: i * 0.2 }}
               className="glass-panel p-8 rounded-3xl flex flex-col items-center text-center"
             >
               <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center mb-6 text-amber-400">
                 <feat.icon className="w-8 h-8"/>
               </div>
               <h3 className="text-2xl font-cairo font-bold text-white mb-4">{feat.title}</h3>
               <p className="text-slate-400 font-tajawal text-lg leading-relaxed">{feat.desc}</p>
             </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <div className="bg-slate-950 min-h-screen text-slate-50 selection:bg-amber-500/30">
      <Hero />
      <Features />
    </div>
  );
}
