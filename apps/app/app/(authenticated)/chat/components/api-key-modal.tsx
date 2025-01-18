import { ProviderSelect } from '@/app/(authenticated)/chat/components/provider-select';
import { AnthropicSettings } from '@/app/(authenticated)/chat/components/settings/models/anthropic';
import { GeminiSettings } from '@/app/(authenticated)/chat/components/settings/models/gemini';
import { GroqSettings } from '@/app/(authenticated)/chat/components/settings/models/groq';
import { OllamaSettings } from '@/app/(authenticated)/chat/components/settings/models/ollama';
import { OpenAISettings } from '@/app/(authenticated)/chat/components/settings/models/openai';
import { useRootContext } from '@/context/root';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@repo/design-system/components/ui/dialog';

export const ApiKeyModal = () => {
  const {
    openApiKeyModal,
    setOpenApiKeyModal,
    apiKeyModalProvider = 'openai',
    setApiKeyModalProvider,
  } = useRootContext();
  return (
    <Dialog open={openApiKeyModal} onOpenChange={setOpenApiKeyModal}>
      <DialogContent
        ariaTitle="Add API Key"
        className="no-scrollbar !max-w-[460px] max-h-[80vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle>Add API Key</DialogTitle>
        </DialogHeader>
        <ProviderSelect
          variant="bordered"
          selectedProvider={apiKeyModalProvider || 'openai'}
          setSelectedProvider={setApiKeyModalProvider}
        />
        {apiKeyModalProvider === 'openai' && <OpenAISettings />}
        {apiKeyModalProvider === 'anthropic' && <AnthropicSettings />}
        {apiKeyModalProvider === 'gemini' && <GeminiSettings />}
        {apiKeyModalProvider === 'groq' && <GroqSettings />}
        {apiKeyModalProvider === 'ollama' && (
          <OllamaSettings onRefresh={() => {}} />
        )}
      </DialogContent>
    </Dialog>
  );
};
