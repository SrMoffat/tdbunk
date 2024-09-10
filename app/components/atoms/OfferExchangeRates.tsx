import { RightCircleFilled } from "@ant-design/icons";
import { Button, Flex, Space, theme } from "antd";

export interface AssetExchangeRatesProps {
    fromCurrencyCode: string;
    fromCurrencyFlag: string;
    fromUnit: string;
    toUnit: string;
    toCurrencyFlag: string;
    toCurrencyCode: string;
}

const AssetExchangeRates = ({
    fromCurrencyCode,
    fromCurrencyFlag,
    fromUnit,
    toUnit,
    toCurrencyFlag,
    toCurrencyCode
}: AssetExchangeRatesProps) => {
    const {
        token: { colorPrimary },
    } = theme.useToken()
    return (
        <Flex className="w-full justify-end items-end">
            <Space.Compact>
                <Button className="h-[70px] w-[80px]" disabled>
                    <Flex className="flex flex-col justify-center items-center">
                        <Flex className="text-white" >
                            {fromCurrencyCode}
                            {' '}
                            {fromCurrencyFlag}
                        </Flex>
                        <Flex className="-mt-1 text-xs text-white" > {`${parseFloat(fromUnit).toFixed(2)}`}</Flex>
                    </Flex>
                </Button>
                <Button className="h-[70px] w-[50px]">
                    <RightCircleFilled style={{ color: colorPrimary }} />
                </Button>
                <Button className="h-[70px] w-[80px]" disabled >
                    <Flex className="flex flex-col justify-center items-center">
                        <Flex className="text-white" >
                            {toCurrencyCode}
                            {' '}
                            {toCurrencyFlag}
                        </Flex>
                        <Flex className="-mt-1 text-xs text-white" > {`${parseFloat(toUnit)}`} </Flex>
                    </Flex>
                </Button>
            </Space.Compact>
        </Flex>
    )
}

export default AssetExchangeRates
