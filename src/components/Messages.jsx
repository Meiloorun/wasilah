import React from 'react';
import { Box, Typography } from '@mui/material';

export default function Messages() {
  return (
    <Box className="h-full flex justify-center items-center">
      <Typography variant="h6" className="text-gray-400">
        No messages yet
      </Typography>
    </Box>
  );
}