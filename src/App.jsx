import React, { useState, useEffect, memo, lazy } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { 
  MessageCircle, ShieldCheck, Home, 
  Grid, Search, User, ChevronRight,
  Zap, CheckCircle2, Scale, Landmark, ChevronUp, Accessibility
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ======================== DATA ======================== */

const clientMessages = [
  "Вітаю. Я зараз на лікуванні після поранення, ВЛК написали \"обмежено придатний\", але командир вимагає повертатися на нуль вже завтра. Каже, що людей немає. Допоможіть скласти рапорт на відпустку для оздоровлення або переведення. Фото висновку ВЛК додаю.",
  "Добрий день! Чоловік зник безвісти під час виконання завдання місяць тому. В частині нічого не кажуть, довідку Ф-15 не дають. Грошове забезпечення теж перестали нараховувати. Підкажіть, які заяви треба написати, щоб отримати виплати родині?",
  "Я орендую квартиру, вчора нас затопили сусіди зверху. Господар квартири каже, що це мої проблеми, а сусіди двері не відкривають. Що мені зараз зафіксувати, щоб потім не платити за ремонт з власної кишені?",
  "ВЛК написали \"придатний\", хоча спина не гнеться і є виписки з лікарні. Хочу оскаржити — куди писати заяву?",
  "Не прийшли бойові за минулий місяць, хоча був на передку. В частині кажуть, що не подали вчасно списки. Допоможете з рапортом на перерахунок?"
];

const faqData = [
  {
    question: "Хто саме буде займатися моєю справою?",
    answer: "LegalClick — це платформа, яка об'єднує десятки перевірених юристів з різних міст. Ми не передаємо справи «універсалам». Система аналізує ваш запит і підключає вільного фахівця, який є експертом саме у вашій галузі."
  },
  {
    question: "Як я можу бути впевненим у надійності?",
    answer: "Платформа виступає гарантом вашої безпеки. Ми співпрацюємо лише з сертифікованими адвокатами, які внесені до Єдиного реєстру адвокатів України. Усі процеси контролюються сервісом, що виключає ризики для клієнта."
  },
  {
    question: "Чи безпечно надсилати документи у Telegram?",
    answer: "Абсолютно. Telegram використовує надійні протоколи шифрування, а кожен адвокат нашої мережі пов'язаний суворим договором про нерозголошення конфіденційної інформації (NDA) та діє в рамках адвокатської таємниці."
  },
  {
    question: "Що робити, якщо для суду потрібен паперовий документ?",
    answer: "Ми працюємо 100% онлайн, але видаємо реальні документи. Адвокат підписує позови чи клопотання своїм КЕП (кваліфікованим електронним підписом), який має повну юридичну силу. Якщо ж вам необхідний фізичний документ із \"живим\" підписом, ваш адвокат відправить його Новою Поштою."
  },
  {
    question: "Чи можете ви представляти мене в суді?",
    answer: "Так. Оскільки в нашій мережі є фахівці з різних областей, ми або залучимо адвоката у вашому місті, або забезпечимо участь юриста онлайн через державну систему «Електронний суд». Вам не доведеться йти до зали засідань."
  }
];

const serviceItems = [
  { name: 'Військові пенсії', icon: Landmark },
  { name: 'Допомога військовослужбовцям', icon: ShieldCheck },
  { name: 'Цивільні пенсії', icon: Accessibility },
  { name: 'Житлове право', icon: Home },
  { name: 'Адміністративні правопорушення', icon: Scale },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqData.map(item => ({
    "@type": "Question",
    "name": item.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": item.answer
    }
  }))
};

const BOT_LINK = "https://t.me/legal_click_bot";

/* ======================== COMPONENTS ======================== */

const ChatCarousel = memo(() => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % clientMessages.length);
    }, 20000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative overflow-hidden flex-1 min-h-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -200, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="bg-electric text-white rounded-xl p-3 shadow-sm ml-4"
        >
          <p className="text-[12px] font-sans leading-relaxed">{clientMessages[currentIndex]}</p>
          <span className="text-[9px] opacity-70 block text-right mt-1">19:03</span>
        </motion.div>
      </AnimatePresence>
      <div className="flex justify-center gap-1.5 mt-3">
        {clientMessages.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === currentIndex ? 'bg-electric w-4' : 'bg-gray-300 w-1.5'
            }`}
          />
        ))}
      </div>
    </div>
  );
});

const AccordionItem = memo(({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
      <button 
        className="w-full flex items-center justify-between p-4 md:p-6 text-left outline-none focus:ring-2 focus:ring-electric/50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-bold text-[15px] md:text-lg text-graphite pr-4">{question}</span>
        <div className={`w-7 h-7 md:w-8 md:h-8 shrink-0 rounded-full bg-blue-50 flex items-center justify-center transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronUp className="w-4 h-4 md:w-5 md:h-5 text-electric" />
        </div>
      </button>
      <div 
        className={`px-4 md:px-6 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100 pb-4 md:pb-6' : 'max-h-0 opacity-0 pb-0'}`}
      >
        <p className="text-gray-500 leading-relaxed text-sm border-t border-gray-100 pt-3 md:pt-4">
          {answer}
        </p>
      </div>
    </div>
  );
});

const ServiceCard = memo(({ name, icon: Icon }) => (
  <div className="flex items-center justify-between p-4 md:p-6 rounded-2xl md:rounded-3xl bg-white border border-gray-100 shadow-md md:shadow-xl shadow-blue-900/5 md:transition-all md:duration-500 md:ease-out md:hover:-translate-y-3 md:hover:shadow-[0_20px_40px_-15px_rgba(0,82,255,0.2)] cursor-pointer group active:scale-[0.98] transition-transform">
    <div className="flex items-center gap-4 md:gap-5">
      <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-blue-50/50 rounded-xl md:rounded-2xl group-hover:bg-blue-50 transition-colors">
        <Icon className="w-5 h-5 md:w-6 md:h-6 text-electric" strokeWidth={2.5} />
      </div>
      <span className="font-bold text-graphite text-[15px] md:text-lg">{name}</span>
    </div>
    <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-300 group-hover:text-electric transition-colors shrink-0" strokeWidth={2.5} />
  </div>
));

/* ======================== MAIN APP ======================== */

const ResponsiveApp = () => {
  return (
    <div className="min-h-screen bg-app-bg md:bg-white text-graphite font-sans overflow-x-hidden pt-14 md:pt-[88px] pb-24 md:pb-0">
      
      {/* ========== HEADER ========== */}
      
      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 w-full px-4 py-3 flex justify-between items-center bg-white/95 backdrop-blur-sm z-50 shadow-sm border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-electric text-white flex items-center justify-center font-bold text-lg">L</div>
          <span className="text-lg font-bold tracking-tight">Legal<span className="text-electric">Click</span></span>
        </div>
        <a href={BOT_LINK} className="bg-electric text-white px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-1.5 active:scale-95 transition-transform">
          <MessageCircle className="w-4 h-4" /> Чат
        </a>
      </header>

      {/* Desktop Header */}
      <header className="hidden md:flex w-full px-8 lg:px-16 py-6 items-center justify-between bg-white/95 backdrop-blur-md border-b border-gray-50 fixed top-0 left-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-electric text-white flex items-center justify-center font-bold text-2xl">L</div>
          <span className="text-2xl font-bold tracking-tight">Legal<span className="text-electric">Click</span></span>
        </div>
        <nav className="flex items-center gap-8 font-semibold text-graphite">
          <a href="#services" onClick={(e) => { e.preventDefault(); document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-electric transition-colors">Послуги</a>
          <a href="#about" onClick={(e) => { e.preventDefault(); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-electric transition-colors">Як це працює</a>
          <a href="#faq" onClick={(e) => { e.preventDefault(); document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-electric transition-colors">FAQ</a>
        </nav>
        <motion.a 
          href={BOT_LINK}
          className="bg-electric text-white px-6 py-2.5 rounded-xl font-bold hover:bg-electric-hover shadow-lg shadow-electric/20 flex items-center gap-2"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <MessageCircle className="w-5 h-5" /> Чат з юристом
        </motion.a>
      </header>

      {/* ========== MAIN CONTENT ========== */}
      <main className="w-full">
        
        {/* ===== HERO ===== */}
        <section className="px-5 py-6 md:px-8 lg:px-16 md:py-20 lg:py-24 bg-gradient-to-b md:bg-gradient-to-r from-white md:from-blue-50/80 to-blue-50/50 md:to-white overflow-hidden relative">
          <div className="hidden md:block absolute right-0 top-0 w-1/2 h-full bg-electric/5 rounded-l-[100px] -z-10"></div>
          
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12 lg:gap-24 relative z-10">
            {/* Text Content */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-1 text-center md:text-left"
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-electric/10 text-electric font-semibold text-xs uppercase tracking-wider mb-4">
                <div className="w-2 h-2 rounded-full bg-electric animate-pulse"></div>
                100% Онлайн
              </div>
              
              <h1 className="text-[28px] md:text-4xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] mb-4 md:mb-6 text-graphite">
                Юрист у твоєму <br className="hidden sm:block"/><span className="text-electric">смартфоні</span>
              </h1>
              
              <p className="text-gray-500 text-[15px] md:text-xl leading-relaxed mb-6 md:mb-8 max-w-xl mx-auto md:mx-0">
                Рапорти, виплати та житлові суперечки. Все онлайн. Описуєш ситуацію в чаті — отримуєш результат.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center md:justify-start">
                <motion.a 
                  href={BOT_LINK}
                  className="bg-electric text-white rounded-2xl py-3.5 md:py-4 px-6 md:px-8 font-bold text-base md:text-lg flex items-center justify-center gap-3 hover:bg-electric-hover shadow-lg shadow-electric/30 active:scale-95 transition-transform"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <MessageCircle className="w-5 h-5 md:w-6 md:h-6" /> Отримати допомогу в чаті
                </motion.a>
                <button 
                  className="hidden sm:flex bg-transparent border-2 border-electric text-electric rounded-2xl py-4 px-8 font-bold text-lg items-center justify-center hover:bg-blue-50 transition-colors"
                  onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Як це працює
                </button>
              </div>
            </motion.div>

            {/* Phone Mockup — Desktop Only */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1.1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="hidden md:flex flex-1 justify-center lg:justify-end relative origin-right xl:pr-10"
            >
              <div className="w-[320px] h-[640px] bg-graphite rounded-[40px] p-3 shadow-2xl relative border-4 border-slate-800">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-graphite rounded-b-3xl z-20"></div>
                <div className="w-full h-full bg-app-bg text-left rounded-[28px] overflow-hidden flex flex-col pt-10 px-3 gap-3 pb-6">
                  <div className="bg-white rounded-xl p-3 shadow-sm shrink-0">
                    <div className="flex gap-2 items-center mb-1">
                      <div className="w-6 h-6 bg-electric rounded-full text-white text-[10px] flex items-center justify-center font-bold">L</div>
                      <span className="text-[12px] font-bold font-sans text-graphite">LegalClick</span>
                      <span className="text-[9px] text-gray-400 ml-auto">19:02</span>
                    </div>
                    <p className="text-[12px] bg-gray-100 p-2 rounded-xl rounded-tl-none font-sans leading-relaxed text-graphite">Вітаю! Опишіть вашу ситуацію текстом 👇</p>
                  </div>
                  <ChatCarousel />
                  <div className="bg-white rounded-xl p-2.5 shadow-sm border border-blue-100 shrink-0">
                    <p className="text-[11px] font-sans leading-relaxed text-graphite">✅ Матеріали отримано. Юрист аналізує...</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Mobile: Chat preview card instead of phone mockup */}
          <div className="md:hidden mt-6">
            <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-electric text-white flex items-center justify-center font-bold text-sm">L</div>
                <div>
                  <h4 className="font-bold text-sm text-graphite">LegalClick</h4>
                  <p className="text-[11px] text-green-500 font-medium">Онлайн</p>
                </div>
              </div>
              <div className="bg-gray-100 p-3 rounded-xl rounded-tl-none text-sm text-graphite leading-relaxed mb-3">
                Вітаю! Опишіть вашу ситуацію текстом 👇
              </div>
              <div className="overflow-hidden relative min-h-[80px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`mobile-${Math.floor(Date.now() / 20000) % clientMessages.length}`}
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -100, opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="bg-electric text-white p-3 rounded-xl rounded-tr-none ml-6 text-sm leading-relaxed"
                  >
                    {clientMessages[Math.floor(Date.now() / 20000) % clientMessages.length]}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>

        {/* ===== ADVANTAGES ===== */}
        <section id="why-us" className="px-4 md:px-5 py-10 md:py-32 bg-white md:bg-slate-50 border-t border-slate-100 overflow-hidden">
          <motion.div 
            className="max-w-7xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2 className="text-2xl md:text-5xl font-bold mb-8 md:mb-16 text-center">Чому ми?</h2>
            
            <div className="flex gap-4 md:grid md:grid-cols-3 md:gap-6 overflow-x-auto no-scrollbar scroll-touch pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory">
              <div className="min-w-[260px] md:min-w-0 md:w-full bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-10 snap-center shrink-0 shadow-lg md:shadow-xl shadow-blue-900/5 md:transition-all md:duration-500 md:hover:-translate-y-3 md:hover:shadow-[0_20px_40px_-15px_rgba(0,82,255,0.2)] border border-slate-100">
                <MessageCircle className="w-10 h-10 md:w-12 md:h-12 text-electric mb-5 md:mb-8" strokeWidth={2.5} />
                <h3 className="font-bold text-base md:text-xl mb-3 md:mb-4 text-graphite">💬 Без візитів та дзвінків</h3>
                <ul className="space-y-2 md:space-y-3 text-gray-500 text-sm leading-relaxed list-disc pl-5">
                  <li>Вирішуйте питання як у чаті з другом</li>
                  <li>Жодних поїздок до офісу</li>
                  <li>Юрист завжди в Telegram</li>
                </ul>
              </div>

              <div className="min-w-[260px] md:min-w-0 md:w-full bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-10 snap-center shrink-0 shadow-lg md:shadow-xl shadow-blue-900/5 md:transition-all md:duration-500 md:hover:-translate-y-3 md:hover:shadow-[0_20px_40px_-15px_rgba(0,82,255,0.2)] border border-slate-100">
                <ShieldCheck className="w-10 h-10 md:w-12 md:h-12 text-electric mb-5 md:mb-8" strokeWidth={2.5} />
                <h3 className="font-bold text-base md:text-xl mb-3 md:mb-4 text-graphite">🛡 Чесна ціна без сюрпризів</h3>
                <ul className="space-y-2 md:space-y-3 text-gray-500 text-sm leading-relaxed list-disc pl-5">
                  <li>Без «погодинної оплати юриста»</li>
                  <li>Фіксована вартість ДО початку роботи</li>
                  <li>Ніяких прихованих комісій</li>
                </ul>
              </div>

              <div className="min-w-[260px] md:min-w-0 md:w-full bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-10 snap-center shrink-0 shadow-lg md:shadow-xl shadow-blue-900/5 md:transition-all md:duration-500 md:hover:-translate-y-3 md:hover:shadow-[0_20px_40px_-15px_rgba(0,82,255,0.2)] border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mt-10 -mr-10 blur-2xl"></div>
                <Zap className="w-10 h-10 md:w-12 md:h-12 text-electric mb-5 md:mb-8 relative z-10" strokeWidth={2.5} />
                <h3 className="font-bold text-base md:text-xl mb-3 md:mb-4 text-electric relative z-10">⚡️ Включаємось за 15 хвилин</h3>
                <ul className="space-y-2 md:space-y-3 text-gray-500 text-sm leading-relaxed list-disc pl-5 relative z-10">
                  <li>Діємо негайно, без записів</li>
                  <li>Автоматичний розподіл юристу</li>
                  <li>Швидка правова допомога</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ===== SERVICES ===== */}
        <section id="services" className="px-4 md:px-5 py-10 md:py-32 bg-white overflow-hidden">
          <motion.div 
            className="max-w-7xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="text-center md:text-left mb-6 md:mb-16">
              <h2 className="text-2xl md:text-5xl font-bold mb-2 md:mb-4">Напрямки послуг</h2>
              <p className="text-gray-500 text-sm md:text-xl">Легке розв'язання складних питань</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
              {serviceItems.map((item, index) => (
                <ServiceCard key={index} name={item.name} icon={item.icon} />
              ))}
            </div>
          </motion.div>
        </section>

        {/* ===== HOW IT WORKS ===== */}
        <section id="about" className="px-4 md:px-5 py-12 md:py-32 bg-graphite text-white relative overflow-hidden">
          {/* Background glows — desktop only for performance */}
          <div className="hidden md:block absolute top-0 right-0 w-[500px] h-[500px] bg-electric/15 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="hidden md:block absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none"></div>

          <motion.div 
            className="max-w-7xl mx-auto relative z-10"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2 className="text-2xl md:text-5xl font-bold mb-10 md:mb-24 text-center">Як це працює</h2>
            
            {/* Mobile Vertical Timeline */}
            <div className="md:hidden relative border-l-2 border-gray-700 ml-5 space-y-8 pb-2">
              <div className="relative pl-8">
                <div className="absolute -left-[18px] top-0 w-9 h-9 bg-white/10 text-white text-sm font-bold rounded-full flex items-center justify-center border-3 border-graphite">1</div>
                <h3 className="font-bold text-lg mb-1.5">Обираєте послугу</h3>
                <p className="text-gray-300 text-sm leading-relaxed">Натисніть потрібний напрямок у боті. Не впевнені? Тисніть «Інше», і ми зорієнтуємо!</p>
              </div>
              <div className="relative pl-8">
                <div className="absolute -left-[18px] top-0 w-9 h-9 bg-white/10 text-white text-sm font-bold rounded-full flex items-center justify-center border-3 border-graphite">2</div>
                <h3 className="font-bold text-lg mb-1.5">Пишете в чат</h3>
                <p className="text-gray-300 text-sm leading-relaxed">Опишіть ситуацію та додайте фото. Юрист вже вивчає документи і будує стратегію.</p>
              </div>
              <div className="relative pl-8">
                <div className="absolute -left-[18px] top-0 w-9 h-9 bg-electric/30 text-electric text-sm font-bold rounded-full flex items-center justify-center border-3 border-graphite shadow-[0_0_15px_rgba(0,102,255,0.4)]">3</div>
                <h3 className="font-bold text-lg mb-1.5">Отримуєте рішення</h3>
                <p className="text-gray-300 text-sm leading-relaxed">В смартфон надходить покроковий план або готові документи. Все зрозумілою мовою.</p>
              </div>
            </div>

            {/* Desktop Horizontal Timeline */}
            <div className="hidden md:grid grid-cols-3 gap-12 relative mt-10">
              <div className="absolute top-10 left-24 right-24 h-[2px] bg-gray-700 z-0"></div>
              <div className="relative z-10 px-6">
                <div className="w-20 h-20 bg-white/10 text-white text-2xl font-bold rounded-full flex items-center justify-center mx-auto mb-8">1</div>
                <h3 className="font-bold text-2xl mb-4 text-center">Обираєте послугу</h3>
                <p className="text-gray-300 text-lg leading-relaxed text-center">Просто натисніть потрібний напрямок у боті. Тисніть «Інше», і ми миттєво зорієнтуємо!</p>
              </div>
              <div className="relative z-10 px-6">
                <div className="w-20 h-20 bg-white/10 text-white text-2xl font-bold rounded-full flex items-center justify-center mx-auto mb-8">2</div>
                <h3 className="font-bold text-2xl mb-4 text-center">Пишете в чат</h3>
                <p className="text-gray-300 text-lg leading-relaxed text-center">Опишіть ситуацію та додайте фото документів. Юрист вже будує правову стратегію.</p>
              </div>
              <div className="relative z-10 px-6">
                <div className="w-20 h-20 bg-electric/20 text-white text-2xl font-bold rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(0,102,255,0.4)]">3</div>
                <h3 className="font-bold text-2xl mb-4 text-center">Отримуєте рішення</h3>
                <p className="text-gray-300 text-lg leading-relaxed text-center">Ви отримаєте план дій або готові документи. Проблема вирішена 100% онлайн.</p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ===== TRUST ===== */}
        <section className="px-4 md:px-5 py-10 md:py-24 bg-white">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6 md:gap-16">
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6">Довіра у числах</h2>
              <div className="flex items-center justify-center md:justify-start gap-3 text-electric font-bold text-3xl md:text-4xl mb-2">
                <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10" /> 5,000+
              </div>
              <div className="text-base md:text-lg text-gray-500 font-medium mb-5 md:mb-6">Успішно вирішених справ за цей рік</div>
              
              <div className="grid grid-cols-2 gap-3 md:flex md:flex-row md:gap-4">
                <div className="bg-green-50 border border-green-100 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl">
                  <div className="text-xs md:text-sm text-gray-500 mb-0.5">Час реакції</div>
                  <div className="text-lg md:text-xl font-bold text-green-700">~12 хв</div>
                </div>
                <div className="bg-blue-50 border border-blue-100 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl">
                  <div className="text-xs md:text-sm text-gray-500 mb-0.5">Рейтинг</div>
                  <div className="text-lg md:text-xl font-bold text-blue-700">4.9 / 5.0</div>
                </div>
              </div>
            </div>
            
            {/* Chat Bubble */}
            <div className="flex-1 w-full max-w-sm shrink-0">
              <div className="bg-app-bg p-4 md:p-6 rounded-2xl md:rounded-[32px] border border-gray-100 shadow-lg md:shadow-xl relative">
                <div className="absolute top-0 right-0 p-3 md:p-4 opacity-10">
                  <MessageCircle className="w-16 h-16 md:w-24 md:h-24 text-graphite" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-electric text-white flex items-center justify-center font-bold text-sm">L</div>
                    <div>
                      <h4 className="font-bold text-sm md:text-base text-graphite">LegalClick Team</h4>
                      <p className="text-[10px] md:text-xs text-gray-400">Онлайн</p>
                    </div>
                  </div>
                  <div className="bg-white p-3 md:p-4 rounded-xl md:rounded-2xl rounded-tl-none shadow-sm text-[13px] md:text-sm text-graphite leading-relaxed border border-gray-100 mb-2 md:mb-3">
                    «Вивчив ваш рапорт та висновок ВЛК. Командир зобов'язаний розглянути рапорт протягом 10 днів — ст. 26 Закону «Про військовий обов'язок». Ось ваш план дій:»
                  </div>
                  <div className="bg-white p-3 md:p-4 rounded-xl md:rounded-2xl rounded-tl-none shadow-sm text-[13px] md:text-sm text-graphite leading-relaxed border border-gray-100">
                    «1️⃣ Подаємо скаргу командиру бригади.<br/>2️⃣ Дублюємо рапорт через "Армія".<br/>3️⃣ Без відповіді — позов до суду 💼»
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== PRICING ===== */}
        <section className="px-4 md:px-5 py-12 md:py-32 bg-graphite text-white relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-electric/10 rounded-full blur-[100px] md:blur-[120px] pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <h2 className="text-2xl md:text-5xl lg:text-6xl font-bold mb-8 md:mb-24 text-center text-white">Прозорий старт:<br/>жодних прихованих платежів</h2>
            
            <div className="max-w-lg mx-auto bg-[#1E1E1E] border border-gray-800 rounded-2xl md:rounded-3xl p-6 md:p-12 shadow-[0_20px_60px_rgba(0,102,255,0.15)]">
              <div className="flex items-center gap-3 md:gap-4 mb-5 md:mb-8">
                <div className="w-11 h-11 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-electric/20 flex items-center justify-center">
                  <span className="text-2xl md:text-3xl" role="img" aria-label="Card">💳</span>
                </div>
                <h3 className="font-bold text-lg md:text-2xl text-white">Первинна консультація та аналіз</h3>
              </div>
              
              <div className="text-5xl md:text-6xl font-black text-electric mb-6 md:mb-10 tracking-tight">500 <span className="text-2xl md:text-3xl text-gray-400 font-bold ml-1">грн</span></div>
              
              <ul className="space-y-4 md:space-y-6 mb-6 md:mb-10">
                <li className="flex items-start gap-3 md:gap-4">
                  <CheckCircle2 className="w-6 h-6 md:w-7 md:h-7 text-electric shrink-0 mt-0.5" strokeWidth={2.5} />
                  <span className="text-gray-300 text-[15px] md:text-lg"><strong>Аналіз документів:</strong> Вивчаємо рапорти, договори чи рішення.</span>
                </li>
                <li className="flex items-start gap-3 md:gap-4">
                  <CheckCircle2 className="w-6 h-6 md:w-7 md:h-7 text-electric shrink-0 mt-0.5" strokeWidth={2.5} />
                  <span className="text-gray-300 text-[15px] md:text-lg"><strong>Ідеальний метч:</strong> Направляємо справу профільному юристу.</span>
                </li>
                <li className="flex items-start gap-3 md:gap-4">
                  <CheckCircle2 className="w-6 h-6 md:w-7 md:h-7 text-electric shrink-0 mt-0.5" strokeWidth={2.5} />
                  <span className="text-gray-300 text-[15px] md:text-lg"><strong>Висновок у чаті:</strong> Чітка відповідь щодо перспектив та кроків.</span>
                </li>
              </ul>
              
              <p className="text-xs md:text-sm text-gray-500 mb-6 md:mb-10 leading-relaxed font-medium">
                Якщо знадобиться складання позовів чи супровід — фіксована ціна ДО початку роботи. Рішення завжди за вами.
              </p>
              
              <motion.a 
                href={BOT_LINK}
                className="w-full bg-electric text-white font-bold py-4 md:py-5 px-6 rounded-xl md:rounded-2xl hover:bg-electric-hover shadow-xl shadow-electric/30 flex items-center justify-center gap-2 md:gap-3 text-base md:text-xl active:scale-95 transition-transform"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                Почати за 500 грн <ChevronRight className="w-5 h-5 md:w-6 md:h-6" strokeWidth={3} />
              </motion.a>
            </div>
          </div>
        </section>

        {/* ===== FAQ ===== */}
        <section id="faq" className="px-4 md:px-5 py-12 md:py-32 bg-white relative">
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
          
          <div className="max-w-3xl mx-auto relative z-10">
            <h2 className="text-2xl md:text-5xl font-bold mb-8 md:mb-20 text-center text-graphite">Залишилися запитання?</h2>
            
            <div className="space-y-3 md:space-y-6">
              {faqData.map((item, index) => (
                <AccordionItem key={index} question={item.question} answer={item.answer} />
              ))}
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

      </main>

      {/* ========== MOBILE BOTTOM TAB BAR ========== */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 px-6 pt-2.5 pb-1 flex justify-around items-center z-50 safe-bottom">
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex flex-col items-center gap-1 text-electric py-1.5 min-w-[64px] cursor-pointer">
          <Home className="w-6 h-6" strokeWidth={2} />
          <span className="text-[11px] font-bold">Головна</span>
        </button>
        <button onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })} className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600 py-1.5 min-w-[64px] cursor-pointer transition-colors">
          <Grid className="w-6 h-6" strokeWidth={2} />
          <span className="text-[11px] font-medium">Послуги</span>
        </button>
        <button onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })} className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600 py-1.5 min-w-[64px] cursor-pointer transition-colors">
          <Search className="w-6 h-6" strokeWidth={2} />
          <span className="text-[11px] font-medium">FAQ</span>
        </button>
      </nav>

      {/* ========== DESKTOP FOOTER ========== */}
      <footer className="hidden md:block bg-graphite text-gray-400 py-16 border-t border-graphite-light">
        <div className="max-w-7xl mx-auto px-8 lg:px-16 flex justify-between items-center">
          <div className="flex items-center gap-2 text-white">
            <div className="w-8 h-8 rounded-lg bg-electric flex items-center justify-center font-bold text-lg">L</div>
            <span className="text-xl font-bold tracking-tight">Legal<span className="text-electric">Click</span></span>
          </div>
          <p>© {new Date().getFullYear()} LegalClick. Всі права захищені.</p>
        </div>
      </footer>

    </div>
  );
};

function App() {
  return (
    <Router>
      <ResponsiveApp />
    </Router>
  );
}

export default App;
