import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, Home, BadgePercent, Eraser, ShieldCheck, MessageCircle, ChevronRight, ScrollText
} from 'lucide-react';

const BOT_LINK = "https://t.me/legal_click_bot";

const services = [
  {
    title: "Квартирний облік",
    desc: "Оскарження зняття та поновлення в черзі на житло.",
    icon: FileText
  },
  {
    title: "Компенсація за житло",
    desc: "Отримання грошових виплат на житлове приміщення військовослужбовцям.",
    icon: ShieldCheck
  },
  {
    title: "Повернення 1% ПФУ",
    desc: "Повернення пенсійного збору (1%) при купівлі житла вперше (первинний/вторинний ринок).",
    icon: BadgePercent
  },
  {
    title: "Комунальні борги",
    desc: "Законне списання безпідставних боргів за послуги ЖКП попереднього власника майна.",
    icon: Eraser
  }
];

export const HousingLaw = () => {
  useEffect(() => {
    // Scroll to top on load
    window.scrollTo(0, 0);
    
    document.title = 'Житлове право та захист нерухомості — LegalClick';
    const tag = document.querySelector('meta[name="description"]');
    if (tag) {
      tag.setAttribute('content', 'Професійні послуги у сфері житлового права: квартирний облік, компенсації, повернення 1% до ПФУ та списання комунальних боргів.');
    }
  }, []);

  return (
    <div className="bg-app-bg md:bg-white text-graphite pb-20 pt-16 md:pt-24 min-h-screen">
      
      {/* ===== HERO ===== */}
      <section className="px-5 py-10 md:py-20 lg:py-24 bg-gradient-to-b md:bg-gradient-to-r from-blue-900 md:from-slate-900 to-electric text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white font-semibold text-xs sm:text-sm uppercase tracking-wider mb-6">
              <Home className="w-4 h-4 text-mint" />
              Житлове право
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.15] mb-6">
              Житлове право та <br className="hidden sm:block"/><span className="text-mint">захист нерухомості</span>
            </h1>
            
            <p className="text-blue-100 text-[16px] sm:text-lg md:text-2xl leading-relaxed mb-8 md:mb-12 max-w-3xl mx-auto">
              Поновлення в черзі на житло, отримання компенсацій та повернення коштів при купівлі нерухомості. Працюємо на результат.
            </p>
            
            <motion.a 
              href={BOT_LINK}
              className="bg-mint text-graphite rounded-2xl py-4 sm:py-5 px-8 sm:px-10 font-bold text-lg sm:text-xl inline-flex items-center justify-center gap-3 hover:bg-white shadow-[0_0_40px_rgba(0,229,255,0.4)] active:scale-95 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MessageCircle className="w-6 h-6" /> Отримати консультацію
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* ===== EXPERTISE TEXT ===== */}
      <section className="px-5 py-12 md:py-24 bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ScrollText className="w-8 h-8 text-electric" />
          </div>
          <h2 className="text-2xl md:text-5xl font-bold mb-6 text-graphite">Експертність без канцеляризмів</h2>
          <p className="text-gray-500 text-lg md:text-2xl leading-relaxed">
            Ми говоримо з вами зрозумілою людяною мовою, проте досконало знаємо всі тонкощі житлового кодексу, бюрократичних процедур та законів України. Не витрачайте час на спроби самостійно розібратися у складнощах системи — довірте це професіоналам.
          </p>
        </div>
      </section>

      {/* ===== SERVICES GRID ===== */}
      <section className="px-4 md:px-5 py-12 md:py-24 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-5xl font-bold mb-10 md:mb-16 text-center">Наші послуги</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 lg:max-w-4xl lg:mx-auto gap-4 md:gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} className="bg-white rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-slate-100">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6 text-electric" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-graphite mb-3">{service.title}</h3>
                  <p className="text-gray-500 text-sm md:text-base leading-relaxed">{service.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== FOOTER CTA ===== */}
      <section className="px-4 md:px-5 pb-8 md:pb-32 bg-white relative text-center">
        <div className="max-w-5xl mx-auto bg-blue-50/50 border border-blue-100 rounded-2xl md:rounded-[40px] p-8 md:p-20 shadow-lg md:shadow-xl shadow-blue-900/5">
          <div className="w-14 h-14 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-5 md:mb-8 shadow-sm">
            <MessageCircle className="w-7 h-7 md:w-10 md:h-10 text-electric" strokeWidth={2.5} />
          </div>
          <h2 className="text-xl md:text-5xl font-bold mb-3 md:mb-6 text-graphite">Юридична підтримка — в одному кліку</h2>
          <p className="text-sm md:text-xl text-gray-500 mb-6 md:mb-10 max-w-2xl mx-auto leading-relaxed">Не відкладайте на потім. Відкрийте чат, опишіть ситуацію і отримайте план дій вже сьогодні.</p>
          <motion.a 
            href={BOT_LINK}
            className="inline-flex bg-electric text-white font-bold py-3.5 px-8 md:py-5 md:px-10 rounded-xl md:rounded-2xl hover:bg-electric-hover shadow-xl shadow-electric/30 items-center justify-center gap-2 md:gap-3 text-base md:text-xl active:scale-95 transition-transform"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            Чат з юристом <ChevronRight className="w-5 h-5 md:w-6 md:h-6" strokeWidth={3} />
          </motion.a>
        </div>
      </section>

    </div>
  );
};
