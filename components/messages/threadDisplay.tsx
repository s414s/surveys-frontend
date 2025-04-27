'use client';

import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Message } from "@/appTypes";
import { useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import LoadingComponent from "../common/loader";
import { capitalizeWord } from "@/utils/utils";
import { replyToThreadMessage } from "@/utils/endpoints/threadsEndpoints";

export function ThreadDisplay({ threadId }: { threadId: number; }) {
    const [reply, setReply] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data, error, loading, refetch } = useFetch<Message[]>("GET", `/threads/${threadId}/messages`);
    if (error) console.log(error);

    async function handleSendMessage() {
        if (!reply.trim()) return; // Don't submit empty replies
        try {
            setIsSubmitting(true);
            await replyToThreadMessage(threadId, { text: reply });
            setReply("");
            refetch?.();
        } catch (err) {
            console.error(err);
            alert(err);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="flex h-full flex-col">
            {/* Toolbar */}
            <div className="flex items-center p-2">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => console.log("Move to trash clicked")}
                            >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Move to trash</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Move to trash</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            <Separator />

            {loading && <LoadingComponent isAdminOnly={false} />}

            {/* Display messages */}
            {data?.map(x => (
                <div key={x.id} className="w-full flex-col border">
                    <div className="flex items-start p-4">
                        <div className="flex items-start gap-4 text-sm">
                            <Avatar>
                                <AvatarImage alt={`${x.name} ${x.surname}`} />
                                <AvatarFallback>
                                    {x.name[0].toUpperCase() + x.surname[0].toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid gap-1">
                                <div className="font-semibold">
                                    {capitalizeWord(x.name)} {capitalizeWord(x.surname)}
                                </div>
                                <div className="line-clamp-1 text-xs">{x.subject}</div>
                                <div className="line-clamp-1 text-xs">{x.email}</div>
                            </div>
                        </div>
                        {x.date && (
                            <div className="ml-auto text-xs text-muted-foreground">
                                {format(new Date(x.date), "PPpp")}
                            </div>
                        )}
                    </div>
                    <Separator />
                    <div className="whitespace-pre-wrap p-4 text-sm">{x.text}</div>
                </div>
            ))}

            {/* Reply form pinned to bottom */}
            <Separator className="mt-auto" />
            <div className="p-4">
                <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}>
                    <div className="grid gap-4">
                        <Textarea
                            className="p-4"
                            placeholder="Reply..."
                            value={reply}
                            onChange={(e) => setReply(e.target.value)}
                        />
                        <div className="flex items-center">
                            <Button
                                type="submit"
                                size="sm"
                                className="ml-auto"
                                disabled={isSubmitting || !reply.trim()}
                            >
                                {isSubmitting ? "Sending..." : "Send"}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}