export function NothingPlaceholder({ name }: { name?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-md border border-gray-3 p-5">
      <h3>Nothing here yet</h3>
      <p className="text-gray-4 text-sm">
        It looks like {name} is still working on it.
      </p>
    </div>
  );
}
