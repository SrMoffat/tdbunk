'use client'

import { Button, Flex, Form } from 'antd';
import { AnimationProps, motion } from "framer-motion";

export default function Home() {
  const Animation = (props: AnimationProps) => props;
  return (
    <Flex>
      <Form component={motion.form} {...Animation({
        animate: {
          rotate: "365deg"
        },
        transition: {
          repeat: Infinity
        }
      })}>
        <Button>TDBunk</Button>
      </Form>
    </Flex>
  );
}
