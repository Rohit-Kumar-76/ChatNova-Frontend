"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import API from "@/lib/api";
import Avatar from "@/components/Avatar";
import { Pencil, Trash2 } from "lucide-react";
import { Heart, MessageCircle } from "lucide-react";

export default function PostDetail() {
    const { id } = useParams();

    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [text, setText] = useState("");
    const [replyTo, setReplyTo] = useState(null);

    const [editing, setEditing] = useState(null);
    const [editText, setEditText] = useState("");

    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(false);

    const [visibleCount, setVisibleCount] = useState(10);

    // 🔥 current user
    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (stored) setCurrentUser(JSON.parse(stored));
    }, []);

    // 🔥 fetch post
    useEffect(() => {
        const fetchPost = async () => {
            const { data } = await API.get(`/posts/${id}`);
            setPost(data);
        };
        if (id) fetchPost();
    }, [id]);

    // 🔥 fetch comments
    const fetchComments = async () => {
        setLoading(true);
        try {
            const { data } = await API.get(`/posts/comments/${id}`);
            setComments(data);
        } catch {
            console.log("error");
        }
        setLoading(false);
    };

    useEffect(() => {
        if (id) fetchComments();
    }, [id]);

    // 🔥 add comment / reply
    const handleSend = async () => {
        if (!text.trim()) return;

        await API.post("/posts/comment", {
            postId: id,
            text,
            parent: replyTo,
        });

        setText("");
        setReplyTo(null);
        fetchComments();
    };

    // 🔥 delete
    const deleteComment = async (cid) => {
        await API.delete(`/posts/comment/${cid}`);
        fetchComments();
    };

    // 🔥 edit
    const updateComment = async (cid) => {
        await API.put(`/posts/comment/${cid}`, {
            text: editText,
        });

        setEditing(null);
        fetchComments();
    };

    // 🔥 recursive replies
    const renderReplies = (parentId, level = 1) => {
        return comments
            .filter((c) => c.parent === parentId)
            .map((c) => (
                <div key={c._id} className="ml-6 mt-2">

                    <div className="bg-white/5 p-2 rounded-xl">

                        <div className="flex justify-between">

                            <div className="flex items-center gap-2">
                                <Avatar src={c.user?.profilePic} />
                                <p className="text-xs font-medium">
                                    {c.text.startsWith("@") && (
                                        <span className="text-blue-400">
                                            {c.text.split(" ")[0]}
                                        </span>
                                    )}
                                    <span className="ml-1">{c.user.username}</span>
                                </p>
                            </div>

                            {(c.user._id === currentUser._id || post.user._id === currentUser._id) && (
                                <div className="flex gap-2">

                                    {c.user._id === currentUser._id && (
                                        <button onClick={() => {
                                            setEditing(c._id);
                                            setEditText(c.text);
                                        }} className="cursor-pointer" >
                                            <Pencil size={14} />
                                        </button>
                                    )}

                                    <button onClick={() => deleteComment(c._id)} className="cursor-pointer">
                                        <Trash2 size={14} />
                                    </button>

                                </div>
                            )}

                        </div>

                        {editing === c._id ? (
                            <>
                                <input
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    className="w-full mt-2 p-2 bg-white/20 rounded"
                                />
                                <button onClick={() => updateComment(c._id)}>
                                    Save
                                </button>
                            </>
                        ) : (
                            <p className="text-sm mt-1">{c.text}</p>
                        )}

                        <button
                            onClick={() => {
                                setReplyTo(c._id);
                                setText(`@${c.user.username} `);
                            }}
                            className="text-xs text-blue-400 mt-1"
                        >
                            Reply
                        </button>

                    </div>

                    {renderReplies(c._id, level + 1)}
                </div>
            ));
    };

    if (!post || !currentUser) return null;

    return (
        <div className="h-full lg:w-1/3 mx-auto overflow-y-auto scrollbar-hide text-white p-4 space-y-4 scroll-smooth ">

            {/* POST */}
            <div className="bg-white/10 p-3 rounded-xl">
                <div className="flex items-center gap-2">
                    <Avatar src={post.user?.profilePic} />
                    <p>{post.user?.username}</p>
                </div>

                <p className="mt-2">{post.text}</p>

                {post.image && (
                    <img src={post.image} className="mt-2 rounded-xl" />
                )}
            </div>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-300">

                {/* ❤️ Likes */}
                <div className="flex items-center gap-1">
                    <Heart /> <span>{post.likes?.length || 0}</span>
                </div>

                {/* 💬 Comments */}
                <div className="flex items-center gap-1">
                    <MessageCircle /><span>{comments.length}</span>
                </div>

            </div>

            {/* INPUT */}
            <div className="flex gap-2 sticky bottom-0 bg-black py-2 z-50">
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={replyTo ? "Reply..." : "Write comment..."}
                    className="flex-1 p-2 bg-white/20 rounded-xl outline-none"
                />
                <button
                    onClick={handleSend}
                    className="bg-blue-500 px-4 rounded-xl cursor-pointer"
                >
                    Send
                </button>
            </div>

            {/* LOADING */}
            {loading && (
                <div className="text-center py-4 animate-pulse text-gray-400">
                    Loading comments...
                </div>
            )}

            {/* COMMENTS */}
            {!loading &&
                comments
                    .filter(c => !c.parent)
                    .slice(0, visibleCount)
                    .map(c => (
                        <div key={c._id}>

                            <div className="bg-white/10 p-3 rounded-xl">

                                <div className="flex justify-between">

                                    <div className="flex gap-2">
                                        <Avatar src={c.user?.profilePic} />
                                        <div>
                                            <p>{c.user.username}</p>
                                            <p className="text-[10px] text-gray-400 ">
                                                {new Date(c.createdAt).toLocaleString("en-IN", {
                                                    day: "numeric",
                                                    month: "short",
                                                    // year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </p>
                                        </div>
                                    </div>



                                    {(c.user._id === currentUser._id || post.user._id === currentUser._id) && (
                                        <div className="flex gap-2">

                                            {c.user._id === currentUser._id && (
                                                <button onClick={() => {
                                                    setEditing(c._id);
                                                    setEditText(c.text);
                                                }}
                                                    className="cursor-pointer"
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                            )}

                                            <button className="cursor-pointer" onClick={() => deleteComment(c._id)}>
                                                <Trash2 size={16} />
                                            </button>

                                        </div>
                                    )}

                                </div>

                                {editing === c._id ? (
                                    <>
                                        <input
                                            value={editText}
                                            onChange={(e) => setEditText(e.target.value)}
                                            className="w-full mt-2 p-2 bg-white/20 rounded"
                                        />
                                        <button onClick={() => updateComment(c._id)}>
                                            Save
                                        </button>
                                    </>
                                ) : (
                                    <p className="mt-1">{c.text}</p>
                                )}

                                <button
                                    onClick={() => {
                                        setReplyTo(c._id);
                                        setText(`@${c.user.username} `);
                                    }}
                                    className="text-xs text-blue-400"
                                >
                                    Reply
                                </button>

                            </div>

                            {/* 🔥 nested replies */}
                            <div className="mt-2 space-y-2">

                                {comments
                                    .filter(r => r.parent === c._id || comments.some(x => x._id === r.parent && x.parent === c._id))
                                    .map(r => (

                                        <div key={r._id} className="bg-white/5 p-2 rounded-xl w-[97%] ml-[2%]">

                                            <div className="flex justify-between">

                                                <div className="flex items-center gap-2">
                                                    <Avatar src={r.user?.profilePic} />
                                                    <div>
                                                        <p className="text-xs">

                                                            {r.user.username}
                                                        </p>
                                                        <p className="text-[10px] text-gray-400 ">
                                                            {new Date(c.createdAt).toLocaleString("en-IN", {
                                                                day: "numeric",
                                                                month: "short",
                                                                // year: "numeric",
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>

                                                {(r.user._id === currentUser._id || post.user._id === currentUser._id) && (
                                                    <div className="flex gap-2 ">

                                                        {r.user._id === currentUser._id && (
                                                            <button
                                                                className="cursor-pointer"
                                                                onClick={() => {
                                                                    setEditing(r._id);
                                                                    setEditText(r.text);
                                                                }}>
                                                                <Pencil size={16} />
                                                            </button>
                                                        )}

                                                        <button
                                                            className="cursor-pointer"
                                                            onClick={() => deleteComment(r._id)}>
                                                            <Trash2 size={16} />
                                                        </button>

                                                    </div>
                                                )}

                                            </div>

                                            {editing === r._id ? (
                                                <>
                                                    <input
                                                        value={editText}
                                                        onChange={(e) => setEditText(e.target.value)}
                                                        className="w-full mt-2 p-2 bg-white/20 rounded"
                                                    />
                                                    <button onClick={() => updateComment(r._id)}>Save</button>
                                                </>
                                            ) : (
                                                <p className="text-sm">{r.text}</p>
                                            )}

                                            <button
                                                onClick={() => {
                                                    setReplyTo(r._id);
                                                    setText(`@${r.user.username} `);
                                                }}
                                                className="text-xs text-blue-400 mt-1"
                                            >
                                                Reply
                                            </button>

                                        </div>

                                    ))}

                            </div>

                        </div>
                    ))}
            {comments.filter(c => !c.parent).length > visibleCount && (
                <div className="text-center mt-3">
                    <button
                        onClick={() => setVisibleCount(prev => prev + 10)}
                        className="text-blue-400 text-sm cursor-pointer"
                    >
                        View more comments
                    </button>
                </div>
            )}

        </div>
    );
}