import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);
  const [usersex, setUserSex] = useState(null);
  const [userAddressId, setUserAddressId] = useState(null);
  return (
    <UserContext.Provider value={{ 
      userId, 
      setUserId, 
      username, 
      setUsername, 
      usersex, 
      setUserSex, 
      userAddressId,
      setUserAddressId,
    }}>
      {children}
    </UserContext.Provider>
  );
};
