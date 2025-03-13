import { Button } from '@repo/design-system/components/ui/button';
import { cn } from '@repo/design-system/lib/utils';
import {
  ChevronDown,
  ChevronUp,
  MessageCircle,
  ThumbsDown,
  ThumbsUp,
} from 'lucide-react';

type CommentActionBarProps = {
  likeCount: number;
  replyCount: number;
  onLike: () => void;
  onDislike: () => void;
  onReply: () => void;
  onToggleReplies: () => void;
  isLiked?: boolean;
  isDisliked?: boolean;
  repliesVisible?: boolean;
};

export const CommentActionBar = ({
  likeCount,
  replyCount,
  onLike,
  onDislike,
  onReply,
  onToggleReplies,
  isLiked = false,
  isDisliked = false,
  repliesVisible = false,
}: CommentActionBarProps) => {
  return (
    <div className="mt-2 flex items-center gap-2 pl-12">
      {/* Like button with count */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          disabled
          onClick={onLike}
          className="h-8 px-2 py-1 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Like"
        >
          <ThumbsUp
            className={cn(
              'h-4 w-4',
              isLiked ? 'fill-current text-green-600 dark:text-green-400' : ''
            )}
          />
        </Button>
        {likeCount > 0 && (
          <span className="text-gray-600 text-sm dark:text-gray-400">
            {likeCount}
          </span>
        )}
      </div>

      {/* Dislike button */}
      <Button
        variant="ghost"
        size="sm"
        disabled
        onClick={onDislike}
        className="h-8 px-2 py-1 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Dislike"
      >
        <ThumbsDown
          className={cn(
            'h-4 w-4',
            isDisliked ? 'fill-current text-red-600 dark:text-red-400' : ''
          )}
        />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onReply}
        className="h-8 rounded-full px-3 font-medium text-gray-600 text-sm hover:bg-blue-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-blue-900 dark:hover:text-gray-200"
      >
        <MessageCircle className="mr-1 h-4 w-4" />
        Reply
      </Button>

      {replyCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleReplies}
          className="h-8 px-2 font-medium text-blue-600 text-sm hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          {repliesVisible ? (
            <>
              <ChevronUp className="mr-1 h-4 w-4" />
              Hide {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
            </>
          ) : (
            <>
              <ChevronDown className="mr-1 h-4 w-4" />
              View {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
            </>
          )}
        </Button>
      )}
    </div>
  );
};
