'use client'

import React, { PropsWithChildren } from 'react'
import { ConfigProvider, theme } from 'antd';

export default function ThemeProvider({ children }: PropsWithChildren) {
  return (
      <ConfigProvider theme={{
          algorithm: theme.darkAlgorithm,
          token: {
              colorPrimary: '#D2AF26',
          }
      }}>
        {children}
      </ConfigProvider>
  )
}
