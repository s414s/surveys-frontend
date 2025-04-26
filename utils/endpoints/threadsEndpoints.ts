import { CreateNewThreadRequest, ReplyToThreadRequest } from "@/appTypes";
import { fetchDataGeneric } from "../fetchDataGeneric";
import { useAppStore } from "@/store/userStore";

export const createNewThread = async (newThread: CreateNewThreadRequest): Promise<number> => {
    try {
        const endpoint = `/threads`;
        return await fetchDataGeneric<number>("POST", endpoint, null, newThread, useAppStore.getState().jwtToken);
    } catch (error) {
        console.error("Error creating new thread:", error);
        throw new Error("Failed to create new thread");
    }
};

export const replyToThreadMessage = async (threadId: number, request: ReplyToThreadRequest): Promise<number> => {
    try {
        const endpoint = `/threads/${threadId}/Messages`;
        console.log("endpoint", endpoint);
        return await fetchDataGeneric<number>("POST", endpoint, null, request, useAppStore.getState().jwtToken);
    } catch (error) {
        console.error("Error replying to message:", error);
        throw new Error("Failed to reply to message");
    }
};

// TODO - seguramente se pueda hacer en el get thread messages ya
export const markThreadAsRead = async (threadId: number, request: ReplyToThreadRequest): Promise<boolean> => {
    try {
        const endpoint = `/threads/${threadId}/messages`;
        return await fetchDataGeneric<boolean>("PUT", endpoint, null, request, useAppStore.getState().jwtToken);
    } catch (error) {
        console.error("Error marking thread as read:", error);
        throw new Error("Failed to mark thread as read");
    }
};

