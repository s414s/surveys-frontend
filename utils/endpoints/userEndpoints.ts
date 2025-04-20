import { CreateNewUserRequest, CreateNewUserResponse, User } from "@/appTypes";
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

export const getDrivers = async (startDate?: Date, endDate?: Date): Promise<User[]> => {
    try {
        const endpoint = (!startDate && !endDate)
            ? `/users`
            : `/users?startDate=${startDate?.toISOString()}&endDate=${endDate?.toISOString()}`;
        return await fetchDataGeneric<User[]>("GET", endpoint, null, null, useAppStore.getState().jwtToken);
    } catch (error) {
        console.error("Error getting drivers:", error);
        throw new Error("Failed to get drivers");
    }
};