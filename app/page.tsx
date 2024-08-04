'use client'
import { EditOutlined, EllipsisOutlined, LaptopOutlined, NotificationOutlined, PlusOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import {
  Avatar, Breadcrumb, Button, Card,
  Cascader,
  Checkbox,
  Col,
  ColorPicker,
  DatePicker,
  Flex,
  Form,
  Input,
  InputNumber,
  Layout, Menu, Modal,
  Radio,
  Row,
  Select,
  Slider,
  Steps,
  Switch,
  theme,
  TreeSelect,
  Upload
} from 'antd';
import { AnimationProps } from "framer-motion";
import { redirect, useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react';
import type { DraggableData, DraggableEvent } from 'react-draggable';
import Draggable from 'react-draggable';
import type { FormProps } from 'antd';

const { RangePicker } = DatePicker;
const { TextArea } = Input;

const { Meta } = Card
const { Header, Sider, Content } = Layout;

const items = [
  {
    path: '/index',
    title: 'home',
  },
  {
    path: '/first',
    title: 'first',
    children: [
      {
        path: '/general',
        title: 'General',
      },
      {
        path: '/layout',
        title: 'Layout',
      },
      {
        path: '/navigation',
        title: 'Navigation',
      },
    ],
  },
  {
    path: '/second',
    title: 'second',
  },
];

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

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

const FormDisabledDemo: React.FC = () => {
  const router = useRouter()

  const [componentDisabled, setComponentDisabled] = useState<boolean>(false);

  const onFinish: FormProps<FieldType>['onFinish'] = async ({ title, option }: any) => {
    const poll = {
      title,
      options: [option, 'Other'],
    };
    console.log('Success:', poll);
    const res = await fetch(`http://0.0.0.0:1999/party/${title}`, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify(poll),
      headers: {
        "Content-Type": "application/json",
      },
    });

    // const data = await res.json()

    console.log('SuccessRES:', {poll, res});


    router.push(`/bunkers/${title}`);
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      {/* <Checkbox
        checked={componentDisabled}
        onChange={(e) => setComponentDisabled(e.target.checked)}
      >
        Form disabled
      </Checkbox> */}
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        disabled={componentDisabled}
        style={{ maxWidth: 600 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please input title!' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="option" label="Option" rules={[{ required: true, message: 'Please add at least 2 options!' }]}>
          <Input />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Create
          </Button>
        </Form.Item>
        {/* <Form.Item label="Checkbox" name="disabled" valuePropName="checked">
          <Checkbox>Checkbox</Checkbox>
        </Form.Item>
        <Form.Item label="Radio">
          <Radio.Group>
            <Radio value="apple"> Apple </Radio>
            <Radio value="pear"> Pear </Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="Select">
          <Select>
            <Select.Option value="demo">Demo</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="TreeSelect">
          <TreeSelect
            treeData={[
              { title: 'Light', value: 'light', children: [{ title: 'Bamboo', value: 'bamboo' }] },
            ]}
          />
        </Form.Item>
        <Form.Item label="Cascader">
          <Cascader
            options={[
              {
                value: 'zhejiang',
                label: 'Zhejiang',
                children: [
                  {
                    value: 'hangzhou',
                    label: 'Hangzhou',
                  },
                ],
              },
            ]}
          />
        </Form.Item>
        <Form.Item label="DatePicker">
          <DatePicker />
        </Form.Item>
        <Form.Item label="RangePicker">
          <RangePicker />
        </Form.Item>
        <Form.Item label="InputNumber">
          <InputNumber />
        </Form.Item>
        <Form.Item label="TextArea">
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item label="Switch" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item label="Upload" valuePropName="fileList" getValueFromEvent={normFile}>
          <Upload action="/upload.do" listType="picture-card">
            <button style={{ border: 0, background: 'none' }} type="button">
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </button>
          </Upload>
        </Form.Item>
        <Form.Item label="Button">
          <Button>Button</Button>
        </Form.Item>
        <Form.Item label="Slider">
          <Slider />
        </Form.Item>
        <Form.Item label="ColorPicker">
          <ColorPicker />
        </Form.Item> */}
      </Form>
    </>
  );
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

  const handleOk = async (e: React.MouseEvent<HTMLElement>) => {
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
        <FormDisabledDemo />
      </Modal>
      <Header style={{ display: 'flex', alignItems: 'center', backgroundColor: colorBgContainer }}>
        {/* <Image alt="TDBunk" src="http://localhost:3000/" width={100} height={100} /> */}
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
        <Breadcrumb style={{ margin: '16px 16px 16px 0px', }} items={items} />
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
                <Col key={bunker.id} className="gutter-row" span={6}>
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
