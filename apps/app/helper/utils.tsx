import type { TChatMessage, TChatSession } from '@/types';
import type { articles, projects } from '@repo/backend/schema';
import moment from 'moment';
import { customAlphabet } from 'nanoid';
import { format } from 'date-fns';


export type Article = typeof articles.$inferSelect;
export type Project = typeof projects.$inferSelect;
export const getRelativeDate = (date: string | Date) => {
  const today = moment().startOf('day');
  const inputDate = moment(date).startOf('day');
  const diffDays = today.diff(inputDate, 'days');
  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else {
    return inputDate.format('DD/MM/YYYY');
  }
};

export function formatNumber(number: number) {
  if (number >= 1000000) {
    return (number / 1000000).toFixed(0) + 'M';
  } else if (number >= 1000) {
    return (number / 1000).toFixed(0) + 'K';
  } else {
    return number.toString();
  }
}

export function removeExtraSpaces(str?: string) {
  str = str?.trim();
  str = str?.replace(/\n{3,}/g, '\n\n');
  return str;
}

export const sortSessions = (
  sessions: TChatSession[],
  sortBy: 'createdAt' | 'updatedAt'
) => {
  return sessions.sort((a, b) => moment(b[sortBy]).diff(moment(a[sortBy])));
};

export const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const sortMessages = (
  messages: Partial<TChatMessage>[],
  sortBy: 'createdAt'
) => {
  return messages.sort((a, b) => moment(a[sortBy]).diff(moment(b[sortBy])));
};

export const convertFileToBase64 = (
  file: File,
  onChange: (base64: string) => void
): void => {
  if (!file) {
    alert('Please select a file!');
    return;
  }
  const reader = new FileReader();
  reader.onload = (event: ProgressEvent<FileReader>) => {
    const base64String = event.target?.result as string;
    onChange(base64String);
  };
  reader.onerror = (error: ProgressEvent<FileReader>) => {
    console.error('Error: ', error);
    alert('Error reading file!');
  };
  reader.readAsDataURL(file);
};

export function generateShortUUID() {
  const nanoid = customAlphabet('1234567890abcdef', 12);
  return nanoid();
}

export function generateAndDownloadJson(data: any, filename: string) {
  const json = JSON.stringify(data);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

export function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export async function imageUrlToBase64(imageUrl: string): Promise<string> {
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      const base64Url = `data:${response.headers.get('Content-Type')};base64,${
        base64String.split(',')[1]
      }`;
      resolve(base64Url);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(blob);
  });
}

export const formatTickerTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export function sortArticles(articles: Article[], published?: string) {
  return articles
    .filter((a) => (published ? a.published!.toString() === published : a))
    .sort((a, b) => Number(b.published) - Number(a.published));
}

export function sortProjects(projects: Project[], published?: string) {
  return projects
    .filter((p) => (published ? p.published!.toString() === published : p))
    .sort((a, b) => Number(b.published) - Number(a.published));
}

export function getSearchParams(url: string) {
  const params = Object.fromEntries(new URL(url).searchParams.entries());
  return params;
}

export function jsonToFrontmatter(jsonData: object) {
  const frontmatter = Object.entries(jsonData)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return `${key}:\n  - ${value.join("\n  - ")}`;
      }
      return `${key}: ${value}`;
    })
    .join("\n");

  return `---\n${frontmatter}\n---\n\n`;
}

export function formatVerboseDate(date: Date) {
  return format(date, "PPPPpppp");
}


export async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<JSON> {
  const res = await fetch(input, init);

  if (!res.ok) {
    const error = await res.text();
    const err = new Error(error) as any;
    err.status = res.status;
    throw err;
  }

  return res.json();
}

export const validDomainRegex = new RegExp(
  /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/,
);
