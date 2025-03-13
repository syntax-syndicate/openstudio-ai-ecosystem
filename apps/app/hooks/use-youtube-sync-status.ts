import { useRealtimeRun } from '@trigger.dev/react-hooks';
import { useEffect, useState } from 'react';

type UseSyncStatusProps = {
  jobId?: string;
  accessToken?: string;
};

export function useYoutubeSyncStatus({
  jobId: initialJobId,
  accessToken: initialAccessToken,
}: UseSyncStatusProps = {}) {
  const [accessToken, setAccessToken] = useState<string | undefined>(
    initialAccessToken
  );
  const [jobId, setJobId] = useState<string | undefined>(initialJobId);
  const [status, setStatus] = useState<
    'idle' | 'in_progress' | 'completed' | 'failed'
  >('idle');
  const [progress, setProgress] = useState<number>(0);
  const [syncStats, setSyncStats] = useState<{
    commentsProcessed?: number;
  }>({});

  // Use Trigger.dev's real-time hook to subscribe to run updates
  const { run, error } = useRealtimeRun(jobId, {
    enabled: !!jobId && !!accessToken,
    accessToken,
  });

  // Initialize from props
  useEffect(() => {
    if (initialJobId && initialAccessToken) {
      setAccessToken(initialAccessToken);
      setJobId(initialJobId);
      setStatus('in_progress');
    }
  }, [initialJobId, initialAccessToken]);

  // Update status based on run status
  useEffect(() => {
    if (error || run?.status === 'FAILED') {
      setStatus('failed');
    } else if (run?.status === 'COMPLETED') {
      setStatus('completed');
      setProgress(100);
    } else if (
      run?.status &&
      ['QUEUED', 'EXECUTING', 'DELAYED'].includes(run.status)
    ) {
      setStatus('in_progress');
    }
  }, [error, run?.status]);

  // Update progress and stats from run metadata
  useEffect(() => {
    if (run?.metadata) {
      // Update progress
      if (typeof run.metadata.progress === 'number') {
        setProgress(run.metadata.progress);
      }

      // Update sync stats
      const newStats = {
        commentsProcessed:
          typeof run.metadata.commentsProcessed === 'number'
            ? run.metadata.commentsProcessed
            : undefined,
      };

      setSyncStats(newStats);
    }
  }, [run?.metadata]);

  return {
    status,
    progress,
    syncStats,
    isLoading: status === 'in_progress',
    isComplete: status === 'completed',
    isFailed: status === 'failed',
    output: run?.output,
  };
}
