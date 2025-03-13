import { ButtonGroup } from '@repo/design-system/components/ui/button-group';
import { LoadingMiniSpinner } from '@repo/design-system/components/ui/loading-mini-spinner';
import {
  CheckCircleIcon,
  OrbitIcon,
  SparklesIcon,
  Trash2Icon,
  XCircleIcon,
} from 'lucide-react';
import { useMemo } from 'react';

export function ActionButtons(props: {
  isCategorizing: boolean;
  isPlanning: boolean;
  isDeleting: boolean;
  isApproving: boolean;
  isRejecting: boolean;
  onAiCategorize: () => void;
  onPlanAiAction: () => void;
  onDelete: () => void;
  onApprove: () => void;
  onReject: () => void;
  shadow?: boolean;
}) {
  const {
    isCategorizing,
    isPlanning,
    isDeleting,
    isApproving,
    isRejecting,
    onAiCategorize,
    onPlanAiAction,
    onDelete,
    onApprove,
    onReject,
    shadow = false,
  } = props;
  const buttons = useMemo(
    () => [
      {
        tooltip: 'Run AI Rules',
        onClick: onPlanAiAction,
        icon: isPlanning ? (
          <LoadingMiniSpinner />
        ) : (
          <SparklesIcon className="h-4 w-4 text-green-500" aria-hidden="true" />
        ),
      },
      {
        tooltip: 'Approve AI Action',
        onClick: onApprove,
        icon: isApproving ? (
          <LoadingMiniSpinner />
        ) : (
          <CheckCircleIcon
            className="h-4 w-4 text-blue-500"
            aria-hidden="true"
          />
        ),
      },
      {
        tooltip: 'Reject AI Action',
        onClick: onReject,
        icon: isRejecting ? (
          <LoadingMiniSpinner />
        ) : (
          <XCircleIcon
            className="h-4 w-4"
            aria-hidden="true"
            style={{
              color: '#eab308',
            }}
          />
        ),
      },
      {
        tooltip: 'AI Categorize',
        onClick: onAiCategorize,
        icon: isCategorizing ? (
          <LoadingMiniSpinner />
        ) : (
          <OrbitIcon
            className="h-4 w-4"
            aria-hidden="true"
            style={{
              color: '#f97316',
            }}
          />
        ),
      },
      {
        tooltip: 'Delete',
        onClick: onDelete,
        icon: isDeleting ? (
          <LoadingMiniSpinner />
        ) : (
          <Trash2Icon className="h-4 w-4 text-red-500" aria-hidden="true" />
        ),
      },
    ],
    [
      isCategorizing,
      isApproving,
      isDeleting,
      isPlanning,
      isRejecting,
      onApprove,
      onDelete,
      onPlanAiAction,
      onReject,
      onAiCategorize,
    ]
  );

  return <ButtonGroup buttons={buttons} shadow={shadow} />;
}
