'use client';
import { ImageGenerationPlugin } from '@/app/(organization)/chat/components/settings/plugins/image-generation';
import { WebSearchPlugin } from '@/app/(organization)/chat/components/settings/plugins/web-search';
import { SettingsContainer } from '@/app/(organization)/chat/components/settings/settings-container';
import { AiImageIcon, Globe02Icon } from '@hugeicons/react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@repo/design-system/components/ui/accordion';
import { Flex } from '@repo/design-system/components/ui/flex';

export default function PluginsSettings() {
  const pluginSettingsData = [
    {
      value: 'websearch',
      label: 'Web Search',
      icon: Globe02Icon,
      settingsComponent: WebSearchPlugin,
    },
    {
      value: 'image_generation',
      label: 'Image Generation',
      icon: AiImageIcon,
      settingsComponent: ImageGenerationPlugin,
    },
  ];
  return (
    <SettingsContainer title="Plugins">
      <Accordion type="single" collapsible className="w-full">
        {pluginSettingsData.map((plugin) => {
          const Icon = plugin.icon;
          return (
            <AccordionItem key={plugin.value} value={plugin.value}>
              <AccordionTrigger>
                <Flex gap="md" items="center">
                  {Icon && (
                    <Icon size={20} strokeWidth={2} className="opacity-50" />
                  )}
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
    </SettingsContainer>
  );
}
