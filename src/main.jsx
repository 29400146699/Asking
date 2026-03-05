import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'

import { ConfigProvider } from 'antd';
import zhCh from 'antd/locale/zh_CN';

import store from './redux/store.js'
import { Provider } from 'react-redux';

import { api } from './services/api.js';

// 初始化模拟 API 数据
api.init();

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <ConfigProvider locale={zhCh}>
        <App />
      </ConfigProvider>
    </BrowserRouter>
  </Provider>
  ,
)
