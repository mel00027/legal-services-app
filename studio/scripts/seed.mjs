// Seed all CMS documents from current hardcoded content.
// Run: cd studio && node scripts/seed.mjs

import { createClient } from '@sanity/client';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envFile = readFileSync(join(__dirname, '..', '.env'), 'utf-8');
const env = Object.fromEntries(
  envFile
    .split(/\r?\n/)
    .filter((l) => l && !l.startsWith('#'))
    .map((l) => {
      const [k, ...rest] = l.split('=');
      return [k.trim(), rest.join('=').trim()];
    }),
);

const client = createClient({
  projectId: env.SANITY_STUDIO_PROJECT_ID,
  dataset: env.SANITY_STUDIO_DATASET || 'production',
  apiVersion: '2024-10-01',
  token: env.SANITY_STUDIO_TOKEN,
  useCdn: false,
});

const docs = [];

docs.push({
  _id: 'siteConfig',
  _type: 'siteConfig',
  botLink: 'https://t.me/legal_click_bot?start=hello',
  pricingAmount: 1000,
  pricingTitle: 'Первинна консультація та попередній аналіз документів',
  pricingHeadingStart: 'Прозорий старт:',
  pricingHeadingGradient: 'жодних прихованих платежів',
  pricingDisclaimer:
    'Якщо знадобиться складання позовів чи супровід — фіксована ціна ДО початку роботи. Рішення завжди за вами.',
  pricingCtaLabel: 'Почати',
  pricingFeatures: [
    { _key: 'f1', label: 'Аналіз документів', desc: 'Вивчаємо рапорти, договори чи рішення.' },
    { _key: 'f2', label: 'Ідеальний матч', desc: 'Направляємо справу профільному юристу.' },
    { _key: 'f3', label: 'Висновок у чаті', desc: 'Чітка відповідь щодо перспектив та кроків.' },
  ],
  seoDefaults: {
    title: 'LegalClick — Юрист у твоєму смартфоні',
    description: 'Рапорти, виплати та житлові суперечки. Все онлайн. Описуєш ситуацію в чаті — отримуєш результат.',
  },
});

docs.push({
  _id: 'navigation',
  _type: 'navigation',
  brand: { name: 'Legal', accentName: 'Click' },
  desktopLinks: [
    { _key: 'd1', label: 'Головна', target: 'home' },
    { _key: 'd2', label: 'Послуги', target: 'services' },
    { _key: 'd3', label: 'Як це працює', target: 'about' },
    { _key: 'd4', label: 'FAQ', target: 'faq' },
  ],
  mobileTabs: [
    { _key: 'm1', label: 'Головна', target: 'home', iconName: 'home' },
    { _key: 'm2', label: 'Послуги', target: 'services', iconName: 'grid' },
    { _key: 'm3', label: 'FAQ', target: 'faq', iconName: 'search' },
  ],
  footerLinks: [
    { _key: 'f1', label: 'Захист прав військовослужбовців', href: '/military-lawyer' },
    { _key: 'f2', label: 'Житлове право', href: '/housing-law' },
    { _key: 'f3', label: 'Адміністративні правопорушення', href: '/administrative-offences' },
    { _key: 'f4', label: 'FAQ', href: '/#faq' },
  ],
});

docs.push({
  _id: 'homePage',
  _type: 'homePage',
  hero: {
    titleStart: 'Юрист у твоєму',
    titleGradient: 'смартфоні',
    titleEnd: '',
    subtitle:
      'Рапорти, виплати та житлові суперечки. Все онлайн. Описуєш ситуацію в чаті — отримуєш результат.',
    ctaLabel: 'Отримати допомогу в чаті',
    secondaryCtaLabel: 'Як це працює',
  },
  chatMessages: [
    { _key: 'c1', text: 'Вітаю. Я зараз на лікуванні після поранення, ВЛК написали "обмежено придатний", але командир вимагає повертатися на нуль вже завтра. Каже, що людей немає. Допоможіть скласти рапорт на відпустку для оздоровлення або переведення.' },
    { _key: 'c2', text: 'Добрий день! Чоловік зник безвісти під час виконання завдання місяць тому. В частині нічого не кажуть, довідку Ф-15 не дають. Грошове забезпечення теж перестали нараховувати. Підкажіть, які заяви треба написати?' },
    { _key: 'c3', text: 'Я орендую квартиру, вчора нас затопили сусіди зверху. Господар квартири каже, що це мої проблеми, а сусіди двері не відкривають. Що мені зараз зафіксувати, щоб потім не платити за ремонт?' },
    { _key: 'c4', text: 'ВЛК написали "придатний", хоча спина не гнеться і є виписки з лікарні. Хочу оскаржити — куди писати заяву?' },
    { _key: 'c5', text: 'Не прийшли бойові за минулий місяць, хоча був на передку. В частині кажуть, що не подали вчасно списки. Допоможете з рапортом на перерахунок?' },
  ],
  serviceCards: [
    { _key: 's1', name: 'Захист прав військовослужбовців', iconName: 'shield-check', gradient: 'from-blue-600 to-indigo-600', path: '/military-lawyer' },
    { _key: 's2', name: 'Житлове право', iconName: 'home', gradient: 'from-emerald-500 to-teal-600', path: '/housing-law' },
    { _key: 's3', name: 'Адміністративні правопорушення', iconName: 'scale', gradient: 'from-violet-500 to-purple-600', path: '/administrative-offences' },
  ],
  advantages: [
    { _key: 'a1', iconName: 'message-circle', gradient: 'from-blue-500 to-indigo-600', title: 'Без візитів та дзвінків', items: ['Вирішуйте питання як у чаті з другом', 'Жодних поїздок до офісу', 'Юрист завжди в Telegram'] },
    { _key: 'a2', iconName: 'shield-check', gradient: 'from-emerald-500 to-teal-600', title: 'Чесна ціна без сюрпризів', items: ['Без «погодинної оплати юриста»', 'Фіксована вартість ДО початку роботи', 'Ніяких прихованих комісій'] },
    { _key: 'a3', iconName: 'zap', gradient: 'from-violet-500 to-purple-600', title: 'Оперативний старт роботи', items: ['Діємо негайно, без записів', 'Автоматичний розподіл юристу', 'Початок роботи в день звернення'] },
  ],
  howItWorks: [
    { _key: 'h1', number: '1', title: 'Обираєте послугу', desc: 'Просто натисніть потрібний напрямок у боті. Тисніть «Інше», і ми миттєво зорієнтуємо!', accent: false },
    { _key: 'h2', number: '2', title: 'Пишете в чат', desc: 'Опишіть ситуацію та додайте фото документів. Юрист вже будує правову стратегію.', accent: false },
    { _key: 'h3', number: '3', title: 'Отримуєте рішення', desc: 'Ви отримаєте план дій або готові документи. Проблема вирішена 100% онлайн.', accent: true },
  ],
  stats: [
    { _key: 'st1', value: '500+', label: 'Вирішених справ' },
    { _key: 'st2', value: '4.9', label: 'Рейтинг платформи' },
    { _key: 'st3', value: '20-30 хв', label: 'Час першої відповіді' },
    { _key: 'st4', value: '100%', label: 'Онлайн без черги' },
  ],
  trustCard: {
    authorName: 'LegalClick Team',
    quote:
      "Вивчив ваш рапорт та висновок ВЛК. Командир зобов'язаний розглянути рапорт протягом 10 днів — ст. 26 Закону «Про військовий обов'язок». Ось ваш план дій:",
    reply: [
      '1️⃣ Подаємо скаргу командиру бригади.',
      '2️⃣ Дублюємо рапорт через «Армія».',
      '3️⃣ Без відповіді — позов до суду 💼',
    ],
  },
  footerCta: {
    heading: 'Юридична підтримка — в одному кліку',
    subtitle: 'Не відкладайте на потім. Відкрийте чат, опишіть ситуацію і отримайте план дій вже сьогодні.',
    buttonLabel: 'Чат з юристом',
  },
});

docs.push({
  _id: 'notFoundPage',
  _type: 'notFoundPage',
  badge: 'Помилка 404',
  heading: 'Сторінку не знайдено',
  description: 'Можливо, ця сторінка була видалена або ви ввели невірну адресу.',
  primaryCtaLabel: 'На головну',
  secondaryCtaLabel: 'Повернутись назад',
  helperText: 'Або напишіть нам у чат — допоможемо знайти потрібне',
});

docs.push({
  _id: 'servicePage-military-lawyer',
  _type: 'servicePage',
  title: 'Захист прав військовослужбовців',
  slug: { _type: 'slug', current: 'military-lawyer' },
  hero: {
    badgeIconName: 'shield-check',
    badge: 'Захист прав військовослужбовців та звільнених у запас',
    titleStart: 'Юридичний захист',
    titleGradient: 'військовослужбовців',
    titleEnd: 'та їхніх родин',
    gradient: 'from-blue-500 to-indigo-600',
    subtitle:
      'Професійна допомога у вирішенні спорів із командуванням, ВЛК та державними органами. Працюємо на результат.',
    ctaLabel: 'Отримати консультацію',
  },
  services: [
    { _key: 'sv1', title: 'Оскарження рішень ВЛК/МСЕК', desc: "Перегляд висновків за станом здоров'я та направлення на комісію.", iconName: 'shield-alert', gradient: 'from-blue-500 to-indigo-600' },
    { _key: 'sv2', title: 'Мобілізація та відстрочка', desc: 'Оскарження призову та супровід при отриманні законної відстрочки.', iconName: 'user-check', gradient: 'from-emerald-500 to-teal-600' },
    { _key: 'sv3', title: 'Звільнення зі служби', desc: 'Юридичний супровід звільнення за наявності законних підстав.', iconName: 'file-text', gradient: 'from-violet-500 to-purple-600' },
    { _key: 'sv4', title: 'Переведення та рапорти', desc: 'Оскарження відмов у переведенні до іншої частини.', iconName: 'move-right', gradient: 'from-orange-500 to-red-500' },
    { _key: 'sv5', title: 'Виплати та забезпечення', desc: "Стягнення недоплачених коштів, «бойових» та виплати 1 млн грн.", iconName: 'landmark', gradient: 'from-amber-500 to-yellow-500' },
    { _key: 'sv6', title: 'Сімейні справи', desc: "Виплати загиблим. Встановлення факту проживання однією сім'єю.", iconName: 'users', gradient: 'from-pink-500 to-rose-600' },
    { _key: 'sv7', title: 'Моральна шкода', desc: 'Відшкодування за незаконні дії чи бездіяльність командування.', iconName: 'hand-heart', gradient: 'from-cyan-500 to-blue-500' },
  ],
  stats: [
    { _key: 'mst1', value: '350+', label: 'Справ військових' },
    { _key: 'mst2', value: '94%', label: 'Успішних рішень' },
    { _key: 'mst3', value: '20-30 хв', label: 'Час відповіді' },
    { _key: 'mst4', value: '100%', label: 'Онлайн' },
  ],
  expertise: {
    heading: 'Експертність без канцеляризмів',
    description:
      'Ми говоримо з вами зрозумілою людяною мовою, проте досконало знаємо всі тонкощі армійських статутів, бюрократичних процедур та законів України. Не витрачайте час на спроби самостійно розібратися у складнощах системи — довірте це професіоналам.',
  },
  footerCta: {
    heading: 'Юридична підтримка — в одному кліку',
    subtitle: 'Не відкладайте на потім. Відкрийте чат, опишіть ситуацію і отримайте план дій вже сьогодні.',
    buttonLabel: 'Чат з юристом',
  },
  seo: {
    title: 'Юридична допомога військовим — Оскарження ВЛК, виплати, звільнення',
    description: 'Професійні послуги військового юриста. Допомога при оскарженні ВЛК, отриманні виплат та звільненні зі служби.',
  },
});

docs.push({
  _id: 'servicePage-housing-law',
  _type: 'servicePage',
  title: 'Житлове право',
  slug: { _type: 'slug', current: 'housing-law' },
  hero: {
    badgeIconName: 'home',
    badge: 'Житлове право',
    titleStart: 'Житлове право та',
    titleGradient: 'захист нерухомості',
    titleEnd: '',
    gradient: 'from-emerald-400 to-teal-400',
    subtitle:
      'Поновлення в черзі на житло, отримання компенсацій та повернення коштів при купівлі нерухомості. Працюємо на результат.',
    ctaLabel: 'Отримати консультацію',
  },
  services: [
    { _key: 'hsv1', title: 'Квартирний облік', desc: 'Оскарження зняття та поновлення в черзі на житло.', iconName: 'file-text', gradient: 'from-blue-500 to-indigo-600' },
    { _key: 'hsv2', title: 'Компенсація за житло', desc: 'Отримання грошових виплат на житлове приміщення військовослужбовцям.', iconName: 'shield-check', gradient: 'from-emerald-500 to-teal-600' },
  ],
  stats: [
    { _key: 'hst1', value: '150+', label: 'Житлових справ' },
    { _key: 'hst2', value: '96%', label: 'Успішних рішень' },
    { _key: 'hst3', value: '~15 хв', label: 'Час відповіді' },
    { _key: 'hst4', value: '100%', label: 'Онлайн' },
  ],
  expertise: {
    heading: 'Захищаємо ваше право на житло',
    description:
      'Допомагаємо у питаннях квартирного обліку, компенсацій за житло, повернення коштів та оскарженні рішень. Швидко, прозоро і без черг.',
  },
  footerCta: {
    heading: 'Юридична підтримка — в одному кліку',
    subtitle: 'Не відкладайте на потім. Відкрийте чат, опишіть ситуацію і отримайте план дій вже сьогодні.',
    buttonLabel: 'Чат з юристом',
  },
  seo: {
    title: 'Житлове право та захист нерухомості — LegalClick',
    description:
      'Професійні послуги у сфері житлового права: квартирний облік, компенсації, повернення 1% до ПФУ та списання комунальних боргів.',
  },
});

docs.push({
  _id: 'servicePage-administrative-offences',
  _type: 'servicePage',
  title: 'Адміністративні правопорушення',
  slug: { _type: 'slug', current: 'administrative-offences' },
  hero: {
    badgeIconName: 'scale',
    badge: 'Адміністративне право',
    titleStart: 'Адміністративні',
    titleGradient: 'правопорушення',
    titleEnd: '',
    gradient: 'from-violet-400 to-fuchsia-400',
    subtitle:
      'Дорожній рух, оскарження постанов поліції та спори з органами влади. Захищаємо ваші права — швидко й без бюрократії.',
    ctaLabel: 'Отримати консультацію',
  },
  services: [
    { _key: 'asv1', title: 'Справи у сфері дорожнього руху', desc: 'Штрафи ПДР, позбавлення прав, оскарження постанов поліції, ДТП та експертизи.', iconName: 'shield-alert', gradient: 'from-violet-500 to-purple-600' },
    { _key: 'asv2', title: 'Оскарження постанов', desc: 'Скасування постанов про адміністративні правопорушення у суді чи вищому органі.', iconName: 'file-text', gradient: 'from-pink-500 to-rose-600' },
    { _key: 'asv3', title: 'Спори з органами влади', desc: "Спори з приводу рішень, дій чи бездіяльності суб'єктів владних повноважень у справах про притягнення до адміністративної відповідальності.", iconName: 'building', gradient: 'from-violet-500 to-purple-600' },
    { _key: 'asv4', title: 'Військові адміністративні правопорушення', desc: 'Ст. 172-10 – 172-20 КУпАП: непокора командиру, СЗЧ, пошкодження військового майна, недбале ставлення до служби, вживання алкоголю чи наркотиків.', iconName: 'shield-alert', gradient: 'from-blue-500 to-indigo-600' },
  ],
  stats: [
    { _key: 'ast1', value: '50+', label: 'Адмін. справ' },
    { _key: 'ast2', value: '92%', label: 'Успішних оскаржень' },
    { _key: 'ast3', value: '~15 хв', label: 'Час відповіді' },
    { _key: 'ast4', value: '100%', label: 'Онлайн' },
  ],
  expertise: {
    heading: 'Зрозуміло про складне',
    description:
      'Адміністративне право — одне з найбільш заплутаних. Ми чітко пояснюємо ваші права, готуємо аргументовані оскарження і доводимо справу до результату.',
  },
  footerCta: {
    heading: 'Не зволікайте — терміни оскарження обмежені',
    subtitle: 'Відкрийте чат, опишіть ситуацію і отримайте план дій вже сьогодні.',
    buttonLabel: 'Чат з юристом',
  },
  seo: {
    title: 'Адміністративні правопорушення — LegalClick',
    description:
      'Професійна допомога у справах про адміністративні правопорушення: дорожній рух, оскарження постанов, спори з органами влади.',
  },
});

// ── FAQ Items ──
const faqItems = [
  {
    question: 'Хто саме буде займатися моєю справою?',
    answer: 'З вами працюватиме вузькопрофільний фахівець. Ми не передаємо справи юристам-«універсалам». Щойно ви опишете свою ситуацію, ми уважно її вивчимо та підберемо з нашої команди саме того адвоката, який має найбільший досвід у таких питаннях.',
  },
  {
    question: 'Чи можете ви представляти мене в суді?',
    answer: 'Звісно. Більше того, вам взагалі не доведеться витрачати час на походи на засідання. Наш адвокат захищатиме ваші інтереси дистанційно через офіційну систему «Електронний суд». Якщо ж ситуація вимагатиме особистої присутності в залі, ми просто залучимо до справи нашого колегу з вашого міста.',
  },
  {
    question: 'А що, якщо мою проблему неможливо вирішити?',
    answer: "Ми беремося лише за ті справи, де реально бачимо законні шляхи вирішення. Якщо об'єктивно шансів на успіх мало, ми прямо і чесно попередимо вас про це до консультації, щоб не витрачати ваш час та гроші даремно.",
  },
  {
    question: 'Як швидко я отримаю допомогу?',
    answer: 'Терміни залежать від того, яка саме допомога потрібна у вашій ситуації:\n\n• Покроковий план дій — розробимо орієнтовно за 1–2 дні.\n• Складання документа чи позову — від 3 днів, залежно від складності питання.\n• Повний супровід — наш юрист буде з вами на кожному етапі справи, від побудови плану до отримання фінального результату.',
  },
];

faqItems.forEach((item, i) => {
  docs.push({
    _id: `faqItem-${i + 1}`,
    _type: 'faqItem',
    question: item.question,
    answer: item.answer,
    order: i + 1,
  });
});

// ── Reviews ──
const reviews = [
  { name: 'Дмитро К.', role: 'ветеран ЗСУ, м. Харків', text: 'Звільнився зі служби і навіть не підозрював, що мені недоплатили майже 400 тисяч гривень. LegalClick самі порахували, підготували всі документи і подали до суду — я навіть жодного разу не з\'являвся особисто. Питання вирішили повністю.', stars: 5 },
  { name: 'Олександр Т.', role: 'військовослужбовець ЗСУ', text: 'Проходив ВЛК, комісія спочатку відмовила у звільненні — казали "придатний". Юристи LegalClick оскаржили рішення через Telegram без жодних черг і кабінетів. На руках законне рішення.', stars: 5 },
  { name: 'Тетяна М.', role: 'дружина мобілізованого, м. Дніпро', text: 'Написала в бот пізно ввечері, вранці вже відповів юрист. Чоловіка мобілізували з порушеннями — все вирішили дистанційно. Жодного офісу, жодної нервотрепки. Дуже вдячна за людське ставлення.', stars: 5 },
  { name: 'Василь Р.', role: 'демобілізований, м. Запоріжжя', text: 'Думав, питання з виплатами за поранення — це місяці походів по інстанціях. Виявилось — кілька повідомлень у Telegram і все вирішено. Юристи знають військове право від і до, жодних зайвих питань.', stars: 5 },
  { name: 'Сергій Л.', role: 'учасник бойових дій, м. Львів', text: 'Мене незаконно зняли з квартирної черги як учасника бойових дій — нібито "виявили підстави". Зв\'язався з LegalClick, юрист підготував оскарження і все повернули. Все вирішили цифрово, до жодної інстанції особисто не ходив.', stars: 5 },
  { name: 'Микола Б.', role: 'водій-далекобійник, м. Полтава', text: 'Зафіксували перевищення швидкості на трасі — на камеру, вантажівка понад норму. Штраф великий, хотів оскаржити. Юрист LegalClick розібрав ситуацію, підготував заперечення. Все онлайн, без суєти.', stars: 5 },
];

reviews.forEach((r, i) => {
  docs.push({
    _id: `review-${i + 1}`,
    _type: 'review',
    name: r.name,
    role: r.role,
    text: r.text,
    stars: r.stars,
    order: i + 1,
  });
});

const tx = client.transaction();
for (const doc of docs) tx.createOrReplace(doc);

console.log(`Seeding ${docs.length} documents to project ${env.SANITY_STUDIO_PROJECT_ID}...`);
const result = await tx.commit();
console.log(`✓ Done. Transaction ID: ${result.transactionId}`);
console.log('Documents:', docs.map((d) => d._id).join(', '));
