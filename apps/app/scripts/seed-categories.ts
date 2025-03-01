import { database } from '@repo/backend/database'; // Comment "server-only" in database.ts to run this script
import { categories } from '@repo/backend/schema';

const categoryNames = [
  'Cars and vehicles',
  'Comedy',
  'Education',
  'Gaming',
  'Entertainment',
  'Film and animation',
  'How-to and style',
  'Music',
  'News and politics',
  'People and blogs',
  'Pets and animals',
  'Science and technology',
  'Sports',
  'Travel and events',
];

async function main() {
  console.log('Seeding categories...');

  try {
    const values = categoryNames.map((name) => ({
      name,
      description: `Videos related to ${name.toLowerCase()}`,
    }));

    await database.insert(categories).values(values);
    console.log('Categories seeded successfully');
    process.exit(1);
  } catch (error) {
    console.error('Error seeding categories', error);
    process.exit(1);
  }
}

main();
