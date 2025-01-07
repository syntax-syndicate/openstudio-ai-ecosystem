import { usePreferenceContext } from '@/context/preferences';
import type { TPreferences } from '@/types';
import { CaretDown } from '@phosphor-icons/react';
import { Button } from '@repo/design-system/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/design-system/components/ui/dropdown-menu';
import { Flex } from '@repo/design-system/components/ui/flex';
import { Type } from '@repo/design-system/components/ui/text';

export const ImageGenerationPlugin = () => {
  const { preferences, updatePreferences } = usePreferenceContext();

  const dalleImageQualities = {
    standard: 'Standard',
    hd: 'HD',
  };
  const dalleImageSizes = ['1024x1024', '1792x1024', '1024x1792'];
  return (
    <Flex direction="col" gap="sm" className="border-white/10 border-t pt-2">
      <Flex className="w-full" justify="between" items="center">
        <Type size="sm" textColor="secondary">
          Image Quality
        </Type>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="secondary">
              {preferences.dalleImageQuality}{' '}
              <CaretDown size={12} weight="bold" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[200px]" align="end">
            {Object.keys(dalleImageQualities).map((quality) => (
              <DropdownMenuItem
                onClick={() => {
                  updatePreferences({
                    dalleImageQuality:
                      quality as TPreferences['dalleImageQuality'],
                  });
                }}
              >
                {
                  dalleImageQualities[
                    quality as TPreferences['dalleImageQuality']
                  ]
                }
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </Flex>
      <Flex className="w-full" justify="between" items="center">
        <Type size="sm" textColor="secondary">
          Image Size
        </Type>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="secondary">
              {preferences.dalleImageSize}
              <CaretDown size={12} weight="bold" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-[200px]" align="end">
            {dalleImageSizes.map((size) => (
              <DropdownMenuItem
                onClick={() => {
                  updatePreferences({
                    dalleImageSize: size as TPreferences['dalleImageSize'],
                  });
                }}
              >
                {size}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </Flex>
    </Flex>
  );
};
