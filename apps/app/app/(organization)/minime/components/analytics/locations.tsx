import { fetcher } from '@/helper/utils';
import { countries } from '@/types/minime';
import { useQuery } from '@tanstack/react-query';
import { useContext, useState } from 'react';
import { AnalyticsContext } from '.';
import BarList from './bar-list';
import Card from './card';
export type LocationsTabs = 'country' | 'city';

export default function Locations() {
  const [tab, setTab] = useState<LocationsTabs>('country');
  const { basePath, interval } = useContext(AnalyticsContext);

  const { data, isLoading } = useQuery<
    {
      country: string;
      city: string;
      value: number;
    }[]
  >({
    queryKey: ['analytics', 'locations', interval],
    queryFn: () =>
      fetcher(
        `${basePath}/analytics/${tab.toLowerCase()}?interval=${interval}`
      ),
  });

  return (
    <Card
      title="Locations"
      tabs={['Country', 'City']}
      setTab={setTab}
      activeTab={tab}
    >
      <BarList
        title={tab}
        data={data?.map((l) => {
          return {
            name: l.city || countries[l.country],
            icon: l.country
              ? `https://flagcdn.com/60x45/${l.country.toLowerCase()}.png`
              : undefined,
            value: l.value,
          };
        })}
        loading={isLoading}
      />
    </Card>
  );
}
