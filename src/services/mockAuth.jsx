import React, { createContext, useState } from "react";

export const MockAuthContext = createContext();

export function MockAuthProvider({ children }) {
  // default account
  const defaultAccount = { name: "Firas Bejaoui", email: "firasbejaoui279@gmail.com", password: "firas123" };

  const [account, setAccount] = useState(defaultAccount);

  const login = async ({ email, password }) => {
    // simulate network delay
    await new Promise((r) => setTimeout(r, 400));
    if (email === account.email && password === account.password) {
      return { token: "mock-token-123", user: { name: account.name, email: account.email } };
    } else {
      throw new Error("Invalid email or password");
    }
  };

  const register = async ({ name, email, password }) => {
    await new Promise((r) => setTimeout(r, 400));
    // overwrite the local account for demo purposes
    setAccount({ name, email, password });
    return { token: "mock-register-token", user: { name, email } };
  };

  return (
    <MockAuthContext.Provider value={{ login, register }}>
      {children}
    </MockAuthContext.Provider>
  );
}