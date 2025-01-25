"use client";

import { Icons } from "@repo/design-system/components/ui/icons";
import Button from "@repo/design-system/components/minime/button";
import Input from "@repo/design-system/components/minime/input";
import type * as React from "react";
import { useFormState, useFormStatus } from "react-dom";
import { unlockProject } from "./action";
import {Project} from "@/helper/utils";
import { User } from "@repo/backend/auth";

export default function Protection({
  project,
  user,
  children,
}: {
  project: Pick<Project, "id"> & {
    isProtected: boolean;
  };
  user: Pick<User, "user_metadata">;
  children: React.ReactNode;
}) {
  const [state, formAction] = useFormState(unlockProject, {
    unlocked: false,
  });
  if (!state.unlocked && project.isProtected) {
    return (
      <div className="w-[300px] mx-auto flex flex-col gap-2 max-md:mt-10">
        <p className="text-sm text-gray-4">
          <b className="text-secondary">{user.user_metadata.username}</b> has made this
          project protected, please enter the password to continue.
        </p>
        <form action={formAction} className="flex flex-col gap-2">
          <input type="hidden" name="projectId" value={project.id} />
          <Input
            type="password"
            name="password"
            placeholder="Enter password"
            className={state?.error ? "focus:border-danger border-danger" : ""}
          />
          {state?.error && <b className="text-xs text-danger">{state.error}</b>}
          <FormButton />
        </form>
      </div>
    );
  }
  return children;
}

function FormButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Icons.spinner size={18} className="animate-spin" />} Unlock
    </Button>
  );
}
