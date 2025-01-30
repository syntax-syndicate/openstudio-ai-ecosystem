import { fetcher } from '@/helper/utils';
import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { AnalyticsContext } from '.';
import BarList from './bar-list';
import Card from './card';

export default function Referrers({ className }: { className?: string }) {
  const { basePath, interval } = useContext(AnalyticsContext);

  const { data, isLoading } = useQuery<{ dimension: string; value: number }[]>({
    queryKey: ['analytics', 'referer', interval],
    queryFn: () =>
      fetcher(`${basePath}/analytics/referer?interval=${interval}`),
  });

  return (
    <Card title="Referrers" className={className}>
      <BarList
        title="Referrers"
        data={data?.map((r) => {
          return {
            name: r.dimension,
            value: r.value,
            icon: r.dimension ?? null,
          };
        })}
        loading={isLoading}
      />
      <></>
    </Card>
  );
}
