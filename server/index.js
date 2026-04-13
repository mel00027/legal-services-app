require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const fs = require('fs');
const path = require('path');
const db = require('./db.js');

// Налаштування логування в файл
const errorLogPath = path.join(__dirname, 'bot_errors.log');
const originalError = console.error;
console.error = function (...args) {
    originalError.apply(console, args);
    try {
        const msg = args.map(a => (typeof a === 'object' && a instanceof Error ? a.stack : (typeof a === 'object' ? JSON.stringify(a) : a))).join(' ');
        fs.appendFileSync(errorLogPath, `[${new Date().toLocaleString('uk-UA')}] ${msg}\n`);
    } catch(err) {}
};

const token = process.env.BOT_TOKEN;
if (!token) {
  console.error("Помилка: Не знайдено BOT_TOKEN у файлі .env");
  process.exit(1);
}

const bot = new Telegraf(token);

const delay = ms => new Promise(res => setTimeout(res, ms));

// Cache for deduplicating media groups (albums)
const processedMediaGroups = new Set();

// 2.2 Ізоляція сесії (Middleware)
bot.use(async (ctx, next) => {
  // Only process isolation for private chats, ignore admin channel logic here
  if (ctx.chat && ctx.chat.type === 'private') {
    const session = await db.getSession(ctx.from.id);
    if (session && session.status === 'active_consultation') {
      const topic = await db.getTopic(ctx.from.id);
      if (topic && topic.is_open === 1) {
        // If it's just a text/media message, let it pass to the admin handler below. 
        // BUT if it's a command (like /start) or callback, reject it.
        const msgText = ctx.message && ctx.message.text ? ctx.message.text : '';
        if (msgText.startsWith('/') || ctx.callbackQuery) {
           if (ctx.callbackQuery) await ctx.answerCbQuery();
           try {
             await ctx.reply("⚠️ У вас зараз активна консультація з юристом. Будь ласка, пишіть ваші повідомлення сюди. Щоб створити нову заявку, дочекайтесь завершення поточної.");
           } catch(e) {}
           return; // Block command/action
        }
      }
    }
  }
  return next();
});

// Головне меню з категоріями
const getMainMenu = () => {
  return Markup.inlineKeyboard([
    [Markup.button.callback('🛡 Військове право', 'category_military')],
    [Markup.button.callback('🏠 Житлові питання', 'category_housing')],
    [Markup.button.callback('⚖️ Адміністративні правопорушення', 'category_admin_offenses')],
    [Markup.button.callback('❓ Інше', 'category_other')]
  ]);
};

// Шаблон запиту опису ситуації
const getDescriptionPromptText = (cat) => `Категорія: *${cat}*

Опишіть вашу ситуацію текстом. Будь ласка, вмістіть усю розповідь у одне повідомлення (якщо потрібно — прикріпіть фото документів).

Що варто вказати:
➕ що саме трапилося (коротко по суті);
➕ чи є у вас на руках документи (договір, постанова, повістка, рапорт тощо);
➕ якого результату ви очікуєте від юриста.

✅ *Так пишуть клієнти, яким ми допомагаємо швидко:*
«Служу з лютого 2022. Написав рапорт на звільнення за станом здоров'я, ВЛК пройшов — командир не підписує вже 2 місяці. Рапорт і висновок ВЛК додаю.»
«Отримав повістку від ТЦК, але маю бронювання від роботодавця. Повістку та наказ про бронь прикріплюю.»
«Сусіди затопили квартиру. Є акт огляду від ЖЕКу і фото пошкоджень. Хочу стягнути компенсацію.»

❌ *Так писати не варто — юристу доведеться уточнювати:*
«Мені потрібна консультація.»
«Проблема з ТЦК, що робити?»
«Питання по документах.»

Чим точніше ви опишете ситуацію одразу, тим швидше юрист візьметься за вашу справу! 👇`;

// Обробка команди /start
bot.start(async (ctx) => {
  await db.deleteSession(ctx.from.id);
  // Also clear any stuck topics if user arbitrarily restarted (failsafe reset)
  await db.saveTopic(ctx.from.id, null);
  
  ctx.reply(
    `Вітаю, ${ctx.from.first_name}! 👋\n\nЯ ваш юрист онлайн — LegalClick.\nБез зустрічей, без черг, все прямо в месенджері.\n\nОберіть категорію вашого питання:`,
    getMainMenu()
  );
});

// Допоміжна команда для того, щоб дізнатись ID групи
bot.command('getid', (ctx) => {
  ctx.reply(`ID цього чату: ${ctx.chat.id}`);
});

// Обробка вибору категорії
const checkAgreementAndProceed = async (ctx, categoryName) => {
  // Завжди показуємо оферту при кожному новому зверненні
  await db.saveSession(ctx.from.id, { 
    chat_id: ctx.chat.id, 
    status: 'awaiting_agreement', 
    category: categoryName 
  });
  await ctx.answerCbQuery();
  await ctx.editMessageText(
    "Перш ніж ми розпочнемо, ознайомтеся з умовами надання послуг. Ми працюємо офіційно та дбаємо про безпеку ваших даних.",
    Markup.inlineKeyboard([
      [Markup.button.callback('📄 Читати Оферту', 'read_offer')],
      [Markup.button.callback('✅ Погоджуюсь та продовжую', 'accept_agreement')]
    ])
  );
};

bot.action(/^category_(.+)/, async (ctx) => {
  const categoryId = ctx.match[1];

  if (categoryId === 'military') {
    await db.saveSession(ctx.from.id, { 
      chat_id: ctx.chat.id, 
      status: 'awaiting_subcategory', 
      category: 'Військове право' 
    });
    
    await ctx.answerCbQuery();
    await ctx.editMessageText(`Ви обрали: *Військове право*\n\nБудь ласка, оберіть специфіку питання, щоб ми могли залучити профільного спеціаліста:`, { 
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.callback('🪖 Мобілізація', 'subcategory_Мобілізація'), Markup.button.callback('🏥 ВЛК', 'subcategory_ВЛК')],
        [Markup.button.callback('💸 Виплати', 'subcategory_Виплати'), Markup.button.callback('📝 Звільнення', 'subcategory_Звільнення')],
        [Markup.button.callback('❓ Інше', 'subcategory_Інше')]
      ])
    });
    return;
  }

  let categoryName = 'Інше';
  switch(categoryId) {
    case 'housing': categoryName = 'Житлові питання'; break;
    case 'admin_offenses': categoryName = 'Адміністративні правопорушення'; break;
  }

  await checkAgreementAndProceed(ctx, categoryName);
});

// Обробка вибору підкатегорії
bot.action(/subcategory_(.+)/, async (ctx) => {
   const subcategoryName = ctx.match[1];
   const session = await db.getSession(ctx.from.id);
   
   if (!session || session.status !== 'awaiting_subcategory') {
      return ctx.answerCbQuery('Заявка не знайдена. Почніть з /start');
   }

   const fullCategory = `${session.category} -> ${subcategoryName}`;
   await checkAgreementAndProceed(ctx, fullCategory);
});

// Agreement Handlers
bot.action('read_offer', async (ctx) => {
  const offerText = `<b>ПУБЛІЧНА ОФЕРТА (ДОГОВІР) ПРО НАДАННЯ ЮРИДИЧНИХ ПОСЛУГ ОНЛАЙН</b>

<b>1. ЗАГАЛЬНІ ПОЛОЖЕННЯ</b>
1.1. Цей документ є офіційною пропозицією сервісу LegalClick для будь-якої особи.
1.2. Акцептом цієї Оферти є натискання Клієнтом кнопки «Погоджуюсь з умовами» в боті.

<b>2. ПРЕДМЕТ ДОГОВОРУ</b>
2.1. Виконавець зобов’язується надати юридичні послуги (консультації, підготовка документів) дистанційно через Telegram.

<b>3. ПОРЯДОК НАДАННЯ ПОСЛУГ</b>
3.1. Клієнт обирає категорію та описує суть запиту в чаті.
3.2. Послуга вважається наданою з моменту відправлення Виконавцем текстової консультації або документа.
3.3. Комунікація в Telegram має юридичну силу офіційного листування.

<b>4. ВАРТІСТЬ ТА ОПЛАТА</b>
4.1. Оплата здійснюється у формі 100% передоплати за реквізитами бота.

<b>5. КОНФІДЕНЦІЙНІСТЬ ТА ДАНІ</b>
5.1. Виконавець зобов’язується не розголошувати інформацію третім особам.
5.2. Виконавець не зберігає копії документів на фізичних серверах, використовуючи інфраструктуру Telegram.

<b>6. ВІДПОВІДАЛЬНІСТЬ СТОРІН</b>
6.1. Виконавець не несе відповідальності за судове рішення, але гарантує фахову підготовку документів.
6.2. Клієнт несе відповідальність за достовірність документів.

<b>7. ПРИПИНЕННЯ ДОГОВОРУ</b>
7.1. Договір вважається виконаним після закриття діалогу в адмін-панелі.`;

  await ctx.answerCbQuery();
  await ctx.reply(offerText, { 
    parse_mode: 'HTML',
    ...Markup.inlineKeyboard([
      [Markup.button.callback('✅ Погоджуюсь та продовжую', 'accept_agreement')]
    ])
  });
});

bot.action('accept_agreement', async (ctx) => {
  await db.saveUserAgreement(ctx.from.id);
  const session = await db.getSession(ctx.from.id);
  if (session && session.status === 'awaiting_agreement') {
     await db.saveSession(ctx.from.id, { 
       ...session, 
       status: 'awaiting_description' 
     });
     await ctx.answerCbQuery();
     await ctx.editMessageText(getDescriptionPromptText(session.category), { parse_mode: 'Markdown' });
  } else {
     await ctx.answerCbQuery('Угода підтверджена.');
  }
});

// Обробка відповідей від юристів-адмінів до клієнта (працює і в Темах, і в приватному чаті адмінів)
bot.on('message', async (ctx, next) => {
  const adminChatId = process.env.ADMIN_CHAT_ID;
  console.log("MESSAGE RECEIVED:", ctx.chat?.id, adminChatId, ctx.message?.message_thread_id);
  
  if (adminChatId && ctx.chat.id.toString() === adminChatId.toString()) {
    if (ctx.message.new_chat_members || ctx.message.forum_topic_created || ctx.message.forum_topic_edited || ctx.message.pinned_message) return next();

    let clientId = null;
    const threadId = ctx.message.message_thread_id;
    
    // Сценарій -1: Адміністратор вводить суму для доплати в Темі
    if (threadId) {
       const admState = await db.getAdminState(threadId);
       if (admState && admState.step === 'awaiting_extra_payment') {
          const amount = parseInt(ctx.message.text);
          if (isNaN(amount)) {
             await ctx.reply("❌ Будь ласка, введіть коректну суму (лише цифри, наприклад: 500).");
             return next();
          }
          await db.deleteAdminState(threadId);
          
          const cid = admState.client_id;
          const session = await db.getSession(cid);
          
          if (session) {
            await db.saveSession(cid, {
               ...session,
               status: 'awaiting_payment_method',
               extra: 1,
               amount: amount
            });
          }
          
          const paymentLink = 'https://send.monobank.ua/4gQ4hJwczZ';
          await ctx.reply(`✅ Рахунок на ${amount} грн успішно сформовано та надіслано клієнту.`);
          
          try {
            await ctx.telegram.sendMessage(
              cid,
              `⚖️ Для продовження роботи над вашою справою необхідно внести доплату.\n\n` +
              `Сума: *${amount} грн*.\n\n` +
              `Після успішної оплати завантажте квитанцію сюди.`,
              { 
                parse_mode: 'Markdown',
                disable_web_page_preview: true,
                ...Markup.inlineKeyboard([
                  [Markup.button.url('Відкрити посилання на оплату', paymentLink)],
                  [Markup.button.callback('🧾 Надіслати квитанцію', 'send_receipt_prompt')]
                ])
              }
            );
          } catch(e) {
             console.error('Не вдалося надіслати запит клієнту', e);
             await ctx.reply('❌ Помилка: Не вдалося надіслати запит клієнту. Можливо, він заблокував бота або видалив чат. Деталі в bot_errors.log');
          }
          return;
       }
    }

    // Сценарій 1: Повідомлення написано в окремій Темі (Форумі)
    if (ctx.message.is_topic_message || threadId) {
       const topicRow = await db.getTopicByThreadId(threadId);
       if (topicRow) clientId = topicRow.client_chat_id;
    }
    
    // Сценарій 2: Відповідь на повідомлення у звичайному приватному чаті (fallback)
    if (!clientId && ctx.message.reply_to_message) {
      const replyTo = ctx.message.reply_to_message;
      if (replyTo.text && replyTo.text.includes('[ID: ')) {
        const match = replyTo.text.match(/\[ID: (\d+)\]/);
        if (match && match[1]) clientId = match[1];
      } else if (replyTo.forward_from && replyTo.forward_from.id) {
        clientId = replyTo.forward_from.id;
      }
    }
    
    // Якщо клієнта знайдено - відправляємо йому копію повідомлення
    if (clientId) {
      const dbTopic = await db.getTopic(clientId);
      if (!dbTopic || dbTopic.is_open === 0) {
        // Блок: Якщо юрист випадково напише повідомлення в уже закритий топік, бот має проігнорувати
        // і НЕ пересилати клієнту.
        try { await ctx.reply("⚠️ Увага: Консультація закрита. Повідомлення не доставлено клієнту.", { reply_to_message_id: ctx.message.message_id }); } catch(ej){}
        return; 
      }
      
      try {
        // 2.3 Безпечне пересилання: Використовуємо ВИКЛЮЧНО copyMessage
        await ctx.telegram.copyMessage(parseInt(clientId), ctx.chat.id, ctx.message.message_id);
      } catch (error) {
        console.error("Помилка відправки клієнту:", error.message);
        try { await ctx.reply('❌ Помилка: Не вдалося надіслати повідомлення клієнту. Можливо він заблокував бота.', { message_thread_id: threadId }); } catch(ej){}
      }
      return; 
    }
  }
  
  return next();
});

// Функція для створення Топіка та передачі справи
async function createClientTopic(ctx, clientId, clientName, category, initialMsgId) {
  const adminChatId = process.env.ADMIN_CHAT_ID;
  if (!adminChatId) return null;
  
  let isForum = adminChatId.startsWith('-100');
  let topicRow = await db.getTopic(clientId);
  let threadId = topicRow ? topicRow.thread_id : null;
  
  if (isForum && !threadId) {
     try {
       const prefix = category ? category.split(' ')[0] : 'Заявка';
       const topicName = `[${prefix}] ${clientName}`;
       const newTopic = await ctx.telegram.createForumTopic(adminChatId, topicName);
       threadId = newTopic.message_thread_id;
       await db.saveTopic(clientId, threadId);
     } catch (e) {
       console.error("Помилка створення топіка:", e);
     }
  }
  return threadId;
}

// Функція відправлення стартового повідомлення в топік
async function dispatchConsultationToTopic(ctx, clientId, clientName, category, threadId) {
  const adminChatId = process.env.ADMIN_CHAT_ID;
  if (!adminChatId || !threadId) return;

  const adminMsg = `🚨 <b>Консультацію розпочато! (Оплачено)</b>\n\n` +
                   `<b>Клієнт:</b> ${clientName} [ID: ${clientId}]\n` +
                   `<b>Категорія:</b> ${category}\n` +
                   `<b>Взяв у роботу:</b> @${ctx.from.username || ctx.from.first_name}\n\n` +
                   `Усі ваші наступні повідомлення в цьому топіку будуть автоматично доставлені клієнту.👇`;
                   
  const actionMenu = Markup.inlineKeyboard([
     [Markup.button.callback('💰 Доплата', `req_pay_${clientId}`), Markup.button.callback('✅ Завершити', `close_chat_${clientId}`)],
     [Markup.button.callback('🗑 Видалити діалог', `delete_chat_${clientId}`)]
  ]);

  try {
    const sentMsg = await ctx.telegram.sendMessage(adminChatId, adminMsg, { 
       parse_mode: 'HTML', 
       message_thread_id: threadId,
       ...actionMenu
    });
    
    // Закріплюємо (Pin) перше адмін повідомлення у топіку
    try {
       await ctx.telegram.pinChatMessage(adminChatId, sentMsg.message_id);
    } catch (pinErr) {
       // Ignore pin error if missing permissions
    }
    
    // Перекидаємо початковий запит клієнта для бази в топік
    const sess = await db.getSession(clientId);
    if (sess && sess.receipt_msg_id) {
       // Instead of text forming, gracefully copy original description message
       try { await ctx.telegram.copyMessage(adminChatId, clientId, sess.receipt_msg_id, { message_thread_id: threadId }); } catch(ej){}
    }
  } catch (error) {
    if (error.message.includes('thread not found') || error.message.includes('message context to reply is not found')) {
        await db.saveTopic(clientId, null);
    }
  }
}

// 2.1 Захист від критичних помилок (Race Condition Block)
bot.action(/confirm_payment_(.+)/, async (ctx) => {
  const clientId = parseInt(ctx.match[1]);
  
  // Checking active consultation
  const session = await db.getSession(clientId);
  if (!session) return ctx.answerCbQuery("Сесію видалено або втрачено.", { show_alert: true });

  if (session.status === 'active_consultation') {
    // Вже взяли! Битва юристів.
    return ctx.answerCbQuery("Цю заявку вже взяв у роботу інший фахівець!", { show_alert: true });
  }

  // Set the status safely
  await db.updateSessionStatus(clientId, 'active_consultation');
  await db.saveSession(clientId, { ...session, status: 'active_consultation' });

  // Update UI locking the button
  await ctx.answerCbQuery("Оплату підтверджено!");
  try {
     const clientNameCall = ctx.callbackQuery.message.text ? ctx.callbackQuery.message.text.match(/Клієнт: (.+) \(/) : null;
     const fetchedName = clientNameCall ? clientNameCall[1] : "Клієнт";
     
     // Remove buttons and append signature safely
     const originalText = ctx.callbackQuery.message.text || ctx.callbackQuery.message.caption || "";
     await ctx.editMessageText(
        `${originalText}\n\n🟢 <b>Взято в роботу юристом:</b> @${ctx.from.username || ctx.from.first_name}`, 
        { parse_mode: 'HTML', reply_markup: { inline_keyboard: [] } }
     ).catch(() => {});
     
     // 3.2 Авто-відповідь після підтвердження
     const paymentSuccessText = `✅ Оплату успішно підтверджено! Чат відкрито.

Ваш профільний юрист уже долучився до бесіди та отримав усі матеріали справи.

⚖️ Щоб надати вам не просто шаблонну відповідь, а глибокий юридичний аналіз вашої конкретної ситуації, фахівцю потрібен час на вивчення документів та актуальної судової практики.

⏳ Зазвичай підготовка детальної відповіді займає від 1 до 2 годин.

Будь ласка, не хвилюйтеся — ви можете закрити бота і займатися своїми справами. Щойно алгоритм дій буде готовий, юрист одразу напише вам сюди!`;
     await ctx.telegram.sendMessage(clientId, paymentSuccessText);

     // Create and dispatch
     const threadId = await createClientTopic(ctx, clientId, fetchedName, session.category);
     if (threadId) {
        await db.saveTopic(clientId, threadId);
        await db.setTopicLawyer(clientId, ctx.from.id);
        await dispatchConsultationToTopic(ctx, clientId, fetchedName, session.category, threadId);
     }
  } catch (err) {
     console.error("Error confirming payment", err);
  }
});

// Admin rejecting
bot.action(/reject_payment_(.+)/, async (ctx) => {
  const clientId = parseInt(ctx.match[1]);
  await ctx.answerCbQuery("Оплату відхилено!");
  
  try {
     await ctx.editMessageReplyMarkup({ inline_keyboard: [] }); 
     await ctx.reply(`❌ Оплату для клієнта [ID: ${clientId}] ВІДХИЛЕНО. @${ctx.from.username || ctx.from.first_name}`, { reply_to_message_id: ctx.callbackQuery.message.message_id });
     
     const session = await db.getSession(clientId);
     if (session) await db.updateSessionStatus(clientId, 'payment_selection');

     await ctx.telegram.sendMessage(
       clientId, 
       "На жаль, ми не змогли підтвердити ваш платіж. Будь ласка, перевірте реквізити або надішліть актуальну квитанцію ще раз.",
       Markup.inlineKeyboard([
         [Markup.button.callback('🧾 Надіслати квитанцію', 'send_receipt_prompt')]
       ])
     );
  } catch (err) {
     console.error("Error rejecting payment", err);
  }
});

// Керування Топіком (Кнопки)
bot.action(/req_pay_(.+)/, async (ctx) => {
  const clientId = parseInt(ctx.match[1]);
  await ctx.answerCbQuery();
  
  const threadId = ctx.callbackQuery.message.message_thread_id;
  if (!threadId) return ctx.reply("Ця кнопка працює тільки всередині окремої Теми(Топіка)!");

  const topicInfo = await db.getTopicByThreadId(threadId);
  if (!topicInfo || topicInfo.is_open === 0) return ctx.reply("Консультація вже закрита.");
  
  await db.saveAdminState(threadId, clientId, 'awaiting_extra_payment');
  await ctx.reply("Виставлення рахунку: Відправте суму доплати цифрами (наприклад, 500) у відповідь сюди:");
});

bot.action(/close_chat_(.+)/, async (ctx) => {
  const clientId = parseInt(ctx.match[1]);
  
  try {
     const topicInfo = await db.getTopic(clientId);
     if (!topicInfo || topicInfo.is_open === 0) {
        return ctx.answerCbQuery("Консультацію вже завершено.");
     }
     
     await ctx.answerCbQuery("Чат завершено!");
     
     await db.updateTopicIsOpen(clientId, false);
     
     // Update session to allow review
     const session = await db.getSession(clientId);
     if (session) {
         await db.saveSession(clientId, { ...session, status: 'review_prompt' });
     } else {
         await db.saveSession(clientId, { chat_id: clientId, status: 'review_prompt' });
     }
     
     await ctx.telegram.sendMessage(
       clientId, 
       "Дякуємо, що обрали LegalClick! Ваша справа офіційно закрита. Якщо у вас виникнуть нові питання — ми на зв'язку.\n\nБудемо вдячні за зворотний зв'язок. Це допоможе нам ставати кращими.",
       Markup.inlineKeyboard([
         [Markup.button.callback('⭐️ Залишити відгук', 'leave_review')],
         [Markup.button.callback('🏠 На головну', 'go_home')]
       ])
     );
     
     const now = new Date().toLocaleString('uk-UA');
     await ctx.editMessageReplyMarkup({ inline_keyboard: [] }); 
     await ctx.reply(`🔒 Сесію закрито [${now}]. Для фізичного видалення натисніть "Видалити діалог".`, { reply_to_message_id: ctx.callbackQuery.message.message_id });
     
     if (topicInfo.thread_id && process.env.ADMIN_CHAT_ID) {
         try {
            await ctx.telegram.closeForumTopic(process.env.ADMIN_CHAT_ID, topicInfo.thread_id);
         } catch(closeErr) {
            console.log("Could not close forum topic natively:", closeErr.message);
         }
     }
  } catch(e) {
     console.error("Помилка завершення", e);
  }
});

bot.action('leave_review', async (ctx) => {
   await db.updateSessionStatus(ctx.from.id, 'writing_review');
   await ctx.answerCbQuery();
   await ctx.editMessageText("Будь ласка, напишіть ваші враження від роботи з юристом (одним повідомленням):");
});

bot.action('go_home', async (ctx) => {
   await db.deleteSession(ctx.from.id);
   await ctx.answerCbQuery();
   ctx.reply("Виберіть категорію вашого питання:", getMainMenu());
});

bot.action(/delete_chat_(.+)/, async (ctx) => {
  const clientId = parseInt(ctx.match[1]);
  await ctx.answerCbQuery("Видалення...");
  
  try {
     const topicInfo = await db.getTopic(clientId);
     if (topicInfo && topicInfo.thread_id && process.env.ADMIN_CHAT_ID) {
         try {
            await ctx.telegram.deleteForumTopic(process.env.ADMIN_CHAT_ID, topicInfo.thread_id);
         } catch(delErr) {
            console.error("Could not delete forum topic natively:", delErr.message);
            await ctx.telegram.sendMessage(process.env.ADMIN_CHAT_ID, "❌ Помилка: У бота немає прав на видалення тем (Manage Topics).");
         }
     }
     await db.saveTopic(clientId, null);
  } catch(e) {
     console.error("Помилка видалення топіку", e);
  }
});

// Обробники оплати для клієнта
bot.action('payment_direct', async (ctx) => {
  const session = await db.getSession(ctx.from.id);
  if (!session) return ctx.answerCbQuery('Заявка не знайдена. Почніть з /start');
  
  await ctx.answerCbQuery();
  
  const paymentLink = 'https://send.monobank.ua/4gQ4hJwczZ';
  await db.updateSessionStatus(ctx.from.id, 'payment_selection');
  
  await ctx.editMessageText(
    `До сплати: *500 грн*. Ваша заявка готова до передачі юристу.\n\n` +
    `Після успішної оплати обов'язково завантажте квитанцію.`, 
    { 
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
      ...Markup.inlineKeyboard([
        [Markup.button.url('Відкрити посилання на оплату', paymentLink)],
        [Markup.button.callback('🧾 Надіслати квитанцію', 'send_receipt_prompt')]
      ])
    }
  );
});

bot.action('send_receipt_prompt', async (ctx) => {
  const session = await db.getSession(ctx.from.id);
  if (!session) return ctx.answerCbQuery('Заявка не знайдена.');
  
  await db.updateSessionStatus(ctx.from.id, 'awaiting_receipt');
  await ctx.answerCbQuery();
  
  await ctx.editMessageText("Будь ласка, надішліть фото квитанції або скриншот у цей чат прямо зараз 👇", {
     ...Markup.inlineKeyboard([
       [Markup.button.callback('🔙 Повернутися до реквізитів', 'go_back_to_payment')]
     ])
  });
});

bot.action('go_back_to_payment', async (ctx) => {
   const session = await db.getSession(ctx.from.id);
   if (!session) return ctx.answerCbQuery();
   
   await db.updateSessionStatus(ctx.from.id, 'payment_selection');
   
   const paymentLink = 'https://send.monobank.ua/4gQ4hJwczZ';
   let msg = `До сплати: *500 грн*. Ваша заявка готова до передачі юристу.\n\nПісля успішної оплати обов'язково завантажте квитанцію.`;
   if (session.extra) {
      const amount = session.amount || 500;
      msg = `⚖️ Для продовження роботи над вашою справою необхідна доплата.\n\nСума: *${amount} грн*.\n\nПісля успішної оплати завантажте квитанцію сюди.`;
   }
   
   await ctx.answerCbQuery();
   await ctx.editMessageText(msg, { 
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
      ...Markup.inlineKeyboard([
        [Markup.button.url('Відкрити посилання на оплату', paymentLink)],
        [Markup.button.callback('🧾 Надіслати квитанцію', 'send_receipt_prompt')]
      ])
   });
});


// Обробка текстових та мультимедійних повідомлень від клієнтів (The main funnel stream)
bot.on(['text', 'voice', 'photo', 'document', 'video'], async (ctx) => {
  // If it's a media group, dedup.
  if (ctx.message.media_group_id) {
     if (processedMediaGroups.has(ctx.message.media_group_id)) {
        return; // Silent ignore (dedup)
     }
     processedMediaGroups.add(ctx.message.media_group_id);
     setTimeout(() => processedMediaGroups.delete(ctx.message.media_group_id), 60000);
  }

  const session = await db.getSession(ctx.from.id);
  const topicRow = await db.getTopic(ctx.from.id);

  if (session && session.status === 'writing_review') {
      const adminChatId = process.env.ADMIN_CHAT_ID;
      if (adminChatId) {
          const username = ctx.from.username ? `@${ctx.from.username}` : ctx.from.first_name;
          let threadId = topicRow ? topicRow.thread_id : null;
          let targetThread = threadId ? { message_thread_id: threadId } : {};
          
          await ctx.telegram.sendMessage(
            adminChatId, 
            `#відгук від клієнта ${username} [ID: ${ctx.from.id}]:\n\n${ctx.message.text || '[Медіафайл]'}`,
            targetThread
          );
      }
      await db.deleteSession(ctx.from.id);
      return ctx.reply("Дякуємо за ваш відгук! Нам дуже приємно. 💙\n\nМожете повернутись на головну: /start");
  }
  
  if (session && session.status === 'awaiting_description') {
    // 2.3 Safe description recording. Just store the ID of the msg for forwarding later safely.
    await db.saveSession(ctx.from.id, { 
      ...session,
      status: 'payment_selection',
      receipt_msg_id: ctx.message.message_id 
    });
    
    // Крок 1. Буфер довіри (Імітація обробки)
    await ctx.sendChatAction('typing');
    await delay(2000);
    await ctx.reply(`✅ Матеріали отримано.\n\n> Система аналізує ваш запит та підбирає вільного фахівця з напрямку «${session.category}»...`, { parse_mode: 'HTML' });
    
    // Крок 2. Продаж цінності + Гарантія (Через 2 секунди)
    await ctx.sendChatAction('typing');
    await delay(2500);
    
    const invoiceText = `⚖️ <b>Юрист знайдений і готовий долучитися до чату!</b>

Платформа LegalClick працює за принципом фіксованого «Вхідного квитка». Вартість повноцінної консультації складає 500 грн.

<b>Що ви отримуєте після оплати:</b>
1️⃣ Прямий чат із профільним юристом без ліміту часу на розмову.
2️⃣ Детальний аналіз вашої ситуації та надісланих документів.
3️⃣ Чіткий алгоритм дій: що робити, куди звертатися, які є ризики.

🛡 <b>Гарантія безпеки:</b> Якщо після ознайомлення з матеріалами юрист побачить, що ми нічим не можемо допомогти у вашій ситуації — ми просто закриємо сесію і повернемо вам гроші.`;

    await ctx.reply(invoiceText, {
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard([
          [Markup.button.callback('💳 Сплатити', 'payment_direct')]
        ])
    });
    
  } else if (session && session.status === 'awaiting_receipt') {
     const adminChatId = process.env.ADMIN_CHAT_ID;
     if (!ctx.message.photo && !ctx.message.document) {
        return ctx.reply("Будь ласка, надішліть фото або скриншот квитанції.");
     }
     
     await db.updateSessionStatus(ctx.from.id, 'pending_admin_approval');
     await ctx.reply("Дякуємо! Квитанцію отримано. Очікуйте на підтвердження (зазвичай це займає кілька хвилин).");
     
     if (adminChatId) {
        const extraLabel = session.extra === 1 ? "ДОПЛАТА" : "НОВА ЗАЯВКА";
        const adminMsg = `💰 <b>Отримана квитанція про оплату! (${extraLabel})</b>\n` +
                         `<b>Клієнт:</b> ${ctx.from.first_name} (@${ctx.from.username || 'без_юзернейму'}) [ID: ${ctx.from.id}]\n` +
                         `<b>Категорія:</b> ${session.category}\n\n` +
                         `Перевірте квитанцію (нижче) та натисніть кнопку для підтвердження.`;
                         
        try {
           // Create a general alert block since topic logic happens after confirmation
           const sentReceipt = await ctx.telegram.copyMessage(adminChatId, ctx.from.id, ctx.message.message_id);
           await ctx.telegram.sendMessage(adminChatId, adminMsg, { 
             parse_mode: 'HTML',
             reply_to_message_id: sentReceipt.message_id,
             ...Markup.inlineKeyboard([
                [Markup.button.callback('✅ Підтвердити', `confirm_payment_${ctx.from.id}`)],
                [Markup.button.callback('❌ Відхилити', `reject_payment_${ctx.from.id}`)]
             ])
           });
        } catch (e) {
           console.error("Не вдалося відправити квитанцію адміну", e);
        }
     }
  } else if (session && (session.status === 'payment_selection' || session.status === 'pending_admin_approval')) {
     if (session.status === 'pending_admin_approval') {
        ctx.reply('Будь ласка, зачекайте підтвердження оплати адміністратором.');
     } else {
        ctx.reply('Будь ласка, завершiть оплату, щоб юрист міг розпочати роботу.');
     }
  } else {
     // User has an active consultation. Forward message safely.
     const topicRow = await db.getTopic(ctx.from.id);
     if (topicRow && topicRow.is_open === 1 && process.env.ADMIN_CHAT_ID) {
        try {
          await ctx.telegram.copyMessage(process.env.ADMIN_CHAT_ID, ctx.from.id, ctx.message.message_id, { message_thread_id: topicRow.thread_id });
        } catch (e) {
          console.error("Failed to forward client message to topic", e);
          if (e.message.includes('thread not found') || e.message.includes('message context to reply is not found')) {
             await db.saveTopic(ctx.from.id, null); // Clear dead topic mapping
             ctx.reply("⚠️ Зв'язок розірвано. Тема з юристом була видалена. Натисніть /start.");
          }
        }
     } else {
        ctx.reply('Будь ласка, скористайтесь меню для вибору послуги. Натисніть /start, щоб почати.');
     }
  }
});

// Global Error Boundary (PM2 safe)
bot.catch((err, ctx) => {
  console.error(`[Error Boundary] Ошибка ${ctx.updateType}:`, err.message);
});

// Ініціалізація БД та запуск
db.initDB().then(() => {
  
  // 3.1 Таймаут очікування оплати (CRON using DB timestamps)
  setInterval(async () => {
    try {
      // 30 minutes timeout for receipts over strict status
      const oldSessions = await db.getOldSessions(30);
      for (const session of oldSessions) {
         try {
           await bot.telegram.sendMessage(session.user_id, "⏳ Час очікування оплати минув (30 хв). Заявку автоматично скасовано для зручності.\n\nЩоб почати знову, натисніть /start");
         } catch(e) {
           console.error("Cannot timeout user", e.message);
         }
         await db.deleteSession(session.user_id);
      }
    } catch (err) {
      console.error("Timeout cleanup failed:", err);
    }
  }, 5 * 60 * 1000); // Check every 5 minutes

  // 3.2 Follow-Up Cron
  setInterval(async () => {
    try {
      const pending = await db.getPendingFollowups();
      for (const topic of pending) {
         try {
           await bot.telegram.sendMessage(topic.client_chat_id, "Чи залишилися у вас додаткові питання по виконаній справі?\n\nЯкщо так, просто виберіть послугу: /start для нової заявки.");
           await db.markFollowupSent(topic.client_chat_id);
         } catch(e) {
           console.error("Cannot send follow-up", e.message);
         }
      }
    } catch(err) {
      console.error("Follow-up cron failed:", err);
    }
  }, 60 * 60 * 1000); // Check every 1 hour

  bot.launch().then(() => {
    console.log('Бот LegalClick успішно запущений (з SQLite, Anti-Fail & Вдосконаленим Топіком)!');
  });

}).catch(err => {
  console.error("Помилка ініціалізації бази даних:", err);
});

// Graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
