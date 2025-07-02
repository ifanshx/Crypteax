import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { ConnectButton } from '../common/ConnectButton';

export function Topbar() {
    return (
        <header className="fixed left-16 top-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-100">
            <div className="relative flex items-center flex-grow max-w-xs ml-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                    type="text"
                    placeholder="Search Collection"
                    className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-blue-500 text-sm placeholder:text-gray-400"
                />
            </div>

            <div className="flex items-center space-x-6 mr-4">
                <span className="text-sm font-medium text-gray-700">0.00 CTEA</span>
                <span className="text-sm font-medium text-gray-700">0.00 TEA</span>
                <ConnectButton />
            </div>
        </header>
    );
}