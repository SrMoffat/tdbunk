import { CopyFilled, CopyOutlined } from '@ant-design/icons';
import { Drawer, Flex } from 'antd';

export interface CredentialDocumentDrawer {
    data: any;
    open: boolean;
    copied: boolean;
    onClose: () => void;
    setCopied: React.Dispatch<React.SetStateAction<boolean>>;
}

const CredentialDocumentDrawer: React.FC<CredentialDocumentDrawer> = ({
    data,
    open,
    copied,
    onClose,
    setCopied
}) => {
  return (
      <Drawer title="Credential Document" onClose={onClose} open={open} width={1000}>
          <Flex className="mb-3">
              Copy Document
              {copied && <CopyFilled style={{ color: "#CC9933" }} className="ml-1 cursor-pointer" />}
              {!copied && <CopyOutlined onClick={() => {
                  setCopied(true)
              }} className="ml-1 cursor-pointer" />}
          </Flex>
          <Flex className="border bg-[#334155] p-4 rounded-md border-gray-800 flex-col">
              <pre>{JSON.stringify(data, null, 2)}</pre>
          </Flex>
      </Drawer>
  );
};

export default CredentialDocumentDrawer;

