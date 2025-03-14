'use client';

import type { User } from '@repo/backend/auth';
import { redirect, useRouter } from 'next/navigation';

import { SidebarHistory } from '@/app/(organization)/artifacts/components/v2/sidebar-history';
import { env } from '@/env';
import { isPremium } from '@/lib/utils/premium';
import { trpc } from '@/trpc/client';
import { Button } from '@repo/design-system/components/ui/button';
import { PlusIcon } from '@repo/design-system/components/ui/icons';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  useSidebar,
} from '@repo/design-system/components/ui/sidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@repo/design-system/components/ui/tooltip';
import Link from 'next/link';

export function AppSidebar({ user }: { user: User | undefined }) {
  const router = useRouter();
  const { setOpenMobile } = useSidebar();

  //TODO: For Testing, this is commented out, later we will uncomment this and redirect to the welcome-upgrade page if the user is not premium
  const [data] = trpc.user.getPremium.useSuspenseQuery();
  const premium = !!(
    data?.premium && isPremium(data.premium.lemon_squeezy_renews_at)
  );

  if (env.NEXT_PUBLIC_WELCOME_UPGRADE_ENABLED && !premium) {
    redirect('/welcome-upgrade');
  }

  return (
    <Sidebar className="group-data-[side=left]:border-r-0">
      <SidebarHeader>
        <SidebarMenu>
          <div className="flex flex-row items-center justify-between">
            <Link
              href="/"
              onClick={() => {
                setOpenMobile(false);
              }}
              className="flex flex-row items-center gap-3"
            >
              <span className="cursor-pointer rounded-md px-2 font-semibold text-lg hover:bg-muted">
                Chatbot
              </span>
            </Link>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  type="button"
                  className="h-fit p-2"
                  onClick={() => {
                    setOpenMobile(false);
                    router.push('/chatv2');
                    router.refresh();
                  }}
                >
                  <PlusIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent align="end">New Chat</TooltipContent>
            </Tooltip>
          </div>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarHistory user={user} />
      </SidebarContent>
      {/* <SidebarFooter>{user && <SidebarUserNav user={user} />}</SidebarFooter> */}
    </Sidebar>
  );
}
