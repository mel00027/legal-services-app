import { ICON_LIST } from './shared/iconList.js';
import { GRADIENT_LIST } from './shared/gradientList.js';

export default {
  name: 'homePage',
  title: 'Головна сторінка',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero блок' },
    { name: 'chat', title: 'Демо-чат' },
    { name: 'services', title: 'Послуги' },
    { name: 'advantages', title: 'Переваги' },
    { name: 'process', title: 'Як це працює' },
    { name: 'stats', title: 'Статистика' },
    { name: 'trust', title: 'Довіра' },
    { name: 'footerCta', title: 'Footer CTA' },
  ],
  fields: [
    {
      name: 'hero',
      title: 'Hero',
      type: 'object',
      group: 'hero',
      fields: [
        { name: 'titleStart', title: 'Початок заголовка', type: 'string' },
        { name: 'titleGradient', title: 'Виділений (gradient) текст', type: 'string' },
        { name: 'titleEnd', title: 'Закінчення заголовка', type: 'string' },
        { name: 'subtitle', title: 'Підзаголовок', type: 'text', rows: 2 },
        { name: 'ctaLabel', title: 'Текст основної кнопки', type: 'string' },
        { name: 'secondaryCtaLabel', title: 'Текст другорядної кнопки', type: 'string' },
      ],
    },
    {
      name: 'chatMessages',
      title: 'Повідомлення в демо-чаті',
      type: 'array',
      group: 'chat',
      of: [
        {
          type: 'object',
          fields: [{ name: 'text', title: 'Текст', type: 'text', rows: 3 }],
          preview: { select: { title: 'text' } },
        },
      ],
    },
    {
      name: 'serviceCards',
      title: 'Картки послуг',
      type: 'array',
      group: 'services',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Назва', type: 'string' },
            { name: 'iconName', title: 'Іконка', type: 'string', options: { list: ICON_LIST } },
            { name: 'gradient', title: 'Градієнт', type: 'string', options: { list: GRADIENT_LIST } },
            { name: 'path', title: 'Посилання (path)', type: 'string' },
          ],
          preview: { select: { title: 'name', subtitle: 'path' } },
        },
      ],
    },
    {
      name: 'advantages',
      title: 'Переваги',
      type: 'array',
      group: 'advantages',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'iconName', title: 'Іконка', type: 'string', options: { list: ICON_LIST } },
            { name: 'gradient', title: 'Градієнт', type: 'string', options: { list: GRADIENT_LIST } },
            { name: 'title', title: 'Заголовок', type: 'string' },
            { name: 'items', title: 'Пункти списку', type: 'array', of: [{ type: 'string' }] },
          ],
          preview: { select: { title: 'title' } },
        },
      ],
    },
    {
      name: 'howItWorks',
      title: 'Кроки "Як це працює"',
      type: 'array',
      group: 'process',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'number', title: 'Номер', type: 'string' },
            { name: 'title', title: 'Заголовок', type: 'string' },
            { name: 'desc', title: 'Опис', type: 'text', rows: 2 },
            { name: 'accent', title: 'Виділити (фінальний крок)', type: 'boolean' },
          ],
          preview: { select: { title: 'title', subtitle: 'number' } },
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
      name: 'trustCard',
      title: 'Картка з відгуком (Trust)',
      type: 'object',
      group: 'trust',
      fields: [
        { name: 'authorName', title: "Ім'я автора", type: 'string' },
        { name: 'quote', title: 'Текст консультації', type: 'text', rows: 3 },
        {
          name: 'reply',
          title: 'Відповідь юриста',
          type: 'array',
          of: [{ type: 'string' }],
        },
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
  ],
  preview: { prepare: () => ({ title: 'Головна сторінка' }) },
};
