import React, { useState, useEffect, memo } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  MessageCircle, ShieldCheck, Home,
  Grid, Search, ChevronRight,
  Zap, CheckCircle2, Scale, ChevronUp,
  Star, ArrowRight, Award, Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MilitaryLawyer } from './pages/MilitaryLawyer';
import { HousingLaw } from './pages/HousingLaw';

/* ======================== DATA ======================== */

const clientMessages = [
  'Вітаю. Я зараз на лікуванні після поранення, ВЛК написали "обмежено придатний", але командир вимагає повертатися на нуль вже завтра. Каже, що людей немає. Допоможіть скласти рапорт на відпустку для оздоровлення або переведення.',
  'Добрий день! Чоловік зник безвісти під час виконання завдання місяць тому. В частині нічого не кажуть, довідку Ф-15 не дають. Грошове забезпечення теж перестали нараховувати. Підкажіть, які заяви треба написати?',
  'Я орендую квартиру, вчора нас затопили сусіди зверху. Господар квартири каже, що це мої проблеми, а сусіди двері не відкривають. Що мені зараз зафіксувати, щоб потім не платити за ремонт?',
  'ВЛК написали "придатний", хоча спина не гнеться і є виписки з лікарні. Хочу оскаржити — куди писати заяву?',
  'Не прийшли бойові за минулий місяць, хоча був на передку. В частині кажуть, що не подали вчасно списки. Допоможете з рапортом на перерахунок?',
];

const faqData = [
  {
    question: 'Хто саме буде займатися моєю справою?',
    answer: 'LegalClick — це платформа, яка об\'єднує десятки перевірених юристів з різних міст. Ми не передаємо справи «універсалам». Система аналізує ваш запит і підключає вільного фахівця, який є експертом саме у вашій галузі.',
  },
  {
    question: 'Як я можу бути впевненим у надійності?',
    answer: 'Платформа виступає гарантом вашої безпеки. Ми співпрацюємо лише з сертифікованими адвокатами, які внесені до Єдиного реєстру адвокатів України. Усі процеси контролюються сервісом, що виключає ризики для клієнта.',
  },
  {
    question: 'Чи безпечно надсилати документи у Telegram?',
    answer: 'Абсолютно. Telegram використовує надійні протоколи шифрування, а кожен адвокат нашої мережі пов\'язаний суворим договором про нерозголошення конфіденційної інформації (NDA) та діє в рамках адвокатської таємниці.',
  },
  {
    question: 'Що робити, якщо для суду потрібен паперовий документ?',
    answer: 'Ми працюємо 100% онлайн, але видаємо реальні документи. Адвокат підписує позови чи клопотання своїм КЕП (кваліфікованим електронним підписом), який має повну юридичну силу. За потреби адвокат відправить документ Новою Поштою.',
  },
  {
    question: 'Чи можете ви представляти мене в суді?',
    answer: 'Так. Оскільки в нашій мережі є фахівці з різних областей, ми або залучимо адвоката у вашому місті, або забезпечимо участь юриста онлайн через державну систему «Електронний суд». Вам не доведеться йти до зали засідань.',
  },
];

const serviceItems = [
  { name: 'Захист прав військовослужбовців', icon: ShieldCheck, path: '/military-lawyer', color: 'from-blue-600 to-indigo-600' },
  { name: 'Житлове право', icon: Home, path: '/housing-law', color: 'from-emerald-500 to-teal-600' },
  { name: 'Адміністративні правопорушення', icon: Scale, color: 'from-violet-500 to-purple-600' },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqData.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
};

const BOT_LINK = 'https://t.me/legal_click_bot';

/* ======================== COMPONENTS ======================== */

const ChatCarousel = memo(() => {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((p) => (p + 1) % clientMessages.length), 18000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative overflow-hidden flex-1 min-h-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ x: 180, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -180, opacity: 0 }}
          transition={{ duration: 0.38, ease: 'easeInOut' }}
          className="bg-[#2563EB] text-white rounded-xl p-3 shadow-sm ml-4"
        >
          <p className="text-[11px] leading-relaxed">{clientMessages[idx]}</p>
          <span className="text-[9px] opacity-60 block text-right mt-1">19:03</span>
        </motion.div>
      </AnimatePresence>
      <div className="flex justify-center gap-1.5 mt-3">
        {clientMessages.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === idx ? 'bg-[#2563EB] w-4' : 'bg-white/20 w-1.5'
            }`}
          />
        ))}
      </div>
    </div>
  );
});
ChatCarousel.displayName = 'ChatCarousel';

const AccordionItem = memo(({ question, answer }) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`rounded-2xl overflow-hidden transition-all duration-300 ${
        open
          ? 'bg-white shadow-lg border border-blue-100'
          : 'bg-white border border-gray-100 shadow-sm hover:border-blue-100 hover:shadow-md'
      }`}
    >
      <button
        className="w-full flex items-center justify-between p-5 md:p-6 text-left outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-2 rounded-2xl"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="font-bold text-[15px] md:text-[17px] text-[#0D1B2E] pr-4 leading-snug">
          {question}
        </span>
        <div
          className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center transition-all duration-300 ${
            open ? 'bg-[#2563EB] rotate-180' : 'bg-blue-50'
          }`}
        >
          <ChevronUp className={`w-4 h-4 transition-colors ${open ? 'text-white' : 'text-[#2563EB]'}`} />
        </div>
      </button>
      <div
        className={`px-5 md:px-6 overflow-hidden transition-all duration-300 ease-in-out ${
          open ? 'max-h-[500px] opacity-100 pb-5 md:pb-6' : 'max-h-0 opacity-0 pb-0'
        }`}
      >
        <p className="text-[#475569] leading-relaxed text-sm md:text-base border-t border-gray-100 pt-4">
          {answer}
        </p>
      </div>
    </div>
  );
});
AccordionItem.displayName = 'AccordionItem';

const ServiceCard = memo(({ name, icon: Icon, path, color }) => {
  const gradientColors =
    color?.includes('blue')
      ? '#2563EB, #7C3AED'
      : color?.includes('emerald')
      ? '#10B981, #0D9488'
      : '#8B5CF6, #7C3AED';

  const inner = (
    <div className="flex items-center justify-between p-5 md:p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/10 md:transition-all md:duration-300 md:hover:-translate-y-2 cursor-pointer group active:scale-[0.98] transition-transform overflow-hidden relative">
      <div
        className="absolute top-0 left-0 w-full h-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ backgroundImage: `linear-gradient(to right, ${gradientColors})` }}
      />
      <div className="flex items-center gap-4">
        <div
          className={`w-11 h-11 flex items-center justify-center bg-gradient-to-br ${
            color || 'from-blue-500 to-indigo-600'
          } rounded-xl shadow-sm`}
        >
          <Icon className="w-5 h-5 text-white" strokeWidth={2} />
        </div>
        <span className="font-bold text-[#0D1B2E] text-[15px] md:text-base">{name}</span>
      </div>
      <div className="w-8 h-8 rounded-full bg-gray-50 group-hover:bg-blue-50 flex items-center justify-center transition-colors shrink-0">
        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#2563EB] transition-colors" strokeWidth={2.5} />
      </div>
    </div>
  );

  return path ? <Link to={path} className="block">{inner}</Link> : inner;
});
ServiceCard.displayName = 'ServiceCard';

/* ======================== NAVIGATION ======================== */

const NavigationHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (e, id) => {
    e.preventDefault();
    const go = () => {
      if (id === 'home') window.scrollTo({ top: 0, behavior: 'smooth' });
      else document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };
    if (!isHome) { navigate('/'); setTimeout(go, 120); }
    else go();
  };

  const headerBase = 'transition-all duration-300 z-50 fixed top-0 w-full';
  const scrolledStyle = 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100';
  const clearStyle = 'bg-white border-b border-transparent';

  return (
    <>
      {/* Mobile */}
      <header className={`md:hidden ${headerBase} px-4 py-3 flex justify-center items-center ${scrolled ? scrolledStyle : 'bg-white shadow-sm border-b border-gray-100'}`}>
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#7C3AED] text-white flex items-center justify-center font-black text-base shadow-lg shadow-blue-500/25">
            L
          </div>
          <span className="text-[17px] font-black tracking-tight text-[#0D1B2E]">
            Legal<span className="text-[#2563EB]">Click</span>
          </span>
        </Link>
      </header>

      {/* Desktop */}
      <header className={`hidden md:flex ${headerBase} px-8 lg:px-16 py-4 items-center justify-between ${scrolled ? scrolledStyle : clearStyle}`}>
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#7C3AED] text-white flex items-center justify-center font-black text-lg shadow-lg shadow-blue-500/25">
            L
          </div>
          <span className="text-xl font-black tracking-tight text-[#0D1B2E]">
            Legal<span className="text-[#2563EB]">Click</span>
          </span>
        </Link>

        <nav className="flex items-center gap-8 font-semibold text-[#475569] text-[15px]">
          {[
            { label: 'Головна', id: 'home' },
            { label: 'Послуги', id: 'services' },
            { label: 'Як це працює', id: 'about' },
            { label: 'FAQ', id: 'faq' },
          ].map(({ label, id }) => (
            <a key={id} href={`/#${id === 'home' ? '' : id}`} onClick={(e) => handleNavClick(e, id)} className="hover:text-[#2563EB] transition-colors">
              {label}
            </a>
          ))}
        </nav>

        <motion.a
          href={BOT_LINK}
          className="bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center gap-2"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          <MessageCircle className="w-4 h-4" /> Чат з юристом
        </motion.a>
      </header>
    </>
  );
};

const MobileBottomBar = ({ activeTab, setActiveTab }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  const goTo = (id) => {
    const scroll = () => {
      if (id === 'home') window.scrollTo({ top: 0, behavior: 'smooth' });
      else document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      setActiveTab(id);
    };
    if (!isHome) { navigate('/'); setTimeout(scroll, 120); }
    else scroll();
  };

  const active = (id) => activeTab === id && isHome;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white/96 backdrop-blur-md border-t border-gray-100 px-2 pt-1.5 pb-1.5 flex justify-around items-center z-50 safe-bottom shadow-[0_-2px_16px_rgba(13,27,46,0.06)]">
      {[
        { id: 'home', label: 'Головна', Icon: Home },
        { id: 'services', label: 'Послуги', Icon: Grid },
        { id: 'faq', label: 'FAQ', Icon: Search },
      ].map(({ id, label, Icon }) => (
        <button
          key={id}
          onClick={() => goTo(id)}
          className={`flex flex-col items-center gap-0.5 py-1.5 px-4 rounded-xl transition-all ${
            active(id) ? 'text-[#2563EB] bg-blue-50' : 'text-[#94A3B8]'
          }`}
        >
          <Icon className="w-5 h-5" strokeWidth={active(id) ? 2.5 : 2} />
          <span className={`text-[10px] ${active(id) ? 'font-bold' : 'font-medium'}`}>{label}</span>
        </button>
      ))}

      <a
        href={BOT_LINK}
        className="flex flex-col items-center gap-0.5 py-1.5 px-4 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white active:scale-95 transition-transform"
      >
        <MessageCircle className="w-5 h-5" strokeWidth={2} />
        <span className="text-[10px] font-bold">Чат</span>
      </a>
    </nav>
  );
};

const MainFooter = () => (
  <footer className="hidden md:block bg-[#020817] text-[#475569] py-14 border-t border-white/5">
    <div className="max-w-7xl mx-auto px-8 lg:px-16 flex justify-between items-center">
      <Link to="/" className="flex items-center gap-2.5 text-white">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#7C3AED] flex items-center justify-center font-black text-lg">
          L
        </div>
        <span className="text-xl font-black tracking-tight">
          Legal<span className="text-[#2563EB]">Click</span>
        </span>
      </Link>
      <div className="flex gap-8 text-sm">
        <Link to="/military-lawyer" className="hover:text-white transition-colors">Захист військових</Link>
        <a href="/#faq" className="hover:text-white transition-colors">FAQ</a>
      </div>
      <p className="text-sm">© {new Date().getFullYear()} LegalClick. Всі права захищені.</p>
    </div>
  </footer>
);

/* ======================== HOME PAGE ======================== */

const HomePage = () => (
  <>
    {/* ===== HERO ===== */}
    <section id="home" className="relative overflow-hidden bg-[#020817]">
      {/* Ambient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-24 w-[500px] h-[500px] bg-[#2563EB]/25 rounded-full blur-[130px]" />
        <div className="absolute -bottom-32 -right-16 w-[450px] h-[450px] bg-[#7C3AED]/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/3 w-[280px] h-[280px] bg-[#1D4ED8]/15 rounded-full blur-[100px] -translate-y-1/2" />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-16 pt-12 pb-14 md:py-28 lg:py-32 flex flex-col md:flex-row items-center gap-10 md:gap-16 lg:gap-24 relative z-10">
        {/* ── Left: text ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 text-center md:text-left"
        >
          {/* Status badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark text-white/75 text-[11px] font-semibold uppercase tracking-[0.1em] mb-7">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_#4ade80]" />
            100% Онлайн · Відповідь за 12 хвилин
          </div>

          <h1 className="text-[38px] sm:text-5xl md:text-5xl lg:text-[68px] font-black text-white leading-[1.05] tracking-tight mb-5 md:mb-7">
            Юрист у твоєму
            <br />
            <span className="text-gradient-blue">смартфоні</span>
          </h1>

          <p className="text-white/55 text-base md:text-lg lg:text-xl leading-relaxed mb-8 md:mb-10 max-w-[480px] mx-auto md:mx-0">
            Рапорти, виплати та житлові суперечки. Все онлайн. Описуєш ситуацію в чаті — отримуєш результат.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
            <motion.a
              href={BOT_LINK}
              className="bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white rounded-2xl py-[18px] px-7 md:px-8 font-bold text-base md:text-lg flex items-center justify-center gap-3 shadow-[0_8px_32px_rgba(37,99,235,0.4)] active:scale-95 transition-transform"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />
              Отримати допомогу в чаті
            </motion.a>
            <button
              className="hidden sm:flex border border-white/15 text-white/80 hover:border-white/30 hover:text-white rounded-2xl py-[18px] px-8 font-semibold text-lg items-center justify-center gap-2 hover:bg-white/5 transition-all"
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Як це працює <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-4 mt-8 justify-center md:justify-start">
            <div className="flex -space-x-2">
              {['#2563EB', '#7C3AED', '#0D9488', '#D97706'].map((c, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-[#020817] flex items-center justify-center text-white text-[10px] font-bold"
                  style={{ backgroundColor: c }}
                >
                  {['М', 'О', 'В', 'Т'][i]}
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                ))}
                <span className="text-white font-bold text-sm ml-1">4.9</span>
              </div>
              <p className="text-white/45 text-[11px]">5,000+ вирішених справ</p>
            </div>
          </div>

          {/* ── Mobile chat preview (inline, not absolute) ── */}
          <div className="md:hidden mt-8 bg-white/8 backdrop-blur-md border border-white/10 rounded-2xl p-4">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2563EB] to-[#7C3AED] flex items-center justify-center text-white font-black text-sm">
                L
              </div>
              <div>
                <p className="font-bold text-sm text-white leading-none">LegalClick</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  <span className="text-[10px] text-green-400">Онлайн</span>
                </div>
              </div>
            </div>
            <div className="bg-white/10 p-3 rounded-xl rounded-tl-none text-[12px] text-white/80 leading-relaxed">
              Вітаю! Опишіть вашу ситуацію текстом 👇
            </div>
          </div>
        </motion.div>

        {/* ── Right: phone mockup (desktop only) ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="hidden md:flex flex-1 justify-center lg:justify-end relative"
        >
          <div className="absolute w-[280px] h-[280px] bg-[#2563EB]/20 rounded-full blur-[80px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          <div className="relative w-[300px] lg:w-[320px]">
            <div className="w-full bg-[#0D1B2E] rounded-[44px] p-3 shadow-[0_40px_120px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.06)] border border-white/5">
              {/* Notch */}
              <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#020817] rounded-b-3xl z-20" />
              {/* Screen */}
              <div className="w-full bg-[#F8FAFF] rounded-[32px] overflow-hidden flex flex-col pt-12 px-3 gap-3 pb-6 min-h-[580px]">
                <div className="bg-white rounded-xl p-3 shadow-sm shrink-0 border border-gray-100">
                  <div className="flex gap-2 items-center mb-2">
                    <div className="w-7 h-7 bg-gradient-to-br from-[#2563EB] to-[#7C3AED] rounded-full text-white text-[10px] flex items-center justify-center font-black">
                      L
                    </div>
                    <div>
                      <span className="text-[12px] font-bold text-[#0D1B2E] block leading-none">LegalClick</span>
                      <div className="flex items-center gap-1 mt-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                        <span className="text-[9px] text-green-500 font-medium">Онлайн</span>
                      </div>
                    </div>
                    <span className="text-[9px] text-gray-400 ml-auto">19:02</span>
                  </div>
                  <p className="text-[11px] bg-gray-100 p-2.5 rounded-xl rounded-tl-none leading-relaxed text-[#0D1B2E]">
                    Вітаю! Опишіть вашу ситуацію 👇
                  </p>
                </div>
                <ChatCarousel />
                <div className="bg-white rounded-xl p-3 shadow-sm border border-blue-100 shrink-0">
                  <p className="text-[11px] leading-relaxed text-[#0D1B2E]">✅ Матеріали отримано. Юрист аналізує...</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>

    {/* ===== ADVANTAGES ===== */}
    <section id="why-us" className="px-4 md:px-5 py-14 md:py-32 bg-[#F8FAFF] border-t border-gray-100 overflow-hidden">
      <motion.div
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="text-center mb-10 md:mb-16">
          <div className="section-eyebrow bg-blue-50 text-[#2563EB] mb-4 mx-auto">
            <Shield className="w-3.5 h-3.5" /> Чому LegalClick
          </div>
          <h2 className="text-2xl md:text-5xl font-black text-[#0D1B2E] tracking-tight">Чому обирають нас</h2>
        </div>

        <div className="flex gap-4 md:grid md:grid-cols-3 md:gap-6 overflow-x-auto no-scrollbar scroll-touch pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory">
          {[
            {
              Icon: MessageCircle,
              gradient: 'from-blue-500 to-indigo-600',
              check: 'text-blue-500',
              title: 'Без візитів та дзвінків',
              items: ['Вирішуйте питання як у чаті з другом', 'Жодних поїздок до офісу', 'Юрист завжди в Telegram'],
            },
            {
              Icon: ShieldCheck,
              gradient: 'from-emerald-500 to-teal-600',
              check: 'text-emerald-500',
              title: 'Чесна ціна без сюрпризів',
              items: ['Без «погодинної оплати юриста»', 'Фіксована вартість ДО початку роботи', 'Ніяких прихованих комісій'],
            },
            {
              Icon: Zap,
              gradient: 'from-violet-500 to-purple-600',
              check: 'text-violet-500',
              title: 'Оперативний старт роботи',
              items: ['Діємо негайно, без записів', 'Автоматичний розподіл юристу', 'Початок роботи в день звернення'],
            },
          ].map(({ Icon, gradient, check, title, items }, i) => (
            <div
              key={i}
              className="min-w-[270px] md:min-w-0 md:w-full bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 snap-center shrink-0 shadow-sm hover:shadow-xl hover:shadow-blue-900/10 md:transition-all md:duration-300 md:hover:-translate-y-2 border border-gray-100 group"
            >
              <div
                className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
              >
                <Icon className="w-6 h-6 md:w-7 md:h-7 text-white" strokeWidth={2} />
              </div>
              <h3 className="font-black text-base md:text-xl mb-3 text-[#0D1B2E]">{title}</h3>
              <ul className="space-y-2 text-[#475569] text-sm leading-relaxed">
                {items.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 className={`w-4 h-4 ${check} shrink-0 mt-0.5`} strokeWidth={2.5} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </motion.div>
    </section>

    {/* ===== SERVICES ===== */}
    <section id="services" className="px-4 md:px-5 py-12 md:py-32 bg-white overflow-hidden">
      <motion.div
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="mb-8 md:mb-14">
          <div className="section-eyebrow bg-blue-50 text-[#2563EB] mb-4">
            <Scale className="w-3.5 h-3.5" /> Напрямки
          </div>
          <h2 className="text-2xl md:text-5xl font-black text-[#0D1B2E] tracking-tight mb-2 md:mb-4">
            Напрямки послуг
          </h2>
          <p className="text-[#475569] text-sm md:text-xl">Легке розв'язання складних питань</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
          {serviceItems.map((item, i) => (
            <ServiceCard key={i} {...item} />
          ))}
        </div>
      </motion.div>
    </section>

    {/* ===== HOW IT WORKS ===== */}
    <section id="about" className="px-4 md:px-5 py-14 md:py-32 bg-[#020817] text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#2563EB]/12 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#7C3AED]/10 rounded-full blur-[160px] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <motion.div
        className="max-w-7xl mx-auto relative z-10"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="text-center mb-12 md:mb-20">
          <div className="section-eyebrow bg-white/10 border border-white/10 text-white/60 mb-4 mx-auto">
            <Zap className="w-3.5 h-3.5" /> Процес
          </div>
          <h2 className="text-2xl md:text-5xl font-black tracking-tight">Як це працює</h2>
        </div>

        {/* Mobile steps */}
        <div className="md:hidden relative pl-7 border-l border-white/10 space-y-8">
          {[
            { n: '1', title: 'Обираєте послугу', desc: 'Натисніть потрібний напрямок у боті. Не впевнені? Тисніть «Інше», і ми зорієнтуємо!', accent: false },
            { n: '2', title: 'Пишете в чат', desc: 'Опишіть ситуацію та додайте фото. Юрист вже вивчає документи і будує стратегію.', accent: false },
            { n: '3', title: 'Отримуєте рішення', desc: 'В смартфон надходить покроковий план або готові документи. Все зрозумілою мовою.', accent: true },
          ].map(({ n, title, desc, accent }) => (
            <div key={n} className="relative">
              <div
                className={`absolute -left-[38px] top-0 w-9 h-9 rounded-full flex items-center justify-center font-black text-sm border-2 ${
                  accent
                    ? 'bg-gradient-to-br from-[#2563EB] to-[#7C3AED] border-transparent text-white shadow-[0_0_20px_rgba(37,99,235,0.5)]'
                    : 'bg-[#0D1B2E] border-white/15 text-white/80'
                }`}
              >
                {n}
              </div>
              <h3 className="font-black text-lg mb-1.5">{title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Desktop steps */}
        <div className="hidden md:grid grid-cols-3 gap-8 lg:gap-12 relative">
          <div className="absolute top-7 left-[calc(33.33%+20px)] right-[calc(33.33%+20px)] h-[2px] bg-gradient-to-r from-[#2563EB]/40 to-[#7C3AED]/40 z-0" />
          {[
            { n: '1', title: 'Обираєте послугу', desc: 'Просто натисніть потрібний напрямок у боті. Тисніть «Інше», і ми миттєво зорієнтуємо!', accent: false },
            { n: '2', title: 'Пишете в чат', desc: 'Опишіть ситуацію та додайте фото документів. Юрист вже будує правову стратегію.', accent: false },
            { n: '3', title: 'Отримуєте рішення', desc: 'Ви отримаєте план дій або готові документи. Проблема вирішена 100% онлайн.', accent: true },
          ].map(({ n, title, desc, accent }) => (
            <div key={n} className="relative z-10 text-center">
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-xl mx-auto mb-8 ${
                  accent
                    ? 'bg-gradient-to-br from-[#2563EB] to-[#7C3AED] shadow-[0_0_40px_rgba(37,99,235,0.5)] text-white'
                    : 'bg-white/10 border border-white/15 text-white/80'
                }`}
              >
                {n}
              </div>
              <h3 className="font-black text-2xl mb-4">{title}</h3>
              <p className="text-white/50 text-base leading-relaxed max-w-xs mx-auto">{desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>

    {/* ===== TRUST ===== */}
    <section className="px-4 md:px-5 py-12 md:py-24 bg-white overflow-hidden">
      <motion.div
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="text-center mb-10 md:mb-16">
          <div className="section-eyebrow bg-amber-50 text-amber-600 mb-4 mx-auto">
            <Award className="w-3.5 h-3.5" /> Результати
          </div>
          <h2 className="text-2xl md:text-5xl font-black text-[#0D1B2E] tracking-tight">Довіра у числах</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-10 md:mb-16">
          {[
            { value: '5,000+', label: 'Вирішених справ' },
            { value: '4.9', label: 'Рейтинг платформи' },
            { value: '~12 хв', label: 'Час першої відповіді' },
            { value: '100%', label: 'Онлайн без черги' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center bg-[#F8FAFF] rounded-2xl p-4 md:p-8 border border-gray-100">
              <div className="text-2xl md:text-5xl font-black text-gradient-blue mb-2">{value}</div>
              <div className="text-[#475569] text-[11px] md:text-sm font-medium leading-snug">{label}</div>
            </div>
          ))}
        </div>

        <div className="max-w-2xl mx-auto bg-[#F8FAFF] p-5 md:p-8 rounded-2xl md:rounded-3xl border border-gray-100 shadow-lg">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2563EB] to-[#7C3AED] flex items-center justify-center text-white font-black shrink-0">
              L
            </div>
            <div>
              <h4 className="font-black text-[#0D1B2E] text-sm md:text-base leading-none">LegalClick Team</h4>
              <div className="flex items-center gap-1 mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                <p className="text-[10px] md:text-xs text-green-500 font-medium">Онлайн</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm text-[13px] md:text-sm text-[#0D1B2E] leading-relaxed border border-gray-100">
              «Вивчив ваш рапорт та висновок ВЛК. Командир зобов'язаний розглянути рапорт протягом 10 днів — ст.&nbsp;26 Закону «Про військовий обов'язок». Ось ваш план дій:»
            </div>
            <div className="bg-[#2563EB] p-4 rounded-2xl rounded-tl-none shadow-sm text-[13px] md:text-sm text-white leading-relaxed space-y-1">
              <p>1️⃣ Подаємо скаргу командиру бригади.</p>
              <p>2️⃣ Дублюємо рапорт через «Армія».</p>
              <p>3️⃣ Без відповіді — позов до суду 💼</p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>

    {/* ===== PRICING ===== */}
    <section className="px-4 md:px-5 py-14 md:py-32 bg-[#020817] text-white relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] md:w-[700px] h-[500px] md:h-[700px] bg-[#7C3AED]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#F59E0B]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-10 md:mb-20">
          <div className="section-eyebrow bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-4 mx-auto">
            <span>💳</span> Тарифи
          </div>
          <h2 className="text-2xl md:text-5xl lg:text-6xl font-black tracking-tight">
            Прозорий старт:
            <br />
            <span className="text-gradient-gold">жодних прихованих платежів</span>
          </h2>
        </div>

        <div className="max-w-lg mx-auto relative">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#F59E0B]/15 to-[#2563EB]/15 blur-2xl scale-105 pointer-events-none" />
          <div className="relative bg-[#0D1B2E] border border-white/10 rounded-2xl md:rounded-3xl p-7 md:p-12 shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
            {/* Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <div className="bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] text-[#020817] text-xs font-black uppercase tracking-widest px-5 py-1.5 rounded-full shadow-lg shadow-amber-500/30">
                Старт
              </div>
            </div>

            <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8 mt-2">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-[#F59E0B]/15 border border-[#F59E0B]/20 flex items-center justify-center shrink-0">
                <span className="text-2xl md:text-3xl" role="img" aria-label="Card">💳</span>
              </div>
              <h3 className="font-black text-lg md:text-2xl text-white">Первинна консультація та аналіз</h3>
            </div>

            <div className="mb-7 md:mb-10">
              <span className="text-5xl md:text-7xl font-black text-gradient-gold">500</span>
              <span className="text-2xl md:text-3xl text-white/40 font-bold ml-2">грн</span>
            </div>

            <ul className="space-y-4 md:space-y-5 mb-7 md:mb-10">
              {[
                { label: 'Аналіз документів', desc: 'Вивчаємо рапорти, договори чи рішення.' },
                { label: 'Ідеальний матч', desc: 'Направляємо справу профільному юристу.' },
                { label: 'Висновок у чаті', desc: 'Чітка відповідь щодо перспектив та кроків.' },
              ].map(({ label, desc }) => (
                <li key={label} className="flex items-start gap-3 md:gap-4">
                  <div className="w-6 h-6 rounded-full bg-[#2563EB]/20 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#3B82F6]" strokeWidth={2.5} />
                  </div>
                  <span className="text-white/70 text-[14px] md:text-base">
                    <strong className="text-white font-bold">{label}:</strong> {desc}
                  </span>
                </li>
              ))}
            </ul>

            <p className="text-[11px] md:text-xs text-white/35 mb-7 md:mb-10 leading-relaxed">
              Якщо знадобиться складання позовів чи супровід — фіксована ціна ДО початку роботи. Рішення завжди за вами.
            </p>

            <motion.a
              href={BOT_LINK}
              className="w-full bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white font-black py-4 md:py-5 px-6 rounded-xl md:rounded-2xl shadow-[0_8px_32px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2 md:gap-3 text-base md:text-xl active:scale-95 transition-transform"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              Почати за 500 грн <ArrowRight className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
            </motion.a>
          </div>
        </div>
      </div>
    </section>

    {/* ===== FAQ ===== */}
    <section id="faq" className="px-4 md:px-5 py-14 md:py-32 bg-[#F8FAFF]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8 md:mb-16">
          <div className="section-eyebrow bg-blue-50 text-[#2563EB] mb-4 mx-auto">
            <Search className="w-3.5 h-3.5" /> FAQ
          </div>
          <h2 className="text-2xl md:text-5xl font-black text-[#0D1B2E] tracking-tight">Залишилися запитання?</h2>
        </div>
        <div className="space-y-3 md:space-y-4">
          {faqData.map((item, i) => (
            <AccordionItem key={i} question={item.question} answer={item.answer} />
          ))}
        </div>
      </div>
    </section>

    {/* ===== FOOTER CTA ===== */}
    <section className="px-4 md:px-5 pb-10 md:pb-32 bg-[#F8FAFF] text-center">
      <div className="max-w-5xl mx-auto relative overflow-hidden bg-[#020817] rounded-2xl md:rounded-[40px] p-8 md:p-20 shadow-2xl">
        <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-[#2563EB]/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-[350px] h-[350px] bg-[#7C3AED]/12 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10">
          <div className="w-14 h-14 md:w-20 md:h-20 bg-gradient-to-br from-[#2563EB] to-[#7C3AED] rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-5 md:mb-8 shadow-[0_8px_32px_rgba(37,99,235,0.4)]">
            <MessageCircle className="w-7 h-7 md:w-10 md:h-10 text-white" strokeWidth={2} />
          </div>
          <h2 className="text-xl md:text-5xl font-black mb-3 md:mb-6 text-white tracking-tight">
            Юридична підтримка —
            <br className="hidden md:block" />
            {' '}в одному кліку
          </h2>
          <p className="text-sm md:text-xl text-white/50 mb-7 md:mb-10 max-w-2xl mx-auto leading-relaxed">
            Не відкладайте на потім. Відкрийте чат, опишіть ситуацію і отримайте план дій вже сьогодні.
          </p>
          <motion.a
            href={BOT_LINK}
            className="inline-flex bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white font-black py-4 px-8 md:py-5 md:px-12 rounded-xl md:rounded-2xl shadow-[0_8px_32px_rgba(37,99,235,0.45)] items-center justify-center gap-2 md:gap-3 text-base md:text-xl active:scale-95 transition-transform"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            Чат з юристом <ArrowRight className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
          </motion.a>
        </div>
      </div>
    </section>
  </>
);

/* ======================== APP LAYOUT ======================== */

const AppLayout = () => {
  const [activeTab, setActiveTab] = useState('home');
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (location.pathname === '/') {
      document.title = 'LegalClick — Юрист у твоєму смартфоні';
    }
    if (location.pathname !== '/') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActiveTab(e.target.id); });
      },
      { rootMargin: '-30% 0px -70% 0px' }
    );
    ['home', 'services', 'faq'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [location.pathname]);

  return (
    <div className="min-h-screen text-[#0D1B2E] font-sans overflow-x-hidden pt-[56px] md:pt-[72px] pb-[72px] md:pb-0">
      <NavigationHeader />
      <main className="w-full">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/military-lawyer" element={<MilitaryLawyer />} />
          <Route path="/housing-law" element={<HousingLaw />} />
        </Routes>
      </main>
      <MobileBottomBar activeTab={activeTab} setActiveTab={setActiveTab} />
      <MainFooter />
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}
