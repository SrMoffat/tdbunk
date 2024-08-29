import CredentialsForm from '@/app/components/molecules/forms/Credentials';
import { Flex } from 'antd';
import React from 'react';

interface CreateCredentialProps {
    nextButtonDisabled: boolean;
    setNextButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>
}

const CreateCredential: React.FC<CreateCredentialProps> = ({
    nextButtonDisabled,
    setNextButtonDisabled
}) => {
    return (
        <Flex className="h-full flex-col">
            <CredentialsForm
                nextButtonDisabled={nextButtonDisabled}
                setNextButtonDisabled={setNextButtonDisabled}
            />
        </Flex>
    );
};

export default CreateCredential;
