'use client'

import { Button, Flex, Form, Alert, Modal, Steps, Layout, Breadcrumb, Menu, theme } from 'antd';
import { AnimationProps, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from 'react'
import PartySocket from 'partysocket';
import CursorsContainer from './CursorsContainer';
import { useBunkerContext } from '@/app/contexts/BunkerContext'
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Card } from 'antd';
import { useRouter } from 'next/navigation'
import type { DraggableData, DraggableEvent } from 'react-draggable';
import Draggable from 'react-draggable';
import type { MenuProps } from 'antd';
import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import { Col, Divider, Row } from 'antd';
import Image from 'next/image';

const style: React.CSSProperties = { background: '#0092ff', padding: '8px 0' };

const { Meta } = Card
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

const headerStyle: React.CSSProperties = {
  // textAlign: 'center',
  // color: '#fff',
  // height: 64,
  // paddingInline: 48,
  // lineHeight: '64px',
  // backgroundColor: '#4096ff',
};

const contentStyle: React.CSSProperties = {
  // textAlign: 'center',
  // minHeight: 120,
  // lineHeight: '120px',
  // color: '#fff',
  // backgroundColor: '#0958d9',
};

const siderStyle: React.CSSProperties = {
  // textAlign: 'center',
  // lineHeight: '120px',
  // color: '#fff',
  // backgroundColor: '#1677ff',
};

const footerStyle: React.CSSProperties = {
  // textAlign: 'center',
  // color: '#fff',
  // backgroundColor: '#4096ff',
};

const layoutStyle = {
  // borderRadius: 8,
  // overflow: 'hidden',
  // width: 'calc(50% - 8px)',
  // maxWidth: 'calc(50% - 8px)',
};

export default function Home() {
  const router = useRouter()
  const [open, setOpen] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [bounds, setBounds] = useState({ left: 0, top: 0, bottom: 0, right: 0 });
  const draggleRef = useRef<HTMLDivElement>(null);

  const Animation = (props: AnimationProps) => props;

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = (e: React.MouseEvent<HTMLElement>) => {
    console.log(e);
    setOpen(false);
  };

  const handleCancel = (e: React.MouseEvent<HTMLElement>) => {
    console.log(e);
    setOpen(false);
  };

  const onStart = (_event: DraggableEvent, uiData: DraggableData) => {
    const { clientWidth, clientHeight } = window.document.documentElement;
    const targetRect = draggleRef.current?.getBoundingClientRect();
    if (!targetRect) {
      return;
    }
    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y),
    });
  };


  const partySocket = new PartySocket({
    host: 'http://192.168.100.4:1999',
    room: 'tdbunk3r'
  })

  const { getCount, others } = useBunkerContext()
  let count = getCount?.()

  partySocket.addEventListener('message', (event) => {
    // const message = JSON.parse(event.data)
    // const userCount = message.connectionCount
    // setUserCount(userCount)
    console.log("Event fired: message", event.data)
  })
  partySocket.addEventListener('close', (event) => {
    // console.log("Event fired: close", event.code)
  })
  partySocket.addEventListener('error', (event) => {
    // console.log("Event fired: error", event.error)
  })
  partySocket.addEventListener('open', (event) => {
    // console.log("Event fired: open", event.eventPhase)
  })

  const bunkers = [
    {
      id: '1',
      name: 'X post',
      description: 'Disinformation',
      thumbnail: ''
    },
    {
      id: '2',
      name: 'Tiktok post',
      description: 'Disinformation',
      thumbnail: ''
    },
    {
      id: '3',
      name: 'Instagram',
      description: 'Disinformation',
      thumbnail: ''
    },
    {
      id: '4',
      name: 'Facebook',
      description: 'Disinformation',
      thumbnail: ''
    },
    {
      id: '5',
      name: 'Youtube video',
      description: 'Disinformation',
      thumbnail: ''
    },
  ]

  const description = "This is a description.";

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ height: '100vh' }}>
      <Modal
        title={
          <div
            style={{ width: "100%", cursor: "move" }}
            onMouseOver={() => {
              if (disabled) {
                setDisabled(false);
              }
            }}
            onMouseOut={() => {
              setDisabled(true);
            }}
            // fix eslintjsx-a11y/mouse-events-have-key-events
            // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/mouse-events-have-key-events.md
            onFocus={() => { }}
            onBlur={() => { }}
          // end
          >
            Debunking Campaign
          </div>
        }
        width={1000}
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        modalRender={(modal) => (
          <Draggable
            disabled={disabled}
            bounds={bounds}
            nodeRef={draggleRef}
            onStart={(event, uiData) => onStart(event, uiData)}
          >
            <div ref={draggleRef}>{modal}</div>
          </Draggable>
        )}
      >
        <Steps
          current={3}
          items={[
            {
              title: "Campaign Details",
              // Title, Description, Source Platform, Link to Source, Number of Investigators, support files e.g audio, video, image
              // Author date, source, X handle, facebook handle, Tikotok handle, date of post, target amount, timeline
              description: "Information, source and team size.",
            },
            {
              title: "Campaign Claims",
              // What do we want to prove/disprove, why is it suspected to be dis/misinformation, e.g source reliability, inconsistencies, suspicions
              description: "What to debunk and expectations.",
            },
            {
              title: "Campaign Type",
              // Free or funded
              // If funded, make initial payment as sponsor
              // if not funded, select to be inevstigator or just observer
              description: "Free or funded campaign.",
            },
          ]}
        />
      </Modal>
      <Header style={{ display: 'flex', alignItems: 'center', backgroundColor: colorBgContainer }}>
        <Image alt="TDBunk" src="" width={100} className='bg-[${}]' />
        <Menu
          // theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['1']}
          items={items1}
          style={{ flex: 1, width: '100%', borderBottom: 'none' }}
        />
        <Button type="primary" onClick={showModal}>
          Start DBunking
        </Button>
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
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              {bunkers.map((bunker) => (
                <Col className="gutter-row" span={6}>
                  <Card
                    key={bunker.id}
                    onClick={() => router.push(`/bunkers/${bunker.id}`)}
                    style={{ width: 300 }}
                    cover={
                      <img
                        alt="example"
                        src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                      />
                    }
                    actions={[
                      <SettingOutlined key="setting" />,
                      <EditOutlined key="edit" />,
                      <EllipsisOutlined key="ellipsis" />,
                    ]}
                  >
                    <Meta
                      avatar={
                        <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />
                      }
                      title={bunker.name}
                      description={bunker.description}
                    />
                    <Flex>Some content here</Flex>
                  </Card>
                </Col>
              ))}
            </Row>
          </Content>
        </Layout>
      </Content>
    </Layout>
  );
}
