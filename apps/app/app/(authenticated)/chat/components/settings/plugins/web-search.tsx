import { usePreferenceContext } from '@/context/preferences';
import { ArrowRight, CaretDown, Info } from '@phosphor-icons/react';
import { Button } from '@repo/design-system/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/design-system/components/ui/dropdown-menu';
import { Flex } from '@repo/design-system/components/ui/flex';
import { Input } from '@repo/design-system/components/ui/input';
import { Type } from '@repo/design-system/components/ui/text';
import { useToast } from '@repo/design-system/components/ui/use-toast';
import axios from 'axios';
import { useEffect } from 'react';
import { FormLabel } from '@repo/design-system/components/ui/form-label';
import Link from 'next/link';
import ApiKeyInput from '@/app/(authenticated)/chat/components/settings/models/api-key-input';
import { configs } from '@/config';

export const WebSearchPlugin = () => {
  const { toast } = useToast();
  const { preferences, updatePreferences } = usePreferenceContext();

  useEffect(() => {}, []);

  const handleRunTest = async () => {
    try {
      const url = "https://www.googleapis.com/customsearch/v1";
      const params = {
        key: preferences.googleSearchApiKey,
        cx: preferences.googleSearchEngineId,
        q: "Latest news",
      };

      const response = await axios.get(url, { params });

      if (response.status === 200) {
        toast({
          title: "Test successful",
          description: "Google search plugin is working",
          variant: "default",
        });
      } else {
        throw new Error("Invalid response");
      }
    } catch (error) {
      toast({
        title: "Test failed",
        description: "Google search plugin is not working",
        variant: "destructive",
      });
    }
  };

  return (
    <Flex direction="col" gap="sm" className="border-t border-white/10 pt-2">
      <Flex className="w-full" justify="between" items="center">
        <Type size="sm" textColor="secondary">
          Default Search Engine
        </Type>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="secondary">
              {preferences.defaultWebSearchEngine}{" "}
              <CaretDown size={12} weight="bold" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[200px]" align="end">
            <DropdownMenuItem
              onClick={() => {
                updatePreferences({ defaultWebSearchEngine: "google" });
              }}
            >
              Google
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                updatePreferences({ defaultWebSearchEngine: "duckduckgo" });
              }}
            >
              DuckDuckGo
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Flex>
      {preferences.defaultWebSearchEngine === "google" && (
        <Flex direction="col" gap="md" className="w-full">
          <Flex direction="col" gap="sm" className="w-full">
            <FormLabel
              label="Google Search Engine ID"
              extra={() => (
                <Link
                  href={configs.googleSearchApiUrl}
                  target="_blank"
                  className="text-sm font-medium text-blue-400 hover:opacity-90"
                >
                  Get your ID here
                </Link>
              )}
            />

            <Input
              name="googleSearchEngineId"
              type="text"
              value={preferences.googleSearchEngineId}
              autoComplete="off"
              onChange={(e) => {
                updatePreferences({ googleSearchEngineId: e.target.value });
              }}
            />
          </Flex>
          <Flex direction="col" gap="sm" className="w-full">
            <FormLabel
              label="Google Search Api Key"
              extra={() => (
                <Link
                  href={configs.googleSearchEngineApiKeyUrl}
                  target="_blank"
                  className="text-sm font-medium text-blue-400 hover:opacity-90"
                >
                  Get your API key here
                </Link>
              )}
            />

            <ApiKeyInput
              value={preferences.googleSearchApiKey}
              setValue={(value) => {
                updatePreferences({ googleSearchApiKey: value });
              }}
              isDisabled={false}
              placeholder="Api Key"
              isLocked={false}
            />
          </Flex>
          <Button onClick={handleRunTest} size="sm">
            Check Connection
          </Button>
        </Flex>
      )}
    </Flex>
  );
};
