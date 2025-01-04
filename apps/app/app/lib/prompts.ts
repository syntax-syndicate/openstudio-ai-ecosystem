export const PromptType = {
  ask: 'ask',
  answer: 'answer',
  explain: 'explain',
  summarize: 'summarize',
  improve: 'improve',
  fix_grammar: 'fix_grammar',
  reply: 'reply',
  short_reply: 'short_reply',
} as const;

export type PromptType = (typeof PromptType)[keyof typeof PromptType];

export const RoleType = {
  assistant: 'assistant',
  writing_expert: 'writing_expert',
  social_media_expert: 'social_media_expert',
} as const;

export type RoleType = (typeof RoleType)[keyof typeof RoleType];

export const getInstruction = (type: PromptType): string => {
  switch (type) {
    case PromptType.ask:
      return 'Answer this question or respond to this message';
    case PromptType.answer:
      return 'Provide a detailed answer to this question';
    case PromptType.explain:
      return 'Explain this concept or topic in detail';
    case PromptType.summarize:
      return 'Summarize this text or content';
    case PromptType.improve:
      return 'Improve this text or content';
    case PromptType.fix_grammar:
      return 'Fix the grammar and spelling in this text';
    case PromptType.reply:
      return 'Reply to this message or comment';
    case PromptType.short_reply:
      return 'Reply to this tweet, social media post or comment in short 3-4 words max';
    default:
      return 'Provide a helpful response';
  }
};

export const getRole = (type: RoleType): string => {
  switch (type) {
    case RoleType.assistant:
      return 'helpful AI assistant';
    case RoleType.writing_expert:
      return 'expert in writing and grammar';
    case RoleType.social_media_expert:
      return 'expert in tweeter, social media in general';
    default:
      return 'helpful AI assistant';
  }
};

export const examplePrompts = [
  {
    title: 'Implement JWT Auth for Express.js',
    prompt:
      'Develop a secure user authentication system in a Node.js application using JSON Web Tokens (JWT) for authorization and authentication.',
  },
  {
    title: 'The Nature of Reality',
    prompt:
      'Discuss the concept of reality from both a subjective and objective perspective, incorporating theories from famous philosophers.',
  },
  {
    title: 'Professional Meeting Follow-Up',
    prompt:
      'Write a follow-up email to a potential employer after a job interview, expressing gratitude for the opportunity and reiterating your interest in the position.',
  },
  {
    title: 'Professional Meeting Follow-Up',
    prompt:
      'Write a follow-up email to a potential employer after a job interview, expressing gratitude for the opportunity and reiterating your interest in the position.',
  },
];

export const roles = [
  {
    name: 'Fix Grammer and Typos',
    content: `Please correct all the grammar errors found in the text provided below without altering the style of the text. After correcting the errors, list them in a clear and structured format.\n Text to be corrected: {{{{your content here}}}}`,
  },
];
