'use client';

import type { User } from '@repo/backend/auth';
import { useRouter } from 'next/navigation';

import { SidebarHistory } from '@/app/(organization)/chatv2/components/v2/sidebar-history';
// import { SidebarUserNav } from '@/app/(organization)/chatv2/components/v2/sidebar-user-nav';
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
