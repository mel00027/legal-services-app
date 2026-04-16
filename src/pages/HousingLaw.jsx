import React, { useEffect } from 'react';
import { m } from 'framer-motion';
import {
  FileText, Home, BadgePercent, Eraser,
  ShieldCheck, MessageCircle, ScrollText, ArrowRight, CheckCircle2
} from 'lucide-react';
import { BOT_LINK_HOUSING } from '../constants';

const services = [
  {
    title: "Квартирний облік",
    desc: "Оскарження зняття та поновлення в черзі на житло.",
    icon: FileText,
    color: "from-blue-500 to-indigo-600",
    shadow: "shadow-blue-500/20"
  },
  {
    title: "Компенсація за житло",
    desc: "Отримання грошових виплат на житлове приміщення військовослужбовцям.",
    icon: ShieldCheck,
    color: "from-emerald-500 to-teal-600",
    shadow: "shadow-emerald-500/20"
  },
  {
    title: "Повернення 1% ПФУ",
    desc: "Повернення пенсійного збору (1%) при купівлі житла вперше (первинний/вторинний ринок).",
    icon: BadgePercent,
    color: "from-amber-500 to-yellow-500",
    shadow: "shadow-amber-500/20"
  },
  {
    title: "Комунальні борги",
    desc: "Законне списання безпідставних боргів за послуги ЖКП попереднього власника майна.",
    icon: Eraser,
    color: "from-violet-500 to-purple-600",
    shadow: "shadow-violet-500/20"
  }
];

const stats = [
  { value: '1,400+', label: 'Житлових справ' },
  { value: '96%', label: 'Успішних рішень' },
  { value: '~15 хв', label: 'Час відповіді' },
  { value: '100%', label: 'Онлайн' },
];

export const HousingLaw = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Житлове право та захист нерухомості — LegalClick';
    const tag = document.querySelector('meta[name="description"]');
    if (tag) {
      tag.setAttribute('content', 'Професійні послуги у сфері житлового права: квартирний облік, компенсації, повернення 1% до ПФУ та списання комунальних боргів.');
    }
  }, []);

  return (
    <div className="text-[#0D1B2E] pb-20 md:pb-0 min-h-screen">

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-[#020817] text-white py-16 md:py-28 lg:py-36">
        {/* Ambient blobs — green/teal palette for housing */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-[#10B981]/15 rounded-full blur-[130px]"></div>
          <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-[#2563EB]/18 rounded-full blur-[110px]"></div>
          <div className="absolute top-[50%] right-[25%] w-[250px] h-[250px] bg-[#7C3AED]/10 rounded-full blur-[90px]"></div>
          <div className="absolute inset-0 opacity-[0.025]" style={{backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px'}}></div>
        </div>

        <div className="max-w-5xl mx-auto px-5 md:px-8 flex flex-col items-center text-center relative z-10">
          <m.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark border border-white/10 text-white/70 text-[11px] font-semibold uppercase tracking-[0.1em] mb-7">
              <Home className="w-4 h-4 text-emerald-400" />
              Житлове право
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[66px] font-black tracking-tight leading-[1.06] mb-6">
              Житлове право та<br className="hidden sm:block"/>
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent"> захист нерухомості</span>
            </h1>

            <p className="text-white/55 text-base sm:text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
              Поновлення в черзі на житло, отримання компенсацій та повернення коштів при купівлі нерухомості. Працюємо на результат.
            </p>

            <m.a
              href={BOT_LINK_HOUSING}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl py-4 md:py-5 px-8 md:px-10 font-black text-base md:text-lg inline-flex items-center justify-center gap-3 shadow-[0_8px_32px_rgba(16,185,129,0.4)] active:scale-95 transition-transform"
              whileHover={{ scale: 1.03, boxShadow: '0 12px 40px rgba(16,185,129,0.5)' }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <MessageCircle className="w-5 h-5 md:w-6 md:h-6" /> Отримати консультацію
            </m.a>
          </m.div>

          {/* Stats */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 mt-14 md:mt-20 w-full"
          >
            {stats.map(({ value, label }) => (
              <div key={label} className="glass-dark rounded-2xl p-4 md:p-6 border border-white/6">
                <div className="text-2xl md:text-3xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-1">{value}</div>
                <div className="text-white/45 text-[11px] md:text-xs font-medium">{label}</div>
              </div>
            ))}
          </m.div>
        </div>
      </section>

      {/* ===== EXPERTISE ===== */}
      <section className="px-5 py-14 md:py-24 bg-white border-b border-gray-100">
        <m.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20">
            <ScrollText className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl md:text-5xl font-black mb-6 text-[#0D1B2E] tracking-tight">Експертність без канцеляризмів</h2>
          <p className="text-[#475569] text-base md:text-xl leading-relaxed max-w-3xl mx-auto">
            Ми говоримо з вами зрозумілою людяною мовою, проте досконало знаємо всі тонкощі житлового кодексу, бюрократичних процедур та законів України. Не витрачайте час на спроби самостійно розібратися у складнощах системи — довірте це професіоналам.
          </p>

          {/* Guarantee pills */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {['Сертифіковані адвокати', 'NDA з кожним юристом', 'Фіксована ціна', '100% онлайн'].map(t => (
              <span key={t} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2.5} /> {t}
              </span>
            ))}
          </div>
        </m.div>
      </section>

      {/* ===== SERVICES GRID ===== */}
      <section className="px-4 md:px-5 py-14 md:py-28 bg-[#F8FAFF]">
        <m.div
          className="max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="text-center mb-10 md:mb-16">
            <div className="section-eyebrow bg-emerald-50 text-emerald-700 mb-4 mx-auto">
              <Home className="w-3.5 h-3.5" /> Послуги
            </div>
            <h2 className="text-2xl md:text-5xl font-black text-[#0D1B2E] tracking-tight">Наші послуги</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <m.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
                  className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-emerald-900/6 md:hover:-translate-y-2 transition-all duration-300 group"
                >
                  <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-5 shadow-lg ${service.shadow} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 md:w-7 md:h-7 text-white" strokeWidth={2} />
                  </div>
                  <h3 className="text-base md:text-xl font-black text-[#0D1B2E] mb-3">{service.title}</h3>
                  <p className="text-[#475569] text-sm md:text-base leading-relaxed">{service.desc}</p>
                </m.div>
              );
            })}
          </div>
        </m.div>
      </section>

      {/* ===== FOOTER CTA ===== */}
      <section className="px-4 md:px-5 py-12 md:pb-32 bg-[#F8FAFF] text-center">
        <div className="max-w-5xl mx-auto relative overflow-hidden bg-[#020817] rounded-2xl md:rounded-[40px] p-8 md:p-20 shadow-2xl">
          <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[#10B981]/10 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-[#2563EB]/10 rounded-full blur-[100px] pointer-events-none translate-x-1/2 translate-y-1/2"></div>

          <div className="relative z-10">
            <div className="w-14 h-14 md:w-20 md:h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-6 md:mb-8 shadow-[0_8px_32px_rgba(16,185,129,0.35)]">
              <MessageCircle className="w-7 h-7 md:w-10 md:h-10 text-white" strokeWidth={2} />
            </div>
            <h2 className="text-xl md:text-5xl font-black mb-3 md:mb-6 text-white tracking-tight">Юридична підтримка —<br className="hidden md:block"/> в одному кліку</h2>
            <p className="text-sm md:text-xl text-white/50 mb-7 md:mb-10 max-w-2xl mx-auto leading-relaxed">Не відкладайте на потім. Відкрийте чат, опишіть ситуацію і отримайте план дій вже сьогодні.</p>
            <m.a
              href={BOT_LINK_HOUSING}
              className="inline-flex bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black py-4 px-8 md:py-5 md:px-12 rounded-xl md:rounded-2xl shadow-[0_8px_32px_rgba(16,185,129,0.4)] items-center justify-center gap-2 md:gap-3 text-base md:text-xl active:scale-95 transition-transform"
              whileHover={{ scale: 1.03, boxShadow: '0 12px 40px rgba(16,185,129,0.5)' }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              Чат з юристом <ArrowRight className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
            </m.a>
          </div>
        </div>
      </section>

    </div>
  );
};
