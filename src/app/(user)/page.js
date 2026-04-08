"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user) {
            router.push("/login");
        }
    }, []);

    return <div>Welcome to Home 🔥</div>;
}