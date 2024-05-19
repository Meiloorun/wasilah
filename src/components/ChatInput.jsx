import React, { useState } from 'react';
import Picker from 'emoji-picker-react';
import { IoMdSend } from 'react-icons/io';
import { BsEmojiSmileFill } from 'react-icons/bs';
import { Box, Input, InputAdornment, IconButton } from '@mui/material';

export default function ChatInput({ handleSendMsg }) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [msg, setMsg] = useState('');

  const handleEmojiPickerHideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (emoji, event) => {
    setMsg((prevMsg) => prevMsg + emoji.emoji);
  };

  const sendChat = (event) => {
    event.preventDefault();
    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg('');
    }
  };

  return (
    <Box className="flex items-center bg-gray-800 rounded-lg p-2">
      <Box className="relative">
        <IconButton onClick={handleEmojiPickerHideShow} className="text-gray-400 hover:text-gray-200">
          <BsEmojiSmileFill />
        </IconButton>
        {showEmojiPicker && (
          <Box className="absolute bottom-10 left-0 z-10">
            <Picker onEmojiClick={handleEmojiClick} />
          </Box>
        )}
      </Box>
      <form onSubmit={sendChat} className="flex-1">
        <Input
          fullWidth
          placeholder="Type your message here"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton type="submit" className="text-gray-400 hover:text-gray-200">
                <IoMdSend />
              </IconButton>
            </InputAdornment>
          }
          disableUnderline
          className="bg-gray-500 text-gray-200 rounded-lg px-4 py-2"
        />
      </form>
    </Box>
  );
}