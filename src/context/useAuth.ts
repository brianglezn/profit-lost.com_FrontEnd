import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export interface AuthContextType {
  authToken: string | null;
  login: (token: string) => void;
  logout: () => void;
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};
