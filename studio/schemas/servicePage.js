import { ICON_LIST } from './shared/iconList.js';
import { GRADIENT_LIST } from './shared/gradientList.js';

export default {
  name: 'servicePage',
  title: 'Сторінка послуги',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero' },
    { name: 'services', title: 'Послуги' },
    { name: 'stats', title: 'Статистика' },
    { name: 'expertise', title: 'Експертиза' },
    { name: 'footerCta', title: 'Footer CTA' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    { name: 'title', title: 'Назва (для адмінки)', type: 'string', validation: (R) => R.required() },
    {
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: { source: 'title' },
      validation: (R) => R.required(),
    },
    {
      name: 'hero',
      title: 'Hero',
      type: 'object',
      group: 'hero',
      fields: [
        { name: 'badgeIconName', title: 'Іконка бейджа', type: 'string', options: { list: ICON_LIST } },
        { name: 'badge', title: 'Текст бейджа', type: 'string' },
        { name: 'titleStart', title: 'Початок заголовка', type: 'string' },
        { name: 'titleGradient', title: 'Виділений (gradient) текст', type: 'string' },
        { name: 'titleEnd', title: 'Закінчення заголовка', type: 'string' },
        { name: 'gradient', title: 'Колір градієнта', type: 'string', options: { list: GRADIENT_LIST } },
        { name: 'subtitle', title: 'Підзаголовок', type: 'text', rows: 2 },
        { name: 'ctaLabel', title: 'Текст кнопки', type: 'string' },
      ],
    },
    {
      name: 'services',
      title: 'Послуги',
      type: 'array',
      group: 'services',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Назва', type: 'string' },
            { name: 'desc', title: 'Опис', type: 'text', rows: 2 },
            { name: 'iconName', title: 'Іконка', type: 'string', options: { list: ICON_LIST } },
            { name: 'gradient', title: 'Градієнт', type: 'string', options: { list: GRADIENT_LIST } },
          ],
          preview: { select: { title: 'title' } },
        },
      ],
    },
    {
      name: 'stats',
      title: 'Статистика',
      type: 'array',
      group: 'stats',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'value', title: 'Значення', type: 'string' },
            { name: 'label', title: 'Підпис', type: 'string' },
          ],
          preview: { select: { title: 'value', subtitle: 'label' } },
        },
      ],
    },
    {
      name: 'expertise',
      title: 'Експертиза',
      type: 'object',
      group: 'expertise',
      fields: [
        { name: 'heading', title: 'Заголовок секції', type: 'string' },
        { name: 'description', title: 'Опис', type: 'text', rows: 4 },
      ],
    },
    {
      name: 'footerCta',
      title: 'Футерний CTA',
      type: 'object',
      group: 'footerCta',
      fields: [
        { name: 'heading', title: 'Заголовок', type: 'string' },
        { name: 'subtitle', title: 'Підзаголовок', type: 'text', rows: 2 },
        { name: 'buttonLabel', title: 'Кнопка', type: 'string' },
      ],
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'object',
      group: 'seo',
      fields: [
        { name: 'title', title: 'Document title', type: 'string' },
        { name: 'description', title: 'Meta description', type: 'text', rows: 2 },
      ],
    },
  ],
  preview: { select: { title: 'title', subtitle: 'slug.current' } },
};
