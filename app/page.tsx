'use client'

import { Button, Flex, Form, Alert } from 'antd';
import { AnimationProps, motion } from "framer-motion";
import { useState } from 'react';

import PartySocket from 'partysocket';

export default function Home() {
  const [userCount, setUserCount] = useState(0)
  const Animation = (props: AnimationProps) => props;

  const partySocket = new PartySocket({
    host: 'http://192.168.100.4:1999',
    room: 'tdbunk3r'
  })


  partySocket.send('Misinformation and disinformation debunked by cross-border crowdfunded investigations.')

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

  return (
    <Flex>
      <Button>TDBunk</Button>
      <Alert message={`User count: ${userCount}`} type="info" />
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
