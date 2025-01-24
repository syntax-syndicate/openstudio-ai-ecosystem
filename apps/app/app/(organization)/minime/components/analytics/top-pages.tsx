import { fetcher } from "@/helper/utils";
import { useContext } from "react";
import { AnalyticsContext } from "@/app/(organization)/minime/components/analytics";
import BarList from "./bar-list";
import Card from "./card";
import { useQuery } from "@tanstack/react-query";

export default function Pages() {
  const { basePath, interval } = useContext(AnalyticsContext);

  const { data, isLoading } = useQuery<{ page: string; value: number }[]>({
    queryKey: ["analytics", "pages", interval],
    queryFn: () => fetcher(`${basePath}/analytics/page?interval=${interval}`),
  });

  return (
    <Card title="Pages">
      <BarList
        title="Pages"
        data={data?.map((p) => {
          return {
            name: p.page,
            value: p.value,
          };
        })}
        loading={isLoading}
      />
    </Card>
  );
}
