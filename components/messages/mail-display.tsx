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
import { MessagePreview } from "@/appTypes";

export function MailDisplay({ email }: { email: MessagePreview | null; }) {
    // const today = new Date();

    return (
        <div className="flex h-full flex-col">
            <div className="flex items-center p-2">
                <div className="flex items-center gap-2">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" disabled={!email}>
                                    <Archive className="h-4 w-4" />
                                    <span className="sr-only">Archive</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Archive</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" disabled={!email}>
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
                                <Button variant="ghost" size="icon" disabled={!email}>
                                    <Reply className="h-4 w-4" />
                                    <span className="sr-only">Reply</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Reply</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" disabled={!email}>
                                    <Forward className="h-4 w-4" />
                                    <span className="sr-only">Forward</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Forward</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>

                <Separator orientation="vertical" className="mx-2 h-6" />

                {/* <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" disabled={!mail}>
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">More</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>Mark as unread</DropdownMenuItem>
                        <DropdownMenuItem>Star thread</DropdownMenuItem>
                        <DropdownMenuItem>Add label</DropdownMenuItem>
                        <DropdownMenuItem>Mute thread</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu> */}

            </div>
            <Separator />
            {email ? (
                <div className="flex flex-1 flex-col">
                    <div className="flex items-start p-4">
                        <div className="flex items-start gap-4 text-sm">
                            <Avatar>
                                <AvatarImage alt={email.name + email.surname} />
                                <AvatarFallback>
                                    {email.name[0].toUpperCase() + email.surname[0].toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid gap-1">
                                <div className="font-semibold">
                                    {email.name + " " + email.surname}
                                </div>
                                <div className="line-clamp-1 text-xs">
                                    {email.subject}
                                </div>
                                <div className="line-clamp-1 text-xs">
                                    {email.email}
                                </div>
                            </div>
                        </div>
                        {email.date && (
                            <div className="ml-auto text-xs text-muted-foreground">
                                {format(new Date(email.date), "PPpp")}
                            </div>
                        )}
                    </div>
                    <Separator />
                    <div className="flex-1 whitespace-pre-wrap p-4 text-sm">
                        {email.text}
                    </div>
                    <Separator className="mt-auto" />
                    <div className="p-4">
                        <form>
                            <div className="grid gap-4">
                                <Textarea
                                    className="p-4"
                                    placeholder={`Reply ${email.name}...`}
                                />
                                <div className="flex items-center">
                                    <Button
                                        onClick={(e) => e.preventDefault()}
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
            ) : (
                <div className="p-8 text-center text-muted-foreground">
                    No message selected
                </div>
            )}
        </div>
    );
}