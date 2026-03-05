import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { message } from "antd";
import { openLoginModal } from "../redux/uiSlice";
import { api } from "../services/api";

function ProtectedRoute({ children }) {
  const dispatch = useDispatch();
  const auth = api.auth.getCurrentUser();

  // 防止 StrictMode 下重复提示
  const hasShown = useRef(false);

  useEffect(() => {
    if (!auth?.user?.userId && !hasShown.current) {
      message.warning("请先登录");
      dispatch(openLoginModal());
      hasShown.current = true;
    }
  }, [auth, dispatch]);

  // 未登录：不渲染受保护页面内容
  if (!auth?.user?.userId) return null;

  return children;
}

export default ProtectedRoute;