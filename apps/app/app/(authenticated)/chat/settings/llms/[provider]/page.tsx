'use client';

import {
  ModelIcon,
  type ModelIconType,
} from '@/app/(authenticated)/chat/components/model-icon';
import { AnthropicSettings } from '@/app/(authenticated)/chat/components/settings/models/anthropic';
import { GeminiSettings } from '@/app/(authenticated)/chat/components/settings/models/gemini';
import { GroqSettings } from '@/app/(authenticated)/chat/components/settings/models/groq';
import { OllamaSettings } from '@/app/(authenticated)/chat/components/settings/models/ollama';
import { OpenAISettings } from '@/app/(authenticated)/chat/components/settings/models/openai';
import { SettingsContainer } from '@/app/(authenticated)/chat/components/settings/settings-container';
import { providers } from '@/config/models';
import { usePreferenceContext } from '@/context/preferences';
import type { TProvider } from '@/types';
import { Alert01Icon, CheckmarkCircle01Icon } from '@hugeicons/react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@repo/design-system/components/ui/accordion';
import { Flex } from '@repo/design-system/components/ui/flex';
import { cn } from '@repo/design-system/lib/utils';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LLMsSettings() {
  const { provider } = useParams();
  const { push } = useRouter();
  const { apiKeys, preferences } = usePreferenceContext();
  const [selectedModel, setSelectedModel] = useState<TProvider>('openai');
  const [ollamaConnected, setOllamaConnected] = useState(false);

  const checkOllamaConnection = async () => {
    try {
      const url = preferences.ollamaBaseUrl;
      await fetch(url + '/api/tags');
      setOllamaConnected(true);
    } catch (error) {
      setOllamaConnected(false);
    }
  };

  useEffect(() => {
    checkOllamaConnection();
  }, [preferences.ollamaBaseUrl]);

  useEffect(() => {
    if (providers.includes(provider as TProvider)) {
      setSelectedModel(provider as TProvider);
    } else {
      push('settings/llms/openai');
    }
  }, [provider]);

  const modelSettingsData = [
    {
      value: 'openai',
      label: 'OpenAI',
      iconType: 'openai',
      connected: !!apiKeys.find((key) => key.provider === 'openai'),
      settingsComponent: OpenAISettings,
    },
    {
      value: 'anthropic',
      label: 'Anthropic',
      iconType: 'anthropic',
      connected: !!apiKeys.find((key) => key.provider === 'anthropic'),

      settingsComponent: AnthropicSettings,
    },
    {
      value: 'gemini',
      label: 'Gemini',
      iconType: 'gemini',
      connected: !!apiKeys.find((key) => key.provider === 'gemini'),

      settingsComponent: GeminiSettings,
    },
    {
      value: 'ollama',
      label: 'Ollama',
      iconType: 'ollama',
      connected: ollamaConnected,
      settingsComponent: () => (
        <OllamaSettings
          onRefresh={() => {
            checkOllamaConnection();
          }}
        />
      ),
    },
    {
      value: 'groq',
      label: 'Groq',
      iconType: 'groq',
      connected: !!apiKeys.find((key) => key.provider === 'groq'),
      settingsComponent: GroqSettings,
    },
  ];
  return (
    <SettingsContainer title="Providers">
      <Accordion
        type="single"
        value={selectedModel}
        collapsible
        className="w-full"
        onValueChange={(value) => {
          setSelectedModel(value as TProvider);
        }}
      >
        {modelSettingsData.map((model) => (
          <AccordionItem key={model.value} value={model.value}>
            <AccordionTrigger>
              <Flex gap="md" items="center">
                <ModelIcon type={model.iconType as ModelIconType} size="sm" />
                {model.label}
              </Flex>
              <Flex className="flex-1" />
              <div
                className={cn(
                  '!rotate-0 px-2',
                  model.connected
                    ? 'text-teal-600 dark:text-teal-400'
                    : 'text-zinc-500'
                )}
              >
                {model.connected ? (
                  <CheckmarkCircle01Icon size={16} variant="solid" />
                ) : (
                  <Alert01Icon size={16} strokeWidth={1.5} variant="solid" />
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-3 py-6">
              <model.settingsComponent />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </SettingsContainer>
  );
}
