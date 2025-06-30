'use client'

import React from 'react'
import { Button } from '@/components/ui/button' // shadcn/ui Button :contentReference[oaicite:1]{index=1}
import { useAppKit, useAppKitAccount, useDisconnect } from '@reown/appkit/react'
import { Loader2Icon, ChevronDown } from 'lucide-react' // import ChevronDown dari lucide-react :contentReference[oaicite:2]{index=2}

export const ConnectButton = () => {
    const { open } = useAppKit()
    const { address, isConnected, status } = useAppKitAccount()
    const { disconnect } = useDisconnect()

    const isLoading = status === 'connecting' || status === 'reconnecting'

    const handleClick = () => {
        if (isConnected) disconnect()
        else open({ view: 'Connect', namespace: 'eip155' })
    }

    return (
        <Button
            onClick={handleClick}
            variant={isConnected ? 'ghost' : 'ghost'}
            size="sm"
            disabled={isLoading}
        >
            {isLoading ? (
                <>
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" /> Connecting…
                </>
            ) : (
                <>
                    <ChevronDown className="mr-1 h-4 w-4" />
                    {isConnected && address
                        ? `Disconnect`
                        : 'Connect Wallet'}
                </>
            )}
        </Button>
    )
}
