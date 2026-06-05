export const BOT_LINK = 'https://t.me/legal_click_bot?start=hello';
export const getBotLink = (startParam = 'hello') => `https://t.me/legal_click_bot?start=${startParam}`;

export const EASE = [0.22, 1, 0.36, 1];

export const VIEWPORT = { once: true, margin: '-80px' };

export const sectionContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.05, ease: EASE } },
};

export const fadeUp = {
  hidden: { opacity: 0, y: 48 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.0, ease: EASE } },
};

export const fadeUpSoft = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};

export const cardRise = {
  hidden: { opacity: 0, y: 60, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 1.05, ease: EASE } },
};
