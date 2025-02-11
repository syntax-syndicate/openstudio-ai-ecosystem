import { Icons } from "@repo/design-system/components/ui/icons";


export function UnderConstruction() {
    return (
        <div className="flex justify-center w-full mb-8 px-4 sm:px-0">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-800 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-yellow-600">🚧</span>
            <span className="font-medium text-sm sm:text-base">
              UNDER CONSTRUCTION
            </span>
            <span className="text-yellow-600">🚧</span>
          </div>
          <div className="hidden sm:block mx-2 h-4 w-px bg-yellow-200" />
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm">Follow on:</span>
            <div className="flex items-center gap-2">
              <a
                href="https://x.com/kuluruvineeth"
                className="p-1.5 hover:bg-yellow-100 rounded-full transition-colors"
                aria-label="Twitter"
              >
                <Icons.x className="size-3 sm:size-4 text-yellow-700" />
              </a>
              <a
                href="https://github.com/kuluruvineeth/openstudio-beta"
                className="p-1.5 hover:bg-yellow-100 rounded-full transition-colors"
                aria-label="GitHub"
              >
                <Icons.github className="size-3 sm:size-4 text-yellow-700" />
              </a>
            </div>
          </div>
        </div>
      </div>
    )
}