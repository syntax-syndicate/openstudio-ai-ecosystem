"use client"

import { useChatContext } from "@/app/context/chat/context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


const App = async () => {
   const router = useRouter();
  const { createSession } = useChatContext();
  useEffect(() => {
    createSession().then((session) => {
      router.push(`/chat/${session.id}`);
    });
  }, []);

  return (
    <>
       <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
      </div>
    </>
  );
};

export default App;
