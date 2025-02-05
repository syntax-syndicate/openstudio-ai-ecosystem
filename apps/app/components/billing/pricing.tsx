'use client';

import {
  frequencies,
  lifetimeFeatures,
  pricing,
  tiers,
} from '@/config/pricing';
import { RadioGroup } from '@headlessui/react';
import type { premiumTierEnum } from '@repo/backend/schema';
import { Tag } from '@repo/design-system/components/ui/tag';
import { cn } from '@repo/design-system/lib/utils';
import { CheckIcon } from 'lucide-react';
import { useState } from 'react';
import { usePremium } from '@/hooks/use-premium';
import { getUserTier } from '@/lib/utils/premium';
import Link from 'next/link';
import { env } from '@/env';
import { CreditCardIcon } from 'lucide-react';
import { TPremium } from '@/types';
import { User } from '@repo/backend/auth';
import { getUserName } from '@repo/backend/auth/format';
import { Button } from '@repo/design-system/components/ui/button-subscription';


function Badge({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-full bg-red-600/10 px-2.5 py-1 text-xs font-semibold leading-5 text-red-600">
      {children}
    </p>
  );
}

function attachUserInfo(
  url: string,
  user: { id: string; email: string; name?: string | null, organizationId: string }
) {
  if (!user) return url;

  return `${url}?checkout[custom][user_id]=${user.id}&checkout[custom][organization_id]=${user.organizationId}&checkout[email]=${user.email}&checkout[name]=${user.name}`;
}

function buildLemonUrl(url: string, affiliateCode: string | null) {
  if (!affiliateCode) return url;
  const newUrl = `${url}?aff_ref=${affiliateCode}`;
  return newUrl;
}

export function Pricing() {
  const { isPremium, user, premium } = usePremium();
  const [frequency, setFrequency] = useState(frequencies[0]);
  const premiumTier = getUserTier(premium);

  
  return (
    <div
      id="pricing"
      className="relative isolate mx-auto max-w-7xl bg-white px-6 pt-10 pb-32 lg:px-6 dark:bg-zinc-800"
    >
      <div className="mx-auto max-w-2xl text-center lg:max-w-4xl">
        <h2 className="font-cal text-base text-red-600 leading-7">Pricing</h2>
        <p className="mt-2 font-cal text-4xl text-gray-900 sm:text-5xl dark:text-white">
          Affordable paid plans
        </p>
      </div>
      <p className="mx-auto mt-6 max-w-2xl text-center text-gray-600 text-lg leading-8 dark:text-white">
        OpenStudio ChatHub is free to use. You can upgrade to a paid plan to get
        more features.
      </p>
      {isPremium && (
        <div className="mt-8 text-center">
            <Button
              link={{
                href: `https://${env.NEXT_PUBLIC_LEMON_STORE_ID}.lemonsqueezy.com/billing`,
                target: "_blank",
              }}
            >
              <CreditCardIcon className="mr-2 h-4 w-4" />
              Manage subscription
            </Button>

        </div>
      )}
      <div className="mt-16 flex justify-center">
        <RadioGroup
          value={frequency}
          onChange={setFrequency}
          className="grid grid-cols-2 gap-x-1 rounded-full p-1 text-center font-semibold text-xs leading-5 ring-1 ring-gray-200 ring-inset"
        >
          <RadioGroup.Label className="sr-only">
            Payment Frequency
          </RadioGroup.Label>
          {frequencies.map((option) => (
            <RadioGroup.Option
              key={option.value}
              value={option}
              className={({ checked }) =>
                cn(
                  checked
                    ? 'bg-black text-white'
                    : 'text-gray-500 dark:text-white',
                  'cursor-pointer rounded-full px-2.5 py-1'
                )
              }
            >
              <span>{option.label}</span>
            </RadioGroup.Option>
          ))}
        </RadioGroup>

        <div className="ml-1">
          <Badge>Save up to 40%</Badge>
        </div>
      </div>
      <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-2">
        {tiers.map((tier, tierIdx) => {
            const isCurrentPlan = tier.tiers?.[frequency.value] === premiumTier;

            const href = user ? isCurrentPlan ? "#" : buildLemonUrl(
                tier.checkout ? attachUserInfo(
                    tier.href[frequency.value]!, {
                        id: user.id,
                        email: user.email!,
                        name: null,
                        organizationId: user.user_metadata.organization_id
                    }
                ) : tier.href[frequency.value]!,
                null
            ) : "/chat";
          return (
            <div
              key={tier.name}
              className={cn(
                tierIdx === 1 ? 'lg:z-10 lg:rounded-b-none' : 'lg-mt-8',
                tierIdx === 0 ? 'lg-rounded-r-none' : '',
                tierIdx === tiers.length - 1 ? 'lg:rounded-l-none' : '',
                'flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-gray-200 xl:p-10 dark:bg-zinc-800 dark:ring-zinc-700'
              )}
            >
              <div>
                <div className="flex items-center justify-between gap-x-4">
                  <h3
                    id={tier.name}
                    className={cn(
                      tier.mostPopular
                        ? 'text-red-600'
                        : 'text-gray-900 dark:text-white',
                      'font-cal text-lg leading-8'
                    )}
                  >
                    {tier.name}
                  </h3>
                  {tier.mostPopular ? (
                    <Badge>Most Popular</Badge>
                  ) : null}
                </div>
                <p className="mt-4 text-gray-600 text-sm leading-6 dark:text-white">
                  {tier.description}
                </p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="font-bold text-4xl text-gray-900 tracking-tight dark:text-white">
                    ${tier.price[frequency.value]}
                  </span>
                  <span className="font-semibold text-gray-600 text-sm leading-6 dark:text-white">
                      {frequency.priceSuffix}
                  </span>
                  {!!tier.discount?.[frequency.value] && (
                    <Badge>
                      <span className='tracking-wide'>
                        SAVE {tier.discount[frequency!.value].toFixed(0)}%
                      </span>
                    </Badge>
                  )}
                </p>
                <div className="mt-16" />
                <ul
                  role="list"
                  className="mt-8 space-y-3 text-gray-600 text-sm leading-6 dark:text-white"
                >
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <CheckIcon
                        className="h-6 w-5 flex-none text-red-600"
                        aria-hidden="true"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href={href}
                target={href.includes('chat') ? undefined : '_blank'}
                aria-describedby={tier.name}
                className={cn(
                  tier.mostPopular
                    ? 'bg-red-600 text-white shadow-sm hover:bg-red-500'
                    : 'text-red-600 ring-1 ring-red-200 ring-inset hover:ring-red-300',
                  'mt-8 block rounded-md px-3 py-2 text-center font-semibold text-sm leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-600 focus-visible:outline-offset-2'
                )}
                onClick={() => {
                  //add posthog checkout event
                }}
                rel="noreferrer"
              >
                {isCurrentPlan ? 'Current plan' : tier.cta}
              </a>
            </div>
          );
        })}
      </div>
      <LifetimePricing user={user ? {id: user.id, email: user.email! , name: getUserName(user), organizationId: user.user_metadata.organization_id}: undefined} premiumTier={premiumTier} />
    </div>
  );
}

function LifetimePricing(props: {
  user?: { id: string; organizationId: string; email: string; name?: string | null };
  premiumTier?: (typeof premiumTierEnum.enumValues)[number] | null;
}) {
  const { user, premiumTier } = props;

  const hasLifetime = premiumTier === 'LIFETIME';

  return (
    <div className="bg-white py-4 sm:py-8 dark:bg-zinc-800">
      <div className="mx-auto max-w-2xl rounded-3xl ring-1 ring-gray-200 lg:mx-0 lg:flex lg:max-w-none dark:ring-zinc-700">
        <div className="p-8 sm:p-10 lg:flex-auto">
          <h3 className="flex items-center font-cal text-2xl text-gray-900 dark:text-white">
            Lifetime Access
            <div className="ml-4">
              <Tag color="green">Limited Time Offer</Tag>
            </div>
          </h3>
          <p className="mt-6 text-base text-gray-600 leading-7 dark:text-white">
            Get lifetime access to OpenStudio ChatHub for a one-time payment.
            <br />
            This includes 2 (more sooner when stable) side by side assistants, unlimited messages, and priority
            support.
          </p>
          <div className="mt-10 flex items-center gap-x-4">
            <h4 className="flex-none font-cal text-red-600 text-sm leading-6">
              What's included
            </h4>
            <div className="h-px flex-auto bg-gray-100 dark:bg-zinc-700" />
          </div>
          <ul
            role="list"
            className="mt-8 grid grid-cols-1 gap-4 text-gray-600 text-sm leading-6 sm:grid-cols-2 sm:gap-6 dark:text-white"
          >
            {lifetimeFeatures.map((feature) => (
              <li key={feature} className="flex gap-x-3">
                <CheckIcon
                  className="h-6 w-5 flex-none text-red-600"
                  aria-hidden="true"
                />
                {feature}
              </li>
            ))}
          </ul>
        </div>
        <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
          <div className="rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-gray-900/5 ring-inset lg:flex lg:flex-col lg:justify-center lg:py-16 dark:bg-zinc-800">
            <div className="mx-auto max-w-xs px-8">
              <p className="font-semibold text-base text-gray-600 dark:text-white">
                Lifetime access to Open Studio ChatHub
              </p>
              <p className="mt-6 flex items-baseline justify-center gap-x-2">
                <span className="font-bold text-5xl text-gray-900 tracking-tight dark:text-white">
                  ${pricing.LIFETIME}
                </span>
                <span className="font-semibold text-gray-600 text-sm leading-6 tracking-wide dark:text-white">
                  USD
                </span>
              </p>
              <a
                href={
                    user?.email ? hasLifetime ? '#' : buildLemonUrl(
                        attachUserInfo(
                            env.NEXT_PUBLIC_LIFETIME_PAYMENT_LINK,
                            {
                                id: user.id,
                                email: user.email,
                                name: user.name,
                                organizationId: user.organizationId
                            }
                        ),
                        null
                    ) : '/chat'

                }
                onClick={() => {
                  //TODO: add posthog checkout event
                }}
                target="_blank"
                className="mt-10 block w-full rounded-md bg-red-600 px-3 py-2 text-center font-semibold text-sm text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-600 focus-visible:outline-offset-2"
                rel="noreferrer"
              >
                {hasLifetime ? 'Current plan' : 'Get lifetime access'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
