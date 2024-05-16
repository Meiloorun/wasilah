import React from 'react';
import { Box, Typography } from '@mui/material';

export default function Welcome({ currentUser }) {
  return (
    <Box className="h-full flex justify-center items-center">
      <Box className="text-center">
        <Typography variant="h4" className="text-gray-200 mb-4">
          Assalamo Alaikum
        </Typography>
        <Typography variant="h5" className="text-gray-400">
          <span className="text-red-500">{`${currentUser.firstname} ${currentUser.secondname}`}</span>
        </Typography>
      </Box>
    </Box>
  );
}