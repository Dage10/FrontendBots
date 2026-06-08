"use client"
import { API_BASE_URL } from "../config";
import Link from "next/link";
import { useState } from "react";

export default function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    async function handleRegister() {
        if(!username || !email || !password) {
            setErrorMessage("Please fill in all fields");
            setSuccessMessage("");
            return;
        }
        if(password.length < 8) {
            setErrorMessage("Password must be at least 8 characters long");
            setSuccessMessage("");
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)) {
            setErrorMessage("Please enter a valid email address");
            setSuccessMessage("");
            return;
        }
        try{
            const response = await fetch(`${API_BASE_URL}/api/users/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    email,
                    password 
                })
            });
            if (!response.ok) {
                let errorMessageText = "Error on registering user";

                try {
                    const errorData = await response.json();
                    errorMessageText = errorData?.message || errorMessageText;
                } catch {
                    const text = await response.text();
                    if (text) errorMessageText = text;
                }

                setErrorMessage(errorMessageText);
                setSuccessMessage("");
                return;
            }
            setSuccessMessage("User registered successfully!");
            setErrorMessage("");
            setUsername("");
            setEmail("");
            setPassword("");
        } catch (error: any) {
            setErrorMessage("Network error: " + error.message);
            setSuccessMessage("");
        }
    }

    return(
        <>
            <div className="absolute top-4 left-4 ">
                <Link href="/">
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
            <div className="flex flex-col items-center justify-center h-auto gap-4 p-6 mx-auto max-w-3xs border border-white/20 shadow-lg shadow-black/40 rounded-xl h-auto slide-in-right delay-200">
                <h1 className="text-3xl font-bold text-glow">Register</h1>

                <div className="flex flex-col">
                    <label>UserName</label>
                    <input 
                       type="text" 
                       className="border border-white/20 shadow-[0_0_2px_#42A5F5] rounded px-4 py-2 bg-transparent text-white focus:outline-none focus:shadow-[0_0_8px_#42A5F5,0_0_2px_#42A5F5] transition-shadow duration-200 ease-in-out"
                       value={username}
                       onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="flex flex-col">
                    <label>Email</label>
                    <input 
                       type="email" 
                       className="border border-white/20 shadow-[0_0_2px_#42A5F5] rounded px-4 py-2 bg-transparent text-white focus:outline-none focus:shadow-[0_0_8px_#42A5F5,0_0_2px_#42A5F5] transition-shadow duration-200 ease-in-out"
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="flex flex-col">
                    <label>Password</label>
                    <input 
                       type="password" 
                       className="border border-white/20 shadow-[0_0_2px_#42A5F5] rounded px-4 py-2 bg-transparent text-white focus:outline-none focus:shadow-[0_0_8px_#42A5F5,0_0_2px_#42A5F5] transition-shadow duration-200 ease-in-out"
                       value={password}
                       onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button 
                    className="bg-[#1E88E5] hover:bg-[#1565C0] shadow-[0_0_8px_#42A5F5] border border-white/20 text-white text-glow font-bold py-2 px-4 rounded mt-4" 
                    onClick={handleRegister}>
                    Register
                </button>
                {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}
                {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}   

            </div>
        </>

    )
}