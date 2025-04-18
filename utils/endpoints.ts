import { AddParcelToFreightRequest, City, CreateNewUserRequest, CreateNewUserResponse, Freight, LoginRequest, LoginResponse, PagedResult } from "@/appTypes";
import { fetchDataGeneric, QueryParams } from "./fetchDataGeneric";
import { useAppStore } from "@/store/userStore";

export const addParcelToFreight = async (freightId: number, request: AddParcelToFreightRequest): Promise<void> => {
    try {
        const jwtToken = useAppStore.getState().jwtToken;
        const endpoint = `/freights/${freightId}/parcels`;
        await fetchDataGeneric<boolean>("POST", endpoint, null, request, jwtToken);
    } catch (error) {
        console.error("Error fetching locations:", error);
        throw new Error("Failed to add parcel");
    }
};

export const getFreights = async (originId: number, destinationId: number): Promise<PagedResult<Freight>> => {
    try {
        const jwtToken = useAppStore.getState().jwtToken;
        const endpoint = `/freights`;
        const queryParams: QueryParams = {
            status: 2,
            originId,
            destinationId,
            pageIndex: 1,
            pageSize: 10,
        };

        return await fetchDataGeneric<PagedResult<Freight>>("GET", endpoint, queryParams, null, jwtToken);
    } catch (error) {
        console.error("Error fetching freights:", error);
        throw new Error("Failed to fetch freights");
    }
};

export const getCities = async (): Promise<City[]> => {
    try {
        const jwtToken = useAppStore.getState().jwtToken;
        const endpoint = `/cities`;
        return await fetchDataGeneric<City[]>("GET", endpoint, null, null, jwtToken);
    } catch (error) {
        console.error("Error fetching cities:", error);
        throw new Error("Failed to fetch cities");
    }
};

export const logIn = async (request: LoginRequest): Promise<LoginResponse> => {
    try {
        const endpoint = `/auth/login`;
        return await fetchDataGeneric<LoginResponse>("POST", endpoint, null, request, undefined);
    } catch (error) {
        console.error("Error loging in:", error);
        throw new Error("Failed to log in");
    }
};

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