import Track from "@/app/(organization)/minime/components/analytics/track";
import Command from "@/app/(organization)/minime/components/layout/user-page-command";
import { currentUser, getUserByDomain } from "@repo/backend/auth/utils";
import { generateSEO } from "@/lib/utils";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type React from "react";
import Watermark from "@/app/(user)/user/[domain]/components/watermark";
import { getUserName } from "@repo/backend/auth/format";

interface LayoutProps {
  children: React.ReactNode;
  params: {
    domain: string;
  };
}

export async function generateMetadata({
  params,
}: LayoutProps): Promise<Metadata | null> {
  const { domain } = await params;
//   const domain_decoded = decodeURIComponent(domain);
//   const user = await getUserByDomain(domain_decoded);
  const user = await currentUser();
  if (!user) {
    return notFound();
  }
  const title = getUserName(user) || user.user_metadata.username;
  const url = user.user_metadata.domain
    ? `https://${user.user_metadata.domain}`
    : `https://${user.user_metadata.username}.${process.env.NEXT_PUBLIC_USER_DOMAIN}`;
  return generateSEO({
    title,
    template: title,
    seoTitle: user.user_metadata.seoTitle || undefined,
    description: user.user_metadata.seoDescription || undefined,
    image:
      user.user_metadata.ogImage ||
      `https://openstudio.tech/api/og/user?username=${user.user_metadata.username}`,
    icons: user.user_metadata.image_url && [user?.user_metadata.image_url as string],
    url,
    feeds: {
      rss: `${url}/feed`,
      atom: `${url}/feed?type=atom`,
    },
  });
}

export default async function UserLayout({ children, params }: LayoutProps) {
  const {domain} = await params
//   const domain_decoded = decodeURIComponent(domain);
//   const user = await getUserByDomain(domain_decoded);
  const user = await currentUser();
  if (!user) {
    return notFound();
  }
  return (
    <div className="mx-auto flex min-h-screen w-[700px] flex-col  max-md:w-full py-20 max-md:pt-10 max-md:px-4 ">
      <main className="w-full flex-1">{children}</main>
      <Command user={user} />
      <Track />
      <Watermark user={user} />
    </div>
  );
}
