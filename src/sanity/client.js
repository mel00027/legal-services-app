import { createClient } from '@sanity/client';

const inIframe = typeof window !== 'undefined' && window.self !== window.top;

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || 'placeholder';
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production';
const previewToken = import.meta.env.VITE_SANITY_PREVIEW_TOKEN;

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: '2024-10-01',
  useCdn: !inIframe,
  perspective: inIframe ? 'previewDrafts' : 'published',
  stega: { enabled: inIframe, studioUrl: '/studio' },
  ...(inIframe && previewToken ? { token: previewToken, withCredentials: true } : {}),
});

export const isPreview = inIframe;
