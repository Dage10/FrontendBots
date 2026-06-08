import { API_BASE_URL } from "../app/config";
import { useState } from "react";

type BotProps = {
    bot: { id: number; name: string; platform: string; type: string; state: boolean; target: string; };
    onDelete: (id: number) => void;
    onToggle: (id: number) => void;
    onEdit: (id: number) => void;
};

export default function BotCard({ bot, onDelete, onToggle, onEdit }: BotProps) {

    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);
    const isSender = bot.type === "SENDER" || bot.type === "BOTH";

     async function sendMessage() {
        if (!message.trim()) return;
        setSending(true);

        await fetch(`${API_BASE_URL}/api/bots/${bot.id}/send`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ message })
        });

        setSending(false);
        setMessage("");
    }

    return (
        <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 border border-white/20 rounded-xl shadow-lg shadow-black/40">
            <div className="flex justify-between items-center"></div>
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${bot.state ? "bg-green-500" : "bg-red-500"}`}></span>
                        {bot.name}
                    </h2>
                    <p className="text-sm text-white/70">{bot.platform} · {bot.type} · {bot.target}</p>
                </div>
            
                <div className="flex flex-wrap gap-2 items-center">
                <button onClick={() => onToggle(bot.id)}
                    className={`py-1 px-3 rounded border border-white/20 text-white font-bold text-sm ${bot.state ? "bg-green-700 hover:bg-green-900" : "bg-gray-600 hover:bg-gray-800"}`}>
                    {bot.state ? "Deactivate" : "Activate"}
                </button>
                <button onClick={() => onEdit(bot.id)}
                    className="bg-[#1E88E5] hover:bg-[#1565C0] border border-white/20 text-white font-bold py-1 px-3 rounded text-sm">
                    Edit
                </button>
                <button onClick={() => onDelete(bot.id)}
                    className="bg-[#E53935] hover:bg-[#B71C1C] border border-white/20 text-white font-bold py-1 px-3 rounded text-sm">
                    Delete
                </button>

                {isSender && (
                    <div className="flex gap-2 mt-2 w-full">
                        <input
                            type="text"
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            className="w-full p-2 bg-transparent border border-white/20 text-white rounded"
                            placeholder="Message to send"
                        />
                        <button onClick={sendMessage} disabled={sending}
                            className="bg-[#1E88E5] hover:bg-[#1565C0] border border-white/20 text-white font-bold py-2 px-4 rounded">
                            {sending ? "Sending..." : "Send"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}