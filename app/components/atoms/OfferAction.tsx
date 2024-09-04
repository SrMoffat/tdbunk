import { Button, Flex } from "antd";

export interface AssetExachangeActionProps {
    showModal: () => void;
    cta: string;
    pfiName: string;
}

const AssetExachangeAction = ({
    showModal,
    pfiName,
    cta
}: AssetExachangeActionProps) => {
    const text = pfiName
        ? cta
        : 'Coming Soon'
    return (
        <Flex className="flex-col w-full items-start justify-end">
            <Flex>
                <Button
                    disabled={!pfiName}
                    onClick={() => showModal()}
                    type="primary"
                >
                    {text}
                </Button>
            </Flex>
        </Flex>
    )
}

export default AssetExachangeAction
