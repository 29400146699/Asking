import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Input, Button, message, Empty } from "antd";
import styles from "../css/BookDetail.module.css";
import { api } from "../services/api";
import PageHeader from "../components/PageHeader";
import { ArrowLeftOutlined } from "@ant-design/icons";


function BookDetail() {
    const navigate = useNavigate();
    const { bookId } = useParams();

    const [book, setBook] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // 当前登录用户（localStorage.auth）
    const currentUser = useMemo(() => api.auth.getCurrentUser()?.user || null, []);

    // 拉取详情 + 评论
    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                // ✅ 进入详情页：浏览数 +1（持久化）
                const detail = await api.book.detail(bookId);
                setBook(detail);

                const list = await api.bookComment.list(bookId);
                setComments(Array.isArray(list) ? list : []);
            } catch (e) {
                message.error(String(e || "加载失败"));
            } finally {
                setLoading(false);
            }
        }

        if (bookId) fetchData();
    }, [bookId]);

    // 发布评论
    const handleAddComment = async () => {
        if (!currentUser?.userId) return message.warning("请先登录");
        if (!commentText.trim()) return message.warning("请输入评论内容");

        setSubmitting(true);
        try {
            await api.bookComment.add({
                bookId,
                userId: currentUser.userId,
                content: commentText,
            });

            setCommentText("");

            // ✅ 重新拉评论
            const list = await api.bookComment.list(bookId);
            setComments(Array.isArray(list) ? list : []);

            // ✅ 刷新书籍信息（不增加浏览数）
            // 需要你在 api.book 里有 get(bookId)
            const latestBook = await api.book.get(bookId);
            setBook(latestBook);

            message.success("评论成功");
        } catch (e) {
            message.error(String(e || "评论失败"));
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div style={{ padding: 20 }}>加载中...</div>;
    if (!book) return <div style={{ padding: 20 }}>书籍不存在</div>;

    return (
        <div>
            <PageHeader title="书籍详情" />
            {/* 返回按钮 */}
            <Button
                type="link"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(-1)}
            >
                返回
            </Button>

            <div className={styles.bookInfoContainer}>
                {/* 左侧：封面 + 下载链接 */}
                <div className={styles.leftSide}>
                    <div className={styles.img} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <img
                            src={book.coverUrl}
                            alt={book.bookTitle}
                            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                        />
                    </div>

                    <div className={styles.link}>
                        <span
                            className={styles.downloadLink}
                            onClick={() => message.info("暂无下载链接")}
                        >
                            下载/查看资源
                        </span>
                    </div>
                </div>

                {/* 右侧：信息 */}
                <div className={styles.rightSide}>
                    <h2 className={styles.title}>{book.bookTitle}</h2>

                    <p>发布日期：{book.bookDate}</p>
                    <p>浏览数：{book.scanNumber ?? 0}</p>
                    <p>评论数：{book.commentNumber ?? 0}</p>

                    <div style={{ marginTop: 12 }}>
                        <p style={{ marginBottom: 8 }}>简介：</p>
                        <p style={{ lineHeight: 1.8 }}>{book.description}</p>
                    </div>
                </div>
            </div>

            {/* 评论区 */}
            <div className={styles.comment}>
                <div style={{ marginBottom: 12 }}>
                    <span className={styles.requirePoints}>*</span> 评论区
                </div>

                <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                    <Input.TextArea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder={currentUser ? "写下你的评论..." : "登录后才能发表评论"}
                        autoSize={{ minRows: 3, maxRows: 5 }}
                        disabled={!currentUser}
                    />
                    <Button
                        type="primary"
                        onClick={handleAddComment}
                        loading={submitting}
                        disabled={!currentUser}
                    >
                        发布
                    </Button>
                </div>

                {comments.length === 0 ? (
                    <Empty description="暂无评论" />
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {comments.map((c) => (
                            <div
                                key={c.commentId}
                                style={{
                                    padding: "12px 14px",
                                    border: "1px solid #eee",
                                    borderRadius: 8,
                                    background: "#fff",
                                }}
                            >
                                <div style={{ fontSize: 12, color: "#999", marginBottom: 6 }}>
                                    用户ID：{c.userId}|{new Date(Number(c.date)).toLocaleString()}
                                </div>
                                <div style={{ fontSize: 14, lineHeight: 1.7 }}>{c.content}</div>
                                
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default BookDetail;