import React, { useEffect, useState } from 'react';
import styles from "../css/Books.module.css";
import PageHeader from '../components/PageHeader';
import TypeSelect from '../components/TypeSelect';
import BookItem from '../components/BookItem';
import { Pagination } from 'antd';
import { api } from '../services/api';
import { useNavigate } from "react-router-dom";

function Books() {
  const navigate = useNavigate();

  const [bookList, setBookList] = useState([]);

  const [pageInfo, setPageInfo] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  // ✅ 当前选中的类型
  const [typeId, setTypeId] = useState("");

  // ✅ 类型列表（用于渲染标签）
  const [typeList, setTypeList] = useState([]);

  // ✅ 先拉类型（只拉一次）
  useEffect(() => {
    async function fetchTypes() {
      const res = await api.type.list();
      setTypeList(res.list || []);
    }
    fetchTypes();
  }, []);

  // 获取书籍数据（分页 + 筛选）
  useEffect(() => {
    fetchBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageInfo.current, typeId]);

  async function fetchBooks() {
    const res = await api.book.list({
      page: pageInfo.current,
      pageSize: pageInfo.pageSize,
      typeId: typeId || undefined, // ✅ 跟问答页一致：空就不传
    });

    setBookList(res.list || []);

    setPageInfo(prev => ({
      ...prev,
      total: res.total || 0,
    }));
  }

  // 分类切换
  const typeChange = (id) => {
    setTypeId(id);
    setPageInfo(prev => ({
      ...prev,
      current: 1
    }));
  };

  // 分页
  const pageChange = (page) => {
    setPageInfo(prev => ({
      ...prev,
      current: page
    }));
  };

  return (
    <div>
      <PageHeader title="书籍资源">
        <TypeSelect
          typeList={typeList}     // ✅ 加上
          value={typeId}          // ✅ 加上
          onChange={typeChange}
        />
      </PageHeader>

      {/* 书籍列表 */}
      <div className={styles.bookContainer}>
        {bookList.map((b) => (
          <BookItem
            key={b.bookId}
            book={b}
            onClick={(book) => navigate(`/books/${book.bookId}`)}
          />
        ))}
      </div>

      {/* 分页 */}
      <div className={styles.paginationContainer}>
        <Pagination
          current={pageInfo.current}
          pageSize={pageInfo.pageSize}
          total={pageInfo.total}
          onChange={pageChange}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
}

export default Books;