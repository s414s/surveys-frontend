import { CreateNewTruckRequest, UpdateTruckRequest } from "@/appTypes";
import { fetchDataGeneric } from "../fetchDataGeneric";
import { useAppStore } from "@/store/userStore";

export const createNewTruck = async (request: CreateNewTruckRequest): Promise<boolean> => {
    try {
        const jwtToken = useAppStore.getState().jwtToken;
        const endpoint = `/trucks/`;
        return await fetchDataGeneric<boolean>("POST", endpoint, null, request, jwtToken);
    } catch (error) {
        console.error("Error creating truck:", error);
        throw new Error("Failed to create truck");
    }
};

export const updateTruck = async (truckId: number, request: UpdateTruckRequest): Promise<boolean> => {
    try {
        const jwtToken = useAppStore.getState().jwtToken;
        const endpoint = `/trucks/${truckId}`;
        return await fetchDataGeneric<boolean>("PUT", endpoint, null, request, jwtToken);
    } catch (error) {
        console.error("Error updating truck:", error);
        throw new Error("Failed to update truck");
    }
};
