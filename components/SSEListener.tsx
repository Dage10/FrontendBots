"use client"

import { useEffect } from "react";
import toast from "react-hot-toast";

export default function SSEListener() {
    useEffect(() => {
        const evt = new EventSource("http://localhost:8080/api/sse/stream", { withCredentials: true });

        evt.addEventListener("bot-event", (e: any) => {
            const msg = e.data;

            toast(msg);

            if (Notification.permission === "granted") {
                new Notification("Bot update", { body: msg });
            }
        });

        return () => evt.close();
    }, []);

    return null;
}