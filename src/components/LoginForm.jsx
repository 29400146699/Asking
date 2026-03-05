import React, { useState } from 'react';
import { Modal, Radio, Button, Checkbox, Form, Input, Flex } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import style from '../css/LoginForm.module.css';
import { api } from '../services/api.js';
import { loginSuccess } from '../redux/userSlice.js';
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";


function LoginForm(props) {
    const navigate = useNavigate();
    //表单实例
    const [loginForm] = Form.useForm();
    const [registerForm] = Form.useForm();

    // 登录注册切换按钮
    const [buttonValue, setButtonValue] = useState('login');
    const options = [
        { label: '登录', value: 'login' },
        { label: '注册', value: 'register' },

    ];
    const onChange = (e) => {
        const next = e.target.value;
        setButtonValue(next);

        if (next === 'login') {
            registerForm.resetFields();
        } else {
            loginForm.resetFields();
        }
    };


    

    //确认注册时验证账号是否已存在
    async function checkLoginId(_, value) {
        if (!value) return Promise.resolve(); // 空值交给 required 规则

        const res = await api.auth.checkUsername(value);
        if (res.exists) {
            return Promise.reject(new Error('账号已存在!'));
        }
        return Promise.resolve();
    }

    // 表单功能
    // 登录提交
    const dispatch = useDispatch();
    const onFinishLogin = async (values) => {
        try {
            const res = await api.auth.login({
                username: values.username,
                password: values.password,
            });
            dispatch(loginSuccess(res.user));
            Modal.success({ title: "登录成功" });
            
            resetForm();  
            props.closeModal?.();

            navigate("/", { replace: true });

        } catch (err) {
            
            Modal.error({ title: "登录失败", content: String(err) });
        }
    };

    // 注册提交
    
    const onFinishRegister = async (values) => {
        try {
            await api.auth.register({
                username: values.registerId,
                password: values.registerPassword,
            });
            
            Modal.success({ title: "注册成功", content: "请用刚注册的账号登录" });

            // 注册后切回登录页，并把登录表单账号填上（体验更像真产品）
            setButtonValue("login");
            loginForm.setFieldsValue({ username: values.registerId });

            registerForm.resetFields();

        } catch (err) {
            Modal.error({ title: "注册失败", content: String(err) });
        }
    };

    // 关闭弹窗时重置表单
    function resetForm() {
        loginForm.resetFields();
        registerForm.resetFields();
        setButtonValue("login");
    }

    // 根据登录注册状态切换表单
    let container = null;
    if (buttonValue === 'login') {
        container = (
            <Form
                form={loginForm}
                className={style.loginForm}
                initialValues={{ remember: true }}
                style={{ maxWidth: 360 }}
                onFinish={onFinishLogin}
            >
                <Form.Item
                    name="username"
                    rules={[{ required: true, message: '请输入你的账号!' }]}
                >
                    <Input prefix={<UserOutlined />} placeholder="请输入账号" />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{ required: true, message: '请输入你的密码!' }]}
                >
                    <Input prefix={<LockOutlined />} type="password" placeholder="请输入密码" />
                </Form.Item>
                <Form.Item>
                    <Flex justify="space-between" align="center">
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox>记住我</Checkbox>
                        </Form.Item>

                    </Flex>
                </Form.Item>

                <Form.Item>
                    <Button block type="primary" htmlType="submit">
                        登录
                    </Button>
                    or <Button type="link" onClick={() => setButtonValue('register')}>注册</Button>
                </Form.Item>
            </Form>
        );
    } else {
        container = (
            <Form
                form={registerForm}
                className={style.registerForm}
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 17 }}
                style={{ maxWidth: 600 }}
                onFinish={onFinishRegister}
                autoComplete="off"
            >
                <Form.Item
                    label="账号"
                    name="registerId"
                    rules={[{ required: true, message: '请输入你的账号!' },
                    { validator: checkLoginId }
                    ]}
                    validateTrigger='onBlur'
                >
                    <Input
                        placeholder="请输入账号"
                    />
                </Form.Item>

                <Form.Item
                    label="密码"
                    name="registerPassword"
                    rules={[{ required: true, message: '请输入你的密码!' }]}
                >
                    <Input.Password placeholder="请输入密码" />
                </Form.Item>

                <Form.Item label={null} className={style.registerButton}>
                    <Button type="primary" htmlType="submit" >
                        注册
                    </Button>
                </Form.Item>
            </Form>
        );
    }

    return (
        <div>
            <Modal
                title="登录/注册"
                closable
                open={props.isShow}
                footer={null} 
                onCancel={() => {
                    resetForm();
                    props.closeModal();                 
                }}
            >
                <Radio.Group
                    block
                    options={options}
                    onChange={onChange}
                    value={buttonValue}
                    optionType="button"
                    buttonStyle="solid"
                />
                {container}
            </Modal>
        </div>
    );
}

export default LoginForm;