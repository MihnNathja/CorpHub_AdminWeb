import React, { useState, useMemo } from "react";
import { Send, X } from "lucide-react";
import CommentItem from "./CommentItem";
import { buildCommentTree } from "../../utils/buildTree";

const CommentSection = ({ comments = [], onAddComment, onReplyComment }) => {
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [visibleCount, setVisibleCount] = useState(3); // hiển thị ban đầu

  // Chuyển list phẳng thành cây
  const commentTree = useMemo(() => buildCommentTree(comments), [comments]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (replyTo) {
      onReplyComment(replyTo.id, newComment);
    } else {
      onAddComment(newComment);
    }

    setNewComment("");
    setReplyTo(null);
  };

  // Cắt danh sách theo visibleCount
  const visibleComments = commentTree.slice(0, visibleCount);

  return (
    <div className="mt-6">
      <h3 className="font-semibold mb-2">Bình luận</h3>

      {/* Danh sách bình luận dạng cây, có scroll */}
      <div
        className="space-y-2 border rounded-lg p-3 bg-gray-50 dark:bg-gray-800 overflow-y-auto"
        style={{ maxHeight: "300px" }}
      >
        {visibleComments.length > 0 ? (
          visibleComments.map((c) => (
            <CommentItem key={c.id} comment={c} onReply={setReplyTo} />
          ))
        ) : (
          <p className="text-sm text-gray-500 italic">Chưa có bình luận nào</p>
        )}

        {/* Nút hiển thị thêm / thu gọn */}
        {commentTree.length > visibleCount ? (
          <div className="text-center mt-2">
            <button
              onClick={() => setVisibleCount((prev) => prev + 5)}
              className="text-sm text-blue-600 hover:underline"
            >
              Hiển thị thêm bình luận
            </button>
          </div>
        ) : visibleCount > 3 ? (
          <div className="text-center mt-2">
            <button
              onClick={() => setVisibleCount(3)}
              className="text-sm text-gray-500 hover:underline"
            >
              Thu gọn
            </button>
          </div>
        ) : null}
      </div>

      {/* Form nhập bình luận */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-3">
        {replyTo && (
          <div className="flex items-center justify-between text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
            <span>Replying to {replyTo.author?.fullName}</span>
            <button
              type="button"
              onClick={() => setReplyTo(null)}
              className="flex items-center gap-1 text-red-500 hover:underline"
            >
              <X className="w-3 h-3" /> Cancel
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder={
              replyTo
                ? `Trả lời @${replyTo.author?.fullName}`
                : "Nhập bình luận..."
            }
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 border rounded-lg px-3 py-2 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-1 transition-colors"
          >
            <Send className="w-4 h-4" /> Gửi
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentSection;
