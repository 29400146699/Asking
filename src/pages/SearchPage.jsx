import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../css/SearchPage.module.css";
import PageHeader from "../components/PageHeader";
import Recommend from "../components/Recommend";
import AddIssueBtn from "../components/AddIssueBtn";
import IssuesItem from "../components/IssuesItem";
import BookItem from "../components/BookItem";
import booksStyles from "../css/Books.module.css"; // ✅ 复用书籍页样式
import { Pagination } from "antd";
import { api } from "../services/api";

function SearchPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // { value, searchType } 从上一个页面 navigate("/search", { state: {...} }) 传来
  const searchState = useMemo(() => location.state || null, [location.state]);

  const [searchResult, setSearchResult] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    current: 1,
    pageSize: 15,
    total: 0,
  });

  // ✅ 搜索条件变化（搜索词/类型变化）时，自动回到第一页
  useEffect(() => {
    if (!searchState) return;
    setPageInfo((prev) => ({ ...prev, current: 1 }));
  }, [searchState?.value, searchState?.searchType]);

  // ✅ 拉取数据：支持分页
  useEffect(() => {
    async function fetchData() {
      if (!searchState) return;

      const { value, searchType } = searchState;

      // 没有关键词就直接清空
      if (!value || !String(value).trim()) {
        setSearchResult([]);
        setPageInfo((prev) => ({ ...prev, total: 0 }));
        return;
      }

      if (searchType === "issue") {
        const res = await api.issue.list({
          page: pageInfo.current,
          pageSize: pageInfo.pageSize,
          sort: "new",
          keyword: value,
        });

        setSearchResult(res.list || []);
        setPageInfo((prev) => ({ ...prev, total: res.total || 0 }));
      }

      if (searchType === "book") {
        // ✅ 你 api.book.list 支持 keyword
        const res = await api.book.list({
          page: pageInfo.current,
          pageSize: pageInfo.pageSize,
          keyword: value,
        });

        setSearchResult(res.list || []);
        setPageInfo((prev) => ({ ...prev, total: res.total || 0 }));
      }
    }

    fetchData();
  }, [searchState, pageInfo.current, pageInfo.pageSize]);

  // ✅ 翻页
  const handlePageChange = (page) => {
    setPageInfo((prev) => ({ ...prev, current: page }));
  };

  // ✅ 翻页滚动到顶部
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pageInfo.current]);

  const isBook = searchState?.searchType === "book";

  return (
    <div className="container">
      <PageHeader title="搜索结果" />

      <div className={styles.searchPageContainer}>
        {/* 左侧 */}
        <div className={isBook ? styles.leftSideFull : styles.leftSide}>
          {searchResult.length === 0 ? (
            <div>没有找到相关结果</div>
          ) : isBook ? (
            // ✅ 书籍：复用 Books 页面样式
            <div className={booksStyles.bookContainer}>
              {searchResult.map((b) => (
                <BookItem
                  key={b.bookId}
                  book={b}
                  onClick={(book) => navigate(`/books/${book.bookId}`)}
                />
              ))}
            </div>
          ) : (
            // ✅ 问答：原样
            searchResult.map((item) => (
              <IssuesItem key={item.issueId} issueInfo={item} />
            ))
          )}

          {/* ✅ 分页（两种搜索都要） */}
          <div
            className={
              isBook ? booksStyles.paginationContainer : styles.paginationContainer
            }
          >
            <Pagination
              current={pageInfo.current}
              pageSize={pageInfo.pageSize}
              total={pageInfo.total}
              onChange={handlePageChange}
              showSizeChanger={false}
              showQuickJumper
            />
          </div>
        </div>

        {/* 右侧：只有问答搜索才显示 */}
{!isBook && (
  <div className={styles.rightSide}>
    <AddIssueBtn />
    <div style={{ marginBottom: 20 }}>
      <Recommend />
    </div>
  </div>
)}
      </div>
    </div>
  );
}

export default SearchPage;