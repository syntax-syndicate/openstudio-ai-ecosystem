import { cn } from '@repo/design-system/lib/utils';
import { memo } from 'react';

interface YouTubeDescriptionProps {
  children: string;
  className?: string;
}

// Function to convert YouTube description format to JSX
const formatYouTubeDescription = (text: string) => {
  if (!text) return null;

  // Split by line breaks
  const lines = text.split('\n');

  return lines.map((line, lineIndex) => {
    // Skip empty lines but preserve space with a <br>
    if (!line.trim()) {
      return <br key={`br-${lineIndex}`} />;
    }

    // Process line content
    let content = line;

    // Convert *text* to bold (YouTube uses single asterisks for bold)
    content = content.replace(
      /\*(.*?)\*/g,
      (_, text) => `<strong>${text}</strong>`
    );

    // Convert URLs to links
    content = content.replace(
      /(https?:\/\/[^\s]+)/g,
      (url) =>
        `<a href="${url}" target="_blank" rel="noreferrer" class="text-blue-500 hover:underline">${url}</a>`
    );

    // Handle bullet points
    if (line.trim().startsWith('- ')) {
      return (
        <div key={`line-${lineIndex}`} className="flex gap-2 py-1">
          <span className="flex-shrink-0">•</span>
          <span dangerouslySetInnerHTML={{ __html: content.substring(2) }} />
        </div>
      );
    }

    // Handle hashtags
    content = content.replace(
      /#(\w+)/g,
      '<span class="text-blue-500">#$1</span>'
    );

    // Regular line
    return (
      <div
        key={`line-${lineIndex}`}
        className="py-1"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  });
};

const NonMemoizedYouTubeDescription = ({
  children,
  className,
}: YouTubeDescriptionProps) => {
  return (
    <div className={cn('whitespace-pre-line text-sm', className)}>
      {formatYouTubeDescription(children)}
    </div>
  );
};

export const YouTubeDescription = memo(
  NonMemoizedYouTubeDescription,
  (prevProps, nextProps) =>
    prevProps.children === nextProps.children &&
    prevProps.className === nextProps.className
);
