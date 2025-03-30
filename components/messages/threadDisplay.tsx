'use-client';

import {
    format,
    // addDays,
    // addHours,
    // nextSaturday
} from "date-fns";
import { Archive, Forward, Reply, Trash2, } from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Message } from "@/appTypes";
import { useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import LoadingComponent from "../common/loader";

export function ThreadDisplay({ threadId }: { threadId: number; }) {
    const [reply, setReply] = useState("");
    const { data, error, loading } = useFetch<Message[]>("GET", `/threads/${threadId}/messages`);

    console.log("FETCHING ID", threadId);
    console.table(data);
    // if (loading) { <LoadingComponent isAdminOnly={false} />; }
    if (error) { console.log(error); }

    return (
        <div className="flex h-full flex-col">
            <div className="flex items-center p-2">
                <div className="flex items-center gap-2">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    disabled={false}
                                >
                                    <Archive className="h-4 w-4" />
                                    <span className="sr-only">Archive</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Archive</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    disabled={false}
                                >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Move to trash</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Move to trash</TooltipContent>
                        </Tooltip>

                    </TooltipProvider>
                    <Separator orientation="vertical" className="mx-1 h-6" />

                </div>
                <div className="ml-auto flex items-center gap-2">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    // disabled={!email}
                                    disabled={false}
                                >
                                    <Reply className="h-4 w-4" />
                                    <span className="sr-only">Reply</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Reply</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    // disabled={!email}
                                    disabled={false}
                                >
                                    <Forward className="h-4 w-4" />
                                    <span className="sr-only">Forward</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Forward</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>

                <Separator orientation="vertical" className="mx-2 h-6" />
            </div>
            <Separator />

            {loading && <LoadingComponent isAdminOnly={false} />}

            {data?.map(x => (
                <div key={x.id} className="flex-1 flex-col border">
                    <div className="flex items-start p-4">
                        <div className="flex items-start gap-4 text-sm">
                            <Avatar>
                                <AvatarImage alt={x.name + x.surname} />
                                <AvatarFallback>
                                    {x.name[0].toUpperCase() + x.surname[0].toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid gap-1">
                                <div className="font-semibold">
                                    {x.name + " " + x.surname}
                                </div>
                                <div className="line-clamp-1 text-xs">
                                    {x.subject}
                                </div>
                                <div className="line-clamp-1 text-xs">
                                    {x.email}
                                </div>
                            </div>
                        </div>
                        {x.date && (
                            <div className="ml-auto text-xs text-muted-foreground">
                                {format(new Date(x.date), "PPpp")}
                            </div>
                        )}
                    </div>

                    <Separator />
                    <div className="flex-1 whitespace-pre-wrap p-4 text-sm">
                        {x.text}
                    </div>
                </div>
            ))}

            <Separator className="mt-auto" />
            <div className="p-4">
                <form>
                    <div className="grid gap-4">
                        <Textarea
                            className="p-4"
                            // placeholder={`Reply to ${x.name}...`}
                            placeholder={`Reply...`}
                            onChange={(e) => {
                                if (e.target.value) {
                                    setReply(e.target.value);
                                }
                            }}
                        />
                        <div className="flex items-center">
                            <Button
                                // onClick={(e) => e.preventDefault()}
                                onClick={(e) => {
                                    e.preventDefault();
                                    console.log(reply);
                                    handleSendMessage(reply, 2);
                                }}
                                size="sm"
                                className="ml-auto"
                            >
                                Send
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

async function handleSendMessage(message: string, threadId: number) {
    try {
        const BASE_URL = process.env.API_URL || 'http://localhost:5097';

        const requestOptions: RequestInit = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ message }),
            // signal: controller.signal, // Attach the AbortSignal to the request
            // credentials: 'include', // Includes cookies in the request
        };

        // const response = await fetch(BASE_URL + endpoint, controller);
        const response = await fetch(`${BASE_URL}/threads/${threadId}`, requestOptions);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (err) {
        console.error(err);
    }
}