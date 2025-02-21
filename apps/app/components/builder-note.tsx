import Image from 'next/image';
import Link from 'next/link';

export function BuilderNote() {
  return (
    <div className="lg:-mx-4 xl:-mx-6 2xl:-mx-8 flex flex-col gap-4 rounded-lg border-[0.5px] bg-[#FFFDF9] p-4 shadow md:p-8 lg:p-12 dark:bg-zinc-800">
      <div className="mb-4 flex flex-col gap-1.5 md:mb-6 lg:mb-8">
        <p className="font-mono text-amber-950/60 bg-blend-overlay dark:text-zinc-400">
          Builder Note
        </p>
        <p className="font-mono text-amber-950/60 bg-blend-overlay dark:text-zinc-400">
          Open Studio Tech.
        </p>
      </div>
      <p className="text-amber-950 leading-[1.8] dark:text-primary">
        The future of software isn’t closed. It’s open.
      </p>

      <p className="text-amber-950 leading-[1.8] dark:text-primary">
        We’re drowning in fragmented, closed, and inaccessible tools. But real
        progress happens when we build together. Open Studio is that space.
      </p>

      <p className="text-amber-950 leading-[1.8] dark:text-primary">
        With <strong>OpenStudio ChatHub</strong>, we provide a home for seamless
        conversations—where diverse models, real-time search, and powerful
        agents fuel research and creativity.
      </p>

      <p className="text-amber-950 leading-[1.8] dark:text-primary">
        With <strong>OpenStudio Tube</strong>, we empower YouTube creators to do
        what they love—while automation handles the rest. Comment management,
        insights, optimization—effortless, open-source, and built for creators.
      </p>

      <p className="text-amber-950 leading-[1.8] dark:text-primary">
        This isn’t just another platform. It’s a movement.
      </p>

      <ul className="ml-4 list-disc">
        <li className="pl-2 text-amber-950 leading-[1.8] dark:text-primary">
          A call for builders, creators, and dreamers
        </li>
        <li className="pl-2 text-amber-950 leading-[1.8] dark:text-primary">
          Who believe software should be transparent and collaborative
        </li>
        <li className="pl-2 text-amber-950 leading-[1.8] dark:text-primary">
          And free to evolve
        </li>
      </ul>

      <p className="text-amber-950 leading-[1.8] dark:text-primary">
        If that sounds like you, Open Studio is waiting.
      </p>

      <div className="mt-8 flex flex-col gap-4">
        {/* <Signature /> */}

        <Link
          href="https://x.com/brian_lovin"
          target="_blank"
          className="mt-4 flex items-center gap-4 md:mt-6 lg:mt-8"
        >
          <Image
            src="/images/vineeth.png"
            width={80}
            height={80}
            alt="Kuluru Vineeth"
            className="h-11 w-11 rounded-full"
          />
          <div className="flex flex-col">
            <p className="text-amber-950 dark:text-zinc-400">Kuluru Vineeth</p>
            <p className="text-amber-950 dark:text-zinc-400">
              Builder, Open Studio
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}

function Signature() {
  return (
    <Image
      src="/images/signature.png"
      alt="Signature"
      width={100}
      height={100}
    />
  );
}
