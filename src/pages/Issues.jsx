import { useEffect, useState } from "react";
import PageHeader from '../components/PageHeader';
import styles from '../css/Issue.module.css';
import { api } from "../services/api";
import IssuesItem from '../components/IssuesItem';
import AddIssueBtn from '../components/AddIssueBtn';
import Recommend from '../components/Recommend';
import TypeSelect from "../components/TypeSelect";
import { Pagination } from 'antd';


function Issues() {
    //用于存储获取到的状态列表
    const [issueInfo, setIssueInfo] = useState([]);

    const [typeList, setTypeList] = useState([]);
    const [selectedTypeId, setSelectedTypeId] = useState("");

    //分页信息
    const [pageInfo, setPageInfo] = useState({
        current: 1, //当前页
        pageSize: 10, //每页条数
        total: 15, //总条数
    });

    useEffect(() => {
        async function fetchData() {
            const res = await api.issue.list({
                page: pageInfo.current,
                pageSize: pageInfo.pageSize,
                sort: "new",
                typeId: selectedTypeId || undefined,
            });
            setIssueInfo(res.list);
            setPageInfo(prev => ({
                ...prev,
                current: res.page,
                pageSize: res.pageSize,
                total: res.total,
            }));
        }
        fetchData();
    }, [pageInfo.current, pageInfo.pageSize, selectedTypeId]);

    useEffect(() => {
  async function fetchTypes() {
    const res = await api.type.list();  // 改成你真实的接口
    setTypeList(res.list || res.data || []);
  }
  fetchTypes();
}, []);

    let issueList = [];
    for (let i = 0; i < issueInfo.length; i++) {
        issueList.push(
            <IssuesItem key={i} issueInfo={issueInfo[i]} />
        );
    }

    // 翻页
    const handlePageChange = (page, pageSize) => {
        setPageInfo(prev => ({
            ...prev,
            current: page,
            pageSize,
        }));
    };

    // 翻页后滚动
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }, [pageInfo.current]);

    const handleTypeChange = (typeId) => {
        setSelectedTypeId(typeId);
        setPageInfo((prev) => ({ ...prev, current: 1 }));
    };

    

    return (
        <div className={styles.container}>
            {/* 上面的头部 */}
            <PageHeader title="问答列表">
                <TypeSelect
                    typeList={typeList}
                    value={selectedTypeId}
                    onChange={handleTypeChange}
                />
            </PageHeader>
            {/* 下面的列表内容区域 */}
            <div className={styles.issueContainer}>
                {/* 左边区域 */}
                <div className={styles.leftSide}>
                    {issueList}
                    <div className={styles.paginationContainer}>
                        <Pagination
                            showQuickJumper
                            current={pageInfo.current}
                            pageSize={pageInfo.pageSize}
                            total={pageInfo.total}
                            onChange={handlePageChange}
                        />
                    </div>

                </div>
                {/* 右边区域 */}
                <div className={styles.rightSide}>
                    <AddIssueBtn />
                    <Recommend />
                </div>
            </div>
        </div>
    );
}

export default Issues;