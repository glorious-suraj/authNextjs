"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface UserData {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    maidenName: string;
    age: number;
    gender: string;
    phone: string;
    birthDate: string;
    image: string;
    bloodGroup: string;
    height: number;
    weight: number;
    eyeColor: string;
    hair: {
        color: string;
        type: string;
    };
    address: {
        address: string;
        city: string;
        state: string;
        stateCode: string;
        postalCode: string;
        coordinates: {
            lat: number;
            lng: number;
        };
        country: string;
    };
    company: {
        department: string;
        name: string;
        title: string;
        address: {
            address: string;
        };
    };
    role: string;
}

export default function ProfilePage() {
    const router = useRouter();
    const [data, setData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const logout = async (): Promise<void> => {
        try {
            localStorage.removeItem('token');
            router.replace('/login');
            toast.success('Logout successful');
        } catch (error: any) {
            console.log(error.message);
            toast.error('Logout failed. Please try again.');
        }
    };

    const getUserDetails = async (): Promise<void> => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');

        if (!token) {
            setError("No token found. Please log in.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('https://dummyjson.com/auth/me', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch user details");
            }
            const userData: UserData = await response.json();
            setData(userData);
        } catch (error: any) {
            console.log(error.message);
            toast.error("Failed to fetch user details");
            setError("Failed to fetch user details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUserDetails();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-12 px-4">
            <div className="bg-white shadow-md rounded-lg w-full max-w-4xl p-8">
                <div className="flex flex-col items-center mb-6">
                    <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden">
                        <img
                            src={data?.image || 'https://via.placeholder.com/96'}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mt-4">{data?.username}</h1>
                </div>

                {loading ? (
                    <p className="text-lg text-gray-600 text-center">Loading...</p>
                ) : error ? (
                    <p className="text-lg text-red-600 text-center">{error}</p>
                ) : !data ? (
                    <p className="text-lg text-gray-600 text-center">No user data available</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { label: 'User ID', value: data.id },
                            { label: 'Email', value: data.email },
                            { label: 'First Name', value: data.firstName },
                            { label: 'Last Name', value: data.lastName },
                            { label: 'Phone', value: data.phone },
                            { label: 'Address', value: `${data.address.address}, ${data.address.city}, ${data.address.state} ${data.address.postalCode}` },
                            { label: 'Company', value: `${data.company.name} - ${data.company.title}` },
                            { label: 'Role', value: data.role }
                        ].map(({ label, value }) => (
                            <div key={label} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                <h2 className="text-lg font-medium text-gray-700">{label}</h2>
                                <p className="text-xl font-semibold text-gray-900">{value}</p>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex justify-between mt-8">
                    <button
                        onClick={getUserDetails}
                        className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
                    >
                        Refresh
                    </button>
                    <button
                        onClick={logout}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}
