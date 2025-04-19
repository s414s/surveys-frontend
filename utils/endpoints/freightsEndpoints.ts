import { AddParcelToFreightRequest, Freight, PagedResult } from "@/appTypes";
import { fetchDataGeneric, QueryParams } from "../fetchDataGeneric";
import { useAppStore } from "@/store/userStore";

export const addParcelToFreight = async (freightId: number, request: AddParcelToFreightRequest): Promise<void> => {
    try {
        const jwtToken = useAppStore.getState().jwtToken;
        const endpoint = `/freights/${freightId}/parcels`;
        await fetchDataGeneric<{}>("POST", endpoint, null, request, jwtToken);
    } catch (error) {
        console.error("Error fetching locations:", error);
        throw new Error("Failed to add parcel");
    }
};

export const getFreights = async (originId: number, destinationId: number): Promise<PagedResult<Freight>> => {
    try {
        const jwtToken = useAppStore.getState().jwtToken;
        const endpoint = `/freights`;
        const queryParams: QueryParams = { // TODO
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