'use strict';

const { Markup } = require('telegraf');
const { SUBCATEGORIES } = require('./categories');
const { MONOBANK_PAYMENT_LINK } = require('../config');

const mainMenu = () => Markup.inlineKeyboard([
  [Markup.button.callback('🛡 Військове право', 'category_military')],
  [Markup.button.callback('🏠 Житлове право', 'category_housing')],
  [Markup.button.callback('⚖️ Адмін. правопорушення', 'category_admin_offenses')],
  [Markup.button.callback('❓ Типові запитання (FAQ)', 'show_faq')]
]);

const faqReplyMarkup = () => ({
  inline_keyboard: [[{ text: '⬅️ Назад у меню', callback_data: 'back_to_menu' }]]
});

const subcategoryKeyboard = (categoryId) => {
  const catData = SUBCATEGORIES[categoryId];
  if (!catData) return null;
  const rows = [];
  for (let i = 0; i < catData.items.length; i += 2) {
    const row = [Markup.button.callback(catData.items[i].label, `subcategory_${catData.items[i].id}`)];
    if (catData.items[i + 1]) {
      row.push(Markup.button.callback(catData.items[i + 1].label, `subcategory_${catData.items[i + 1].id}`));
    }
    rows.push(row);
  }
  rows.push([Markup.button.callback('⬅️ Назад у меню', 'back_to_menu')]);
  return Markup.inlineKeyboard(rows);
};

const serviceTypeKeyboard = () => Markup.inlineKeyboard([
  [Markup.button.callback('📋 Покроковий план дій', 'service_type_plan')],
  [Markup.button.callback('🤝 Супровід на всіх етапах', 'service_type_support')],
  [Markup.button.callback('📝 Скласти документ / позов', 'service_type_document')],
  [Markup.button.callback('⬅️ Назад (змінити опис)', 'back_to_description')]
]);

const paymentKeyboard = () => Markup.inlineKeyboard([
  [Markup.button.url('💳 Перейти до оплати', MONOBANK_PAYMENT_LINK)],
  [Markup.button.callback('🧾 Надіслати квитанцію', 'send_receipt_prompt')]
]);

const receiptOnlyKeyboard = () => Markup.inlineKeyboard([
  [Markup.button.callback('🧾 Надіслати квитанцію', 'send_receipt_prompt')]
]);

const caseActionsKeyboard = (clientId) => Markup.inlineKeyboard([
  [Markup.button.callback('✅ Взяти справу', `take_case_${clientId}`)],
  [Markup.button.callback('❌ Відхилити (немає фахівця)', `reject_case_${clientId}`)],
  [Markup.button.callback('⛔️ Відхилити (неможливо вирішити)', `reject_unsolv_${clientId}`)]
]);

const confirmPaymentKeyboard = (clientId) => Markup.inlineKeyboard([
  [Markup.button.callback('✅ Підтвердити', `confirm_payment_${clientId}`)],
  [Markup.button.callback('❌ Відхилити', `reject_payment_${clientId}`)]
]);

const topicActionsKeyboard = (clientId) => Markup.inlineKeyboard([
  [Markup.button.callback('💰 Доплата', `req_pay_${clientId}`), Markup.button.callback('✅ Завершити', `close_chat_${clientId}`)],
  [Markup.button.callback('🗑 Видалити діалог', `delete_chat_${clientId}`)]
]);

const reviewEndKeyboard = () => Markup.inlineKeyboard([
  [Markup.button.callback('⭐️ Залишити відгук', 'leave_review')],
  [Markup.button.callback('🏠 На головну', 'go_home')]
]);

const backToPaymentKeyboard = () => Markup.inlineKeyboard([
  [Markup.button.callback('🔙 Повернутися до реквізитів', 'go_back_to_payment')]
]);

module.exports = {
  mainMenu,
  faqReplyMarkup,
  subcategoryKeyboard,
  serviceTypeKeyboard,
  paymentKeyboard,
  receiptOnlyKeyboard,
  caseActionsKeyboard,
  confirmPaymentKeyboard,
  topicActionsKeyboard,
  reviewEndKeyboard,
  backToPaymentKeyboard,
};
