import createSlug from 'slugify';
import slug from 'slugify';

export const slugify = (text: string): string =>
  createSlug(text, { lower: true, strict: true });

export const slugifyLax = (text: string): string =>
  createSlug(text, {
    lower: true,
    strict: false,
    trim: false,
    remove: /@/g,
  });

export function slugifyv2(title?: string) {
  if (title) {
    return slug(title, {
      strict: true,
      lower: true,
    });
  }

  return undefined;
}
