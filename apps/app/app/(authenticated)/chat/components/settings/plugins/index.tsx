import { ImageGenerationPlugin } from '@/app/(authenticated)/chat/components/settings/plugins/image-generation';
import { WebSearchPlugin } from '@/app/(authenticated)/chat/components/settings/plugins/web-search';
import { usePreferenceContext } from '@/app/context';
import { GlobalSearchIcon, Image01Icon } from '@hugeicons/react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@repo/design-system/components/ui/accordion';
import { Flex } from '@repo/design-system/components/ui/flex';

export const PulginSettings = () => {
  const { apiKeys } = usePreferenceContext();
  const pluginSettingsData = [
    {
      value: 'websearch',
      label: 'Web Search',
      icon: GlobalSearchIcon,
      settingsComponent: WebSearchPlugin,
    },
    {
      value: 'image_generation',
      label: 'Image Generation',
      icon: Image01Icon,
      settingsComponent: ImageGenerationPlugin,
    },
  ];
  return (
    <Flex direction="col" gap="lg" className="p-2">
      <Accordion type="single" collapsible className="w-full">
        {pluginSettingsData.map((plugin) => {
          const Icon = plugin.icon;
          return (
            <AccordionItem key={plugin.value} value={plugin.value}>
              <AccordionTrigger>
                <Flex gap="sm" items="center">
                  {Icon && <Icon size={20} strokeWidth={1.5} />}
                  {plugin.label}
                </Flex>
              </AccordionTrigger>
              <AccordionContent>
                <plugin.settingsComponent />
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </Flex>
  );
};
