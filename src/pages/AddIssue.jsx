import React from 'react';
import { Form, Input, Button, Select } from 'antd';
import styles from "../css/AddIssue.module.css";
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import { useRef, useState, useEffect } from 'react';
import { api } from '../services/api';
import { message } from "antd";
import { useNavigate } from "react-router-dom";

function AddIssue() {

    const formRef = useRef();
    const editorRef = useRef();
    const [form] = Form.useForm();

    const navigate = useNavigate();

    const [typeList, setTypeList] = useState([]);

    const [issueInfo, setIssueInfo] = useState({
        issueTitle: "",
        typeId: "",
        issueContent: "",
        userId: "",
    });

    useEffect(() => {
        async function fetchTypes() {
            const res = await api.type.list();
            setTypeList(res.list);
        }
        fetchTypes();
    }, []);

    // 提交问答的回调函数
    const addHandle = async (values) => {
        try {
            const auth = api.auth.getCurrentUser();
            if (!auth?.user?.userId) {
                message.warning("请先登录再发布");
                return;
            }

            const editor = editorRef.current?.getInstance();
            const issueContent = editor?.getMarkdown?.() || "";

            if (!issueContent.trim()) {
                message.warning("请输入问题描述");
                return;
            }

            const payload = {
                issueTitle: values.issueTitle,
                typeId: values.typeId,
                issueContent,
                userId: auth.user.userId,
            };

            const res = await api.issue.create(payload);

            message.success("发布成功");

            // 发布成功后回列表
            navigate("/issues");
            
        } catch (e) {
            message.error(typeof e === "string" ? e : "发布失败");
        }
    };

    function updateInfo(newContent, key) {
        const newIssueInfo = { ...issueInfo };
        newIssueInfo[key] = newContent;
        setIssueInfo(newIssueInfo);
    }

    return (
        <div className={styles.container}>
            <Form
                form={form}
                name="basic"
                labelCol={{ flex: "100px" }}
                wrapperCol={{ flex: 1 }}
                labelAlign="right"
                autoComplete="off"
                ref={formRef}
                onFinish={addHandle}
            >
                {/* 问答标题 */}
                <Form.Item

                    label="标题"
                    name="issueTitle"
                    rules={[{ required: true, message: '请输入标题' }]}
                >
                    <Input
                        placeholder="请输入标题"
                        size="large"
                        value={issueInfo.issueTitle}
                        onChange={(e) => updateInfo(e.target.value, 'issueTitle')}
                    />
                </Form.Item>

                {/* 问题类型 */}
                <Form.Item
                    label="问题分类"
                    name="typeId"
                    rules={[{ required: true, message: '请选择问题所属分类' }]}
                >
                    <Select
                        style={{ width: 200 }}
                        options={typeList.map((t) => ({
                            value: t.typeId,
                            label: t.typeName,
                        }))}
                        onChange={(v) => form.setFieldsValue({ typeId: v })}
                    >

                    </Select>
                </Form.Item>


                {/* 问答内容 */}
                <Form.Item
                    label="问题描述"
                    name="issueContent"
                    rules={[{ required: true, message: '请输入问题描述' }]}
                >
                    <Editor
                        initialValue=""
                        previewStyle="vertical"
                        height="600px"
                        initialEditType="wysiwyg"
                        useCommandShortcut={true}
                        language='zh-CN'
                        ref={editorRef}
                    />
                </Form.Item>


                {/* 确认按钮 */}
                <Form.Item wrapperCol={{ offset: 3, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        确认新增
                    </Button>

                    <Button
                        type="link"
                        htmlType="button"
                        className="resetBtn"
                        onClick={() => {
                            formRef.current?.resetFields?.(); // 如果你继续用 ref
                            const editor = editorRef.current?.getInstance();
                            editor?.setMarkdown?.("");
                        }}
                    >
                        重置
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default AddIssue;