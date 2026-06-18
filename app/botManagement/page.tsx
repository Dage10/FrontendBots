"use client";
import { API_BASE_URL } from "../config";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useState,useEffect } from "react";
import BotCard from "@/components/Bot";

type Bot = {
    id: number;
    name: string;
    platform: string;
    type: string;
    state: boolean;
    target: string;
};

export default function BotManagement() {
    const { user, logout, loading } = useAuth();
    const router = useRouter();
    const [loggingOut, setLoggingOut] = useState(false);
    const [bots, setBots] = useState<Bot[]>([]);
    const [botsLoading, setBotsLoading] = useState(true);

    useEffect(() => {
        if (typeof window !== "undefined" && "Notification" in window) {
            Notification.requestPermission();
        }
    }, []);


    useEffect(() => {
        if (loading) return;
        if (!user) { setBotsLoading(false); return; }
        fetch(`${API_BASE_URL}/api/bots`, { credentials: "include" })
            .then(res => res.ok ? res.json() : [])
            .then(data => { setBots(data); setBotsLoading(false); });
    }, [user, loading]);

    async function handleDelete(id: number) {
        await fetch(`${API_BASE_URL}/api/bots/${id}`, { method: "DELETE", credentials: "include" });
        setBots(bots.filter(b => b.id !== id));
    }

    async function handleToggle(id: number) {
        await fetch(`${API_BASE_URL}/api/bots/${id}/state`, { method: "PUT", credentials: "include" });
        setBots(bots.map(b => b.id === id ? { ...b, state: !b.state } : b));
    }

    async function handleLogout() {
        setLoggingOut(true);
        await logout();
    }
    
    if (loading) return null;

    if (!user) {
        if (loggingOut) return null
        return (
            <>
            <div className="flex flex-col items-center justify-center mx-auto max-w-3xl gap-4 h-auto p-6 border border-white/20 shadow-lg shadow-black/40 rounded-xl mt-20 slide-in-right delay-200">
                <p>You must be logged in to view this page.</p>
                <button className="bg-[#1E88E5] hover:bg-[#1565C0] shadow-[0_0_8px_#42A5F5] border border-white/20 text-white font-bold text-glow py-2 px-4 rounded" onClick={() => router.push("/login")}>
                    Login
                </button>
            </div>
            </>
        );
    }

    if (botsLoading) return <p className="text-white text-center mt-20">Loading bots...</p>;


    return(
        <>
        <div className="absolute top-4 right-4 flex items-center gap-4">
            <p className="text-white font-bold">{user?.username}</p>
            <button className="bg-[#1E88E5] hover:bg-[#1565C0] shadow-[0_0_8px_#42A5F5] border border-white/20 text-white font-bold text-glow py-2 px-4 rounded" onClick={handleLogout}>
                Logout
            </button>
        </div>
        <h1 className="text-5xl font-bold text-center mt-10 mx-auto max-w-3xl text-glow slide-in-right delay-200">Bot Management</h1>
        <h3 className="text-2xl font-bold text-center mt-10 mx-auto max-w-3xl text-glow slide-in-right delay-200">This is the bot management page, where you can create and manage your bots for platforms,like Discord,Telegram,Reddit,Github Events,Youtube,etc.</h3>
        <div className="flex flex-col mt-10 gap-4 w-full max-w-5xl mx-auto px-4 pb-20">
            {bots.length === 0 ? (
                <div className="flex justify-center items-center flex-col gap-4 p-10 border border-white/20 shadow-lg shadow-black/40 rounded-xl slide-in-right delay-200">
                    <p className="text-white">Don't you have a bot?</p>
                    <button className="bg-[#1E88E5] hover:bg-[#1565C0] shadow-[0_0_8px_#42A5F5] border border-white/20 text-white font-bold text-glow py-2 px-4 rounded" onClick={() => router.push("/CreateBot")}>Create a bot</button>
                </div>
            ) : (
                <>
                {bots.map(bot => (
                    <BotCard key={bot.id} bot={bot} onDelete={handleDelete} onToggle={handleToggle} onEdit={id => router.push(`/EditBot/${id}`)} />
                ))}
                <div className="flex justify-center mt-6">
                    <button className="bg-[#1E88E5] hover:bg-[#1565C0] shadow-[0_0_8px_#42A5F5] border border-white/20 text-white font-bold text-glow py-2 px-6 rounded w-auto max-w-xs" onClick={() => router.push("/CreateBot")}>Create a bot</button>
                </div>
                </>
            )}
        </div>
        </>
    );
}