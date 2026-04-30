export default {
  name: 'review',
  title: 'Відгук',
  type: 'document',
  fields: [
    { name: 'name', title: 'Ім\'я', type: 'string', validation: (R) => R.required() },
    { name: 'role', title: 'Роль / місто', type: 'string' },
    { name: 'text', title: 'Текст відгуку', type: 'text', rows: 4, validation: (R) => R.required() },
    { name: 'stars', title: 'Зірки', type: 'number', validation: (R) => R.required().min(1).max(5) },
    { name: 'order', title: 'Порядок', type: 'number' },
  ],
  preview: { select: { title: 'name', subtitle: 'role' } },
};
