import { getSearchParams } from '@/helper/utils';
import type { User } from '@repo/backend/auth';
import { currentOrganizationId, currentUser } from '@repo/backend/auth/utils';
import { redirect } from 'next/navigation';
import type * as z from 'zod';

export const handleAuthedState = async (): Promise<void> => {
  const [user, organizationId] = await Promise.all([
    currentUser(),
    currentOrganizationId(),
  ]);

  if (!user) {
    return;
  }

  if (!organizationId) {
    redirect('/setup');
  }
};

export const guard = <
  TBody extends z.ZodType,
  TContext extends z.ZodType,
  TParams extends z.ZodType,
>(
  next: ({
    req,
    user,
    plan,
    body,
    ctx,
  }: {
    req: Request;
    user: User;
    // plan: UserSubscriptionPlan; //TODO: focus on adding this later
    plan: any;
    body: z.infer<TBody>;
    ctx: z.infer<TContext>;
    searchParams: z.infer<TParams>;
  }) => Promise<Response | any>,
  {
    requiredPlan,
    schemas = {},
  }: {
    // requiredPlan?: Plan["title"];
    requiredPlan?: any;
    schemas?: {
      bodySchema?: TBody;
      contextSchema?: TContext;
      searchParamsSchema?: TParams;
    };
  } = {}
) => {
  return async (req: Request, context: any) => {
    const user = await currentUser();
    if (!user) {
      return new Response(null, { status: 401 });
    }
    //TODO: focus on adding this later
    // const plan = await getUserSubscription(user.id);

    // if (requiredPlan && requiredPlan === "Pro" && !plan.isPro) {
    //   return new Response("Upgrade plan to Pro", { status: 401 });
    // }
    const { bodySchema, contextSchema, searchParamsSchema } = schemas;

    const validatedData: {
      bodyData?: any;
      contextData?: any;
      searchParams?: any;
    } = {};

    if (bodySchema) {
      const body = await req.json();
      const parse = bodySchema.safeParse(body);
      if (!parse.success) {
        return new Response(parse.error.issues[0].message, {
          status: 422,
        });
      }
      validatedData.bodyData = parse.data;
    }

    //TODO: focus on adding this later
    // if (contextSchema) {
    //   const contextP = await context.params;
    //   console.log(contextP.articleId);
    //   const parse = contextSchema.safeParse(contextP);
    //   if (!parse.success) {
    //     return new Response(parse.error.issues[0].message, {
    //       status: 422,
    //     });
    //   }
    //   validatedData.contextData = parse.data;
    // }
    validatedData.contextData = await context;

    if (searchParamsSchema) {
      const parse = searchParamsSchema.safeParse(getSearchParams(req.url));
      if (!parse.success) {
        return new Response(parse.error.issues[0].message, {
          status: 422,
        });
      }
      validatedData.searchParams = parse.data;
    }

    return next({
      req,
      user,
      // plan, //TODO: focus on adding this later
      plan: null,
      body: validatedData.bodyData,
      ctx: validatedData.contextData,
      searchParams: validatedData.searchParams,
    });
  };
};
