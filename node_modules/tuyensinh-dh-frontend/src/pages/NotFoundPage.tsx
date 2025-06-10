import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Result
      status="404"
      title="404 - Không Tìm Thấy Trang"
      subTitle="Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển."
      extra={
        <Button type="primary" onClick={() => navigate('/')} className="bg-indigo-600 hover:bg-indigo-700">
          Về Trang Chủ
        </Button>
      }
      className="py-10"
    />
  );
};
export default NotFoundPage;