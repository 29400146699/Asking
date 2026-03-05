import React from 'react';
import { Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

function AddIssue() {

    const navigate = useNavigate();

    const clickHandle = () => {
        // 跳转发布页面，但是先要进行是否登录的判断
        const auth = api.auth.getCurrentUser();

        if (!auth) {
            message.warning("请先登录");
            return;
        }

        navigate("/addIssue");
    }

    return (
        <Button
            type="primary"
            size='large'
            style={{
                width: '100%',
                marginBottom: '16px'
            }}
            onClick={clickHandle}
        >
            我要发问
        </Button>
    );
}

export default AddIssue;