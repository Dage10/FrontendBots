"use client";
import { API_BASE_URL } from "../config";
import Link from "next/dist/client/link";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateBot() {

    const { user, logout, loading } = useAuth();
    const router = useRouter();
    const [loggingOut, setLoggingOut] = useState(false);
    const [name, setName] = useState("");
    const [platform, setPlatform] = useState("");
    const [type, setType] = useState("");
    const [target, setTarget] = useState("");
    const [oauthToken, setOauthToken] = useState("");
    const [clientId, setClientId] = useState("");
    const [clientSecret, setClientSecret] = useState("");
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [error, setError] = useState("");
    const [refreshToken, setRefreshToken] = useState("");

    const finalType =
            platform === "YOUTUBE" || platform === "GITHUB"
                ? "LISTENER"
                : type

    function buildExtraConfig() {
        if (platform === "REDDIT") {
            const cfg: any = { clientId, clientSecret };
            if (type === "SENDER") {
                cfg.title = title; cfg.text = text; 
            }
            return JSON.stringify(cfg);
        }
        return "{}";
    }

    async function handleCreate() {
        const finalType = platform === "YOUTUBE" ? "LISTENER" : type;
        if (!name || !platform || !finalType || !target || !oauthToken) {
            setError("Please fill in all fields"); 
            return;
        }
        const res = await fetch(`${API_BASE_URL}/api/bots`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ name, platform, type: finalType, target, oauthToken, refreshToken, extraConfigJson: buildExtraConfig() })
        });
        if (res.ok) {
            router.push("/botManagement"); 
        }
        else {
            const d = await res.json(); setError(d.message || "Error creating bot"); 
        }
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

    return (
        <>
        <div className="absolute top-4 left-4 ">
                <Link href="/botManagement">
                <svg 
                    width="48" 
                    height="48" 
                    viewBox="0 0 1024 1024" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="cursor-pointer hover:scale-110 transition-transform duration-200 text-white fill-current"
                >   
                <path d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"/>
                <path d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"/>
                </svg>
                </Link>
            </div>
        <div className="absolute top-4 right-4 flex items-center gap-4">
            <p className="text-white font-bold">{user?.username}</p>
            <button className="bg-[#1E88E5] hover:bg-[#1565C0] shadow-[0_0_8px_#42A5F5] border border-white/20 text-white font-bold text-glow py-2 px-4 rounded" onClick={handleLogout}>Logout</button>
        </div>
        <h1 className="text-5xl font-bold text-center mt-10 mx-auto max-w-3xl text-glow slide-in-right delay-200">Create a Bot</h1>
        <div className="flex justify-center items-center flex-col mt-10 mb-10 gap-4 p-10 mx-auto max-w-5xl border border-white/20 shadow-lg shadow-black/40 rounded-xl slide-in-right delay-200">
            <select className="w-full p-3 bg-[#1E88E5] border border-white/20 text-white font-bold rounded" value={platform} onChange={e => { setPlatform(e.target.value); setType(""); }}>
                <option value="">Select a platform</option>
                <option value="DISCORD">Discord</option>
                <option value="TELEGRAM">Telegram</option>
                <option value="REDDIT">Reddit</option>
                <option value="GITHUB">Github Events</option>
                <option value="YOUTUBE">Youtube</option>
            </select>

            {platform && (
                <select
                    className="w-full p-3 bg-[#1E88E5] text-white font-bold rounded"
                    value={type}
                    onChange={e => setType(e.target.value)}
                >
                    <option value="">Select a bot type</option>

                    {platform === "DISCORD" && (
                        <>
                            <option value="LISTENER">Listener</option>
                            <option value="SENDER">Sender</option>
                            <option value="BOTH">Both</option>
                        </>
                    )}

                    {platform === "TELEGRAM" && (
                        <>
                            <option value="LISTENER">Listener</option>
                            <option value="SENDER">Sender</option>
                            <option value="BOTH">Both</option>
                        </>
                    )}

                    {platform === "REDDIT" && (
                        <>
                            <option value="LISTENER">Listener</option>
                            <option value="SENDER">Sender</option>
                            <option value="BOTH">Both</option>
                        </>
                    )}


                    {platform === "GITHUB" && (
                        <option value="LISTENER">Listener</option>
                    )}

                    {platform === "YOUTUBE" && (
                        <option value="LISTENER">Listener</option>
                    )}
                </select>
            )}

            <label className="w-full text-left text-white font-bold">Bot Name</label>
            <input type="text" className="w-full p-3 bg-transparent border border-white/20 text-white rounded" 
                placeholder="Bot name" value={name} onChange={e => setName(e.target.value)} />

            <label className="w-full text-left text-white font-bold">
                {platform === "REDDIT" ? "Subreddit" : platform === "GITHUB" ? "Repository (owner/repo)" : platform === "YOUTUBE" ? "Channel ID" : "Target / Channel ID or Chat ID"}
            </label>
            <input type="text" className="w-full p-3 bg-transparent border border-white/20 text-white rounded" 
                placeholder={platform === "GITHUB" ? "owner/repo" : platform === "YOUTUBE" ? "UCxxxxxx" : "ID"} 
                value={target} onChange={e => setTarget(e.target.value)} />

            <label className="w-full text-left text-white font-bold">
                {platform === "YOUTUBE" ? "YouTube Data API Key" : "Bot Token"}
            </label>
            <input type="text" className="w-full p-3 bg-transparent border border-white/20 text-white rounded" 
                placeholder="Token" value={oauthToken} onChange={e => setOauthToken(e.target.value)} />

            {platform === "REDDIT" && (
                <>
                <label className="w-full text-left text-white font-bold">Reddit Client ID</label>
                <input type="text" className="w-full p-3 bg-transparent border border-white/20 text-white rounded" 
                    value={clientId} onChange={e => setClientId(e.target.value)} />

                <label className="w-full text-left text-white font-bold">Reddit Client Secret</label>
                <input type="text" className="w-full p-3 bg-transparent border border-white/20 text-white rounded" 
                    value={clientSecret} onChange={e => setClientSecret(e.target.value)} />

                <label className="w-full text-left text-white font-bold">Reddit Refresh Token (optional)</label>
                <input type="text" className="w-full p-3 bg-transparent border border-white/20 text-white rounded" 
                    value={refreshToken} onChange={e => setRefreshToken(e.target.value)} />

                {type === "SENDER" && (
                    <>
                    <label className="w-full text-left text-white font-bold">Post Title</label>
                    <input type="text" className="w-full p-3 bg-transparent border border-white/20 text-white rounded" 
                        value={title} onChange={e => setTitle(e.target.value)} />

                    <label className="w-full text-left text-white font-bold">Post Text</label>
                    <textarea className="w-full p-3 bg-transparent border border-white/20 text-white rounded" 
                        rows={3} value={text} onChange={e => setText(e.target.value)} />
                    </>
                )}
                </>
            )}

            {error && <p className="text-red-500">{error}</p>}

            <button className="bg-[#1E88E5] text-white font-bold py-2 px-4 rounded" 
                onClick={handleCreate}>Create Bot</button>
        </div>
        </>
    );
}