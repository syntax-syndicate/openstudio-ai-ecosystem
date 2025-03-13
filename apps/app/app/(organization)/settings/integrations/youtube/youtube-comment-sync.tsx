'use client';

import { useYoutubeSyncStatus } from '@/hooks/use-youtube-sync-status';
import { trpc } from '@/trpc/client';
import { Badge } from '@repo/design-system/components/ui/badge';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@repo/design-system/components/ui/card';
import { Label } from '@repo/design-system/components/ui/label';
import { Progress } from '@repo/design-system/components/ui/progress';
import {
  RadioGroup,
  RadioGroupItem,
} from '@repo/design-system/components/ui/radio-group';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@repo/design-system/components/ui/tooltip';
import { cn } from '@repo/design-system/lib/utils';
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Info,
  RefreshCw,
  RotateCw,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

type SyncFrequency =
  | 'manual'
  | 'hourly'
  | '6hours'
  | '12hours'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'quaterly'
  | 'half_yearly'
  | 'yearly';

type SyncFrequencyOption = {
  value: SyncFrequency;
  label: string;
  description: string;
  disabled: boolean;
};

const syncFrequencyOptions: SyncFrequencyOption[] = [
  {
    value: 'manual',
    label: 'Manual Only',
    description: 'Comments will only sync when you manually trigger a sync.',
    disabled: false,
  },
  {
    value: 'hourly',
    label: 'Every Hour',
    description:
      'Sync comments every hour to stay up-to-date with the latest interactions.',
    disabled: true,
  },
  {
    value: '6hours',
    label: 'Every 6 Hours',
    description:
      'Sync four times daily for regular updates without excessive processing.',
    disabled: true,
  },
  {
    value: '12hours',
    label: 'Every 12 Hours',
    description: 'Sync twice daily, good for moderate comment activity.',
    disabled: true,
  },
  {
    value: 'daily',
    label: 'Once Daily',
    description: 'Sync once per day, recommended for most channels.',
    disabled: true,
  },
  {
    value: 'weekly',
    label: 'Once Weekly',
    description:
      'Sync once per week, suitable for channels with lower comment activity.',
    disabled: true,
  },
  {
    value: 'monthly',
    label: 'Once Monthly',
    description:
      'Sync once per month for channels with minimal comment activity.',
    disabled: true,
  },
  {
    value: 'quaterly',
    label: 'Once Quarterly',
    description: 'Sync every three months for archival purposes.',
    disabled: true,
  },
  {
    value: 'half_yearly',
    label: 'Twice Yearly',
    description: 'Sync twice per year for very low-activity channels.',
    disabled: true,
  },
  {
    value: 'yearly',
    label: 'Once Yearly',
    description: 'Annual sync for minimal maintenance.',
    disabled: true,
  },
];

interface YouTubeCommentSyncSettingsProps {
  organizationId: string;
  channelId: string;
  initialFrequency: string;
}

export function YoutubeCommentSyncSettings({
  organizationId,
  channelId,
  initialFrequency = 'manual',
}: YouTubeCommentSyncSettingsProps) {
  const [syncFrequency, setSyncFrequency] = useState<SyncFrequency>(
    initialFrequency as SyncFrequency
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isManualSyncing, setIsManualSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<
    'idle' | 'in_progress' | 'completed' | 'failed'
  >('idle');

  // State for tracking active job
  const [activeJob, setActiveJob] = useState<{
    jobId?: string;
    publicToken?: string;
  }>({});

  const {
    status,
    progress,
    syncStats,
    isLoading: isSyncRunning,
    output: syncOutput,
  } = useYoutubeSyncStatus({
    jobId: activeJob.jobId,
    accessToken: activeJob.publicToken,
  });

  const updateFrequencyMutation =
    trpc.organization.updateYoutubeCommentSyncFrequency.useMutation({
      onSuccess: () => {
        toast.success('Sync frequency updated');
      },
      onError: (error) => {
        toast.error('Failed to update sync frequency');
      },
    });

  const triggerManualSyncMutation = trpc.youtube.syncComments.useMutation({
    onSuccess: (data) => {
      setIsManualSyncing(false);
      setSyncStatus('in_progress');
      if (data.jobId && data.publicAccessToken) {
        setActiveJob({
          jobId: data.jobId,
          publicToken: data.publicAccessToken,
        });

        toast.success('Comment sync started');
      }
    },
    onError: (error) => {
      setIsManualSyncing(false);
      setSyncStatus('failed');
      console.error('Failed to trigger sync:', error);
    },
  });

  const { data: syncMetadata, isLoading: isSyncMetadataLoading } =
    trpc.youtube.getSyncMetadata.useQuery(
      {
        organization_id: organizationId,
        channel_id: channelId,
      },
      {
        enabled: !!organizationId && !!channelId,
        refetchInterval: syncStatus === 'in_progress' ? 10000 : false,
      }
    );

  // Clear job when sync completes or fails
  useEffect(() => {
    if (status === 'completed' || status === 'failed') {
      // Wait a moment to show the final state, then clear
      const timer = setTimeout(() => {
        setActiveJob({});
        // refetchMetadata();
      }, 3000);

      // Notify user of completion or failure
      if (status === 'completed' && syncOutput) {
        if (syncOutput.commentsSynced === 0) {
          toast.success('YouTube comment sync completed', {
            description: 'No new comments to sync',
          });
        } else {
          toast.success('YouTube comment sync completed', {
            description: `Successfully synced ${syncOutput.commentsSynced} comments`,
          });
        }
      } else if (status === 'failed') {
        toast.error('YouTube comment sync failed', {
          description: 'Please try again or contact support',
        });
      }

      return () => clearTimeout(timer);
    }
  }, [status, syncOutput]);

  // Format the last sync time
  const formatLastSyncTime = (isoDate: string | null | undefined) => {
    if (!isoDate) return 'Never';

    const date = new Date(isoDate);
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Comment Sync Settings</CardTitle>
          <SyncStatusBadge status={status} />
        </div>
        <CardDescription>
          Configure how frequently your YouTube comments are synced to your
          dashboard
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-medium text-lg">Sync Frequency</h3>
              <div className="flex items-center text-gray-500 text-sm dark:text-gray-400">
                <Info className="mr-1 h-4 w-4" />
                Last synced: {formatLastSyncTime(syncMetadata?.last_sync_time)}
              </div>
            </div>

            <RadioGroup
              value={syncFrequency}
              onValueChange={(value) =>
                setSyncFrequency(value as SyncFrequency)
              }
              className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
            >
              {syncFrequencyOptions.map((option) => (
                <div key={option.value} className="relative">
                  <RadioGroupItem
                    value={option.value}
                    id={`sync-${option.value}`}
                    className="peer sr-only"
                    disabled={option.disabled}
                  />
                  {option.disabled && (
                    <span className="-top-2 -right-2 absolute z-10 rounded-full border border-amber-200 bg-amber-100 px-2 py-0.5 font-medium text-amber-800 text-xs dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                      Enabling soon
                    </span>
                  )}
                  <Label
                    htmlFor={`sync-${option.value}`}
                    className={cn(
                      'flex h-full cursor-pointer flex-col rounded-lg border px-4 py-3',
                      'hover:border-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary',
                      'peer-checked:border-primary peer-checked:bg-primary/5',
                      'transition-all duration-200',
                      // Enabled state styling
                      !option.disabled &&
                        'cursor-pointer hover:border-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary',
                      !option.disabled &&
                        syncFrequency === option.value &&
                        'border-primary bg-primary/5',
                      // Disabled state styling
                      option.disabled &&
                        'cursor-not-allowed bg-muted opacity-50'
                    )}
                  >
                    <span className="font-medium">{option.label}</span>
                    <span className="mt-1 text-gray-500 text-sm dark:text-gray-400">
                      {option.description}
                    </span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Sync Status & Progress */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-sm">Sync Status</h3>
              <SyncStatusBadge status={status} />
            </div>

            {/* Progress bar during sync */}
            {isSyncRunning && (
              <div className="space-y-2">
                <Progress value={progress} className="h-2 w-full" />
                <div className="flex justify-between text-muted-foreground text-xs">
                  <span>{syncStats?.commentsProcessed || 'Processing...'}</span>
                  <span>{progress}% complete</span>
                </div>
              </div>
            )}

            {/* Sync Details */}
            <div className="space-y-3 rounded-md bg-muted/50 p-4">
              <h4 className="mb-2 font-medium text-sm">Sync Details</h4>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2 rounded-md bg-background/50 p-3">
                  <h5 className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
                    Timing
                  </h5>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Last Synced:</span>
                      </div>
                      <span className="font-medium text-sm">
                        {formatLastSyncTime(syncMetadata?.last_sync_time)}
                      </span>
                    </div>
                    {syncMetadata?.newest_comment_time && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Info className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Most Recent Comment:</span>
                        </div>
                        <span className="font-medium text-sm">
                          {formatLastSyncTime(
                            syncMetadata?.newest_comment_time
                          )}
                        </span>
                      </div>
                    )}
                    {syncMetadata?.oldest_comment_time && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Info className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Earliest Comment:</span>
                        </div>
                        <span className="font-medium text-sm">
                          {formatLastSyncTime(
                            syncMetadata?.oldest_comment_time
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-2 rounded-md bg-background/50 p-3">
                  <h5 className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
                    Statistics
                  </h5>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <RefreshCw className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Total Comments:</span>
                    </div>
                    <span className="font-medium text-sm">
                      {syncMetadata?.total_comments ?? 0}
                    </span>
                  </div>
                  {syncStats && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <CheckCircle className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Comments Synced:</span>
                      </div>
                      <span className="font-medium text-sm">
                        {syncMetadata?.comments_synced || 0}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              {status === 'failed' && (
                <div className="mt-3 flex items-start rounded-md border border-destructive/20 bg-destructive/10 p-3 text-destructive text-sm">
                  <AlertCircle className="mt-0.5 mr-2 h-4 w-4 flex-shrink-0" />
                  <span>
                    The sync process encountered an error. Please try again or
                    contact support if the issue persists.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                onClick={() => {
                  triggerManualSyncMutation.mutate({
                    organization_id: organizationId,
                  });
                }}
                disabled={triggerManualSyncMutation.isPending}
                className="flex items-center"
              >
                {triggerManualSyncMutation.isPending ? (
                  <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                {triggerManualSyncMutation.isPending
                  ? 'Syncing...'
                  : 'Sync Now'}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Manually trigger a YouTube comment sync</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Button
          onClick={() =>
            updateFrequencyMutation.mutate({
              organizationId,
              frequency: syncFrequency,
            })
          }
          disabled={
            updateFrequencyMutation.isPending ||
            initialFrequency === syncFrequency
          }
          className="flex items-center"
        >
          {updateFrequencyMutation.isPending ? (
            <RotateCw className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <CheckCircle className="mr-2 h-4 w-4" />
          )}
          {updateFrequencyMutation.isPending ? 'Saving...' : 'Save Settings'}
        </Button>
      </CardFooter>
    </Card>
  );
}

// Helper component for sync status badge
function SyncStatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'completed':
      return (
        <Badge
          variant="outline"
          className="border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400"
        >
          <CheckCircle className="mr-1 h-3 w-3" />
          Synced
        </Badge>
      );
    case 'in_progress':
      return (
        <Badge
          variant="outline"
          className="border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
        >
          <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
          Syncing
        </Badge>
      );
    case 'failed':
      return (
        <Badge
          variant="outline"
          className="border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
        >
          <AlertCircle className="mr-1 h-3 w-3" />
          Failed
        </Badge>
      );
    default:
      return (
        <Badge
          variant="outline"
          className="border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
        >
          <Info className="mr-1 h-3 w-3" />
          Not Configured
        </Badge>
      );
  }
}
