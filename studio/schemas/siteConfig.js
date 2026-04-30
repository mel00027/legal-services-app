export default {
  name: 'siteConfig',
  title: 'Налаштування сайту',
  type: 'document',
  groups: [
    { name: 'global', title: 'Глобальні' },
    { name: 'pricing', title: 'Тариф' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    { name: 'botLink', title: 'Посилання на бот', type: 'url', group: 'global', validation: (R) => R.uri({ scheme: ['https'] }) },
    { name: 'pricingAmount', title: 'Сума консультації (грн)', type: 'number', group: 'pricing' },
    { name: 'pricingTitle', title: 'Заголовок тарифу', type: 'string', group: 'pricing' },
    { name: 'pricingHeadingStart', title: 'Заголовок секції тарифу — початок', type: 'string', group: 'pricing' },
    { name: 'pricingHeadingGradient', title: 'Заголовок — gradient частина', type: 'string', group: 'pricing' },
    { name: 'pricingDisclaimer', title: 'Дрібний текст внизу тарифу', type: 'text', rows: 2, group: 'pricing' },
    { name: 'pricingCtaLabel', title: 'Текст кнопки тарифу', type: 'string', group: 'pricing' },
    {
      name: 'pricingFeatures',
      title: 'Що включено в тариф',
      type: 'array',
      group: 'pricing',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Назва пункту', type: 'string' },
            { name: 'desc', title: 'Опис пункту', type: 'string' },
          ],
          preview: { select: { title: 'label' } },
        },
      ],
    },
    {
      name: 'seoDefaults',
      title: 'SEO за замовчуванням',
      type: 'object',
      group: 'seo',
      fields: [
        { name: 'title', title: 'Title', type: 'string' },
        { name: 'description', title: 'Meta description', type: 'text', rows: 2 },
      ],
    },
  ],
  preview: { prepare: () => ({ title: 'Налаштування сайту' }) },
};
