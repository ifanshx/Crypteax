// app/error.tsx
'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import { XCircle } from 'lucide-react'; // Menggunakan ikon XCircle dari lucide-react
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'; // Menggunakan komponen Card
import { Button } from '@/components/ui/button'; // Menggunakan komponen Button

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div
            className="relative flex min-h-screen items-center justify-center bg-background overflow-hidden"
        >
            {/* Background Effect: Menggunakan gradient dan animasi */}
            <div
                className="absolute inset-0 bg-gradient-to-br from-background to-destructive/10 z-0 opacity-90 animate-fade-in-up duration-1000" // Warna gradient ke destructive untuk nuansa error
            ></div>

            <Card
                className="z-10 p-8 text-center max-w-md mx-4 shadow-2xl border border-destructive/30 rounded-xl animate-zoom-in duration-700 delay-200" // Border ke destructive, bayangan lebih kuat, animasi zoom-in
            >
                <CardHeader className="p-0 pb-4 flex flex-col items-center">
                    <XCircle className="size-16 text-destructive mb-4 animate-bounce-in-down duration-500" /> {/* Ikon XCircle yang lebih besar dengan warna destructive dan animasi */}
                    <CardTitle className="text-4xl font-extrabold text-destructive mb-2 tracking-tight">
                        Oops, Something Broke!
                    </CardTitle>
                    <CardDescription className="text-lg text-muted-foreground leading-relaxed">
                        It looks like we spilled the tea...
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0 pt-4">
                    <p className="text-md text-foreground mb-6">
                        We&#39;re sorry, an unexpected error occurred. Please try reloading the page.
                    </p>
                    {error.digest && (
                        <p className="text-xs text-muted-foreground break-all mb-4 opacity-70">
                            Error Ref: <code>{error.digest}</code>
                        </p>
                    )}
                    <Button
                        variant="destructive" // Menggunakan variant destructive dari Button UI
                        size="lg" // Ukuran tombol besar
                        onClick={() => reset()}
                        className="rounded-full font-semibold text-lg px-8 py-4 shadow-md hover:scale-105 transition-transform duration-300 ease-out"
                    >
                        Try Again
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}