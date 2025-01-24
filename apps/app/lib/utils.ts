import { NextRequest } from "next/server";
import { siteConfig } from "@/config/site";
import type { Metadata } from "next";

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function detectBot(req: NextRequest) {
  const url = req.nextUrl;
  if (url.searchParams.get("bot")) return true;
  const ua = req.headers.get("User-Agent");
  if (ua) {
    return /bot|chatgpt|facebookexternalhit|WhatsApp|google|baidu|bing|msn|duckduckbot|teoma|slurp|yandex|MetaInspector/i.test(
      ua,
    );
  }
  return false;
}

export function getInitials(input: string): string {
  const splitted = input.split(" ");
  const [first, last] =
    splitted?.length > 1
      ? [splitted[0].charAt(0), splitted[1].charAt(0)]
      : [input[0], input.at(-1)];
  return `${first + last}`.toLocaleUpperCase();
}

export function generateSEO({
  title = siteConfig.name,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  siteName = siteConfig.name,
  seoTitle = siteConfig.name,
  icons = {
    shortcut: [
      {
        media: "(prefers-color-scheme: light)",
        rel: "icon",
        type: "image/x-icon",
        url: "/favicon-light.ico",
        href: "/favicon-light.ico",
      },
      {
        media: "(prefers-color-scheme: dark)",
        rel: "icon",
        type: "image/x-icon",
        url: "/favicon.ico",
        href: "/favicon.ico",
      },
    ],
    icon: [
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        url: "/favicon-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        url: "/favicon-16x16.png",
      },
    ],
    apple: [
      {
        rel: "apple-touch-icon",
        sizes: "32x32",
        url: "/apple-touch-icon.png",
      },
    ],
  },
  url = siteConfig.url,
  template,
  noIndex = false,
  canonicalURL,
  feeds,
}: {
  title?: string;
  template?: string | null;
  description?: string;
  seoTitle?: string;
  image?: string;
  siteName?: string;
  icons?: Metadata["icons"];
  url?: string;
  noIndex?: boolean;
  canonicalURL?: string;
  feeds?: {
    rss: string;
    atom: string;
  };
} = {}): Metadata {
  return {
    ...(template
      ? {
          title: {
            default: title,
            template: template ? `%s / ${template}` : "",
          },
        }
      : {
          title,
        }),
    description,
    openGraph: {
      type: "website",
      locale: "en_US",
      title: seoTitle || title,
      description,
      images: [
        {
          url: image,
        },
      ],
      siteName,
      url,
    },
    twitter: {
      title: seoTitle || title,
      description,
      card: "summary_large_image",
      images: [
        {
          url: image,
        },
      ],
    },
    icons,
    metadataBase: url
      ? new URL(url)
      : new URL(`https://${process.env.NEXT_PUBLIC_APP_DOMAIN as string}`),
    alternates: {
      canonical: canonicalURL || url,
      ...(feeds && {
        types: {
          "application/rss+xml": [
            {
              title: "RSS Feed",
              url: feeds.rss,
            },
          ],
          "application/atom+xml": [
            {
              title: "Atom Feed",
              url: feeds.atom,
            },
          ],
        },
      }),
    },
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}