"use client"

import React, { useState, useEffect } from 'react'
import { Button, Flex, Form, Alert, Modal, Steps, Layout, Breadcrumb, Menu, theme } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined, UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';
import { Avatar, Card } from 'antd';
import Draggable from 'react-draggable';
import { Col, Row } from 'antd';
import Image from 'next/image';
import type { MenuProps } from 'antd';
import { notFound } from "next/navigation";

import usePartySocket from "partysocket/react";
export function PollOptions({
    options,
    votes,
    vote,
    setVote,
}: {
    options: string[];
    votes: number[];
    vote: number | null;
    setVote: (option: number) => void;
}) {
    const totalVotes = votes.reduce((a, b) => a + b, 0);
    const mostVotes = Math.max(...votes);

    return (
        <ul className="flex flex-col space-y-4">
            {options.map((option, i) => (
                <li key={i}>
                    <div className="relative w-full min-h-[40px] border rounded-md  border-black flex">
                        <div
                            className={`absolute top-0 left-0 bottom-0 w-full rounded-md transition-all duration-500 z-10 ${votes[i] === mostVotes
                                ? "vote-bg-winning"
                                : vote === i
                                    ? "vote-bg-own"
                                    : "vote-bg"
                                }`}
                            style={{
                                width:
                                    vote === null
                                        ? 0
                                        : `${((votes[i] ?? 0) / totalVotes) * 100}%`,
                            }}
                        ></div>

                        <div className="select-none w-full flex items-center justify-between px-4 z-20">
                            <button
                                onClick={() => setVote(i)}
                                className={`flex flex-1 text-left py-2 ${vote === null ? "cursor-pointer" : "cursor-default"
                                    } ${vote === null ? "" : votes[i] === mostVotes ? "font-bold" : ""
                                    }`}
                            >
                                <span>
                                    {vote === i && <span className="relative">🎈 </span>}
                                    {option}
                                </span>
                            </button>

                            {vote === null ? null : <span>{votes[i] ?? 0}</span>}
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
}

export function PollUI({
    id,
    options,
    initialVotes,
}: {
    id: string;
    options: string[];
    initialVotes?: number[];
}) {
    const [votes, setVotes] = useState<number[]>(initialVotes ?? []);
    const [vote, setVote] = useState<number | null>(null);

    const socket = usePartySocket({
        host: 'http://0.0.0.0:1999',
        room: id,
        onMessage(event) {
            const message = JSON.parse(event.data) as Poll;
            if (message.votes) {
                setVotes(message.votes);
            }
        },
    });

    const sendVote = (option: number) => {
        if (vote === null) {
            socket.send(JSON.stringify({ type: "vote", option }));
            setVote(option);
        }
    };

    // prevent double voting
    useEffect(() => {
        let saved = localStorage?.getItem("poll:" + id);
        if (vote === null && saved !== null) {
            setVote(+saved);
        } else if (vote !== null && saved === null) {
            localStorage?.setItem("poll:" + id, `${vote}`);
        }
    }, [id, vote]);

    return (
        <PollOptions
            options={options}
            votes={votes}
            vote={vote}
            setVote={sendVote}
        />
    );
}

export type Poll = {
    title: string;
    options: string[];
    votes?: number[];
};


const { Header, Footer, Sider, Content } = Layout;

const items1: MenuProps['items'] = ['1', '2', '3'].map((key) => ({
    key,
    label: `nav ${key}`,
}));

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

export default function BunkerPage({ params }: { params: { id: string } }) {
    const [pollData, setPollData] = useState<any>()

    useEffect(() => {
        const pollId = params.id;
        const getDetails = async () => {
            try {
                const req = await fetch(`http://localhost:1999/party/${pollId}`, {
                    method: "GET",
                    next: {
                        revalidate: 0,
                    },
                });

                if (!req.ok) {
                    if (req.status === 404) {
                        notFound();
                    } else {
                        throw new Error("Something went wrong.");
                    }
                }
                const poll = await req.json()
                setPollData(poll)
            } catch (error: any) {
                console.log("Error", error)
            }
        }
        getDetails()
    }, [params])

    console.log("Data", pollData)
    const [vote, setVote] = useState<number | null>(null);
    const [votes, setVotes] = useState<number[]>(pollData?.votes ?? []);

    const totalVotes = votes.reduce((a, b) => a + b, 0);
    const mostVotes = Math.max(...votes);

    const socket = usePartySocket({
        host: 'http://localhost:1999',
        room: params.id,
        onMessage(event) {
            try {
                const message = JSON.parse(event.data) as Poll;
                if (message.votes) {
                    setVotes(message.votes);
                }
            } catch (error: any) {
                console.log("Event error", {
                    error,
                    event
                })
            }
        },
    });


    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const sendVote = (option: number) => {
        if (vote === null) {
            socket.send(JSON.stringify({ type: "vote", option }));
            setVote(option);
        }
    };

    return (
        <Layout style={{ height: '100vh' }}>
            <Header style={{ display: 'flex', alignItems: 'center', backgroundColor: colorBgContainer }}>
                {/* <Image alt="TDBunk" src="" width={100} className='bg-[${}]' /> */}
                <Menu
                    // theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={['1']}
                    items={items1}
                    style={{ flex: 1, width: '100%', borderBottom: 'none' }}
                />
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
                        <div>{pollData?.title}</div>
                        <ul className="flex flex-col space-y-4">

                        </ul>
                        <div>{pollData?.options?.map((entry: string, i: number) => {
                            const votes = pollData?.votes[i]
                            return (
                                <li key={i}>
                                    <div className="relative w-full min-h-[40px] border rounded-md  border-black flex">
                                        <div
                                            className={`absolute top-0 left-0 bottom-0 w-full rounded-md transition-all duration-500 z-10 ${votes[i] === mostVotes
                                                ? "vote-bg-winning"
                                                : vote === i
                                                    ? "vote-bg-own"
                                                    : "vote-bg"
                                                }`}
                                            style={{
                                                width:
                                                    vote === null
                                                        ? 0
                                                        : `${((votes[i] ?? 0) / totalVotes) * 100}%`,
                                            }}
                                        ></div>

                                        <div className="select-none w-full flex items-center justify-between px-4 z-20">
                                            <button
                                                onClick={() => sendVote(i)}
                                                className={`flex flex-1 text-left py-2 ${vote === null ? "cursor-pointer" : "cursor-default"
                                                    } ${vote === null ? "" : votes[i] === mostVotes ? "font-bold" : ""
                                                    }`}
                                            >
                                                <span className="text-white">
                                                    {vote === i && <span className="relative">🎈 </span>}
                                                    {entry}
                                                </span>
                                            </button>
                                            {votes}
                                        </div>
                                    </div>
                                </li>
                            )
                        })}</div>
                    </Content>
                </Layout>
            </Content>
        </Layout>
    )
}
