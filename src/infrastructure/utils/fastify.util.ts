import { nanoid } from 'nanoid';

export const generateRequestId = () => `req-${nanoid()}`;

export const getPort = (defaultPort: number = 3000) => {
    return parseInt(process.env.APP_PORT || defaultPort.toString(), 10);
};

export const getHost = (defaultHost: string = '0.0.0.0') => {
    return process.env.APP_HOST || defaultHost;
};