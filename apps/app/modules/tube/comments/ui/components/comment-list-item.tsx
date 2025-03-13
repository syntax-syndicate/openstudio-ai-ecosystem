import { trpc } from '@/trpc/client';
import { Button } from '@repo/design-system/components/ui/button';
import { Input } from '@repo/design-system/components/ui/input';
import { cn } from '@repo/design-system/lib/utils';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import { useRef } from 'react';
import { ActionButtons } from './action-buttons';
import { CategoryBadge } from './category-badge';
import { Checkbox } from './checkbox';
import { CommentActionBar } from './comment-action-bar';
import { CommentDate } from './comment-date';
import { EmojiPicker } from './emoji-picker';

type CommentType = {
  organization_id: string;
  comment_id: string;
  comment_text: string;
  author_display_name: string;
  author_profile_image_url: string;
  author_channel_id: string;
  like_count: number;
  published_at: string;
  updated_at: string;
  video_id: string;
  parent_id: string | null | undefined;
  reply_id: string | null | undefined;
  reply_count: number;
  is_thread: number; // 0 or 1
};

type CommentListItemProps = {
  comment: CommentType;
  organizationId: string;
  videoId?: string;
  level?: number;
};

export const CommentListItem = ({
  comment,
  organizationId,
  videoId,
  level = 0,
}: CommentListItemProps) => {
  const [repliesVisible, setRepliesVisible] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);

  const toggleReplyForm = useCallback(() => {
    setShowReplyForm((prev) => !prev);
  }, []);

  const handleLike = useCallback(() => {
    if (isDisliked) setIsDisliked(false);
    setIsLiked((prev) => !prev);
    // Add API integration here
  }, [isDisliked]);

  const handleDislike = useCallback(() => {
    if (isLiked) setIsLiked(false);
    setIsDisliked((prev) => !prev);
    // Add API integration here
  }, [isLiked]);

  const toggleReplies = useCallback(() => {
    setRepliesVisible((prev) => !prev);
  }, []);

  const handleSubmitReply = (replyText: string) => {
    // This would connect to your API to submit the reply
    console.log(
      'Replying to comment:',
      comment.comment_id,
      'with text:',
      replyText
    );
    // After submission, you might want to refetch the replies
    setShowReplyForm(false);
  };

  // Only fetch replies when needed - when the user expands the comment
  const { data: replies = [], isLoading } =
    trpc.youtube.getCommentReplies.useQuery(
      {
        organization_id: organizationId,
        parent_id: comment.comment_id,
        video_id: videoId,
        limit: 100,
      },
      {
        // Only fetch when replies are visible
        enabled: repliesVisible,
        // Keep previous data while loading new data
        //   keepPreviousData: true
      }
    );

  const hasReplies = comment.reply_count > 0;
  const isThread = comment.is_thread === 1;

  return (
    <>
      <li
        className={cn(
          'group relative cursor-pointer border-l-0 py-3',
          level > 0 && 'pl-4'
        )}
      >
        <div className="px-4">
          <div className="mx-auto flex">
            <div className="flex flex-1 flex-col overflow-hidden whitespace-nowrap text-sm leading-6">
              <div>
                <div className="min-w-0 overflow-hidden font-semibold text-gray-900 dark:text-white">
                  <div className="flex">
                    <div className="mr-3 flex items-center pl-1">
                      <Checkbox checked={false} onChange={() => {}} />
                    </div>
                    <Image
                      src={comment.author_profile_image_url}
                      alt="Author Image"
                      width={30}
                      height={30}
                      className="rounded-full"
                    />

                    <span className="ml-4 font-normal text-gray-500 dark:text-white">
                      {comment.author_display_name}
                    </span>

                    <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-red-800 text-xs dark:bg-red-900 dark:text-red-200">
                      Plan
                    </span>
                  </div>
                  <div className="min-w-0 whitespace-normal text-balance pl-1 font-normal text-gray-700 dark:text-white">
                    {comment.comment_text}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="relative flex items-center">
                <div className="absolute right-0 z-20 hidden group-hover:block">
                  <ActionButtons
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
                    shadow
                  />
                </div>
                <CommentDate
                  date={new Date(comment.published_at)}
                  className="group-hover:hidden"
                />

                <div className="ml-3 flex items-center whitespace-nowrap group-hover:hidden">
                  <CategoryBadge category={'POSITIVE'} />
                </div>
              </div>
            </div>
          </div>

          {/* Comment actions row - with Like and Reply buttons */}
          <CommentActionBar
            likeCount={comment.like_count}
            replyCount={comment.reply_count}
            onLike={handleLike}
            onDislike={handleDislike}
            onReply={toggleReplyForm}
            onToggleReplies={toggleReplies}
            isLiked={isLiked}
            isDisliked={isDisliked}
            repliesVisible={repliesVisible}
          />

          {/* Reply form */}
          {showReplyForm && (
            <div className="mt-3 pl-12">
              <CommentReplyForm
                onSubmit={handleSubmitReply}
                onCancel={() => setShowReplyForm(false)}
                authorImageUrl={comment.author_profile_image_url}
              />
            </div>
          )}
        </div>
      </li>
      {repliesVisible && (
        <div className={cn('relative ml-6 pl-6')}>
          {isLoading ? (
            <div className="py-2 pl-4 text-gray-500 text-sm">
              <div className="animate-pulse">Loading replies...</div>
            </div>
          ) : replies.length > 0 ? (
            <ul className="relative border-gray-300 border-l-2 dark:border-gray-700">

              <div className="-left-6 absolute top-0 h-8 w-6 overflow-visible">
                <div
                  className="absolute top-0 left-0 h-8 w-6"
                  style={{
                    borderBottom: '2px solid #d1d5db',
                    borderLeft: '2px solid #d1d5db',
                    borderBottomLeftRadius: '12px',
                  }}
                />
              </div>

              {replies.map((reply) => (
                <CommentListItem
                  key={reply.comment_id}
                  comment={reply as any}
                  organizationId={organizationId}
                  videoId={videoId}
                  level={level + 1}
                />
              ))}
            </ul>
          ) : (
            <div className="py-2 pl-4 text-gray-500 text-sm">
              No replies found
            </div>
          )}
        </div>
      )}
    </>
  );
};

// Reply form component
type CommentReplyFormProps = {
  onSubmit: (text: string) => void;
  onCancel: () => void;
  authorImageUrl: string;
};

const CommentReplyForm = ({
  onSubmit,
  onCancel,
  authorImageUrl,
}: CommentReplyFormProps) => {
  const [replyText, setReplyText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (replyText.trim()) {
      onSubmit(replyText.trim());
      setReplyText('');
    }
  };

  const insertEmoji = (emoji: string) => {
    if (inputRef.current) {
      const start = inputRef.current.selectionStart || 0;
      const end = inputRef.current.selectionEnd || 0;

      // Insert emoji at cursor position
      const newText =
        replyText.substring(0, start) + emoji + replyText.substring(end);

      setReplyText(newText);

      // Set cursor position after the inserted emoji
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.selectionStart = start + emoji.length;
          inputRef.current.selectionEnd = start + emoji.length;
        }
      }, 0);
    } else {
      // If no cursor position (rare), just append
      setReplyText((prev) => prev + emoji);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2">
      <div className="flex-shrink-0">
        <Image
          src={authorImageUrl}
          alt="Your Profile"
          width={24}
          height={24}
          className="rounded-full"
        />
      </div>
      <div className="flex-1">
        <div className="relative">
          <Input
            ref={inputRef}
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Add a reply..."
            className="w-full rounded-full border border-gray-300 px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </div>
        <div className="mt-2 flex items-center justify-between">
          {/* Emoji picker */}
          <EmojiPicker onEmojiSelect={insertEmoji} />

          <div className="flex space-x-2">
            <Button
              variant="outline"
              type="button"
              onClick={onCancel}
              className="rounded-full px-3 py-1.5 font-medium text-gray-700 text-sm hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!replyText.trim() || true}
              className={cn(
                'rounded-full px-3 py-1.5 font-medium text-sm disabled:cursor-not-allowed disabled:opacity-50',
                replyText.trim()
                  ? 'bg-blue-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800'
                  : 'cursor-not-allowed bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-500'
              )}
            >
              Reply
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};
