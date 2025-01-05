// 'use client';
// import { BotLibrary } from '@/app/(authenticated)/chat/components/bots/bot-library';
// import { CreateBot } from '@/app/(authenticated)/chat/components/bots/create-bot';
// import { BotsContext } from '@/app/context/bots/context';
// import { useSessionsContext } from '@/app/context/sessions/provider';
// import { type TBot, useBots } from '@/app/hooks/use-bots';
// import {
//   Dialog,
//   DialogContent,
// } from '@repo/design-system/components/ui/dialog';
// import { useQuery } from '@tanstack/react-query';
// import axios from 'axios';
// import moment from 'moment';
// import { useRouter } from 'next/navigation';
// import { useState } from 'react';

// export type TBotsProvider = {
//   children: React.ReactNode;
// };

// export type TBotMenuItem = {
//   name: string;
//   key: string;
//   icon: () => React.ReactNode;
//   component: React.ReactNode;
// };
// export const BotsProvider = ({ children }: TBotsProvider) => {
//   const [isBotOpen, setIsBotOpen] = useState(false);
//   const [showCreateBot, setShowCreateBot] = useState(false);
//   const [tab, setTab] = useState<'public' | 'local'>('public');
//   const {
//     currentSession,
//     createSession,
//     refetchCurrentSession,
//     updateSessionMutation,
//   } = useSessionsContext();
//   const { botsQuery, createBotMutation, deleteBotMutation } = useBots();
//   const { push, refresh } = useRouter();

//   const open = (action?: 'public' | 'local' | 'create') => {
//     if (action === 'create') {
//       setShowCreateBot(true);
//     } else {
//       action && setTab(action);
//     }
//     setIsBotOpen(true);
//   };

//   const dismiss = () => setIsBotOpen(false);

//   const localBotsQuery = botsQuery;

//   const publicBotsQuery = useQuery<{ bots: TBot[] }>({
//     queryKey: ['Bots'],
//     queryFn: async () => axios.get('/api/bots').then((res) => res.data),
//   });

//   const allBots = [
//     ...(localBotsQuery?.data || []),
//     ...(publicBotsQuery.data?.bots || []),
//   ];

//   const assignBot = (bot: TBot) => {
//     console.log('assign', bot);
//     if (currentSession?.messages?.length) {
//       createSession({
//         bot,
//         redirect: true,
//       });
//     } else {
//       console.log('currentsession', bot, currentSession);

//       currentSession?.id &&
//         updateSessionMutation.mutate(
//           {
//             sessionId: currentSession?.id,
//             session: { updatedAt: moment().toISOString() },
//           },
//           {
//             onSuccess: () => {
//               console.log('success');
//               refetchCurrentSession?.();
//               refresh();
//             },
//           }
//         );
//     }
//     dismiss?.();
//   };

//   return (
//     <BotsContext.Provider value={{ open, dismiss, allBots, assignBot }}>
//       {children}

//       <Dialog open={isBotOpen} onOpenChange={setIsBotOpen}>
//         <DialogContent className="flex max-h-[80dvh] w-[96dvw] flex-col gap-0 overflow-hidden rounded-2xl border border-white/5 p-0 md:max-h-[600px] md:min-w-[640px]">
//           {showCreateBot ? (
//             <CreateBot
//               open={showCreateBot}
//               onOpenChange={(isOpen) => {
//                 setShowCreateBot(isOpen);
//                 if (!isOpen) {
//                   setTab('local');
//                 }
//               }}
//               onCreateBot={(bot) => {
//                 createBotMutation.mutate(bot);
//               }}
//             />
//           ) : (
//             <BotLibrary
//               open={!showCreateBot}
//               tab={tab}
//               localBots={localBotsQuery.data || []}
//               publicBots={publicBotsQuery.data?.bots || []}
//               assignBot={assignBot}
//               onTabChange={setTab}
//               onDelete={(bot: TBot) => {
//                 deleteBotMutation.mutate(bot.id);
//               }}
//               onCreate={() => setShowCreateBot(true)}
//             />
//           )}
//         </DialogContent>
//       </Dialog>
//     </BotsContext.Provider>
//   );
// };
