import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Car, FileX, Building2,
  Scale, MessageCircle, ArrowRight
} from 'lucide-react';

const BOT_LINK = "https://t.me/legal_click_bot?start=hello";

const services = [
  {
    title: "Справи у сфері дорожнього руху",
    desc: "Штрафи ПДР, позбавлення прав, оскарження постанов поліції, ДТП та експертизи.",
    icon: Car,
    color: "from-violet-500 to-purple-600",
    shadow: "shadow-violet-500/20"
  },
  {
    title: "Оскарження постанов",
    desc: "Скасування постанов про адміністративні правопорушення у суді чи вищому органі.",
    icon: FileX,
    color: "from-fuchsia-500 to-pink-600",
    shadow: "shadow-fuchsia-500/20"
  },
  {
    title: "Спори з органами влади",
    desc: "Спори з приводу рішень, дій чи бездіяльності суб'єктів владних повноважень у справах про притягнення до адміністративної відповідальності.",
    icon: Building2,
    color: "from-indigo-500 to-violet-600",
    shadow: "shadow-indigo-500/20"
  }
];

const stats = [
  { value: '50+', label: 'Адмін. справ' },
  { value: '92%', label: 'Успішних оскаржень' },
  { value: '~15 хв', label: 'Час відповіді' },
  { value: '100%', label: 'Онлайн' },
];

export const AdministrativeOffences = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Адміністративні правопорушення — LegalClick';
    const tag = document.querySelector('meta[name="description"]');
    if (tag) {
      tag.setAttribute('content', 'Професійна допомога у справах про адміністративні правопорушення: дорожній рух, оскарження постанов, спори з органами влади.');
    }
  }, []);

  return (
    <div className="text-[#0D1B2E] pb-20 md:pb-0 min-h-screen">

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-[#020817] text-white py-16 md:py-28 lg:py-36">
        {/* Ambient blobs — violet/purple palette */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-[#7C3AED]/18 rounded-full blur-[130px]"></div>
          <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-[#2563EB]/18 rounded-full blur-[110px]"></div>
          <div className="absolute top-[50%] right-[25%] w-[250px] h-[250px] bg-[#A855F7]/12 rounded-full blur-[90px]"></div>
          <div className="absolute inset-0 opacity-[0.025]" style={{backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px'}}></div>
        </div>

        <div className="max-w-5xl mx-auto px-5 md:px-8 flex flex-col items-center text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark border border-white/10 text-white/70 text-[11px] font-semibold uppercase tracking-[0.1em] mb-7">
              <Scale className="w-4 h-4 text-violet-400" />
              Адміністративне право
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[66px] font-black tracking-tight leading-[1.06] mb-6">
              Адміністративні<br className="hidden sm:block"/>
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent"> правопорушення</span>
            </h1>

            <p className="text-white/55 text-base sm:text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
              Дорожній рух, оскарження постанов поліції та спори з органами влади. Захищаємо ваші права — швидко й без бюрократії.
            </p>

            <motion.a
              href={BOT_LINK}
              className="bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-2xl py-4 md:py-5 px-8 md:px-10 font-black text-base md:text-lg inline-flex items-center justify-center gap-3 shadow-[0_8px_32px_rgba(124,58,237,0.4)] active:scale-95 transition-transform"
              whileHover={{ scale: 1.03, boxShadow: '0 12px 40px rgba(124,58,237,0.5)' }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <MessageCircle className="w-5 h-5 md:w-6 md:h-6" /> Отримати консультацію
            </motion.a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 mt-14 md:mt-20 w-full"
          >
            {stats.map(({ value, label }) => (
              <div key={label} className="glass-dark rounded-2xl p-4 md:p-6 border border-white/6">
                <div className="text-2xl md:text-3xl font-black bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent mb-1">{value}</div>
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
          <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-violet-500/20">
            <Scale className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl md:text-5xl font-black mb-6 text-[#0D1B2E] tracking-tight">Захист у адміністративних справах</h2>
          <p className="text-[#475569] text-base md:text-xl leading-relaxed max-w-3xl mx-auto">
            Штраф ПДР, позбавлення прав, протокол поліції, неправомірні дії посадовця — все це адміністративні справи з жорсткими строками. Пропустили 10 днів на оскарження — постанова набуде чинності. Ми складемо скаргу, зберемо докази та представимо ваші інтереси у суді.
          </p>
        </motion.div>
      </section>

      {/* ===== SERVICES GRID ===== */}
      <section className="px-4 md:px-5 py-14 md:py-28 bg-[#F8FAFF]">
        <motion.div
          className="max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="text-center mb-10 md:mb-16">
            <div className="section-eyebrow bg-violet-50 text-violet-700 mb-4 mx-auto">
              <Scale className="w-3.5 h-3.5" /> Категорії справ
            </div>
            <h2 className="text-2xl md:text-5xl font-black text-[#0D1B2E] tracking-tight">Наші послуги</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
                  className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-violet-900/6 md:hover:-translate-y-2 transition-all duration-300 group"
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
          <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[#7C3AED]/12 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-[#2563EB]/10 rounded-full blur-[100px] pointer-events-none translate-x-1/2 translate-y-1/2"></div>

          <div className="relative z-10">
            <div className="w-14 h-14 md:w-20 md:h-20 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-6 md:mb-8 shadow-[0_8px_32px_rgba(124,58,237,0.35)]">
              <MessageCircle className="w-7 h-7 md:w-10 md:h-10 text-white" strokeWidth={2} />
            </div>
            <h2 className="text-xl md:text-5xl font-black mb-3 md:mb-6 text-white tracking-tight">Не втрачайте час —<br className="hidden md:block"/> строки на оскарження обмежені</h2>
            <p className="text-sm md:text-xl text-white/50 mb-7 md:mb-10 max-w-2xl mx-auto leading-relaxed">Відкрийте чат, опишіть свою ситуацію і отримайте план дій вже сьогодні. Кожен день рахується.</p>
            <motion.a
              href={BOT_LINK}
              className="inline-flex bg-gradient-to-r from-violet-500 to-purple-600 text-white font-black py-4 px-8 md:py-5 md:px-12 rounded-xl md:rounded-2xl shadow-[0_8px_32px_rgba(124,58,237,0.4)] items-center justify-center gap-2 md:gap-3 text-base md:text-xl active:scale-95 transition-transform"
              whileHover={{ scale: 1.03, boxShadow: '0 12px 40px rgba(124,58,237,0.5)' }}
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
