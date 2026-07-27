import { createContext, useState, type ReactNode } from "react";
import { loginAction, registerAction, type RegisterForm } from "../../core/actions";

interface UserSessionData {
  token: string;
  fullName: string;
  roles: string[];
}

interface AuthContextType {
  token: string | null;
  fullName: string | null;
  roles: string[];
  isAdmin: boolean;
  isUser: boolean; 
  isAuthenticated: boolean;
  register: (form: RegisterForm) => Promise<{ ok: boolean; message: string }>;
  login: (email: string, password: string) => Promise<{ ok: boolean; message: string }>;
  logout: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [fullName, setFullName] = useState<string | null>(localStorage.getItem("fullName"));
  const [roles, setRoles] = useState<string[]>(
    JSON.parse(localStorage.getItem("roles") || "[]")
  );


  const persistSession = (data: UserSessionData) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("fullName", data.fullName);
    localStorage.setItem("roles", JSON.stringify(data.roles));
    setToken(data.token);
    setFullName(data.fullName);
    setRoles(data.roles);
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await loginAction(email, password);
      
      console.log("Respuesta del servidor:", res);

      const rawRes = res as unknown as Record<string, unknown> & {
        Status?: boolean; status?: boolean;
        Message?: string; message?: string;
        Data?: Record<string, unknown> & {
          Token?: string; token?: string;
          FullName?: string; fullName?: string;
          Roles?: string[]; roles?: string[];
        };
        data?: Record<string, unknown> & {
          Token?: string; token?: string;
          FullName?: string; fullName?: string;
          Roles?: string[]; roles?: string[];
        };
      };

      const status = rawRes.Status ?? rawRes.status;
      const data = rawRes.Data ?? rawRes.data;
      const message = rawRes.Message ?? rawRes.message;

      if (!status || !data) {
        return { ok: false, message: message || "No se pudo iniciar sesión." };
      }

      const sessionData: UserSessionData = {
        token: data.Token ?? data.token ?? "",
        fullName: data.FullName ?? data.fullName ?? "",
        roles: data.Roles ?? data.roles ?? [],
      };

      persistSession(sessionData);
      
      return { ok: true, message: message || "" };
    } catch (error) {
      console.error("Error en login:", error);
      return { ok: false, message: "Correo o contraseña incorrectos." };
    }
  };

  const register = async (form: RegisterForm) => {
    try {
      const res = await registerAction(form);
      if (!res.status || !res.data) {
        return { ok: false, message: res.message || "No se pudo crear la cuenta." };
      }

      persistSession(res.data);
      return { ok: true, message: res.message };
    } catch {
      return { ok: false, message: "No se pudo crear la cuenta. Revisa los datos." };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("fullName");
    localStorage.removeItem("roles");
    setToken(null);
    setFullName(null);
    setRoles([]);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        fullName,
        roles,
        isAdmin: roles.includes("Admin"),
        isUser: roles.includes("NORMAL_USER"), 
        isAuthenticated: !!token,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

