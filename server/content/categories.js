'use strict';

const SUBCATEGORIES = {
  military: {
    name: 'Захист прав військовослужбовців',
    items: [
      { label: '🏥 ВЛК / МСЕК', id: 'ВЛК_МСЕК' },
      { label: '🪖 Мобілізація', id: 'Мобілізація' },
      { label: '📝 Звільнення', id: 'Звільнення' },
      { label: '🔄 Переведення', id: 'Переведення' },
      { label: '💸 Виплати', id: 'Виплати' },
      { label: '🤝 Для звільнених', id: 'Звільнені_виплати' },
      { label: '👨‍👩‍👧 Сімейні', id: 'Сімейні_військ' }
    ]
  },
  admin_offenses: {
    name: 'Адміністративні правопорушення',
    items: [
      { label: '🚦 Дорожній рух', id: 'Дорожній_рух' },
      { label: '⚖️ Оскарження постанов', id: 'Оскарження_постанов' },
      { label: '🏛 Спори з владою', id: 'Спори_з_владою' },
      { label: '🛡 Військові адмін.', id: 'Військові_адмін' }
    ]
  }
};

const CAT_ID_BY_NAME = Object.fromEntries(
  Object.entries(SUBCATEGORIES).map(([id, data]) => [data.name, id])
);

module.exports = { SUBCATEGORIES, CAT_ID_BY_NAME };
