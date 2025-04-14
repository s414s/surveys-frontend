import { AddParcelToFreightRequest, City, Freight, PagedResult } from "@/appTypes";
import { fetchDataGeneric } from "./fetchDataGeneric";
import { useAppStore } from "@/store/userStore";

export const addParcelToFreight = async (freightId: number, request: AddParcelToFreightRequest): Promise<void> => {
    try {
        const jwtToken = useAppStore.getState().jwtToken;
        console.log("JWT-TOKEN ->", jwtToken);
        console.log("FREIGHT-ID ->", freightId);
        console.log("REQUEST ->", request);

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
        const endpoint = `/freights?status=2&originId=${originId}&destinationId=${destinationId}&pageindex=1&pagesize=100`;
        return await fetchDataGeneric<PagedResult<Freight>>("GET", endpoint, null, null, jwtToken);
        // Convert string dates to Date objects
        // const freightsWithDates = response.data.map((freight) => ({
        //     ...freight,
        //     dueStart: new Date(freight.dueStart),
        // }));
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