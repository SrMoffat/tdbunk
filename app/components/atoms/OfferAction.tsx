import { Button, Flex } from "antd";

export interface AssetExachangeActionProps {
    showModal: () => void;
    cta: string;
}

const AssetExachangeAction = ({
    showModal,
    cta
}: AssetExachangeActionProps) => {
    return (
        <Flex className="flex-col w-full items-start justify-end">
            <Flex>
                <Button
                    onClick={() => showModal()}
                    type="primary"
                >
                    {cta}
                </Button>
            </Flex>
        </Flex>
    )
}

export default AssetExachangeAction
