'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Separator } from './ui/separator';
import { House } from 'lucide-react';

export default function NavBar() {
    // Get the current pathname
    const pathname = usePathname();

    // Function to get the link classes
    const getLinkClasses = (href: string) => {
        return pathname === href ? 'text-lolgold2' : 'text-gray-200';
    };

    return (
        <nav className="flex gap-4 items-center w-full p-2">
            <Link href="/">
                <House className={`${getLinkClasses('/')}`} />
            </Link>
            <Separator orientation="vertical" className="h-4 bg-lolgray1/40" />
        </nav>
    );
}
