import { useContext } from 'react';
import { AnalyticsContext } from '.';
import Card from './card';

export default function Referrers({ className }: { className?: string }) {
  const { basePath, interval } = useContext(AnalyticsContext);

  //   const { data, isLoading } = useQuery<{ referer: string; value: number }[]>({
  //     queryKey: ["analytics", "referer", interval],
  //     queryFn: () => fetcher(`${basePath}/analytics/referer?interval=${interval}`),
  //   });

  return (
    <Card title="Referrers" className={className}>
      {/* <BarList
        title="Referrers"
        data={data?.map((r) => {
          return {
            name: r.referer,
            value: r.value,
            icon: r.referer ?? null,
          };
        })}
        loading={isLoading}
      /> */}
      <></>
    </Card>
  );
}
