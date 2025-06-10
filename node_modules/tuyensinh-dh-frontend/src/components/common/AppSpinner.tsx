import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

interface AppSpinnerProps {
  size?: 'small' | 'default' | 'large';
  tip?: string;
}

const AppSpinner: React.FC<AppSpinnerProps> = ({ size = 'default', tip }) => {
  const antIcon = <LoadingOutlined style={{ fontSize: size === 'large' ? 48 : size === 'small' ? 16 : 24 }} spin />;
  return <Spin indicator={antIcon} size={size} tip={tip} />;
};
export default AppSpinner;