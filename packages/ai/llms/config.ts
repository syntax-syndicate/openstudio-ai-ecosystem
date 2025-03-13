export const Provider = {
  OPEN_AI: 'openai',
  ANTHROPIC: 'anthropic',
  GOOGLE: 'google',
  GROQ: 'groq',
  GROK: 'grok',
  OPENROUTER: 'openrouter',
};

export const Model = {
  GPT_4O: 'gpt-4o',
  GPT_4O_MINI: 'gpt-4o-mini',
  CLAUDE_3_7_SONNET: 'claude-3-7-sonnet-20250219',
  GEMINI_1_5_PRO: 'gemini-1.5-pro-latest',
  GEMINI_1_5_FLASH: 'gemini-1.5-flash-latest',
  GEMINI_2_0_FLASH_LITE: 'gemini-2.0-flash-lite',
  GEMINI_2_0_FLASH: 'gemini-2.0-flash',
  GROQ_LLAMA_3_3_70B: 'llama-3.3-70b-versatile',
};

export const providerOptions: { label: string; value: string }[] = [
  { label: 'OpenAI', value: Provider.OPEN_AI },
  { label: 'Anthropic', value: Provider.ANTHROPIC },
  { label: 'Google', value: Provider.GOOGLE },
  { label: 'Groq', value: Provider.GROQ },
  { label: 'Grok', value: Provider.GROK },
  { label: 'OpenRouter', value: Provider.OPENROUTER },
];

export const modelOptions: Record<string, { label: string; value: string }[]> =
  {
    [Provider.OPEN_AI]: [
      { label: 'GPT-4o', value: Model.GPT_4O },
      { label: 'GPT-4o-mini', value: Model.GPT_4O_MINI },
    ],
    [Provider.ANTHROPIC]: [
      { label: 'Claude 3.7 Sonnet', value: Model.CLAUDE_3_7_SONNET },
    ],
    [Provider.GOOGLE]: [
      { label: 'Gemini 1.5 Pro', value: Model.GEMINI_1_5_PRO },
      { label: 'Gemini 1.5 Flash', value: Model.GEMINI_1_5_FLASH },
      { label: 'Gemini 2.0 Flash Lite', value: Model.GEMINI_2_0_FLASH_LITE },
      { label: 'Gemini 2.0 Flash', value: Model.GEMINI_2_0_FLASH },
    ],
    [Provider.GROQ]: [
      { label: 'Groq Llama 3.3 70B', value: Model.GROQ_LLAMA_3_3_70B },
    ],
    [Provider.GROK]: [],
    [Provider.OPENROUTER]: [],
  };
