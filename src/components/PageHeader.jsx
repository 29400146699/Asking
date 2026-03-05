import React from 'react';
import style from '../css/PageHeader.module.css';

function PageHeader(props) {
    return (
        <div className={style.row}>
            <div className={style.pageHeader}>
                {props.title}
            </div>
            {/* 分类选择 */}
            {props.children}
        </div>
    );
}

export default PageHeader;