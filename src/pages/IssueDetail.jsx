import React from 'react';
import { api } from '../services/api';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styles from '../css/IssueDetail.module.css';
import PageHeader from '../components/PageHeader';
import Recommend from "../components/Recommend";
import { formatDate } from '../utils/tools';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import Discuss from '../components/Discuss';

function IssueDetail() {
    const { issueId } = useParams();
    const [issueInfo, setIssueInfo] = useState(null);

    const navigate = useNavigate();

    const goBack = () => {
        if (window.history.length > 1) {
            navigate(-1);   // 返回上一页
        } else {
            navigate('/issues'); // 没历史记录就回列表页
        }
    };

    useEffect(() => {
        async function fetchIssueDetail() {
            const res = await api.issue.detail(issueId);
            setIssueInfo(res);
        }
        fetchIssueDetail();
    }, [issueId]);

    return (
        <div className={styles.container}>
            <PageHeader title="问题详情" />
            {/* 返回按钮 */}
            <div style={{ marginBottom: 16 }}>
                <Button
                    type="link"
                    icon={<ArrowLeftOutlined />}
                    onClick={goBack}
                >
                    返回
                </Button>
            </div>
            <div className={styles.detailContainer}>
                {/* 左侧 */}
                <div className={styles.leftSide}>
                    {/* 问答详情 */}
                    <div className={styles.question}>
                        {/* 标题 */}
                        <h1>{issueInfo?.title}</h1>
                        {/* 提问人信息,时间 */}
                        <div className={styles.questioner}>

                            <span className={styles.user}>
                                {issueInfo?.author?.username}
                            </span>
                            <span>发布于：{formatDate(issueInfo?.date)}</span>
                        </div>
                        {/* 问题详情 */}
                        <div className={styles.content}>
                            {issueInfo?.issueContent}
                        </div>
                    </div>
                    {/* 评论 */}
                    <Discuss issueId={issueId} />
                </div>

                {/* 右侧 */}
                <div className={styles.rightSide}>
                    <div style={{ marginBottom: 20 }}>
                        <Recommend />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default IssueDetail;