import { Button, Flex } from "antd";
import React from "react";

export interface AssetExachangeActionProps {
    cta: string;
    offering: any;
    pfiName: string;
    selectedOffering: any
    showModal: () => void;
    setSelectedOffering: React.Dispatch<React.SetStateAction<any>>
}

const AssetExachangeAction = ({
    cta,
    pfiName,
    offering,
    showModal,
    selectedOffering,
    setSelectedOffering,
}: AssetExachangeActionProps) => {
    const text = pfiName
        ? cta
        : 'Coming Soon'

    const handleButtonClicked = () => {
        showModal()
        setSelectedOffering(offering)
        console.log("Offering selected", offering)
    }
    return (
        <Flex className="flex-col w-full items-start justify-end">
            <Flex>
                <Button
                    disabled={!pfiName}
                    onClick={handleButtonClicked}
                    type="primary"
                >
                    {text}
                </Button>
            </Flex>
        </Flex>
    )
}

export default AssetExachangeAction
