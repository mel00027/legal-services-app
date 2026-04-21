import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Compass, MessageCircle } from 'lucide-react';

const BOT_LINK = 'https://t.me/legal_click_bot?start=hello';

export const NotFound = () => {
  useEffect(() => {
    document.title = '404 — Сторінку не знайдено · LegalClick';
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#020817] min-h-[calc(100vh-128px)] md:min-h-[calc(100vh-144px)] flex items-center">
      {/* Ambient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-24 w-[500px] h-[500px] bg-[#2563EB]/25 rounded-full blur-[130px]" />
        <motion.div
          aria-hidden="true"
          className="absolute -bottom-36 -right-20 w-[540px] h-[540px] rounded-full blur-[130px] pointer-events-none"
          animate={{
            backgroundColor: [
              'rgba(124,58,237,0.22)',
              'rgba(59,130,246,0.24)',
              'rgba(109,40,217,0.22)',
              'rgba(124,58,237,0.22)',
            ],
            scale: [1, 1.06, 1.03, 1],
            opacity: [0.85, 1, 0.9, 0.85],
          }}
          transition={{ duration: 20, ease: 'easeInOut', repeat: Infinity }}
        />
        <div className="absolute top-1/2 left-1/3 w-[280px] h-[280px] bg-[#1D4ED8]/15 rounded-full blur-[100px] -translate-y-1/2" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-5 md:px-8 py-16 md:py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark text-white/75 text-[11px] font-semibold uppercase tracking-[0.1em] mb-8">
            <Compass className="w-3.5 h-3.5" />
            Помилка 404
          </div>

          <h1 className="text-[88px] sm:text-[120px] md:text-[160px] font-black leading-none tracking-tight mb-4">
            <span className="text-gradient-blue">404</span>
          </h1>

          <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight mb-4">
            Сторінку не знайдено
          </h2>

          <p className="text-white/55 text-base md:text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            Можливо, сторінку видалено, перейменовано або адреса введена з помилкою. Повертайтеся на головну — ми допоможемо знайти потрібну послугу.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}>
              <Link
                to="/"
                className="bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white rounded-2xl py-[18px] px-7 md:px-8 font-bold text-base md:text-lg flex items-center justify-center gap-3 shadow-[0_8px_32px_rgba(37,99,235,0.4)] w-full"
              >
                <Home className="w-5 h-5" />
                На головну
              </Link>
            </motion.div>

            <button
              type="button"
              onClick={() => window.history.back()}
              className="border border-white/15 text-white/80 hover:border-white/30 hover:text-white rounded-2xl py-[18px] px-8 font-semibold text-base md:text-lg flex items-center justify-center gap-2 hover:bg-white/5 transition-all"
            >
              <ArrowLeft className="w-5 h-5" /> Повернутись назад
            </button>
          </div>

          <div className="mt-10 md:mt-14">
            <p className="text-white/40 text-sm mb-4">Або напишіть нам у чат — юрист допоможе зорієнтуватися:</p>
            <motion.a
              href={BOT_LINK}
              className="inline-flex items-center gap-2 text-[#60A5FA] hover:text-white font-semibold text-sm md:text-base transition-colors"
              whileHover={{ x: 3 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <MessageCircle className="w-4 h-4" />
              Чат з юристом
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default NotFound;
