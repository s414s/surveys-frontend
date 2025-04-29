import { AddParcelToFreightRequest, Freight, FreightStatus, PagedResult } from "@/appTypes";
import { fetchDataGeneric, QueryParams } from "../fetchDataGeneric";
import { useAppStore } from "@/store/userStore";

// TODO - poner las fechas a futuro
export const getFreights = async (originId: number, destinationId: number, status: FreightStatus): Promise<PagedResult<Freight>> => {
    try {
        const queryParams: QueryParams = {
            status: status,
            originId,
            destinationId,
            pageIndex: 1,
            pageSize: 100,
        };

        return await fetchDataGeneric<PagedResult<Freight>>("GET", `/freights`, queryParams, null, useAppStore.getState().jwtToken);
    } catch (error) {
        console.error("Error fetching freights:", error);
        throw new Error("Failed to fetch freights");
    }
};

export const addParcelToFreight = async (freightId: number, request: AddParcelToFreightRequest): Promise<void> => {
    try {
        const endpoint = `/freights/${freightId}/parcels`;
        await fetchDataGeneric<unknown>("POST", endpoint, null, request, useAppStore.getState().jwtToken);
    } catch (error) {
        console.error("Error fetching locations:", error);
        throw new Error("Failed to add parcel");
    }
};

export const createFreight = async (originId: number, destinationId: number, startDate: Date): Promise<void> => {
    try {
        console.log(startDate);
        const request = { originId, destinationId, startDate };
        await fetchDataGeneric<unknown>("POST", `/freights`, null, request, useAppStore.getState().jwtToken);
    } catch (error) {
        console.error("Error creating freight:", error);
        throw new Error("Failed to create freight");
    }
};