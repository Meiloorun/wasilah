import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getGroup, assignRole } from '../utils/APIRoutes';
import { Box, Button, FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material';

export default function RoleAssignment({ groupId, onClose }) {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  useEffect(() => {
    const fetchUsersAndRoles = async () => {
      try {
        const usersResponse = await axios.get(`${getGroup}/${groupId}/users`); 
        const rolesResponse = await axios.get(`${getGroup}/${groupId}/roles`); 
        setUsers(usersResponse.data);
        setRoles(rolesResponse.data);
      } catch (error) {
        console.error('Error fetching users and roles', error);
      }
    };
    fetchUsersAndRoles();
  }, [groupId]); 

  const handleAssignRole = async () => {
    try {
      const response = await axios.post(assignRole, {
        userId: selectedUser,
        roleId: selectedRole,
      });
      console.log(response.data);
      alert('Role assigned successfully!');
    } catch (error) {
      console.error('Error assigning role', error);
      alert('Failed to assign role');
    }
  };

  return (
    <Box sx={{ p: 2, position: 'relative', backgroundColor: 'white', borderRadius: '8px', boxShadow: 24, maxWidth: '400px', margin: 'auto' }}>
      <Typography variant="h6" gutterBottom>Assign Role to User</Typography>
      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel id="select-user-label">Select User</InputLabel>
        <Select
          labelId="select-user-label"
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          {users.map((user) => (
            <MenuItem key={user._id} value={user._id}>
              {user.firstname} {user.secondname}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel id="select-role-label">Select Role</InputLabel>
        <Select
          labelId="select-role-label"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          {roles.map((role) => (
            <MenuItem key={role._id} value={role._id}>
              {role.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button variant="contained" color="primary" onClick={handleAssignRole}>
          Assign Role
        </Button>
        <Button variant="outlined" color="secondary" onClick={onClose}>
          Close
        </Button>
      </Box>
    </Box>
  );
}
