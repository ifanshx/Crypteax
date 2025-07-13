// src/components/FooterHome.tsx
import Link from "next/link";
import React from "react";
import { cn } from '@/lib/utils'; // Untuk classnames kondisional

/**
 * @interface FooterLink
 * @property {string} name - Nama tampilan link.
 * @property {string} href - URL tujuan link.
 */
interface FooterLink {
    name: string;
    href: string;
}

export function FooterHome() {
    const footerLinks: FooterLink[] = [
        { name: "Github", href: "https://github.com/your-repo" },
        { name: "Whitepaper", href: "/whitepaper" },
        { name: "Support", href: "/support" },
        { name: "Twitter", href: "https://twitter.com/your-handle" },
    ];

    return (
        <footer className="w-full absolute bottom-0 h-16 flex items-center justify-center z-10 px-2 md:px-0">
            <div className={cn(
                "w-[95%] md:w-[70%] mx-auto rounded-full p-2",
                "bg-white/20 backdrop-blur-lg border border-white/10",
                "shadow-lg transition-all duration-300 ease-in-out",
                "hover:scale-[1.01] hover:shadow-xl"
            )}>
                <nav aria-label="Footer navigation">
                    <ul className="flex flex-wrap justify-center gap-x-2 sm:gap-x-4 gap-y-1 text-white/80 py-1 px-1">
                        {footerLinks.map((link, index) => (
                            <li key={link.name} className="flex items-center"> {/* Use li directly and align items */}
                                <Link
                                    href={link.href}
                                    className={cn(
                                        "text-xs sm:text-sm font-medium",
                                        "hover:text-white transition-colors duration-200 ease-in-out",
                                        "focus:outline-none focus:ring-2 focus:ring-white/50 rounded-md px-1"
                                    )}
                                    {...(link.href.startsWith("http")
                                        ? { target: "_blank", rel: "noopener noreferrer" }
                                        : {})}
                                >
                                    {link.name}
                                </Link>
                                {index < footerLinks.length - 1 && (
                                    <span
                                        className="text-white/30 ml-2 hidden sm:inline-block" // Added ml-2 for spacing
                                        aria-hidden="true"
                                    >
                                        |
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </footer>
    );
}