"use client";

import { useRouter } from "next/navigation";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4">

            <h1 className="text-6xl font-bold mb-4">404</h1>
            <p className="text-gray-400 mb-6 text-center">
                Page not found 😢
            </p>

            <div className="flex gap-4">

                <button
                    onClick={() => router.push("/")}
                    className="flex items-center gap-2 bg-blue-500 px-4 py-2 rounded-xl"
                >
                    <Home size={18} />
                    Home
                </button>

                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 bg-gray-600 px-4 py-2 rounded-xl"
                >
                    <ArrowLeft size={18} />
                    Back
                </button>

            </div>
        </div>
    );
}