// app/not-found.tsx
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div
            className="relative flex min-h-screen items-center justify-center bg-background overflow-hidden" // Tambahkan overflow-hidden untuk animasi background
        >
            {/* Background Effect: Menggunakan pseudo-element atau div terpisah jika ingin efek lebih kompleks,
          namun untuk kesederhanaan, kita bisa menggunakan overlay dengan animasi. */}
            <div
                className="absolute inset-0 bg-gradient-to-br from-background to-card z-0 opacity-90 animate-fade-in-up duration-1000" // Animasi fadeInUp pada background gradient
            ></div>

            <Card
                className="z-10 p-8 text-center max-w-md mx-4 shadow-2xl border border-primary/20 rounded-xl animate-zoom-in duration-700 delay-200" // Border yang lebih halus, bayangan lebih kuat, animasi zoom-in
            >
                <CardHeader className="p-0 pb-4"> {/* Sesuaikan padding header card */}
                    <CardTitle className="text-6xl font-extrabold text-primary mb-3 tracking-tighter"> {/* Ukuran lebih besar, warna primary, tracking lebih ketat */}
                        404
                    </CardTitle>
                    <CardDescription className="text-xl text-foreground leading-relaxed"> {/* Ukuran lebih besar, warna foreground, line-height lebih santai */}
                        It looks like this page steeped away in hot water…
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0 pt-4"> {/* Sesuaikan padding content card */}
                    <p className="text-md text-muted-foreground mb-8"> {/* Ukuran teks sedikit lebih besar, margin bawah lebih besar */}
                        (Don’t worry, we still have tea for you!)
                    </p>
                    <Button
                        asChild
                        variant="default" // Menggunakan variant default dari Button UI
                        size="lg" // Ukuran tombol besar
                        className="rounded-full font-semibold text-lg px-8 py-4 shadow-md hover:scale-105 transition-transform duration-300 ease-out" // Tombol bulat, bayangan, efek hover
                    >
                        <Link href="/" aria-label="Go back to homepage">
                            Back to Home
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}