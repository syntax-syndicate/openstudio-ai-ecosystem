import AppShell from "@/app/(organization)/minime/components/layout/app-shell";
import SettingsNav from "@/app/(organization)/minime/components/layout/settings-nav";
import type * as React from "react";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShell>
      <SettingsNav />
      {children}
    </AppShell>
  );
}
