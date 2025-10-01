import React, { useState } from "react";
import {
    UserCircle,
    CornerDownRight,
    ChevronDown,
    ChevronRight,
} from "lucide-react";

const CommentItem = ({ comment, onReply, level = 0 }) => {
    const [expanded, setExpanded] = useState(false);

    const avatarUrl = comment.author?.avatar
        ? `http://localhost:8080/${comment.author.avatar}` // hoặc `${process.env.REACT_APP_API_URL}/${comment.author.avatar}`
        : null;

    return (
        <div className="mt-2" style={{ marginLeft: level * 20 }}>
            <div className="flex items-start gap-3 p-2 border-b last:border-none dark:border-gray-700">
                {/* Avatar */}
                {avatarUrl ? (
                    <img
                        src={avatarUrl}
                        alt="avatar"
                        className="w-8 h-8 rounded-full object-cover"
                    />
                ) : (
                    <UserCircle className="w-8 h-8 text-gray-400 flex-shrink-0" />
                )}

                {/* Nội dung */}
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">
                            {comment.author?.fullName || "Ẩn danh"}
                        </span>
                        <span className="text-xs text-gray-500">
                            {new Date(comment.updatedAt).toLocaleString()}
                        </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                        {comment.commentText}
                    </p>

                    <div className="flex items-center gap-3 mt-1">
                        {/* Nút Reply */}
                        <button
                            onClick={() => onReply(comment)}
                            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                        >
                            <CornerDownRight className="w-3 h-3" /> Reply
                        </button>

                        {/* Nút expand/collapse nếu có children */}
                        {comment.children?.length > 0 && (
                            <button
                                onClick={() => setExpanded((prev) => !prev)}
                                className="text-xs text-gray-500 hover:underline flex items-center gap-1"
                            >
                                {expanded ? (
                                    <>
                                        <ChevronDown className="w-3 h-3" /> Ẩn{" "}
                                        {comment.children.length} phản hồi
                                    </>
                                ) : (
                                    <>
                                        <ChevronRight className="w-3 h-3" /> Hiện{" "}
                                        {comment.children.length} phản hồi
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Render children đệ quy khi expanded */}
            {expanded &&
                comment.children?.length > 0 &&
                comment.children.map((child) => (
                    <CommentItem
                        key={child.id}
                        comment={child}
                        onReply={onReply}
                        level={level + 1}
                    />
                ))}
        </div>
    );
};

export default CommentItem;
