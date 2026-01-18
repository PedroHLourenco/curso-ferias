import { jwtDecode } from "jwt-decode";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import api from "../services/api";

interface JwtPayload {
  sub: number;
  email: string;
  role: "admin" | "player";
  exp: number;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: JwtPayload | null;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<JwtPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  //verifica se já tem token salvo
  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      try {
        const decoded = jwtDecode<JwtPayload>(storedToken);

        if (decoded.exp * 1000 < Date.now()) {
          logout();
        } else {
          setUser(decoded);

          api.defaults.headers.Authorization = `Bearer ${storedToken}`;
        }
      } catch (error) {
        logout();
      }
    }
    setIsLoading(false);
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    api.defaults.headers.Authorization = `Bearer ${token}`;
    const decoded = jwtDecode<JwtPayload>(token);

    setUser(decoded);
  };

  const logout = () => {
    localStorage.removeItem("token");
    api.defaults.headers.Authorization = null;

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: !!user, user, login, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
