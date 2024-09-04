'use client'
import { notification } from 'antd';
import { PropsWithChildren, createContext, useContext } from 'react';

type NotificationType = 'success' | 'info' | 'warning' | 'error';

export interface NotificationDetails {
    message: string;
    description: string
}

export interface NotificationContextProps {
    notify: (type: NotificationType, { message, description }: NotificationDetails) => void
}

const NotificationContext = createContext<Partial<NotificationContextProps>>({})

export default function NotificationProvider({ children }: PropsWithChildren) {
    const [api, contextHolder] = notification.useNotification();

    const openNotificationWithIcon = (type: NotificationType, { message, description }: NotificationDetails) => {
        api[type]({
            message,
            description
        });
    };

    return (
        <NotificationContext.Provider value={{
            notify: openNotificationWithIcon
        }}>
            {contextHolder}
            {children}
        </NotificationContext.Provider>
    )
};

export const useNotificationContext = (): Partial<NotificationContextProps> => {
    const context = useContext(NotificationContext)
    if (!context) {
        throw new Error('useNotificationContext mus be used within a NotificationProvider')
    }
    return context
}
