"use server";

import { database } from "@repo/backend/database";
import { currentUser } from "@repo/backend/auth/utils";
import { projects } from "@repo/backend/schema";
import { and, desc } from "drizzle-orm";
import { eq } from "drizzle-orm";

// get projects
export async function getProjects({
    limit,
    published,
}: {
    limit?: number;
    published?: boolean;
} = {}) {
    const user = await currentUser();
    return await database
        .select()
        .from(projects)
        .where(
            and(
                eq(projects.authorId, user!.id),
                published !== undefined ? eq(projects.published, published) : undefined
            )
        )
        .limit(limit || 50) // Adding a default limit of 50 if none provided
        .orderBy(desc(projects.year));
}