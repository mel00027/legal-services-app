import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Car, FileX, Building2, ShieldAlert,
  Scale, MessageCircle, ArrowRight
} from 'lucide-react';
import { useSanityQuery } from '../sanity/useSanity.js';
import { SERVICE_PAGE_QUERY, SITE_CONFIG_QUERY } from '../sanity/queries.js';
import { getIcon } from '../sanity/iconMap.js';

const DEFAULT_BOT_LINK = "https://t.me/legal_click_bot?start=hello";

const EASE = [0.22, 1, 0.36, 1];
const VIEWPORT = { once: true, margin: '-80px' };

const sectionContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.05, ease: EASE } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 48 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.0, ease: EASE } },
};
const fadeUpSoft = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};
const cardRise = {
  hidden: { opacity: 0, y: 60, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 1.05, ease: EASE } },
};

const services = [
  { title: "Справи у сфері дорожнього руху", desc: "Штрафи ПДР, позбавлення прав, оскарження постанов поліції, ДТП та експертизи.", icon: Car, color: "from-violet-500 to-purple-600" },
  { title: "Оскарження постанов", desc: "Скасування постанов про адміністративні правопорушення у суді чи вищому органі.", icon: FileX, color: "from-fuchsia-500 to-pink-600" },
  { title: "Спори з органами влади", desc: "Спори з приводу рішень, дій чи бездіяльності суб'єктів владних повноважень у справах про притягнення до адміністративної відповідальності.", icon: Building2, color: "from-indigo-500 to-violet-600" },
  { title: "Військові адміністративні правопорушення", desc: "Ст. 172-10 – 172-20 КУпАП: непокора командиру, СЗЧ, пошкодження військового майна, недбале ставлення до служби, вживання алкоголю чи наркотиків.", icon: ShieldAlert, color: "from-blue-500 to-indigo-600" },
];

const stats = [
  { value: '50+', label: 'Адмін. справ' },
  { value: '92%', label: 'Успішних оскаржень' },
  { value: '~15 хв', label: 'Час відповіді' },
  { value: '100%', label: 'Онлайн' },
];

export const AdministrativeOffences = () => {
  const { data: cms } = useSanityQuery(SERVICE_PAGE_QUERY, null, { slug: 'administrative-offences' });
  const { data: siteConfig } = useSanityQuery(SITE_CONFIG_QUERY, null);

  const BOT_LINK = siteConfig?.botLink || DEFAULT_BOT_LINK;
  const hero = cms?.hero || {};
  const badgeText = hero.badge || 'Адміністративне право';
  const titleStart = hero.titleStart || 'Адміністративні';
  const titleGradient = hero.titleGradient || 'правопорушення';
  const heroSubtitle = hero.subtitle || 'Дорожній рух, оскарження постанов поліції та спори з органами влади. Захищаємо ваші права — швидко й без бюрократії.';
  const ctaLabel = hero.ctaLabel || 'Отримати консультацію';
  const activeServices = cms?.services?.length ? cms.services.map((s) => ({ ...s, icon: getIcon(s.iconName), color: s.gradient })) : services;
  const activeStats = cms?.stats || stats;
  const activeExpertise = cms?.expertise || { heading: 'Зрозуміло про складне', description: 'Адміністративне право — одне з найбільш заплутаних. Ми чітко пояснюємо ваші права, готуємо аргументовані оскарження і доводимо справу до результату.' };
  const activeFooterCta = cms?.footerCta || { heading: 'Не зволікайте — терміни оскарження обмежені', subtitle: 'Відкрийте чат, опишіть ситуацію і отримайте план дій вже сьогодні.', buttonLabel: 'Чат з юристом' };
  const seo = cms?.seo || { title: 'Адміністративні правопорушення — LegalClick', description: 'Професійна допомога у справах про адміністративні правопорушення: дорожній рух, оскарження постанов, спори з органами влади.' };

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = seo.title;
    const tag = document.querySelector('meta[name="description"]');
    if (tag) tag.setAttribute('content', seo.description);
  }, [seo.title, seo.description]);

  return (
    <div className="text-white pb-20 md:pb-0 min-h-screen">

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-transparent py-16 md:py-28 lg:py-36">
        <motion.div
          className="max-w-5xl mx-auto px-5 md:px-8 flex flex-col items-center text-center relative z-10"
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.18, delayChildren: 0.5, ease: EASE } } }}
        >
          <motion.div variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } } }}
            style={{ willChange: 'transform, opacity' }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark border border-white/10 text-white/70 text-[11px] font-semibold uppercase tracking-[0.1em] mb-7">
              <Scale className="w-4 h-4 text-violet-400" />
              {badgeText}
            </div>
          </motion.div>

          <motion.h1
            variants={{ hidden: { opacity: 0, y: 48 }, visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: EASE } } }}
            style={{ willChange: 'transform, opacity' }}
            className="no-bg text-3xl sm:text-4xl md:text-5xl lg:text-[66px] font-black tracking-tight leading-[1.06] mb-6 text-white"
          >
            {titleStart}<br className="hidden sm:block"/>
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent"> {titleGradient}</span>
          </motion.h1>

          <motion.p
            variants={{ hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0, transition: { duration: 1.0, ease: EASE } } }}
            style={{ willChange: 'transform, opacity' }}
            className="text-white/55 text-base sm:text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto"
          >
            {heroSubtitle}
          </motion.p>

          <motion.div
            variants={{ hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0, transition: { duration: 1.0, ease: EASE } } }}
            style={{ willChange: 'transform, opacity' }}
          >
            <motion.a
              href={BOT_LINK}
              className="bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-2xl py-4 md:py-5 px-8 md:px-10 font-black text-base md:text-lg inline-flex items-center justify-center gap-3 shadow-[0_8px_32px_rgba(124,58,237,0.4)] active:scale-95 transition-transform"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <MessageCircle className="w-5 h-5 md:w-6 md:h-6" /> {ctaLabel}
            </motion.a>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0, transition: { duration: 1.0, ease: EASE } } }}
            style={{ willChange: 'transform, opacity' }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 mt-14 md:mt-20 w-full"
          >
            {activeStats.map(({ value, label }) => (
              <div key={label} className="bg-white/[0.04] backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-white/[0.08]">
                <div className="text-2xl md:text-3xl font-black bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent mb-1">{value}</div>
                <div className="text-white/45 text-[11px] md:text-xs font-medium">{label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ===== EXPERTISE ===== */}
      <section className="px-5 py-14 md:py-24 bg-transparent">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          variants={sectionContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          <motion.div variants={fadeUpSoft} style={{ willChange: 'transform, opacity' }}
            className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-violet-500/20"
          >
            <Scale className="w-8 h-8 text-white" />
          </motion.div>
          <motion.h2 variants={fadeUp} style={{ willChange: 'transform, opacity' }}
            className="text-2xl md:text-5xl font-black mb-6 text-white tracking-tight"
          >
            {activeExpertise.heading}
          </motion.h2>
          <motion.p variants={fadeUpSoft} style={{ willChange: 'transform, opacity' }}
            className="text-white/55 text-base md:text-xl leading-relaxed max-w-3xl mx-auto"
          >
            {activeExpertise.description}
          </motion.p>
        </motion.div>
      </section>

      {/* ===== SERVICES GRID ===== */}
      <section className="px-4 md:px-5 py-14 md:py-28 bg-transparent">
        <motion.div
          className="max-w-5xl mx-auto"
          variants={sectionContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          <div className="text-center mb-10 md:mb-16">
            <motion.div variants={fadeUpSoft} style={{ willChange: 'transform, opacity' }}
              className="section-eyebrow bg-white/10 border border-white/10 text-white/60 mb-4 mx-auto"
            >
              <Scale className="w-3.5 h-3.5" /> Категорії справ
            </motion.div>
            <motion.h2 variants={fadeUp} style={{ willChange: 'transform, opacity' }}
              className="text-2xl md:text-5xl font-black text-white tracking-tight"
            >
              Наші послуги
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
            {activeServices.map((service, index) => {
              const Icon = service.icon || getIcon(service.iconName);
              return (
                <motion.div
                  key={index}
                  variants={cardRise}
                  style={{ willChange: 'transform, opacity' }}
                  className="bg-white/[0.04] backdrop-blur-sm rounded-2xl md:rounded-3xl p-6 md:p-8 border border-white/[0.08] hover:bg-white/[0.07] md:hover:-translate-y-2 transition-all duration-300 group"
                >
                  <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 md:w-7 md:h-7 text-white" strokeWidth={2} />
                  </div>
                  <h3 className="text-base md:text-xl font-black text-white mb-3">{service.title}</h3>
                  <p className="text-white/55 text-sm md:text-base leading-relaxed">{service.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* ===== FOOTER CTA ===== */}
      <section className="px-4 md:px-5 py-12 md:pb-32 bg-transparent text-center">
        <motion.div
          className="max-w-5xl mx-auto p-8 md:p-20"
          variants={sectionContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          <motion.div variants={cardRise} style={{ willChange: 'transform, opacity' }}
            className="w-14 h-14 md:w-20 md:h-20 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-6 md:mb-8 shadow-[0_8px_32px_rgba(124,58,237,0.35)]"
          >
            <MessageCircle className="w-7 h-7 md:w-10 md:h-10 text-white" strokeWidth={2} />
          </motion.div>
          <motion.h2 variants={fadeUp} style={{ willChange: 'transform, opacity' }}
            className="text-xl md:text-5xl font-black mb-3 md:mb-6 text-white tracking-tight"
          >
            {activeFooterCta.heading}
          </motion.h2>
          <motion.p variants={fadeUpSoft} style={{ willChange: 'transform, opacity' }}
            className="text-sm md:text-xl text-white/50 mb-7 md:mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            {activeFooterCta.subtitle}
          </motion.p>
          <motion.a
            href={BOT_LINK}
            variants={fadeUpSoft}
            className="inline-flex bg-gradient-to-r from-violet-500 to-purple-600 text-white font-black py-4 px-8 md:py-5 md:px-12 rounded-xl md:rounded-2xl shadow-[0_8px_32px_rgba(124,58,237,0.4)] items-center justify-center gap-2 md:gap-3 text-base md:text-xl active:scale-95 transition-transform"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            style={{ willChange: 'transform, opacity' }}
          >
            {activeFooterCta.buttonLabel} <ArrowRight className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
          </motion.a>
        </motion.div>
      </section>

    </div>
  );
};
