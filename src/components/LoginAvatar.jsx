import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Popover, Avatar, Menu } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/userSlice';


function LoginAvatar(props) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
      const { isLogin, userInfo } = useSelector(state => state.user);


    const goPersonal = () => {
        navigate('/personal');
    };

    const doLogout = () => {
        localStorage.removeItem('auth');
        dispatch(logout());
        navigate('/');
    };

    if (!isLogin) {
        return (
            <Button type="primary" size="large" onClick={props.loginHandle}>
                登录/注册
            </Button>
        );
    }

    const menu = (
        <Menu
            items={[
                { key: 'personal', label: '个人中心', onClick: goPersonal },
                { type: 'divider' },
                { key: 'logout', label: '退出登录', danger: true, onClick: doLogout },
            ]}
        />
    );

    return (
        <Popover
            placement="bottom"
            content={menu}
        >
            <Avatar
        key={userInfo?.avatar || "default"} // 强制在头像变化时刷新
        size="large"
        src={userInfo?.avatar || undefined} // 有头像就用
        icon={!userInfo?.avatar ? <UserOutlined /> : undefined} />
        </Popover>
    );

}

export default LoginAvatar;