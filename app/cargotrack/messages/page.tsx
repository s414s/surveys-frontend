'use client';

import { MessagePreview, PagedResult } from "@/appTypes";
import { MailDisplay } from "@/components/messages/mail-display";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
// import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/userStore";
import { useFetch } from "@/hooks/useFetch";
import LoadingComponent from "@/components/common/loader";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function Page() {
    // const router = useRouter();
    const store = useAppStore();
    const [selectedMsgId, setSelectedMsgId] = useState<number | null>(null);

    if (!store.isUserLoggedIn()) {
        // router.push("/login");
        console.log("user not logged");
    }

    const { data, error, loading } = useFetch<PagedResult<MessagePreview>>("GET", "/messages");
    if (loading) return <LoadingComponent />;
    if (error) { console.log("error", error); }

    return (
        <div className="flex border">
            <ScrollArea className="h-screen">

                <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <form>
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search" className="pl-8" />
                        </div>
                    </form>
                </div>

                <div className="flex flex-col gap-2 p-4 pt-0">
                    {data?.data.map((item) => (
                        <button
                            key={item.id}
                            className={cn(
                                "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
                                selectedMsgId === item.id && "bg-muted"
                            )}
                            onClick={() => setSelectedMsgId(item.id)}
                        >
                            <div className="flex w-full flex-col gap-1">
                                <div className="flex items-center">
                                    <div className="flex items-center gap-2">
                                        <div className="font-semibold">{item.name}</div>
                                        {!item.isRead && (
                                            <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                                        )}
                                    </div>
                                    <div
                                        className={cn(
                                            "ml-auto text-xs",
                                            selectedMsgId === item.id
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
                                {item.text.substring(0, 300)}
                            </div>

                            {/* {item.labels.length ? (
              <div className="flex items-center gap-2">
                {item.labels.map((label) => (
                  <Badge key={label} variant={getBadgeVariantFromLabel(label)}>
                    {label}
                  </Badge>
                ))}
              </div>
            ) : null} */}

                        </button>
                    ))}
                </div>
            </ScrollArea>


            {/* <ScrollArea className="h-screen">
        <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-2">
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">All Inboxes</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Inbox</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header >
        <div className="flex flex-1 flex-col gap-2 p-4">
          {data.mails.map((mail) => (
            <a
              href="#"
              key={mail.email}
              className="flex flex-col items-start gap-2 whitespace-nowrap p-4 text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground bg-muted/50 border rounded-md"
            >
              <div className="flex w-full items-center gap-2">
                <span>{mail.name}</span>{" "}
                <span className="ml-auto text-xs">{mail.date}</span>
              </div>
              <span className="font-medium">{mail.subject}</span>
              <span className="line-clamp-2 w-[260px] whitespace-break-spaces text-xs">
                {mail.teaser}
              </span>
            </a>
          ))}
        </div>
      </ScrollArea> */}

            {/* Messages */}
            {/* TODO - ajustar anchos */}
            <div className="border flex-1">
                <MailDisplay email={fakeMail} />
            </div>

        </div>
    );
}

// This is sample data
const data = {
    mails: [
        {
            name: "William Smith",
            email: "williamsmith@example.com",
            subject: "Meeting Tomorrow",
            date: "09:34 AM",
            teaser:
                "Hi team, just a reminder about our meeting tomorrow at 10 AM.\nPlease come prepared with your project updates.",
        },
        {
            name: "Alice Smith",
            email: "alicesmith@example.com",
            subject: "Re: Project Update",
            date: "Yesterday",
            teaser:
                "Thanks for the update. The progress looks great so far.\nLet's schedule a call to discuss the next steps.",
        },
        {
            name: "Bob Johnson",
            email: "bobjohnson@example.com",
            subject: "Weekend Plans",
            date: "2 days ago",
            teaser:
                "Hey everyone! I'm thinking of organizing a team outing this weekend.\nWould you be interested in a hiking trip or a beach day?",
        },
        {
            name: "Emily Davis",
            email: "emilydavis@example.com",
            subject: "Re: Question about Budget",
            date: "2 days ago",
            teaser:
                "I've reviewed the budget numbers you sent over.\nCan we set up a quick call to discuss some potential adjustments?",
        },
        {
            name: "Michael Wilson",
            email: "michaelwilson@example.com",
            subject: "Important Announcement",
            date: "1 week ago",
            teaser:
                "Please join us for an all-hands meeting this Friday at 3 PM.\nWe have some exciting news to share about the company's future.",
        },
        {
            name: "Sarah Brown",
            email: "sarahbrown@example.com",
            subject: "Re: Feedback on Proposal",
            date: "1 week ago",
            teaser:
                "Thank you for sending over the proposal. I've reviewed it and have some thoughts.\nCould we schedule a meeting to discuss my feedback in detail?",
        },
        {
            name: "David Lee",
            email: "davidlee@example.com",
            subject: "New Project Idea",
            date: "1 week ago",
            teaser:
                "I've been brainstorming and came up with an interesting project concept.\nDo you have time this week to discuss its potential impact and feasibility?",
        },
        {
            name: "Olivia Wilson",
            email: "oliviawilson@example.com",
            subject: "Vacation Plans",
            date: "1 week ago",
            teaser:
                "Just a heads up that I'll be taking a two-week vacation next month.\nI'll make sure all my projects are up to date before I leave.",
        },
        {
            name: "James Martin",
            email: "jamesmartin@example.com",
            subject: "Re: Conference Registration",
            date: "1 week ago",
            teaser:
                "I've completed the registration for the upcoming tech conference.\nLet me know if you need any additional information from my end.",
        },
        {
            name: "Sophia White",
            email: "sophiawhite@example.com",
            subject: "Team Dinner",
            date: "1 week ago",
            teaser:
                "To celebrate our recent project success, I'd like to organize a team dinner.\nAre you available next Friday evening? Please let me know your preferences.",
        },
    ],
};

const fakeMail: MessagePreview = {
    name: "Alberto",
    surname: "Salas",
    subject: "Hello Subject",
    email: "Salas@hello.com",
    text: "Hello World",
    isDeleted: false,
    date: "2023-03-16T09:34:00",
    teaser: "hello...",
};