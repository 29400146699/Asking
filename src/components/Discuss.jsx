import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import {
  Button,
  Input,
  Pagination,
  message,
  Spin,
  Empty,
  Card,
  Avatar,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import { formatDate } from "../utils/tools";

const { TextArea } = Input;

function Discuss({ issueId }) {
  const [comments, setComments] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });

  const [content, setContent] = useState("");
  const [listLoading, setListLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // 拉评论
  const fetchComments = async (page = pageInfo.current, pageSize = pageInfo.pageSize) => {
    setListLoading(true);
    try {
      const res = await api.comment.list({ issueId, page, pageSize });
      setComments(Array.isArray(res.list) ? res.list : []);
      setPageInfo((prev) => ({
        ...prev,
        current: res.page,
        pageSize: res.pageSize,
        total: res.total,
      }));
    } catch (e) {
      message.error(typeof e === "string" ? e : "评论加载失败");
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    if (!issueId) return;
    fetchComments(1, pageInfo.pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [issueId]);

  // 提交评论
  const submitComment = async () => {
    const auth = api.auth.getCurrentUser();
    if (!auth?.user?.userId) {
      message.warning("请先登录再评论");
      return;
    }
    if (!content.trim()) {
      message.warning("请输入评论内容");
      return;
    }

    setSubmitLoading(true);
    try {
      await api.comment.create({
        issueId,
        content,
        userId: auth.user.userId,
      });

      message.success("评论成功");
      setContent("");
      await fetchComments(1, pageInfo.pageSize);
    } catch (e) {
      message.error(typeof e === "string" ? e : "评论失败");
    } finally {
      setSubmitLoading(false);
    }
  };

  const onPageChange = (page, pageSize) => {
    setPageInfo((prev) => ({ ...prev, current: page, pageSize }));
    fetchComments(page, pageSize);
  };

  return (
    <Card
      title={`评论（${pageInfo.total}）`}
      style={{ marginTop: 24 }}
      styles={{ body: { padding: 16 } }}
    >
      {/* 评论输入框 */}
      <div style={{ marginBottom: 20 }}>
        <TextArea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          placeholder="写下你的评论..."
          maxLength={500}
          showCount
        />
        <div
          style={{
            marginTop: 20,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button
            type="primary"
            onClick={submitComment}
            loading={submitLoading}
          >
            发表评论
          </Button>
        </div>
      </div>

      {/* 评论列表 */}
      <Spin spinning={listLoading}>
        {comments.length === 0 ? (
          <Empty description="暂无评论，快来抢沙发～" />
        ) : (
          comments.map((item, index) => (
            <Card
              key={item.commentId || item.id || index}
              size="small"
              style={{
                marginBottom: 12,
                background: "#fafafa",
              }}
              styles={{ body: { paddingBottom: 16 } }}
            >
              {/* 头部 */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 8,
                }}
              >
                <Avatar icon={<UserOutlined />} />
                <div>
                  <div style={{ fontWeight: 600 }}>
                    {item.author?.username || "未知用户"}
                  </div>
                  <div style={{ fontSize: 12, opacity: 0.6 }}>
                    {formatDate(item.date, "year")}
                  </div>
                </div>
              </div>

              {/* 内容 */}
              <div
                style={{
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.8,
                  fontSize: 14,
                }}
              >
                {item.content}
              </div>
            </Card>
          ))
        )}
      </Spin>

      {/* 分页 */}
      {pageInfo.total > pageInfo.pageSize && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
          <Pagination
            current={pageInfo.current}
            pageSize={pageInfo.pageSize}
            total={pageInfo.total}
            onChange={onPageChange}
            showSizeChanger
          />
        </div>
      )}
    </Card>
  );
}

export default Discuss;