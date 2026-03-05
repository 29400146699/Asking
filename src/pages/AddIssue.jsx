import React, { useRef, useState, useEffect } from 'react';
import { Form, Input, Button, Select, message } from 'antd';
import styles from "../css/AddIssue.module.css";
import Editor from '@toast-ui/editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import { api } from '../services/api';
import { useNavigate } from "react-router-dom";

function AddIssue() {

  const formRef = useRef();
  const editorRef = useRef(null);      // 存 editor 实例
  const editorElRef = useRef(null);    // 存 DOM 容器
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

  // 初始化 Toast UI Editor（原生版本）
  useEffect(() => {
    if (!editorElRef.current) return;

    const editor = new Editor({
      el: editorElRef.current,
      height: '600px',
      initialEditType: 'wysiwyg',   // 你原来用的 wysiwyg
      previewStyle: 'vertical',
      usageStatistics: false,
      language: 'zh-CN',
      initialValue: "",
    });

    editorRef.current = editor;

    return () => {
      editor.destroy();
      editorRef.current = null;
    };
  }, []);

  // 提交问答的回调函数
  const addHandle = async (values) => {
    try {
      const auth = api.auth.getCurrentUser();
      if (!auth?.user?.userId) {
        message.warning("请先登录再发布");
        return;
      }

      const issueContent = editorRef.current?.getMarkdown?.() || "";

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

      await api.issue.create(payload);

      message.success("发布成功");
      navigate("/issues");

    } catch (e) {
      message.error(typeof e === "string" ? e : "发布失败");
    }
  };

  function updateInfo(newContent, key) {
    setIssueInfo(prev => ({ ...prev, [key]: newContent }));
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
            value={issueInfo.typeId}
            onChange={(v) => {
              form.setFieldsValue({ typeId: v });
              updateInfo(v, 'typeId');
            }}
          />
        </Form.Item>

        {/* 问答内容 */}
        <Form.Item
          label="问题描述"
          // 这里保留 name 只是为了校验提示（真正内容我们用 editorRef 取）
          name="issueContent"
          rules={[{ required: true, message: '请输入问题描述' }]}
        >
          {/* 原生 editor 需要一个 div 容器 */}
          <div ref={editorElRef} />
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
              form.resetFields();
              editorRef.current?.setMarkdown?.("");
              setIssueInfo({
                issueTitle: "",
                typeId: "",
                issueContent: "",
                userId: "",
              });
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