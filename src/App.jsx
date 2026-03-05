import NavHeader from './components/NavHeader.jsx'
import PageFooter from './components/PageFooter.jsx'
import PageSider from './components/PageSider.jsx'
import AppRouter from './router/index.jsx';
import LoginForm from './components/LoginForm.jsx';

import { Layout } from 'antd';

import './css/App.css';

import { useEffect } from "react";
import { api } from "./services/api";
import { useSelector, useDispatch } from "react-redux";
import { openLoginModal, closeLoginModal } from "./redux/uiSlice";
import { loginSuccess } from "./redux/userSlice";

const { Header, Footer, Content, Sider } = Layout;


function App() {
  const dispatch = useDispatch();

  const isModalOpen = useSelector(
    (state) => state.ui.loginModalOpen
  );

  useEffect(() => {
    const auth = api.auth.getCurrentUser();
    if (auth?.user) {
      dispatch(loginSuccess(auth.user));
    }
  }, [dispatch]);

  function loginHandle() {
    dispatch(openLoginModal());
  }

  function closeModal() {
    dispatch(closeLoginModal());
  }

  return (
    <div className="App">
      <Header className="header">
        <NavHeader loginHandle={loginHandle} />
      </Header>

      <Sider className="sider">
        <PageSider />
      </Sider>

      <Content className="content">
        <AppRouter />
      </Content>

      <Footer>
        <PageFooter />
      </Footer>

      {/* 登录模态框 */}
      <LoginForm isShow={isModalOpen} closeModal={closeModal} />
    </div>
  );
}

export default App
