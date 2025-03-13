'use client';

import { Button } from '@repo/design-system/components/ui/button';
import { Checkbox } from '@repo/design-system/components/ui/checkbox';
import { Input } from '@repo/design-system/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@repo/design-system/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/design-system/components/ui/select';
import { Separator } from '@repo/design-system/components/ui/separator';
import { BookmarkIcon, FilterIcon, XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

// Define filter types as interfaces for better reusability
interface FilterOption {
  id: string;
  label: string;
}

interface SearchFilter {
  type: 'search';
  id: string;
  label: string;
  value: string;
}

interface CheckboxFilter {
  type: 'checkbox';
  id: string;
  label: string;
  checked: boolean;
}

interface SelectFilter {
  type: 'select';
  id: string;
  label: string;
  value: string;
  options: FilterOption[];
}

type FilterItem = SearchFilter | CheckboxFilter | SelectFilter;

interface CommentFiltersProps {
  filters: FilterItem[];
  onFilterChange: (filters: FilterItem[]) => void;
  onSaveAsDefault?: () => void;
  onResetFilters?: () => void;
}

export const CommentFilters = ({
  filters,
  onFilterChange,
  onSaveAsDefault,
  onResetFilters,
}: CommentFiltersProps) => {
  const [localFilters, setLocalFilters] = useState<FilterItem[]>(filters);
  const [isOpen, setIsOpen] = useState(false);

  // Count active filters for the badge
  const activeFilterCount = localFilters.filter((filter) => {
    if (filter.type === 'search') return !!filter.value;
    if (filter.type === 'checkbox') return filter.checked;
    if (filter.type === 'select') return !!filter.value;
    return false;
  }).length;

  // Update parent when filters change
  useEffect(() => {
    onFilterChange(localFilters);
  }, [localFilters, onFilterChange]);

  const updateFilter = (updatedFilter: FilterItem) => {
    setLocalFilters((prev) =>
      prev.map((filter) =>
        filter.id === updatedFilter.id ? updatedFilter : filter
      )
    );
  };

  const handleResetFilters = () => {
    const resetFilters = localFilters.map((filter) => {
      if (filter.type === 'search') return { ...filter, value: '' };
      if (filter.type === 'checkbox') return { ...filter, checked: false };
      if (filter.type === 'select') return { ...filter, value: '' };
      return filter;
    });

    setLocalFilters(resetFilters);
    if (onResetFilters) onResetFilters();
    setIsOpen(false);
  };

  const renderFilterItem = (filter: FilterItem) => {
    switch (filter.type) {
      case 'search':
        return (
          <div className="space-y-1" key={filter.id}>
            <div className="font-medium text-sm">{filter.label}</div>
            <div className="flex items-center gap-2">
              <Input
                className="h-8"
                placeholder="Search..."
                value={filter.value}
                onChange={(e) =>
                  updateFilter({ ...filter, value: e.target.value })
                }
                // startIcon={<SearchIcon className="h-4 w-4 text-gray-500" />}
              />
            </div>
          </div>
        );

      case 'checkbox':
        return (
          <div
            className="flex items-center justify-between py-1"
            key={filter.id}
          >
            <span className="text-sm">{filter.label}</span>
            <Checkbox
              checked={filter.checked}
              onChange={() =>
                updateFilter({ ...filter, checked: !filter.checked })
              }
            />
          </div>
        );

      case 'select':
        return (
          <div className="space-y-1" key={filter.id}>
            <div className="font-medium text-sm">{filter.label}</div>
            <Select
              value={filter.value}
              onValueChange={(value) => updateFilter({ ...filter, value })}
            >
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {filter.options.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger disabled={true} asChild>
        <Button
          variant="outline"
          size="sm"
          className="relative flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FilterIcon className="h-4 w-4" />
          <span>Filter</span>
          {activeFilterCount > 0 && (
            <span className="-top-2 -right-2 absolute flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white text-xs">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="start">
        <div className="flex items-center justify-between border-b px-3 py-2">
          <h3 className="font-medium">Filters</h3>
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="h-8 px-2 text-gray-500"
            >
              <XIcon className="mr-1 h-4 w-4" />
              Clear
            </Button>
          )}
        </div>

        <div className="max-h-80 space-y-4 overflow-y-auto p-3">
          {localFilters.map(renderFilterItem)}
        </div>

        <Separator />

        <div className="p-3">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-blue-600"
            onClick={onSaveAsDefault}
          >
            <BookmarkIcon className="mr-2 h-4 w-4" />
            Set current filters as default
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
