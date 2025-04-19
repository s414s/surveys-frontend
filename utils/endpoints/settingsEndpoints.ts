import { SettingsEntity } from "@/appTypes";
import { fetchDataGeneric } from "../fetchDataGeneric";
import { useAppStore } from "@/store/userStore";

export const updateSettings = async (settings: SettingsEntity): Promise<void> => {
    try {
        const jwtToken = useAppStore.getState().jwtToken;
        const endpoint = `/settings`;
        await fetchDataGeneric<{}>("PUT", endpoint, null, settings, jwtToken);
    } catch (error) {
        console.error("Error fetching freights:", error);
        throw new Error("Failed to fetch freights");
    }
};