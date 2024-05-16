import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, Typography, Box } from '@mui/material';

export default function Channels({ currentGroup, changeChannel }) {
  const [currentSelected, setCurrentSelected] = useState(undefined);

  const changeCurrentChannel = (index, channel) => {
    setCurrentSelected(index);
    changeChannel(channel);
  };

  return (
    <Box className="bg-gray-700 rounded-lg p-4">
      <Typography variant="h6" className="text-gray-200 mb-4">
        Channels
      </Typography>
      <List className="overflow-auto max-h-96">
        {currentGroup?.channels?.length > 0 ? (
          currentGroup.channels.map((channel, index) => (
            <ListItem
              key={index}
              button
              selected={index === currentSelected}
              onClick={() => changeCurrentChannel(index, channel)}
              className={`rounded-md transition-colors duration-300 ${
                index === currentSelected ? 'bg-gray-800 text-white' : 'hover:bg-gray-800'
              }`}
            >
              <ListItemText primary={channel.name} className="text-gray-200" />
            </ListItem>
          ))
        ) : (
          <Typography variant="body1" className="text-gray-400">
            No channels found
          </Typography>
        )}
      </List>
    </Box>
  );
}
