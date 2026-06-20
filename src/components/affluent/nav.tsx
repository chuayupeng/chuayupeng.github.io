/* Lightweight navigation so any view can jump to another (e.g. "Edit in Settings"). */
import { createContext, useContext } from "react";

export const NavContext = createContext<(view: string) => void>(() => {});
export const useNav = () => useContext(NavContext);
