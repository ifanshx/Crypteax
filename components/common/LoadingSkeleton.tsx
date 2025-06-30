// file: components/common/LoadingSkeleton.tsx
import { cn } from "@/lib/utils"; //
import { Skeleton } from "@/components/ui/skeleton"; //
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; //

/**
 * @interface LoadingSkeletonProps
 * @extends React.ComponentProps<'div'>
 * @property {'dashboard-summary' | 'table-list' | 'text-block' | 'chart'} [type] - Jenis skeleton yang akan dirender.
 * - 'dashboard-summary': Meniru tata letak kartu ringkasan dashboard.
 * - 'table-list': Meniru daftar atau tabel.
 * - 'text-block': Meniru blok teks.
 * - 'chart': Meniru layout chart.
 */
interface LoadingSkeletonProps extends React.ComponentProps<'div'> {
    type?: 'dashboard-summary' | 'table-list' | 'text-block' | 'chart';
}

/**
 * LoadingSkeleton Component
 *
 * Komponen ini menampilkan placeholder animasi (skeleton) saat data sedang dimuat,
 * memberikan umpan balik visual kepada pengguna.
 *
 * @param {LoadingSkeletonProps} props - Properti untuk menyesuaikan tampilan skeleton.
 * @returns {JSX.Element} Komponen skeleton loading.
 */
export default function LoadingSkeleton({
    className,
    type = 'dashboard-summary',
    ...props
}: LoadingSkeletonProps) {

    // Renders a skeleton mimicking dashboard summary cards
    const renderDashboardSummary = () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full animate-fade-in-up duration-500">
            {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="p-6">
                    <CardHeader className="p-0 pb-4">
                        <CardTitle>
                            <Skeleton className="h-6 w-3/4 mb-2" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Skeleton className="h-10 w-1/2" />
                    </CardContent>
                </Card>
            ))}
        </div>
    );

    // Renders a skeleton mimicking a table or list
    const renderTableList = () => (
        <div className="space-y-4 w-full animate-fade-in-up duration-500">
            <Skeleton className="h-8 w-1/3 mb-4" /> {/* Section Title Skeleton */}
            <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-4 p-2 rounded-md bg-card border">
                        <Skeleton className="h-8 w-8 rounded-full" /> {/* Avatar/Icon Skeleton */}
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    // Renders a skeleton mimicking a block of text
    const renderTextBlock = () => (
        <div className="space-y-3 w-full max-w-lg animate-fade-in-up duration-500">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-4 w-[95%]" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[80%]" />
        </div>
    );

    // Renders a skeleton mimicking a chart area
    const renderChart = () => (
        <Card className="p-6 w-full aspect-video flex flex-col gap-4 animate-fade-in-up duration-500">
            <Skeleton className="h-8 w-1/2" /> {/* Chart Title */}
            <Skeleton className="flex-1 w-full" /> {/* Main Chart Area */}
            <div className="flex justify-center gap-4">
                <Skeleton className="h-4 w-1/5" />
                <Skeleton className="h-4 w-1/5" />
                <Skeleton className="h-4 w-1/5" />
            </div>
        </Card>
    );

    const renderSkeletonContent = () => {
        switch (type) {
            case 'dashboard-summary':
                return renderDashboardSummary();
            case 'table-list':
                return renderTableList();
            case 'text-block':
                return renderTextBlock();
            case 'chart':
                return renderChart();
            default:
                return renderDashboardSummary();
        }
    };

    return (
        <div
            className={cn(
                "w-full h-full flex flex-col items-center justify-center",
                className
            )}
            {...props}
        >
            {renderSkeletonContent()}
        </div>
    );
}