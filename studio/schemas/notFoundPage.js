export default {
  name: 'notFoundPage',
  title: 'Сторінка 404',
  type: 'document',
  fields: [
    { name: 'badge', title: 'Бейдж', type: 'string' },
    { name: 'heading', title: 'Заголовок', type: 'string' },
    { name: 'description', title: 'Опис', type: 'text', rows: 3 },
    { name: 'primaryCtaLabel', title: 'Основна кнопка', type: 'string' },
    { name: 'secondaryCtaLabel', title: 'Другорядна кнопка', type: 'string' },
    { name: 'helperText', title: 'Допоміжний текст', type: 'string' },
  ],
  preview: { prepare: () => ({ title: 'Сторінка 404' }) },
};
