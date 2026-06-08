"use client";
import { API_BASE_URL } from "../config";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
type User = { id: number; username: string; email: string };
type AuthContextType = {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
    loading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/users/me`, {
            credentials: "include"
        })
        .then(res => res.ok ? res.json() : null)
        .then(data => { if (data) setUser(data); })
        .finally(() => setLoading(false));
    }, []);

    function login(user: User) {
         setUser(user); 
    }
    function logout() {
        setUser(null);
        fetch(`${API_BASE_URL}/api/users/logout`, {
            method: "POST",
            credentials: "include"
        });
        router.push("/");
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext)!;
}