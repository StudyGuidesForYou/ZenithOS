import { createContext, useContext } from 'react';

export const OSContext = createContext(null);

export const useOS = () => useContext(OSContext);