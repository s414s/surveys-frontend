import { LoginRequest, LoginResponse } from "@/appTypes";
import { fetchDataGeneric } from "../fetchDataGeneric";

export const logIn = async (request: LoginRequest): Promise<LoginResponse> => {
    try {
        const endpoint = `/auth/login`;
        return await fetchDataGeneric<LoginResponse>("POST", endpoint, null, request, undefined);
    } catch (error) {
        console.error("Error loging in:", error);
        throw new Error("Failed to log in");
    }
};