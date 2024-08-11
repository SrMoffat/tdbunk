import { CopyFilled, CopyOutlined } from "@ant-design/icons";
import { Button, Flex } from "antd";
import { useEffect, useState } from "react";

const CredentialIssuer = () => {
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        let timer: string | number | NodeJS.Timeout | undefined
        if (copied) {
            timer = setTimeout(() => {
                setCopied(false)
            }, 1000)
        }

        return () => {
            clearTimeout(timer)
        }
    }, [copied])
    return (
        <Flex className="flex-col border border-gray-800 rounded-md p-4 gap-2">
            <Flex>Credential Issuer Name</Flex>
            <Flex>https://credential.users.com</Flex>
            <Flex>
                did:dht:i73yjhjd....87jhbsdj
                {copied && <CopyFilled style={{ color: "#CC9933" }} className="ml-1 cursor-pointer" />}
                {!copied && <CopyOutlined onClick={() => {
                    setCopied(true)
                    // TO DO: Copy to clipboard
                }} className="ml-1 cursor-pointer" />}
            </Flex>
            <Flex>
                <Button type="primary" size="small">Request</Button>
            </Flex>
        </Flex>
    );
};

export default CredentialIssuer;
