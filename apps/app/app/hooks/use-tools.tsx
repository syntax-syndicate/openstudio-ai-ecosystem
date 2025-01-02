import { env } from '@/env';
import type { ChatAnthropic } from '@langchain/anthropic';
import { TavilySearchResults } from '@langchain/community/tools/tavily_search';
import {
  AIMessage,
  type AIMessageChunk,
  SystemMessage,
} from '@langchain/core/messages';
import { RunnableLambda } from '@langchain/core/runnables';
import { DynamicStructuredTool } from '@langchain/core/tools';
import type { IterableReadableStream } from '@langchain/core/utils/stream';
import type { ChatOpenAI } from '@langchain/openai';
import { z } from 'zod';

const calculatorSchema = z.object({
  operation: z
    .enum(['add', 'subtract', 'multiply', 'divide'])
    .describe('The type of operation to execute.'),
  number1: z.number().describe('The first number to operate on.'),
  number2: z.number().describe('The second number to operate on.'),
});

type CalculatorInput = z.infer<typeof calculatorSchema>;
const calculatorTool = () => {
  return new DynamicStructuredTool({
    name: 'calculator',
    description: 'Can perform mathematical operations.',
    schema: calculatorSchema,
    func: async ({ operation, number1, number2 }: CalculatorInput) => {
      // Functions must return strings
      if (operation === 'add') {
        return `${number1 + number2}`;
      } else if (operation === 'subtract') {
        return `${number1 - number2}`;
      } else if (operation === 'multiply') {
        return `${number1 * number2}`;
      } else if (operation === 'divide') {
        return `${number1 / number2}`;
      } else {
        throw new Error('Invalid operation.');
      }
    },
  });
};
type SearchResult = {
  title: string;
  url: string;
  description: string;
};
export const useTools = (): {
  calTool: DynamicStructuredTool<typeof calculatorSchema>;
  searchTool: TavilySearchResults;
  toolCalling: (
    selectedModel: ChatOpenAI | ChatAnthropic
  ) => RunnableLambda<
    AIMessage,
    AIMessage | IterableReadableStream<AIMessageChunk>
  >;
} => {
  const calTool = calculatorTool();
  const searchTool = new TavilySearchResults({
    maxResults: 5,
    apiKey: env.NEXT_PUBLIC_TAVILY_API_KEY,
  });
  const toolCalling = (selectedModel: ChatOpenAI | ChatAnthropic) =>
    new RunnableLambda({
      func: async (output: AIMessage) => {
        const tool = output?.tool_calls?.[0];
        if (tool?.name === 'calculator') {
          const result = await calTool.invoke(tool.args as CalculatorInput);
          return new AIMessage(result);
        }
        if (tool?.name === 'tavily_search_results_json') {
          const result = await searchTool.invoke(tool.args.input);
          const parsedResults = JSON.parse(result) as SearchResult[];
          const searchPrompt = [
            new SystemMessage(
              `Based on past conversation here are result from the internet. ${parsedResults.map(
                (r, index) =>
                  `${index + 1}. Title: """${r.title}""" \n URL: """${r.url}"""\n description: """${r.description}""" `
              )} . Please summarize this findings with citation link to their source`
            ),
          ];
          return selectedModel.stream(searchPrompt);
        }
        return output;
      },
    });
  return { calTool, searchTool, toolCalling };
};
