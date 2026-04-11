"use client";

import { useState, useRef } from "react";
import API from "@/lib/api";
import { Image as ImageIcon, X } from "lucide-react";

export default function CreatePostModal({ open, setOpen, refresh }) {
    const [text, setText] = useState("");
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    const fileRef = useRef(null); // 🔥 important

    if (!open) return null;

    const handleImage = (file) => {
        if (!file) return;
        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const removeImage = () => {
        setImage(null);
        setPreview(null);
    };

    const handlePost = async () => {
        if (!text && !image) return;

        // 🔥 size check (frontend)
        if (image && image.size > 2 * 1024 * 1024) {
            toast.error("Image must be less than 2MB 🚫");
            return;
        }

        try {
            if (image) {
                const reader = new FileReader();

                reader.onloadend = async () => {
                    try {
                        await API.post("/posts", {
                            text,
                            image: reader.result,
                        });

                        refresh();
                        setOpen(false);
                        setText("");
                        setImage(null);
                        setPreview(null);

                    } catch (err) {
                        if (err.response?.status === 413) {
                            toast.error("Image too large 🚫");
                        } else {
                            toast.error("Upload failed");
                        }
                    }
                };

                reader.readAsDataURL(image);

            } else {
                await API.post("/posts", { text });

                refresh();
                setOpen(false);
                setText("");
            }

        } catch {
            toast.error("Something went wrong");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">

            <div className="w-[90%] max-w-md p-5 rounded-2xl 
            bg-white/10 backdrop-blur-xl border border-white/20 text-white">

                <h2 className="text-lg font-semibold mb-4 text-center">
                    Create Post
                </h2>

                <textarea
                    placeholder="What's on your mind?"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-white/20 border border-white/30 outline-none mb-3"
                />

                {/* IMAGE SECTION */}
                {preview ? (
                    <div className="relative mb-3">

                        {/* PREVIEW */}
                        <img
                            src={preview}
                            className="w-full max-h-[250px] object-contain rounded-xl cursor-pointer"
                            onClick={() => fileRef.current.click()} // 🔥 replace
                        />

                        {/* REMOVE */}
                        <button
                            onClick={removeImage}
                            className="absolute top-2 right-2 bg-black/70 p-1 rounded-full cursor-pointer"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ) : (
                    <div
                        onClick={() => fileRef.current.click()} // 🔥 open picker
                        className="flex items-center justify-center gap-2 
                        bg-white/10 border border-dashed border-white/30 
                        py-6 rounded-xl cursor-pointer mb-3"
                    >
                        <ImageIcon size={20} />
                        <span>Add Photo</span>
                    </div>
                )}

                {/* HIDDEN INPUT */}
                <input
                    ref={fileRef}
                    type="file"
                    hidden
                    onChange={(e) => handleImage(e.target.files[0])}
                />

                {/* ACTIONS */}
                <div className="flex gap-3 mt-4">
                    <button
                        onClick={() => setOpen(false)}
                        className="flex-1 py-2 rounded-xl bg-gray-500 cursor-pointer"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handlePost}
                        className="flex-1 py-2 rounded-xl bg-blue-500 cursor-pointer"
                    >
                        Post
                    </button>
                </div>
            </div>
        </div>
    );
}