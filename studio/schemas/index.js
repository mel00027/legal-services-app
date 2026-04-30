import faqItem from './faqItem.js';
import review from './review.js';
import servicePage from './servicePage.js';
import siteConfig from './siteConfig.js';
import homePage from './homePage.js';
import navigation from './navigation.js';
import notFoundPage from './notFoundPage.js';

export const schemaTypes = [
  siteConfig,
  navigation,
  homePage,
  servicePage,
  notFoundPage,
  faqItem,
  review,
];

export const SINGLETON_TYPES = new Set([
  'siteConfig',
  'navigation',
  'homePage',
  'notFoundPage',
]);

export const SINGLETON_IDS = {
  siteConfig: 'siteConfig',
  navigation: 'navigation',
  homePage: 'homePage',
  notFoundPage: 'notFoundPage',
};
