import { City } from "@/appTypes";
import { fetchDataGeneric } from "../fetchDataGeneric";
import { useAppStore } from "@/store/userStore";

export const getCities = async (originId?: number): Promise<City[]> => {
    try {
        const jwtToken = useAppStore.getState().jwtToken;
        const endpoint = !originId ? `/cities` : `/cities?originId=${originId}`;
        return await fetchDataGeneric<City[]>("GET", endpoint, null, null, jwtToken);
    } catch (error) {
        console.error("Error fetching cities:", error);
        throw new Error("Failed to fetch cities");
    }
};