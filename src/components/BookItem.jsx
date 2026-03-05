import React from "react";
import styles from "../css/BookItem.module.css";

export default function BookItem({ book, onClick }) {
  if (!book) return null;

  return (
    <div className={styles.container} onClick={() => onClick?.(book)}>
      <div className={styles.bookContainer}>
        <div className={styles.left}>
          <img
            className={styles.bookPic}
            src={book.coverUrl}
            alt={book.bookTitle}
          />
        </div>

        <div className={styles.right}>
          <div className={styles.top}>{book.bookTitle}</div>

          <div className={styles.bookNum}>
            <div>浏览数：{book.scanNumber ?? 0}</div>
            <div>评论数：{book.commentNumber ?? 0}</div>
          </div>
        </div>
      </div>
    </div>
  );
}