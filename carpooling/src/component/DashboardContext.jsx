import { createContext, useContext } from "react";

const DashboardContext = createContext(false);

export const DashboardProvider = DashboardContext.Provider;

export const useDashboard = () => useContext(DashboardContext);