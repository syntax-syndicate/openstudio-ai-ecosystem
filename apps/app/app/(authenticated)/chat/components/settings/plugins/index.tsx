import {
  ModelIcon,
  type ModelIconType,
} from '@/app/(authenticated)/chat/components/model-icon';
import { WebSearchPlugin } from '@/app/(authenticated)/chat/components/settings/plugins/web-search';
import { usePreferenceContext } from '@/app/context';
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
      iconType: 'websearch',
      settingsComponent: WebSearchPlugin,
    },
  ];
  return (
    <Flex direction="col" gap="lg" className="p-2">
      <Accordion type="single" collapsible className="w-full">
        {pluginSettingsData.map((plugin) => (
          <AccordionItem key={plugin.value} value={plugin.value}>
            <AccordionTrigger>
              <Flex gap="sm" items="center">
                <ModelIcon type={plugin.iconType as ModelIconType} size="sm" />
                {plugin.label}
              </Flex>
            </AccordionTrigger>
            <AccordionContent>
              <plugin.settingsComponent />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Flex>
  );
};
