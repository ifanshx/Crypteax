'use client'

import { ConnectButton } from "@/components/common/ConnectButton";
import { useToast } from "@/context/ToastContext";

export default function Home() {
  const { add } = useToast()

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <ConnectButton />
        <button onClick={() => add({
          title: 'Sukses!',
          description: 'Data berhasil disimpan.',
          type: 'success',
          duration: 50000
        })}>
          Tampilkan Toast
        </button>
      </main>

    </div>
  );
}
