'use client';
import { Checkbox } from '@/modules/tube/comments/ui/components/checkbox';
import { trpc } from '@/trpc/client';
import { Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ActionButtonsBulk } from '../components/action-buttons-bulk';
import { CommentFilters } from '../components/comment-filters';
import { CommentListItem } from '../components/comment-list-item';

export const CommentSection = ({
  organizationId,
}: {
  organizationId: string;
}) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorBoundary fallback={<div>Error</div>}>
        <CommentSectionSuspense organizationId={organizationId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const CommentSectionSuspense = ({
  organizationId,
  videoId,
}: {
  organizationId: string;
  videoId?: string;
}) => {
  // Only fetch thread comments initially (top-level comments)
  const { data: threads = [], isLoading } =
    trpc.youtube.getCommentThreads.useQuery({
      organization_id: organizationId,
      video_id: videoId,
      limit: 100,
    });
  //temp
  const [checked, setChecked] = useState(false);

  const [filters, setFilters] = useState([
    {
      type: 'search',
      id: 'search',
      label: 'Search',
      value: '',
    },
    {
      type: 'checkbox',
      id: 'hasQuestions',
      label: 'Contains questions',
      checked: false,
    },
    {
      type: 'select',
      id: 'subscriberCount',
      label: 'Subscriber count',
      value: '',
      options: [
        { id: 'all', label: 'All subscribers' },
        { id: 'verified', label: 'Verified' },
        { id: 'subscribers', label: 'Subscribers' },
        { id: 'new', label: 'New viewers' },
      ],
    },
    {
      type: 'select',
      id: 'responseStatus',
      label: 'Response status',
      value: '',
      options: [
        { id: 'all', label: 'All' },
        { id: 'responded', label: 'Responded' },
        { id: 'notResponded', label: 'Not responded' },
      ],
    },
  ]);

  // Handle filter changes and apply to your data
  const handleFilterChange = (updatedFilters: any) => {
    setFilters(updatedFilters);
    //TODO: Implement this, placeholder for now
  };

  // Save filters as default (would store in localStorage or backend)
  const saveFiltersAsDefault = () => {
    //TODO: Implement this, placeholder for now
    localStorage.setItem('commentFilters', JSON.stringify(filters));
  };

  return (
    <>
      <div className="sticky top-0 z-40 flex items-center justify-between divide-gray-100 border-b border-l-0 bg-white px-2 py-1 dark:divide-black dark:bg-zinc-800/50">
        <div className="flex items-center">
          <div className="flex-shrink-0 pl-1">
            <Checkbox
              disabled={true}
              checked={checked}
              onChange={() => {
                setChecked(!checked);
              }}
            />
          </div>
          <div
            className="no-scrollbar ml-2 overflow-x-auto"
            style={{ maxWidth: 'calc(100vw - 200px)' }}
          >
            <ActionButtonsBulk
              isCategorizing={false}
              isPlanning={false}
              isDeleting={false}
              isApproving={false}
              isRejecting={false}
              onAiCategorize={() => {}}
              onPlanAiAction={() => {}}
              onDelete={() => {}}
              onApprove={() => {}}
              onReject={() => {}}
            />
          </div>
        </div>

        <div className="flex-shrink-0">
          <CommentFilters
            filters={filters as any}
            onFilterChange={handleFilterChange}
            onSaveAsDefault={saveFiltersAsDefault}
            onResetFilters={() => {
              //TODO: Implement this, placeholder for now
            }}
          />
        </div>
      </div>
      <div className="flex flex-col">
        {isLoading ? (
          <div className="py-4 text-center text-gray-500">
            Loading comments...
          </div>
        ) : threads.length > 0 ? (
          <ul role="list" className="overflow-y-auto scroll-smooth">
            {threads.map((thread) => (
              <CommentListItem
                key={thread.comment_id}
                comment={thread as any}
                organizationId={organizationId}
                videoId={videoId}
              />
            ))}
          </ul>
        ) : (
          <div className="py-4 text-center text-gray-500">
            No comments found
          </div>
        )}
      </div>
    </>
  );
};
