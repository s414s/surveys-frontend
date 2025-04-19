import { CreateNewUserRequest, CreateNewUserResponse } from "@/appTypes";
import { fetchDataGeneric } from "../fetchDataGeneric";
import { useAppStore } from "@/store/userStore";

export const createNewDriver = async (request: CreateNewUserRequest): Promise<CreateNewUserResponse> => {
    try {
        const jwtToken = useAppStore.getState().jwtToken;
        const endpoint = `/users`;
        return await fetchDataGeneric<CreateNewUserResponse>("POST", endpoint, null, request, jwtToken);
    } catch (error) {
        console.error("Error creating new driver:", error);
        throw new Error("Failed to create a new driver");
    }
};