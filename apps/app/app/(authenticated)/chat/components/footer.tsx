export type TFooter = {};

export const Footer = () => {
  return (
    <div className=" flex w-full flex-row justify-center p-1 text-xs">
      <p className="text-xs text-zinc-500/50">
        LLM can make mistakes, please be aware of it.
      </p>
    </div>
  );
};
