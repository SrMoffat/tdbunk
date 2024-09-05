import CredentialsForm from '@/app/components/molecules/forms/Credentials';
import { BearerIdentity } from '@web5/agent';
import { Web5 } from '@web5/api';
import { BearerDid } from '@web5/dids';
import { Flex } from 'antd';
import React from 'react';

export interface CreateCredentialProps {
    nextButtonDisabled: boolean;
    noCredentialsFound: boolean;
    localStorageCredentials: any[];
    stateCredentials: { [x: string]: any[]; } | undefined;
    setNextButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
    setIsCreatingCredential: React.Dispatch<React.SetStateAction<boolean>>;
    setUserDid: React.Dispatch<React.SetStateAction<string | null>> | undefined;
    setWeb5Instance: React.Dispatch<React.SetStateAction<Web5 | null>> | undefined;
    setCredentials: React.Dispatch<React.SetStateAction<{ [x: string]: any[]; }>> | undefined;
    setRecoveryPhrase: React.Dispatch<React.SetStateAction<string | null | undefined>> | undefined;
    setUserBearerDid: React.Dispatch<React.SetStateAction<BearerDid | BearerIdentity | null | undefined>> | undefined;
}

const CreateCredential: React.FC<CreateCredentialProps> = ({
    stateCredentials,
    noCredentialsFound,
    nextButtonDisabled,
    localStorageCredentials,

    setUserDid,
    setCredentials,
    setWeb5Instance,
    setUserBearerDid,
    setRecoveryPhrase,
    setNextButtonDisabled,
    setIsCreatingCredential,
}) => {
    return (
        <Flex className="h-full flex-col">
            <CredentialsForm
                stateCredentials={stateCredentials}
                noCredentialsFound={noCredentialsFound}
                nextButtonDisabled={nextButtonDisabled}
                localStorageCredentials={localStorageCredentials}

                setUserDid={setUserDid}
                setCredentials={setCredentials}
                setWeb5Instance={setWeb5Instance}
                setUserBearerDid={setUserBearerDid}
                setRecoveryPhrase={setRecoveryPhrase}
                setNextButtonDisabled={setNextButtonDisabled}
                setIsCreatingCredential={setIsCreatingCredential}
            />
        </Flex>
    );
};

export default CreateCredential;
