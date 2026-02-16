import { Skeleton } from '../ui/skeleton';

export default function DashboardSkeleton() {
    return (
        <div className="space-y-10 pb-12 animate-pulse">

            {/* Hero Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="col-span-1 md:col-span-2 lg:col-span-3 h-64 bg-slate-200 dark:bg-slate-800 rounded-[2rem]" />
            </div>

            {/* Stats Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-[1.5rem]" />
                ))}
            </div>

            {/* Courses & Sidebar Skeleton */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
                <div className="xl:col-span-2 space-y-8">
                    <div className="flex justify-between items-center mb-6">
                        <Skeleton className="h-8 w-40 rounded-lg" />
                        <Skeleton className="h-8 w-32 rounded-lg" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-80 bg-slate-200 dark:bg-slate-800 rounded-[2rem]" />
                        ))}
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="h-[400px] bg-slate-200 dark:bg-slate-800 rounded-[2rem]" />
                    <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-[2rem]" />
                </div>
            </div>
        </div>
    );
}
