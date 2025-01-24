import { parseError } from '@repo/observability/error';
import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';

export * from "class-variance-authority";

export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));

export const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const handleError = (error: unknown): void => {
  const message = parseError(error);

  toast.error(message);
};

export const URLRegex = new RegExp(/^https?:\/\/.*/);

export function getDomainFromURL(url: string) {
  if (!URLRegex.test(url)) {
    return url;
  }
  const u = new URL(url);

  return u.host;
}

export function getSubdomain(name: string, apex: string) {
  if (name === apex) return null;

  return name.split(`.${apex}`)[0];
}
