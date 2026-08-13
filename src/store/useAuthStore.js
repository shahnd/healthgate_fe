import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            isLoggedIn: false,
            login: (userData) => set({user: userData, isLoggedIn: true}),
            logout: () => set({user: null, isLoggedIn: false}),
        }),
        {
            name: 'auth-storage'
        }
    )
)

export const useUserInfo = () => useAuthStore((state) => state.user);