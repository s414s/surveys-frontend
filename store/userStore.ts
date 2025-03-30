import { create } from 'zustand';
import { jwtDecode } from "jwt-decode";
import { UserInfo } from '@/appTypes';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AppState {
    jwtToken?: string;
    setUser: (jwtToken?: string) => void,
    getUserInfo: () => UserInfo | undefined,
    removeUser: () => void,
    isAdmin: () => boolean,
    isUserLoggedIn: () => boolean,
}

// export const useAppStore = create<AppState>()((set, get) => ({
//     jwtToken: undefined,
//     setUser: (jwtToken?: string) => {
//         set({ jwtToken });
//     },
//     getUserInfo: () => {
//         const { jwtToken } = get();

//         if (!jwtToken)
//             return undefined;

//         return jwtDecode<UserInfo>(jwtToken);
//     },
//     removeUser: () => {
//         set({ jwtToken: undefined });
//     },
//     isAdmin: () => get().getUserInfo()?.role === "Admin",
//     isUserLoggedIn: () => get().getUserInfo() !== undefined,
// }));


export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            jwtToken: undefined,
            setUser: (jwtToken?: string) => {
                set({ jwtToken });
            },
            getUserInfo: () => {
                const { jwtToken } = get();

                if (!jwtToken)
                    return undefined;

                return jwtDecode<UserInfo>(jwtToken);
            },
            removeUser: () => {
                set({ jwtToken: undefined });
            },
            isAdmin: () => get().getUserInfo()?.role === "Admin",
            isUserLoggedIn: () => get().getUserInfo() !== undefined,
        }),
        {
            name: 'user-storage',
            storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
        },
    ),
);