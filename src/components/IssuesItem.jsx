import React from 'react';
import styles from '../css/IssueItem.module.css';
import { formatDate } from '../utils/tools';
import { Tag } from 'antd';
import { useNavigate } from 'react-router-dom';

function IssuesItem(props) {
    const variants = ['solid', 'outlined'];
    const color = '#f50';
    const tagColorMap = {
        React: "blue",
        JavaScript: "gold",
        "UI/UX": "purple",
    };

    const navigate = useNavigate();



    return (
        <div 
        className={styles.container} 
        onClick={() => navigate(`/issues/${props.issueInfo.issueId}`)}>           
                {/* 回答数 */}
                <div className={styles.issueNum}>
                    <div>
                        {props.issueInfo.commentNumber}
                    </div>
                    <div>
                        回答
                    </div>

                </div>

                {/* 浏览数 */}
                <div className={styles.issueNum}>
                    <div>
                        {props.issueInfo.scanNumber}
                    </div>
                    <div>
                        浏览
                    </div>

                </div>

            {/* 问题内容 */}
            <div className={styles.issueContainer}>
                <div className={styles.top}>
                    {props.issueInfo.title}
                </div>
                <div className={styles.bottom}>
                    <div>

                        <div>
                            <Tag color={tagColorMap[props.issueInfo.tag?.typeName]} variant={variants[0]}>
                                {props.issueInfo.tag?.typeName}
                            </Tag>
                        </div>

                    </div>
                    <div className={styles.right}>
                        <Tag color={color} variant={variants[1]}>
                            {props.issueInfo.author?.username}
                        </Tag>
                        <span className={styles.time}>{formatDate(props.issueInfo.date, "year")}</span>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default IssuesItem;