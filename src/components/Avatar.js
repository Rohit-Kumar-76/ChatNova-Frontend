"use client";

import { User } from "lucide-react";

export default function Avatar({ src, size = 40 }) {
    return src ? (
        <img
            src={src}
            alt="dp"
            style={{ width: size, height: size }}
            className="rounded-full object-cover"
        />
    ) : (
        <div
            style={{ width: size, height: size }}
            className="rounded-full bg-gray-300 flex items-center justify-center"
        >
            <User size={size / 2} />
        </div>
    );
}