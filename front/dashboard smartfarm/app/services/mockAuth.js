
import React, { createContext } from 'react';

export const MockAuthContext = createContext({});

export function MockAuthProvider({ children }) {
  return children;
}
