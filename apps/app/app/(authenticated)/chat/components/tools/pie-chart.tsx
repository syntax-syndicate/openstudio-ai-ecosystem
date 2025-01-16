'use client';
import { ErrorBoundary } from '@/app/(authenticated)/chat/components/tools/error-boundary';
import type { pieChartSchema } from '@/tools/pie-chart';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@repo/design-system/components/ui/chart';
import { Type } from '@repo/design-system/components/ui/text';
import { useMemo } from 'react';
import { Legend, Pie, PieChart } from 'recharts';
import type { z } from 'zod';

export type ChartComponentProps = z.infer<typeof pieChartSchema>;

const colors = [
  'hsl(var(--color-red-700-value))',
  'hsl(var(--color-green-700-value))',
  'hsl(var(--color-blue-700-value))',
  'hsl(var(--color-amber-700-value))',
  'hsl(var(--color-purple-700-value))',
  'hsl(var(--color-pink-700-value))',
  'hsl(var(--color-teal-700-value))',
];

export function PieChartComponent({
  values,
  labels,
  title,
}: ChartComponentProps) {
  const combinedData = useMemo(
    () =>
      values?.map((value, index) => ({
        key: labels?.[index],
        value: value,
        fill: colors[index % colors.length],
      })) ?? [],
    [values, labels]
  );
  return (
    <ErrorBoundary fallbackError="Something went wrong. Can't display chart.">
      <div className="w-full rounded-lg bg-zinc-500/5 p-4">
        <Type size="sm" weight="medium">
          {title}
        </Type>
        <ChartContainer
          config={{}}
          className="mx-auto aspect-square max-h-[350px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Legend layout="vertical" align="left" verticalAlign="middle" />
            <Pie
              data={combinedData}
              dataKey="value"
              nameKey="key"
              innerRadius={60}
              strokeWidth={5}
            />
          </PieChart>
        </ChartContainer>
      </div>
    </ErrorBoundary>
  );
}
