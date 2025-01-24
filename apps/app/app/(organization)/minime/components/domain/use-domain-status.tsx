import { fetcher } from "@/helper/utils";
import type { DomainStatus } from "@/types/minime";
import { useQuery } from "@tanstack/react-query";

const useDomainStatus = (
  domain: string | null,
): {
  status: DomainStatus;
  domainRes: any;
  isLoading: boolean;
  mutate: () => void;
} => {
  const { data, refetch: mutate, isLoading } = useQuery({
    queryKey: ['domain', domain],
    queryFn: () => fetcher(`/api/user/domain/${domain}`),
    enabled: !!domain,
    staleTime: 0,
  });

  return {
    status: data?.status as DomainStatus,
    domainRes: data?.domainRes,
    isLoading,
    mutate,
  };
};

export default useDomainStatus;
