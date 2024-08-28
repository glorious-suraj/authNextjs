"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';

interface User {
    username: string;
    password: string;
}

export default function LoginPage() {
    const router = useRouter();
    const [user, setUser] = useState<User>({
        username: "",
        password: "",
    });
    const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);

    const validate = (): boolean => {
        let valid = true;
        let messages: string[] = [];

        if (!user.username) {
            messages.push("Email is required");
            valid = false;
        } else if (!user.password) {
            messages.push("Password is required");
            valid = false;
        }

        if (messages.length > 0) {
            toast.error(messages.join(", "));
        }

        return valid;
    };

    const onLogin = async (): Promise<void> => {
        if (!validate()) return;

        try {
            setLoading(true);
            const response = await axios.post("https://dummyjson.com/auth/login", user);
            console.log("Login success", response.data);
            toast.success("Login successful");

            // Save the token to localStorage
            localStorage.setItem("token", response.data.token);

            // Navigate to the profile page after login
            router.push("/profile");
        } catch (error: any) {
            console.log("Login failed", error?.response?.data?.message);
            toast.error("Login failed: " + error?.response?.data?.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Validate user input to enable or disable button
        if (user.username.trim().length > 0 && user.password.trim().length > 0) {
            setButtonDisabled(false)
        } else {
            setButtonDisabled(true)
        }
    }, [user]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 py-6 px-4">
            <div className="bg-gray-800 shadow-2xl rounded-lg p-8 w-full max-w-md">
                <h1 className="text-4xl font-bold text-white text-center mb-6">
                    Login
                </h1>

                <label htmlFor="email" className="block text-gray-300 mb-2">
                    User Name *
                </label>
                <input
                    id="email"
                    type="text"
                    value={user.username}
                    onChange={(e) => setUser({ ...user, username: e.target.value })}
                    placeholder="Enter your email"
                    className="w-full p-3 border border-gray-600 rounded-lg mb-4 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                />

                <label htmlFor="password" className="block text-gray-300 mb-2">
                    Password *
                </label>
                <input
                    id="password"
                    type="password"
                    value={user.password}
                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                    placeholder="Enter your password"
                    className="w-full p-3 border border-gray-600 rounded-lg mb-6 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                />

                <button
                    onClick={onLogin}
                    disabled={buttonDisabled}
                    className={`w-full p-3 rounded-lg text-white font-semibold ${buttonDisabled ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"} transition duration-200 ease-in-out`}
                >
                    {loading ? "Processing..." : "Login"}
                </button>

                <p className="text-gray-300 text-center mt-4">
                    Don't have login details? Get a username and password from{" "}
                    <Link href="https://dummyjson.com/users" target="_blank" className="text-blue-500 hover:underline">
                        here
                    </Link>.
                </p>
            </div>
            <Toaster />
        </div>
    );
}
