import 'antd/dist/reset.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConfigProvider, App as AntdApp } from 'antd'; // THÊM AntdApp
import viVN from 'antd/locale/vi_VN';
import App from './App';
import { store } from './store';
import './styles/global.css';
import antdTheme from './styles/theme';
import { loadUserFromStorage } from './features/auth/store/authSlice';

// store.dispatch(loadUserFromStorage());

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(

    <Provider store={store}>
      <BrowserRouter>
        <ConfigProvider locale={viVN} theme={antdTheme}>
          <AntdApp> {/* BỌC ỨNG DỤNG TRONG AntdApp */}
            <App />
          </AntdApp>
        </ConfigProvider>
      </BrowserRouter>
    </Provider>

);
