import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';

export default function Groups({ groups, currentUser, changeGroup }) {
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [groupArray, setGroupArray] = useState([]);

  useEffect(() => {
    if (!Array.isArray(groups)) {
      setGroupArray([groups])
    } else {
      setGroupArray([groups])
    }
  }, [groups]);

  const changeCurrentGroup = (index, group) => {
    setCurrentSelected(index);
    changeGroup(group);
  };

  return (
    <Box className="overflow-hidden bg-gray-800 font-montserrat">
      <Box className="flex flex-col items-center overflow-auto pt-4 gap-2">
        {groupArray.length > 0 ? (
          groupArray[0].groups.map((group, index) => (
            <Box
              key={index}
              onClick={() => changeCurrentGroup(index, group)}
              className={`w-11/12 cursor-pointer bg-gray-700 rounded-md p-2 transition duration-300 ease-in-out hover:bg-gray-600`}
            >
              <Typography variant="h6" className="text-white text-center">
                {group?.name || 'Unnamed Group'}
              </Typography>
            </Box>
          ))
        ) : (
          <Typography variant="h6" className="text-white">
            No groups found
          </Typography>
        )}
      </Box>
    </Box>
  );
}
