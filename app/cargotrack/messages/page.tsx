'use client';

import { PagedResult, Thread } from "@/appTypes";
import { ThreadDisplay } from "@/components/messages/threadDisplay";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { useFetch } from "@/hooks/useFetch";
import LoadingComponent from "@/components/common/loader";
import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { capitalizeWord } from "@/utils/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAppStore } from "@/store/userStore";

export default function Page() {
    const [selectedThreadId, setSelectedThreadId] = useState<number | null>(null);
    const { data, error, loading } = useFetch<PagedResult<Thread>>("GET", "/threads");
    const store = useAppStore();
    const activeUserId = store.getUserInfo()?.id ?? -1;

    if (selectedThreadId && data?.data) {
        const selectedThread = data.data.find(x => x.id == selectedThreadId);
        if (selectedThread) {
            selectedThread.isRead = true;
        }
    }

    if (loading) return <LoadingComponent isAdminOnly={false} />;
    if (error) { console.log("error", error); }

    return (
        <div className="flex flex-1 border">
            <ScrollArea className="flex flex-1">
                <div className="ml-auto flex gap-2 p-4">
                    <Button size="sm" className="h-8 gap-1" asChild>
                        <Link href={"/cargotrack/messages/new"}>
                            <PlusCircle className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                New Thread
                            </span>
                        </Link>
                    </Button>
                </div>

                {/* <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <form>
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search" className="pl-8" />
                        </div>
                    </form>
                </div> */}

                <div className="flex flex-col gap-2 p-4 pt-0">
                    {data?.data.map((item) => (
                        <button
                            key={item.id}
                            className={cn(
                                "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
                                selectedThreadId === item.id && "bg-muted"
                            )}
                            onClick={() => setSelectedThreadId(item.id)}
                        >
                            <div className="flex w-full flex-col gap-1">
                                <div className="flex items-center">
                                    <div className="flex items-center gap-2">
                                        <div className="font-semibold">{capitalizeWord(item.name)}</div>
                                        {!item.isRead && (
                                            <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                                        )}
                                    </div>
                                    <div
                                        className={cn("ml-auto text-xs",
                                            selectedThreadId === item.id
                                                ? "text-foreground"
                                                : "text-muted-foreground"
                                        )}
                                    >
                                        {formatDistanceToNow(new Date(item.date), {
                                            addSuffix: true,
                                        })}
                                    </div>
                                </div>
                                <div className="text-xs font-medium">{item.subject}</div>
                            </div>
                            <div className="line-clamp-2 text-xs text-muted-foreground">
                                {item.teaser}
                            </div>
                        </button>
                    ))}
                </div>
            </ScrollArea>

            {/* Message Display */}
            <div className="border flex-1">
                {
                    selectedThreadId
                        ? <ThreadDisplay
                            canUserDeleteThread={Number(activeUserId) === data?.data.find(x => x.id === selectedThreadId)?.authorId}
                            threadId={selectedThreadId}
                        />
                        : <div className="text-center text-sm py-40">No Thread Selected</div>
                }
            </div>
        </div>
    );
}