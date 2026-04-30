import { SINGLETON_IDS } from './schemas/index.js';

export const structure = (S) =>
  S.list()
    .title('LegalClick CMS')
    .items([
      S.listItem()
        .title('Налаштування')
        .child(
          S.list()
            .title('Налаштування')
            .items([
              S.listItem()
                .title('Налаштування сайту')
                .id('siteConfig')
                .child(
                  S.document()
                    .schemaType('siteConfig')
                    .documentId(SINGLETON_IDS.siteConfig)
                    .title('Налаштування сайту'),
                ),
              S.listItem()
                .title('Навігація')
                .id('navigation')
                .child(
                  S.document()
                    .schemaType('navigation')
                    .documentId(SINGLETON_IDS.navigation)
                    .title('Навігація'),
                ),
            ]),
        ),
      S.divider(),
      S.listItem()
        .title('Сторінки')
        .child(
          S.list()
            .title('Сторінки')
            .items([
              S.listItem()
                .title('Головна сторінка')
                .id('homePage')
                .child(
                  S.document()
                    .schemaType('homePage')
                    .documentId(SINGLETON_IDS.homePage)
                    .title('Головна сторінка'),
                ),
              S.documentTypeListItem('servicePage').title('Сторінки послуг'),
              S.listItem()
                .title('Сторінка 404')
                .id('notFoundPage')
                .child(
                  S.document()
                    .schemaType('notFoundPage')
                    .documentId(SINGLETON_IDS.notFoundPage)
                    .title('Сторінка 404'),
                ),
            ]),
        ),
      S.divider(),
      S.listItem()
        .title('Контент-блоки')
        .child(
          S.list()
            .title('Контент-блоки')
            .items([
              S.documentTypeListItem('faqItem').title('FAQ'),
              S.documentTypeListItem('review').title('Відгуки'),
            ]),
        ),
    ]);
