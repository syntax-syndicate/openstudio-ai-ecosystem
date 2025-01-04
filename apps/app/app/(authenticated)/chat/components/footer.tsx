export type TFooter = {
  show: boolean;
};

export const Footer = ({ show }: TFooter) => {
  if (!show) {
    return null;
  }
  return (
    <div className="fixed right-0 bottom-0 left-0 flex w-full flex-row justify-center p-3 text-xs">
      <p className="text-xs text-zinc-500/50">
        P.S. Your data is stored locally on local storage, not in the cloud.
      </p>
    </div>
  );
};
