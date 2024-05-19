import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, ListItemAvatar, Avatar, Typography, Box } from '@mui/material';

export default function Contacts({ contacts, currentUser, changeChat }) {
  const [currentSelected, setCurrentSelected] = useState(undefined);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  return (
    <Box className="bg-gray-700 rounded-lg p-4">
      <Typography variant="h6" className="text-gray-200 mb-4">
        Contacts
      </Typography>
      <List className="overflow-auto max-h-96">
        {contacts.map((contact, index) => (
          <ListItem
            key={index}
            button
            selected={index === currentSelected}
            onClick={() => changeCurrentChat(index, contact)}
            className={`rounded-md transition-colors duration-300 ${
              index === currentSelected ? 'bg-gray-700' : 'hover:bg-gray-800'
            }`}
          >
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: '#616161' }}>{contact.firstname.charAt(0)}</Avatar>
            </ListItemAvatar>
            <ListItemText primary={`${contact.firstname} ${contact.secondname}`} className="text-gray-200" />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
