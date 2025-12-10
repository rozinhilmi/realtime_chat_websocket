import { create } from "zustand";
import { persist } from "zustand/middleware";
import { StoreInterface } from "./interface";

export const useStore = create<StoreInterface>()(
  persist(
    (set) => ({
      // functional State {
      setStore: (key: string, newValue: any) =>
        set((state) => ({
          ...state,
          [key]: newValue,
        })),
      setTheme: () =>
        set((state) => ({
          currentTheme: !state.currentTheme,
        })),
      // }

      // Global State {
      token: "",
      currentTheme: false,
      // }

      // Dashboard Page {
      count: 1,
      inputState: "input state value",
      // }
    }),
    {
      name: "store",
    }
  )
);

export const store = <K extends keyof StoreInterface>(key: K) => {
  return useStore<StoreInterface[K]>((state) => state[key]);
};

export const setStore = <K extends keyof StoreInterface>(key: K, newValue: StoreInterface[K]) => {
  useStore.getState().setStore(key, newValue);
};
