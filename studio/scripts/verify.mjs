import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '0lhvfdje',
  dataset: 'production',
  apiVersion: '2024-10-01',
  useCdn: false,
});

// Check all document IDs
const all = await client.fetch('*[_id in ["servicePage.military-lawyer","servicePage.housing-law","servicePage.administrative-offences"]]{_id, _type, title}');
console.log('By exact ID:', JSON.stringify(all, null, 2));

// Check by type
const byType = await client.fetch('*[_type == "servicePage"]{_id, _type, title}');
console.log('By type:', JSON.stringify(byType, null, 2));

// Check all docs
const count = await client.fetch('count(*)');
console.log('Total documents:', count);
