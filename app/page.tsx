'use client';

import { ConnectButton } from "@/components/common/ConnectButton";

export default function Home() {

  return (
    <div className="relative min-h-screen font-[family-name:var(--font-geist-sans)] overflow-hidden">

      {/* Main Content */}
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 relative z-10">
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
          <ConnectButton />
        </main>
      </div>
    </div>
  );
}
