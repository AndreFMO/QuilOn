import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [quilomboId, setQuilomboId] = useState(null);
  const [username, setUsername] = useState(null);
  const [usersex, setUserSex] = useState(null);
  const [userAddressId, setUserAddressId] = useState(null);
  const [representante, setRepresentante] = useState(0);

  return (
    <UserContext.Provider value={{ 
      userId, 
      setUserId,
      quilomboId,
      setQuilomboId,
      username, 
      setUsername, 
      usersex, 
      setUserSex, 
      userAddressId,
      setUserAddressId,
      representante,
      setRepresentante,
    }}>
      {children}
    </UserContext.Provider>
  );
};
