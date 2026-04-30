export default {
  name: 'faqItem',
  title: 'FAQ Item',
  type: 'document',
  fields: [
    { name: 'question', title: 'Питання', type: 'string', validation: (R) => R.required() },
    { name: 'answer', title: 'Відповідь', type: 'text', rows: 4, validation: (R) => R.required() },
    { name: 'order', title: 'Порядок', type: 'number' },
  ],
  preview: { select: { title: 'question' } },
};
