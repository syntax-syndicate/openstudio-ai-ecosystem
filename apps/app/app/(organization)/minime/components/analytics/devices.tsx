import { AnalyticsContext } from '@/app/(organization)/minime/components/analytics';
import BarList from '@/app/(organization)/minime/components/analytics/bar-list';
import Card from '@/app/(organization)/minime/components/analytics/card';
import { fetcher } from '@/helper/utils';
import { useQuery } from '@tanstack/react-query';
import { useContext, useState } from 'react';

export type DevicesTabs = 'device' | 'OS' | 'browser';

export default function Devices() {
  const [tab, setTab] = useState<DevicesTabs>('device');
  const { basePath, interval } = useContext(AnalyticsContext);

  const { data, isLoading } = useQuery<
    {
      device: string;
      os: string;
      browser: string;
      value: number;
    }[]
  >({
    queryKey: ['analytics', 'devices', tab, interval],
    queryFn: () =>
      fetcher(
        `${basePath}/analytics/${tab.toLowerCase()}?interval=${interval}`
      ),
  });

  return (
    <Card
      title="Devices"
      tabs={['Device', 'OS', 'Browser']}
      setTab={setTab}
      activeTab={tab}
    >
      <BarList
        title={tab}
        data={data?.map((d) => {
          return {
            name: d.device || d.os || d.browser,
            value: d.value,
          };
        })}
        loading={isLoading}
      />
    </Card>
  );
}
