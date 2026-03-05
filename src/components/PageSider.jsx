import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom'
import { Menu } from 'antd';
import {
  QuestionCircleOutlined,
  ReadOutlined,
  BulbOutlined
} from '@ant-design/icons'

const items = [
    { key: '/issues',icon:<QuestionCircleOutlined />, label: '问答' },
    { key: '/books',icon:<ReadOutlined />, label: '书籍' },
    { key: '/interview',icon:<BulbOutlined />, label: '面试题' },
]

function PageSider() {
    const navigate = useNavigate()
    const location = useLocation()

    return (
        <Menu
            mode="inline"
            theme="dark"
            items={items}
            selectedKeys={[location.pathname]}
            onClick={({ key }) => navigate(key)}
        />
    );
}

export default PageSider;