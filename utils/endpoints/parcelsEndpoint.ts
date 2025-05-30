import { Parcel } from "@/appTypes";
import { useAppStore } from "@/store/userStore";
import { fetchDataGeneric } from "../fetchDataGeneric";

export const searchParcelById = async (parcelId: number): Promise<Parcel> => {
    try {
        const jwtToken = useAppStore.getState().jwtToken;
        const endpoint = `/parcels/${parcelId}`;
        return await fetchDataGeneric<Parcel>("GET", endpoint, null, null, jwtToken);
    } catch (error) {
        console.error("Error searching for parcel:", error);
        throw new Error("Failed to search for parcel");
    }
};