import { SearchOffers } from "@/app/components/atoms/SearchOffersInput";
import { WalletBalance } from "@/app/components/molecules/cards/WalletBalance";
import DebunkingCampaign from "@/app/components/molecules/description/DebunkCampaign";
import DebunkCampaignStats from "@/app/components/molecules/description/DebunkCampaignStats";
import DebunkSubject from "@/app/components/molecules/description/DebunkSubject";
import { CredentialStorage } from "@/app/components/molecules/forms/Credentials";
import { Credentials } from "@/app/components/organisms/Credentials";
import useBrowserStorage from "@/app/hooks/useLocalStorage";
import { OFFERINGS_LOCAL_STORAGE_KEY, LOCAL_STORAGE_KEY } from "@/app/lib/constants";
import { useTbdexContext } from "@/app/providers/TbdexProvider";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Card, Flex, Layout, List, Segmented, StepProps, Steps, theme, Typography, Space, Button } from "antd";

const StepFour = () => {
    const {
        token: { colorBgContainer },
    } = theme.useToken()

    const { selectedCurrency, selectedDestinationCurrency, monopolyMoney } = useTbdexContext()

    const [localStorageData] = useBrowserStorage<CredentialStorage>(
        OFFERINGS_LOCAL_STORAGE_KEY,
        LOCAL_STORAGE_KEY
    )

    const getFormattedOfferings = (offerings: any) => {
        for (const offer of offerings) {
            const offering = Object.values(offer!)[0] as any
            const [sourceCurrency, destinationCurrency] = offering?.pair
            const sourceCurrencyCode = sourceCurrency?.currencyCode
            const destinationCurrencyCode = destinationCurrency?.currencyCode

            const sourceMatches = selectedCurrency === sourceCurrencyCode
            const destinationMatches = selectedDestinationCurrency === destinationCurrencyCode
            const isHit = sourceMatches && destinationMatches

            if (isHit) {
                console.log("isHit ===>", offering?.pair)
            } else {
                // console.log("isMiss", [sourceCurrencyCode, destinationCurrencyCode])
                // console.log("isMiss", offering?.pair)
            }
        }
    }

    getFormattedOfferings(Object.values(localStorageData!))

    const data = [
        {
            title: "Ant Design Title 1",
        },
        {
            title: "Ant Design Title 2",
        },
        {
            title: "Ant Design Title 3",
        },
        {
            title: "Ant Design Title 4",
        },
    ];

    const items = [
        {
            title: `${selectedCurrency} 1.00`,
            status: 'process'
        },
        {
            title: '',
            status: 'wait'
        },
        {
            title: `${selectedDestinationCurrency} calc`,
            status: 'process'
        },
    ] as StepProps[];

    return <Layout style={{ backgroundColor: colorBgContainer }}>
        <Flex className="flex-col">
            <Flex className="justify-between">
                <Credentials />
                <WalletBalance money={monopolyMoney} />
            </Flex>
            <Flex className="flex-row mt-4 gap-3 justify-between">
                <Card className="w-full">
                    <Flex className="items-center w-full">
                        <SearchOffers />
                        <Flex className="flex-col items-center w-1/3">
                            <Typography.Text style={{ fontSize: 12 }}>Market Rate</Typography.Text>
                            <Steps
                                type="inline"
                                items={items}
                            />
                        </Flex>
                    </Flex>
                    <List
                        pagination={{ position: "bottom", align: "start" }}
                        dataSource={data}
                        className="mt-4"
                        renderItem={(item, index) => (
                            <List.Item>
                                <Space.Compact>
                                    <Button className="h-[70px] w-[70px]">Button 1</Button>
                                    <Button className="h-[70px] w-[70px]">Button 1</Button>
                                    <Button className="h-[70px] w-[70px]">Button 1</Button>
                                </Space.Compact>
                                {/* <Segmented
                                        options={[
                                            {
                                                label: (
                                                    <div style={{ padding: 4 }}>
                                                        <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />
                                                        <div>USD</div>
                                                    </div>
                                                ),
                                                value: 'user1',
                                            },
                                            {
                                                label: (
                                                    <div style={{ padding: 4 }}>
                                                        <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
                                                        <div>User 2</div>
                                                    </div>
                                                ),
                                                value: 'user2',
                                            },
                                            {
                                                label: (
                                                    <div style={{ padding: 4 }}>
                                                        <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                                                        <div>User 3</div>
                                                    </div>
                                                ),
                                                value: 'user3',
                                            },
                                        ]}
                                    /> */}
                                {/* <List.Item.Meta
                                        avatar={
                                            <Avatar
                                                src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`}
                                            />
                                        }
                                        title={<a href="https://ant.design">{item.title}</a>}
                                        description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                                    /> */}
                            </List.Item>
                        )}
                    />
                </Card>
                <Flex className="w-full flex flex-row">
                    <Flex className="w-full">
                        <DebunkCampaignStats />
                    </Flex>
                    <Flex className="w-full flex-col">
                        <DebunkSubject />
                        <DebunkingCampaign />
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    </Layout>
}

export default StepFour;
