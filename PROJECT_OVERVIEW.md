# 🏛️ PROJECT OVERVIEW: LegalClick (Fintech Legal Platform)

Цей файл є "єдиним джерелом істини" для проєкту LegalClick. Він містить повну інформацію про архітектуру, деплой, автоматизацію та останні оновлення.

---

## 🚀 1. Останні ключові оновлення (Квітень 2026)
- **Mobile-First UI:** Повна оптимізація під iPhone/смартфони. Додано нижню панель навігації (Bottom Tab Bar) та Safe Area для "чубчиків".
- **Hetzner VPS Deployment:** Проєкт перенесено з локальної розробки на бойовий сервер Hetzner.
- **GitHub Actions (CI/CD):** Налаштовано повну автоматизацію. Кожен `git push` автоматично оновлює код на сервері та перезапускає бота.
- **Persistence (База даних):** SQLite база даних винесена за межі папки з кодом (`/var/data/`), щоб історія клієнтів зберігалася роками і не затиралася при нових деплоях.

---

## 🛠️ 2. Технологічний стек
- **Frontend:** React 19 (Vite), TailwindCSS v4, Framer Motion (анімації), Lucide React (іконки).
- **Backend:** Node.js, `telegraf` (Telegram Bot API).
- **Database:** SQLite (SQL-зберігання сесій та топіків).
- **DevOps:** PM2 (керування процесами), GitHub Actions (автодеплой), SSH.

---

## 📱 3. Frontend (Landing Page)
- **Файл:** `src/App.jsx`
- **Стиль:** Fintech Dark Mode, Glassmorphism, акцентний синій `#0052FF`.
- **Мобільна адаптація:** 
  - Sticky Bottom Navigation (Головна, Послуги, FAQ).
  - `ChatCarousel` у Hero-блоці для соціального доказу (авто-зміна повідомлень кожні 20 сек).
  - Прибрано всі зайві елементи (профіль, чат-віджети) з мобільної версії для чистоти інтерфейсу.
- **SEO/Analytics:** Schema.org розмітка для FAQ. Всі посилання "Чат" ведуть прямо на Telegram-бота.

---

## 🤖 4. Backend (Telegram Bot & Workflow)
- **Файл:** `server/index.js`
- **Логіка воронок:**
  1. Стартове меню -> Вибір послуги -> Опис ситуації -> Метод оплати.
  2. Оплата (Direct/Crypto) -> Підтвердження адміністратором у Forum-групі.
  3. **Forum Topics:** Бот автоматично створює окремий Топік (Thread) для кожного клієнта після оплати.
  4. **Двосторонній зв'язок:** Юристи відповідають у топіку — клієнт отримує відповідь від імені бота.

---

## 🌐 5. Інфраструктура та Деплой (Hetzner VPS)
- **IPv4:** `178.104.136.90`
- **Користувач:** `root`
- **Пароль:** `Rost27041975!`
- **Архітектура на сервері:**
  - Код проекту: `/opt/legalclick`
  - База даних: `/var/data/legalclick/database.sqlite` (Конфігурація в `.env` через `DB_PATH`)
  - Логи PM2: `/opt/legalclick/logs/`

---

## 🔄 6. Автоматизація (CI/CD)
Налаштовано через GitHub Actions (`.github/workflows/deploy.yml`).
**Принцип роботи:**
1. Розробник робить `git push` у `master`.
2. GitHub підключається до сервера через SSH (секрети `SSH_PRIVATE_KEY` у репозиторії).
3. Виконуються команди: `git pull`, `npm install`, `pm2 restart ecosystem.config.cjs`.

**Команди для ручного керування на сервері:**
- `pm2 status` — перевірити чи працює бот.
- `pm2 logs legalclick-bot` — переглянути помилки та події.
- `pm2 restart legalclick-bot` — перезапустити вручну.

---

## 🔑 7. Змінні оточення (.env)
*Файл `.env` на сервері містить:*
- `BOT_TOKEN`: 8713961917:AAFJAnFKiZ5_j...
- `ADMIN_CHAT_ID`: -1003704423334
- `DB_PATH`: /var/data/legalclick/database.sqlite
- `MONOBANK_API_TOKEN`: uzfzIW4psGfaOguU...

---

## ⚠️ 8. Важливі примітки для розробки
1. **Repository:** Репозиторій МАЄ бути приватним (так і зроблено).
2. **Ecosystem:** PM2 конфігурація знаходиться у `ecosystem.config.cjs` (розширення `.cjs` обов'язкове через `"type": "module"` у `package.json`).
3. **Database:** Якщо потрібно скинути базу даних вручну — видаліть файл у `/var/data/legalclick/`. Бот створить новий при старті.

*Останнє оновлення документу: 06.04.2026*
