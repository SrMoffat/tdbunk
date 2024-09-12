import { Transaction } from "@/app/components/atoms/Icon";
import { PFIs, TBDEX_MESSAGE_TYPES, TBDEX_MESSAGE_TYPES_TO_STATUS, TDBUNK_CANCEL_REASON, TDBUNK_SUCCESS_REASON, TDBUNK_SUCCESS_TEXT } from "@/app/lib/constants";
import { getCurrencyFlag } from "@/app/lib/utils";
import { RightCircleFilled } from "@ant-design/icons";
import type { CollapseProps } from 'antd';
import { Avatar, Badge, Button, Card, Collapse, Flex, Modal, Rate, Space, Tag, theme, Typography } from "antd";
import { format, formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { useState } from "react";
import { generateExchangesComponents } from "../../atoms/Transaction";
import { PRIMARY_GOLD_HEX } from "@/app/providers/ThemeProvider";

const Transactions = (props: any) => {
    const {
        exchanges,
        userBearerDid
    } = props
    const {
        token: { colorPrimary, colorSuccess, colorError }
    } = theme.useToken()
    const [showModal, setShowModal] = useState(false)

    const handleCancel = () => {
        setShowModal(false)
    }

    const handleViewCancelTransactions = () => {
        setShowModal(true)
    }

    const transactions: CollapseProps['items'] = generateExchangesComponents(exchanges)

    // console.log("dummyExchanges:>>", exchanges)

    return (
        <Flex className="w-full ml-4 items-center mt-5">
            <Modal
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
            <Flex className="items-center gap-1">
                <Button className="pl-0" onClick={handleViewCancelTransactions}>
                    <Badge count={transactions.length} style={{ color: "white", backgroundColor: colorPrimary }}>
                        <Avatar shape='square' style={{ backgroundColor: colorPrimary, borderTopRightRadius: 0, borderBottomRightRadius: 0 }} icon={<Image src={Transaction} alt="factChecker" width={50} height={50} />} />
                    </Badge>
                    <Typography.Text className="ml-1 text-xs">View Transactions</Typography.Text>
                </Button>
            </Flex>
        </Flex>
    )
}


export default Transactions

