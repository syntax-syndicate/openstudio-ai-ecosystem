import type React from 'react';
import { forwardRef } from 'react';

export const Checkbox = forwardRef(
  (
    props: {
      checked: boolean;
      disabled?: boolean;
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    },
    ref: React.Ref<HTMLInputElement>
  ) => {
    return (
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-gray-300 bg-white text-red-600 focus:ring-red-600 dark:border-zinc-700 dark:bg-zinc-800/50 disabled:opacity-50 disabled:cursor-not-allowed"
        ref={ref}
        checked={props.checked}
        onChange={props.onChange}
        disabled={props.disabled}
      />
    );
  }
);

Checkbox.displayName = 'Checkbox';
