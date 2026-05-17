"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Home, RotateCcw } from "lucide-react";

export default function Error({ error, reset }) {
    const router = useRouter();

    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4">

            <h1 className="text-5xl font-bold mb-4">Something went wrong 💥</h1>

            <p className="text-gray-400 mb-6 text-center max-w-md">
                {error?.message || "Unexpected error occurred"}
            </p>

            <div className="flex gap-4">

                <button
                    onClick={() => reset()}
                    className="flex items-center gap-2 bg-yellow-500 px-4 py-2 rounded-xl"
                >
                    <RotateCcw size={18} />
                    Try Again
                </button>

                <button
                    onClick={() => router.push("/")}
                    className="flex items-center gap-2 bg-blue-500 px-4 py-2 rounded-xl"
                >
                    <Home size={18} />
                    Home
                </button>

            </div>
        </div>
    );
}