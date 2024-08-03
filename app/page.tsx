'use client'

import { Button, Flex, Form, Alert } from 'antd';
import { AnimationProps, motion } from "framer-motion";
import { useEffect } from 'react'
import PartySocket from 'partysocket';
import CursorsContainer from './CursorsContainer';
import { useBunkerContext } from '@/app/contexts/BunkerContext'
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Card } from 'antd';
import { useRouter} from 'next/navigation'

const { Meta } = Card

export default function Home() {
  const router = useRouter()
  const Animation = (props: AnimationProps) => props;


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
  ]

  return (
    <Flex>
      <Button>Start Debunking</Button>
      {bunkers.map(bunker => (
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
            avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />}
            title={bunker.name}
            description={bunker.description}
          />
          <Flex>Some content here</Flex>
        </Card>

      ))}

      {/* <Button>TDBunk</Button>
      <CursorsContainer>
        <Alert type='info' message={`User count: ${count}`} />
      </CursorsContainer> */}
      {/* <Form component={motion.form} {...Animation({
        animate: {
          rotate: "365deg"
        },
        transition: {
          repeat: Infinity
        }
      })}>
        <Button>TDBunk</Button>
      </Form> */}
    </Flex>
  );
}
