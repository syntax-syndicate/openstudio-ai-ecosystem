import { useChatContext, usePreferenceContext } from '@/context';
import {
  barChartToolDefinition,
  dalleToolDefinition,
  duckduckGoToolDefinition,
  googleSearchToolDefinition,
  lineChartToolDefinition,
  memoryToolDefinition,
  pieChartToolDefinition,
  readerToolDefinition,
} from '@/tools';
import type { TModelItem, ToolDefinition, ToolKey } from '@/types';

export const useTools = () => {
  const { store } = useChatContext();
  const { preferences, updatePreferences, apiKeys } = usePreferenceContext();
  const addTool = store((state) => state.addTool);

  const tools: ToolDefinition[] = [
    dalleToolDefinition,
    preferences.defaultWebSearchEngine === 'duckduckgo'
      ? duckduckGoToolDefinition
      : googleSearchToolDefinition,
    memoryToolDefinition,
    readerToolDefinition,
    pieChartToolDefinition,
    barChartToolDefinition,
    lineChartToolDefinition,
  ];

  const getToolByKey = (key: ToolKey) => {
    return tools.find((tool) => tool.key.includes(key));
  };

  const getAvailableTools = (model: TModelItem) => {
    const plugins = preferences.defaultPlugins || [];

    return (
      model?.plugins
        ?.filter((p) => plugins.includes(p) || p === 'webpage_reader')
        ?.map((p) =>
          getToolByKey(p)?.executionFunction({
            updatePreferences,
            preferences,
            model,
            apiKeys,
            updateToolExecutionState: addTool,
          })
        )
        ?.filter((t): t is any => !!t) || []
    );
  };

  return {
    tools,
    getToolByKey,
    getAvailableTools,
  };
};
