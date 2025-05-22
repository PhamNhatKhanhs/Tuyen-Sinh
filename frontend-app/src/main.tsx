import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import App from './App';
import { store } from './store';
import './styles/global.css';
import antdTheme from './styles/theme'; // IMPORT THEME MỚI

// import { loadUserFromStorage } from './features/auth/store/authSlice';
// store.dispatch(loadUserFromStorage());

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ConfigProvider locale={viVN} theme={antdTheme}> {/* ÁP DỤNG THEME MỚI */}
          <App />
        </ConfigProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);