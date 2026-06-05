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

// Deep link map: ?start=<key> → immediate subcategory routing from website
const DEEP_LINK_MAP = {
  vlk:           { categoryId: 'military', subcategoryId: 'ВЛК_МСЕК' },
  mobilizatsiya: { categoryId: 'military', subcategoryId: 'Мобілізація' },
  zvilnennya:    { categoryId: 'military', subcategoryId: 'Звільнення' },
  perevedennya:  { categoryId: 'military', subcategoryId: 'Переведення' },
  vyplaty:       { categoryId: 'military', subcategoryId: 'Виплати' },
  zvilneni:      { categoryId: 'military', subcategoryId: 'Звільнені_виплати' },
  simeyni:       { categoryId: 'military', subcategoryId: 'Сімейні_військ' },
  pdr:           { categoryId: 'admin_offenses', subcategoryId: 'Дорожній_рух' },
  oskarjennya:   { categoryId: 'admin_offenses', subcategoryId: 'Оскарження_постанов' },
  spory:         { categoryId: 'admin_offenses', subcategoryId: 'Спори_з_владою' },
  viysk_admin:   { categoryId: 'admin_offenses', subcategoryId: 'Військові_адмін' },
};

module.exports = { SUBCATEGORIES, CAT_ID_BY_NAME, DEEP_LINK_MAP };
