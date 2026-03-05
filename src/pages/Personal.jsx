import React, { useMemo, useState } from "react";
import PageHeader from "../components/PageHeader";
import styles from "../css/Personal.module.css";
import {
  Card,
  Descriptions,
  Avatar,
  Upload,
  Button,
  message,
  Modal,
  Form,
  Input,
} from "antd";
import { useSelector, useDispatch } from "react-redux";
import { api } from "../services/api";
import { updateAvatar, loginSuccess } from "../redux/userSlice";
import { UserOutlined, UploadOutlined } from "@ant-design/icons";

function Personal() {
  const dispatch = useDispatch();
  const reduxUser = useSelector((state) => state.user?.userInfo);

  // 统一拿 user（redux 优先，其次 localStorage）
  const user = useMemo(() => {
    if (reduxUser?.userId) return reduxUser;
    return api.auth.getCurrentUser()?.user || null;
  }, [reduxUser?.userId, reduxUser?.username, reduxUser?.avatar]);

  // ============= 头像上传（你原来的逻辑） =============
  const [uploading, setUploading] = useState(false);

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const beforeUpload = async (file) => {
    if (!user?.userId) {
      message.warning("请先登录");
      return Upload.LIST_IGNORE;
    }

    const isImg = file.type.startsWith("image/");
    if (!isImg) {
      message.error("只能上传图片文件");
      return Upload.LIST_IGNORE;
    }

    const maxMB = 1;
    if (file.size / 1024 / 1024 > maxMB) {
      message.error(`图片不能超过 ${maxMB}MB`);
      return Upload.LIST_IGNORE;
    }

    setUploading(true);
    try {
      const base64 = await fileToBase64(file);
      await api.user.updateAvatar({ userId: user.userId, avatar: base64 });
      dispatch(updateAvatar(base64));
      message.success("头像更新成功");
    } catch (e) {
      message.error(typeof e === "string" ? e : "头像更新失败");
    } finally {
      setUploading(false);
    }

    return Upload.LIST_IGNORE;
  };

  // ============= 编辑弹窗（新增） =============
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  const openEdit = () => {
    if (!user?.userId) {
      message.warning("请先登录");
      return;
    }
    setEditOpen(true);
    // 预填昵称（你图里叫“用户昵称”）
    form.setFieldsValue({
      username: user.username || "",
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const closeEdit = () => {
    setEditOpen(false);
  };

  const resetEditForm = () => {
    form.setFieldsValue({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
      username: user?.username || "",
    });
  };

  const onSaveEdit = async () => {
    try {
      const values = await form.validateFields();
      const { username, oldPassword, newPassword } = values;

      setSaving(true);

      // 1) 更新昵称（允许只改昵称不改密码）
      if (username !== user.username) {
        const res = await api.user.updateProfile({
          userId: user.userId,
          username,
        });
        // 同步 redux（让页面立刻刷新）
        dispatch(loginSuccess(res.user));
      }

      // 2) 更新密码（只有填了新密码才改）
      if (newPassword && newPassword.trim()) {
        await api.user.changePassword({
          userId: user.userId,
          oldPassword,
          newPassword,
        });
      }

      message.success("保存成功");
      closeEdit();
    } catch (e) {
      // validateFields 的错误不要 message.error
      if (e?.errorFields) return;
      message.error(typeof e === "string" ? e : "保存失败");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader title="个人中心" />

      <div className={styles.container}>
        <div className={styles.row}>
          <Card
            title="基本信息"
            extra={
              <div className={styles.edit} onClick={openEdit} style={{ cursor: "pointer" }}>
                编辑
              </div>
            }
          >
            <Descriptions column={1}>
              <Descriptions.Item label="用户名">{user?.username || "-"}</Descriptions.Item>
              <Descriptions.Item label="用户ID">{user?.userId || "-"}</Descriptions.Item>
            </Descriptions>

            <div className={styles.avatar}>
              <Avatar size={50} src={user?.avatar || undefined} icon={<UserOutlined />}>
                {user?.username?.[0]?.toUpperCase()}
              </Avatar>

              <Upload
                className={styles.upload}
                showUploadList={false}
                beforeUpload={beforeUpload}
              >
                <Button icon={<UploadOutlined />} loading={uploading}>
                  更换头像
                </Button>
              </Upload>
            </div>
          </Card>
        </div>
      </div>

      {/* 编辑弹窗 */}
      <Modal
        title="基本信息"
        open={editOpen}
        onCancel={closeEdit}
        footer={[
          <Button key="ok" type="primary" loading={saving} onClick={onSaveEdit}>
            确认
          </Button>,
          <Button key="reset" onClick={resetEditForm} disabled={saving}>
            重置
          </Button>,
        ]}
        destroyOnClose
      >
        <Form
          form={form}
          layout="horizontal"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
        >
          <Form.Item
            label="登录密码"
            name="oldPassword"
            rules={[
              // 只有当用户填了新密码时才要求旧密码
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const newPwd = getFieldValue("newPassword");
                  if (!newPwd) return Promise.resolve();
                  if (value && value.trim()) return Promise.resolve();
                  return Promise.reject(new Error("如要修改密码，请先输入旧密码"));
                },
              }),
            ]}
          >
            <Input.Password placeholder="如果要修改密码，请先输入旧密码" />
          </Form.Item>

          <Form.Item
            label="新密码"
            name="newPassword"
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value) return Promise.resolve(); // 允许不改密码
                  if (String(value).length < 6) {
                    return Promise.reject(new Error("新密码至少 6 位"));
                  }
                  // 有新密码就要求确认密码一致（在 confirm 里也会校验）
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input.Password placeholder="请输入新密码" />
          </Form.Item>

          <Form.Item
            label="确认密码"
            name="confirmPassword"
            dependencies={["newPassword"]}
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const newPwd = getFieldValue("newPassword");
                  if (!newPwd) return Promise.resolve(); // 没改密码就不校验
                  if (value === newPwd) return Promise.resolve();
                  return Promise.reject(new Error("两次输入的密码不一致"));
                },
              }),
            ]}
          >
            <Input.Password placeholder="请确认密码" />
          </Form.Item>

          <Form.Item
            label="用户昵称"
            name="username"
            rules={[
              { required: true, message: "请输入用户昵称" },
              { max: 20, message: "昵称最多 20 个字符" },
            ]}
          >
            <Input placeholder="请输入用户昵称" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Personal;