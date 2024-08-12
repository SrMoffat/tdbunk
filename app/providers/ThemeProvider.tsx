'use client'
import React, { PropsWithChildren } from 'react';
import { ConfigProvider, theme } from 'antd';

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
