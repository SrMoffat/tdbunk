"use client"
import { Request } from '@/app/components/atoms/Icon';
import type { UploadProps } from 'antd';
import { Input, message, QRCode, Tabs, Upload } from 'antd';
import Image from 'next/image';

const { TextArea } = Input;
const { Dragger } = Upload;

const ImportCredential = () => {
    const props: UploadProps = {
        name: 'file',
        multiple: true,
        action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };
    return (
        <Tabs
            defaultActiveKey="upload"
            type="card"
            size="small"
            centered
            items={[
                {
                    label: 'Upload Document',
                    key: 'upload',
                    children: <Dragger {...props}>
                        <p className="flex justify-center">
                            <Image alt="Card3" src={Request} width={50} height={50} />
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                        <p className="ant-upload-hint">
                            Upload the JSON document for the credential. Kindly ensure it is a valid JSON file.
                        </p>
                    </Dragger>
                },
                {
                    label: 'Paste Document',
                    key: 'paste',
                    children: <TextArea rows={4} placeholder="maxLength is 6" maxLength={6} />
                }
            ]}
        />

    );
};

export default ImportCredential;
