import React from 'react';
import  UserState  from '../Context/user/UserState';
import Users from '../Users/Users';

export const UsersLayout = () => {
  
  
  return (
    <UserState>
      <Users />
    </UserState>
  );
};
