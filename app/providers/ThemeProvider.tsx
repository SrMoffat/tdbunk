'use client'
import { ConfigProvider, theme } from 'antd';
import { PropsWithChildren } from 'react';

export const PRIMARY_GOLD_HEX = '#CC9933';

export default function ThemeProvider({ children }: PropsWithChildren) {
  return (
    <ConfigProvider theme={{
      algorithm: theme.darkAlgorithm,
      token: {
        colorPrimary: PRIMARY_GOLD_HEX,
      }
    }}>
      {children}
    </ConfigProvider>
  )
};
