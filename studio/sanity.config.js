import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { presentationTool } from 'sanity/presentation';
import { schemaTypes, SINGLETON_TYPES } from './schemas/index.js';
import { structure } from './structure.js';

const PREVIEW_URL = process.env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:5173';

export default defineConfig({
  name: 'legalclick',
  title: 'LegalClick CMS',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',

  plugins: [
    structureTool({ structure }),
    presentationTool({
      previewUrl: { origin: PREVIEW_URL },
    }),
  ],

  schema: { types: schemaTypes },

  document: {
    actions: (input, context) =>
      SINGLETON_TYPES.has(context.schemaType)
        ? input.filter(({ action }) => !['duplicate', 'delete', 'unpublish'].includes(action))
        : input,
    newDocumentOptions: (prev, { creationContext }) => {
      if (creationContext.type === 'global') {
        return prev.filter((tpl) => !SINGLETON_TYPES.has(tpl.templateId));
      }
      return prev;
    },
  },
});
