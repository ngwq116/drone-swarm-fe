import clsx, { type ClassValue } from 'clsx';

const cn = (...inputs: ClassValue[]): string => {
    return clsx(inputs);
};

export default cn;
