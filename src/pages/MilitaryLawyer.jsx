import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldAlert, UserCheck, FileText, MoveRight,
  Landmark, ShieldCheck, ScrollText, Users, HandHeart,
  MessageCircle, ArrowRight, CheckCircle2, Award
} from 'lucide-react';

const BOT_LINK = "https://t.me/legal_click_bot";

const services = [
  {
    title: "Оскарження рішень ВЛК/МСЕК",
    desc: "Перегляд висновків за станом здоров'я та направлення на комісію.",
    icon: ShieldAlert,
    color: "from-blue-500 to-indigo-600",
    shadow: "shadow-blue-500/20"
  },
  {
    title: "Мобілізація та відстрочка",
    desc: "Оскарження призову та супровід при отриманні законної відстрочки.",
    icon: UserCheck,
    color: "from-emerald-500 to-teal-600",
    shadow: "shadow-emerald-500/20"
  },
  {
    title: "Звільнення зі служби",
    desc: "Юридичний супровід звільнення за наявності законних підстав.",
    icon: FileText,
    color: "from-violet-500 to-purple-600",
    shadow: "shadow-violet-500/20"
  },
  {
    title: "Переведення та рапорти",
    desc: "Оскарження відмов у переведенні до іншої частини.",
    icon: MoveRight,
    color: "from-orange-500 to-red-500",
    shadow: "shadow-orange-500/20"
  },
  {
    title: "Виплати та забезпечення",
    desc: "Стягнення недоплачених коштів, «бойових» та виплати 1 млн грн.",
    icon: Landmark,
    color: "from-amber-500 to-yellow-500",
    shadow: "shadow-amber-500/20"
  },
  {
    title: "Сімейні справи",
    desc: "Виплати загиблим. Встановлення факту проживання однією сім'єю.",
    icon: Users,
    color: "from-pink-500 to-rose-600",
    shadow: "shadow-pink-500/20"
  },
  {
    title: "Моральна шкода",
    desc: "Відшкодування за незаконні дії чи бездіяльність командування.",
    icon: HandHeart,
    color: "from-cyan-500 to-blue-500",
    shadow: "shadow-cyan-500/20"
  }
];

const stats = [
  { value: '2,800+', label: 'Справ військових' },
  { value: '94%', label: 'Успішних рішень' },
  { value: '~12 хв', label: 'Час відповіді' },
  { value: '100%', label: 'Онлайн' },
];

export const MilitaryLawyer = () => {
  useEffect(() => {
    document.title = 'Юридична допомога військовим — Оскарження ВЛК, виплати, звільнення';
    const tag = document.querySelector('meta[name="description"]');
    if (tag) {
      tag.setAttribute('content', 'Професійні послуги військового юриста. Допомога при оскарженні ВЛК, отриманні виплат та звільненні зі служби.');
    }
  }, []);

  return (
    <div className="text-[#0D1B2E] pb-20 md:pb-0 min-h-screen">

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-[#020817] text-white py-16 md:py-28 lg:py-36">
        {/* Ambient blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-[#2563EB]/20 rounded-full blur-[130px]"></div>
          <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-[#7C3AED]/18 rounded-full blur-[110px]"></div>
          <div className="absolute inset-0 opacity-[0.025]" style={{backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px'}}></div>
        </div>

        <div className="max-w-5xl mx-auto px-5 md:px-8 flex flex-col items-center text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark border border-white/10 text-white/70 text-[11px] font-semibold uppercase tracking-[0.1em] mb-7">
              <ShieldCheck className="w-4 h-4 text-[#3B82F6]" />
              Захист прав військовослужбовців та звільнених у запас
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[66px] font-black tracking-tight leading-[1.06] mb-6">
              Юридичний захист<br className="hidden sm:block"/>
              <span className="text-gradient-blue"> військовослужбовців</span><br/>та їхніх родин
            </h1>

            <p className="text-white/55 text-base sm:text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
              Професійна допомога у вирішенні спорів із командуванням, ВЛК та державними органами. Працюємо на результат.
            </p>

            <motion.a
              href={BOT_LINK}
              className="bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white rounded-2xl py-4 md:py-5 px-8 md:px-10 font-black text-base md:text-lg inline-flex items-center justify-center gap-3 shadow-[0_8px_32px_rgba(37,99,235,0.45)] active:scale-95 transition-transform"
              whileHover={{ scale: 1.03, boxShadow: '0 12px 40px rgba(37,99,235,0.55)' }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <MessageCircle className="w-5 h-5 md:w-6 md:h-6" /> Отримати консультацію
            </motion.a>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 mt-14 md:mt-20 w-full"
          >
            {stats.map(({ value, label }) => (
              <div key={label} className="glass-dark rounded-2xl p-4 md:p-6 border border-white/6">
                <div className="text-2xl md:text-3xl font-black text-gradient-blue mb-1">{value}</div>
                <div className="text-white/45 text-[11px] md:text-xs font-medium">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== EXPERTISE ===== */}
      <section className="px-5 py-14 md:py-24 bg-white border-b border-gray-100">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="w-16 h-16 bg-gradient-to-br from-[#2563EB] to-[#7C3AED] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/20">
            <ScrollText className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl md:text-5xl font-black mb-6 text-[#0D1B2E] tracking-tight">Експертність без канцеляризмів</h2>
          <p className="text-[#475569] text-base md:text-xl leading-relaxed max-w-3xl mx-auto">
            Ми говоримо з вами зрозумілою людяною мовою, проте досконало знаємо всі тонкощі армійських статутів, бюрократичних процедур та законів України. Не витрачайте час на спроби самостійно розібратися у складнощах системи — довірте це професіоналам.
          </p>

          {/* Guarantee pills */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {['Сертифіковані адвокати', 'NDA з кожним юристом', 'Результат або повернення', '100% онлайн'].map(t => (
              <span key={t} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-blue-50 text-[#2563EB] text-sm font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2.5} /> {t}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ===== SERVICES GRID ===== */}
      <section className="px-4 md:px-5 py-14 md:py-28 bg-[#F8FAFF]">
        <motion.div
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="text-center mb-10 md:mb-16">
            <div className="section-eyebrow bg-blue-50 text-[#2563EB] mb-4 mx-auto">
              <ShieldCheck className="w-3.5 h-3.5" /> Послуги
            </div>
            <h2 className="text-2xl md:text-5xl font-black text-[#0D1B2E] tracking-tight">Наші послуги</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.06, ease: "easeOut" }}
                  className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/8 md:hover:-translate-y-2 transition-all duration-300 group"
                >
                  <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-5 shadow-lg ${service.shadow} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 md:w-7 md:h-7 text-white" strokeWidth={2} />
                  </div>
                  <h3 className="text-base md:text-xl font-black text-[#0D1B2E] mb-3">{service.title}</h3>
                  <p className="text-[#475569] text-sm md:text-base leading-relaxed">{service.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* ===== FOOTER CTA ===== */}
      <section className="px-4 md:px-5 py-12 md:pb-32 bg-[#F8FAFF] text-center">
        <div className="max-w-5xl mx-auto relative overflow-hidden bg-[#020817] rounded-2xl md:rounded-[40px] p-8 md:p-20 shadow-2xl">
          <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[#2563EB]/12 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-[#7C3AED]/10 rounded-full blur-[100px] pointer-events-none translate-x-1/2 translate-y-1/2"></div>

          <div className="relative z-10">
            <div className="w-14 h-14 md:w-20 md:h-20 bg-gradient-to-br from-[#2563EB] to-[#7C3AED] rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-6 md:mb-8 shadow-[0_8px_32px_rgba(37,99,235,0.4)]">
              <MessageCircle className="w-7 h-7 md:w-10 md:h-10 text-white" strokeWidth={2} />
            </div>
            <h2 className="text-xl md:text-5xl font-black mb-3 md:mb-6 text-white tracking-tight">Юридична підтримка —<br className="hidden md:block"/> в одному кліку</h2>
            <p className="text-sm md:text-xl text-white/50 mb-7 md:mb-10 max-w-2xl mx-auto leading-relaxed">Не відкладайте на потім. Відкрийте чат, опишіть ситуацію і отримайте план дій вже сьогодні.</p>
            <motion.a
              href={BOT_LINK}
              className="inline-flex bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white font-black py-4 px-8 md:py-5 md:px-12 rounded-xl md:rounded-2xl shadow-[0_8px_32px_rgba(37,99,235,0.45)] items-center justify-center gap-2 md:gap-3 text-base md:text-xl active:scale-95 transition-transform"
              whileHover={{ scale: 1.03, boxShadow: '0 12px 40px rgba(37,99,235,0.55)' }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              Чат з юристом <ArrowRight className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
            </motion.a>
          </div>
        </div>
      </section>

    </div>
  );
};
