import { create } from "zustand";

type ProjectTitleState = {
  title: string;
  setTitle: (title: string) => void;
};

export const useProjectTitleStore = create<ProjectTitleState>((set) => ({
  title: "",
  setTitle: (title) => set({ title }),
}));
