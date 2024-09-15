import { Transaction } from "@/app/components/atoms/Icon";
import { getUniqueExchanges } from "@/app/lib/utils";
import type { CollapseProps } from 'antd';
import { Avatar, Badge, Button, Collapse, Flex, Modal, theme, Typography } from "antd";
import Image from "next/image";
import { useState } from "react";
import { generateExchangesComponents } from "../../atoms/Transaction";

const Transactions = (props: any) => {
    const {
        exchanges,
    } = props
    const {
        token: { colorPrimary }
    } = theme.useToken()
    const [showModal, setShowModal] = useState(false)

    const handleCancel = () => {
        setShowModal(false)
    }

    const handleViewCancelTransactions = () => {
        setShowModal(true)
    }
    const toRender = getUniqueExchanges(exchanges)

    const transactions: CollapseProps['items'] = generateExchangesComponents(toRender)
    return (
        <Flex className="w-full ml-4 items-center mt-5">
            <Modal
                destroyOnClose
                open={showModal}
                title="Transactions"
                footer={[
                    <Button danger key="back" onClick={handleCancel}>
                        Close
                    </Button>
                ]}
            >
                <Collapse accordion items={transactions} expandIcon={() => <></>} />
            </Modal>
            {Boolean(transactions?.length) && (
                <Flex className="items-center gap-1">
                    <Button className="pl-0" onClick={handleViewCancelTransactions}>
                        <Badge count={transactions?.length} style={{ color: "white", backgroundColor: colorPrimary }}>
                            <Avatar shape='square' style={{ backgroundColor: colorPrimary, borderTopRightRadius: 0, borderBottomRightRadius: 0 }} icon={<Image src={Transaction} alt="factChecker" width={50} height={50} />} />
                        </Badge>
                        <Typography.Text className="ml-1 text-xs">View Transactions</Typography.Text>
                    </Button>
                </Flex>
            )}
        </Flex>
    )
}


export default Transactions

