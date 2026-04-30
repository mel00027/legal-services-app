import { ICON_LIST } from './shared/iconList.js';

export default {
  name: 'navigation',
  title: 'Навігація',
  type: 'document',
  fields: [
    {
      name: 'brand',
      title: 'Бренд',
      type: 'object',
      fields: [
        { name: 'name', title: "Ім'я бренду (перша частина)", type: 'string' },
        { name: 'accentName', title: 'Акцент (друга частина)', type: 'string' },
      ],
    },
    {
      name: 'desktopLinks',
      title: 'Меню (desktop)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Підпис', type: 'string' },
            { name: 'target', title: 'Якір/маршрут (id або /path)', type: 'string' },
          ],
          preview: { select: { title: 'label', subtitle: 'target' } },
        },
      ],
    },
    {
      name: 'mobileTabs',
      title: 'Нижня панель (mobile)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Підпис', type: 'string' },
            { name: 'target', title: 'Якір/маршрут', type: 'string' },
            { name: 'iconName', title: 'Іконка', type: 'string', options: { list: ICON_LIST } },
          ],
          preview: { select: { title: 'label', subtitle: 'target' } },
        },
      ],
    },
    {
      name: 'footerLinks',
      title: 'Посилання у footer',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Підпис', type: 'string' },
            { name: 'href', title: 'URL або /path', type: 'string' },
          ],
          preview: { select: { title: 'label', subtitle: 'href' } },
        },
      ],
    },
  ],
  preview: { prepare: () => ({ title: 'Навігація сайту' }) },
};
