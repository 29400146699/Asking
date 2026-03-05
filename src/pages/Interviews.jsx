import React, { useEffect, useState } from "react";
import { Tree, Spin, Card, Button, Empty, message } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import styles from "../css/Interview.module.css";
import PageHeader from "../components/PageHeader.jsx";
import { api } from "../services/api";

function Interviews() {
    const [categoryMap, setCategoryMap] = useState({});
    // 左侧树
    const [treeData, setTreeData] = useState([]);
    const [treeLoading, setTreeLoading] = useState(false);

    // 当前选中的分类
    const [selectedCategory, setSelectedCategory] = useState(null);

    // 右侧列表
    const [questionList, setQuestionList] = useState([]);
    const [listLoading, setListLoading] = useState(false);

    // 右侧详情
    const [selectedQuestionId, setSelectedQuestionId] = useState(null);
    const [questionDetail, setQuestionDetail] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);

    // 把 mock 分类数据转换为 antd Tree 格式：{title,key,children}
    const convertToTreeData = (list = []) =>
        list.map((item) => ({
            title: item.title,
            key: item.id,
            children: convertToTreeData(item.children || []),
        }));

    // 1) 加载分类树
    useEffect(() => {
        async function fetchTree() {
            setTreeLoading(true);
            try {
                const res = await api.interview.category.tree();

                const rawTree = res.list || [];

                // Tree 数据
                setTreeData(convertToTreeData(rawTree));

                // 🔥 构建 id → 路径映射
                const map = buildCategoryMap(rawTree);
                setCategoryMap(map);

            } catch (e) {
                message.error("加载分类失败");
            } finally {
                setTreeLoading(false);
            }
        }

        fetchTree();
    }, []);

    // 2) 选中分类后：拉题目列表，并回到“列表态”
    useEffect(() => {
        if (!selectedCategory) return;

        async function fetchQuestions() {
            setListLoading(true);
            try {
                // pageSize 你可按需要调整
                const res = await api.interview.question.list({
                    page: 1,
                    pageSize: 50,
                    categoryId: selectedCategory,
                });
                setQuestionList(res.list || []);

                // 切换分类时，回到列表态
                setSelectedQuestionId(null);
                setQuestionDetail(null);
            } catch (e) {
                message.error(typeof e === "string" ? e : "加载题目失败");
            } finally {
                setListLoading(false);
            }
        }

        fetchQuestions();
    }, [selectedCategory]);


    // 3) 点击题目：拉详情
    const openDetail = async (id) => {
        setSelectedQuestionId(id);
        setDetailLoading(true);
        try {
            const res = await api.interview.question.detail(id);
            setQuestionDetail(res);
        } catch (e) {
            message.error(typeof e === "string" ? e : "加载详情失败");
            // 失败就退回列表态
            setSelectedQuestionId(null);
            setQuestionDetail(null);
        } finally {
            setDetailLoading(false);
        }
    };

    // 4) 返回列表
    const backToList = () => {
        setSelectedQuestionId(null);
        setQuestionDetail(null);
    };

    // 点击 Tree 节点
    const handleSelect = (selectedKeys) => {
        if (selectedKeys?.length) setSelectedCategory(selectedKeys[0]);
    };

    const isDetailMode = !!selectedQuestionId;

    const buildCategoryMap = (tree = [], parentPath = [], map = {}) => {
        tree.forEach((node) => {
            const currentPath = [...parentPath, node.title];
            map[node.id] = currentPath;

            if (node.children && node.children.length) {
                buildCategoryMap(node.children, currentPath, map);
            }
        });



        return map;
    };

    return (
        <div className={styles.container}>
            <PageHeader title="面试题大全" />

            <div className={styles.interviewContainer}>
                {/* 左侧 */}
                <div className={styles.leftSide}>
                    <Spin spinning={treeLoading}>
                        <Tree treeData={treeData} defaultExpandAll onSelect={handleSelect} />
                    </Spin>
                </div>

                {/* 右侧 */}
                <div className={styles.rightSide}>
                    {!selectedCategory ? (
                        <Empty description="请先从左侧选择一个分类" />
                    ) : isDetailMode ? (
                        // ===== 详情态 =====
                        <Spin spinning={detailLoading}>
                            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                                <Button icon={<ArrowLeftOutlined />} onClick={backToList}>
                                    返回
                                </Button>
                            </div>

                            <Card
                                style={{ marginTop: 12 }}
                                title={questionDetail?.title || "题目详情"}
                                styles={{ body: { lineHeight: 1.8 } }}
                            >
                                <div style={{ opacity: 0.7, marginBottom: 10 }}>
                                    类别：
                                    {categoryMap[questionDetail?.categoryId]?.join(" / ") || "-"}
                                </div>

                                <div style={{ whiteSpace: "pre-wrap" }}>
                                    {questionDetail?.content || ""}
                                </div>
                            </Card>
                        </Spin>
                    ) : (
                        // ===== 列表态 =====
                        <Spin spinning={listLoading}>
                            {questionList.length === 0 ? (
                                <Empty description="该分类下暂无题目" />
                            ) : (
                                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                    {questionList.map((q) => (
                                        <Card
                                            key={q.id}
                                            hoverable
                                            onClick={() => openDetail(q.id)}
                                            styles={{ body: { padding: 14 } }}
                                        >
                                            <div style={{ fontWeight: 600 }}>{q.title}</div>
                                            <div style={{ marginTop: 8, opacity: 0.7 }}>
                                                {q.preview}
                                                {q.preview?.length >= 120 ? "…" : ""}
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </Spin>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Interviews;