"use client"

import React from 'react'
import { Button, Flex, Form, Alert, Modal, Steps, Layout, Breadcrumb, Menu, theme } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined, UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';
import { Avatar, Card } from 'antd';
import Draggable from 'react-draggable';
import { Col, Row } from 'antd';
import Image from 'next/image';
import type { MenuProps } from 'antd';

const { Header, Footer, Sider, Content } = Layout;

const items1: MenuProps['items'] = ['1', '2', '3'].map((key) => ({
    key,
    label: `nav ${key}`,
}));

const items2: MenuProps['items'] = [UserOutlined, LaptopOutlined, NotificationOutlined].map(
    (icon, index) => {
        const key = String(index + 1);

        return {
            key: `sub${key}`,
            icon: React.createElement(icon),
            label: `subnav ${key}`,

            children: new Array(4).fill(null).map((_, j) => {
                const subKey = index * 4 + j + 1;
                return {
                    key: subKey,
                    label: `option${subKey}`,
                };
            }),
        };
    },
);

export default function BunkerPage({ params }: { params: { id: string }}) {

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
  return (
      <Layout style={{ height: '100vh' }}>
          <Header style={{ display: 'flex', alignItems: 'center', backgroundColor: colorBgContainer }}>
              <Image alt="TDBunk" src="" width={100} className='bg-[${}]' />
              <Menu
                  // theme="dark"
                  mode="horizontal"
                  defaultSelectedKeys={['1']}
                  items={items1}
                  style={{ flex: 1, width: '100%', borderBottom: 'none' }}
              />
          </Header>
          <Content style={{ padding: '0 48px' }}>
              <Breadcrumb style={{ margin: '16px 16px 16px 0px', }}>
                  <Breadcrumb.Item>Home</Breadcrumb.Item>
                  <Breadcrumb.Item>List</Breadcrumb.Item>
                  <Breadcrumb.Item>App</Breadcrumb.Item>
              </Breadcrumb>
              <Layout
                  style={{ padding: '24px 0', background: colorBgContainer, borderRadius: borderRadiusLG, height: '90%' }}
              >
                  <Sider style={{ background: colorBgContainer }} width={200}>
                      <Menu
                          mode="inline"
                          defaultSelectedKeys={['1']}
                          defaultOpenKeys={['sub1']}
                          style={{ height: '100%' }}
                          items={items2}
                      />
                  </Sider>
                  <Content style={{ padding: '0 24px', minHeight: 280 }}>
                     {`Bunker ${params.id}`}
                  </Content>
              </Layout>
          </Content>
      </Layout>
  )
}
