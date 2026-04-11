"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";

export default function CommentModal({ open, setOpen, postId }) {
    const [comments, setComments] = useState([]);
    const [text, setText] = useState("");

    const fetchComments = async () => {
        const { data } = await API.get(`/posts/comments/${postId}`);
        setComments(data);
    };

    useEffect(() => {
        if (open) fetchComments();
    }, [open]);

    const addComment = async () => {
        await API.post("/posts/comment", {
            postId,
            text,
        });
        setText("");
        fetchComments();
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center">

            <div className="bg-white/10 p-4 rounded-xl w-[90%] max-w-md">

                {/* COMMENTS */}
                <div className="max-h-[300px] overflow-y-auto">
                    {comments.map(c => (
                        <div key={c._id} className="mb-2">
                            <p className="text-sm">{c.user.username}</p>
                            <p className="text-xs">{c.text}</p>
                        </div>
                    ))}
                </div>

                {/* INPUT */}
                <div className="flex gap-2 mt-3">
                    <input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="flex-1 p-2 rounded-xl bg-white/20"
                    />
                    <button onClick={addComment} className="bg-blue-500 px-3 rounded-xl">
                        Send
                    </button>
                </div>

            </div>
        </div>
    );
}