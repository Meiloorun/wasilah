import React, { useState } from 'react';
import styled from 'styled-components';
import Picker from "emoji-picker-react";
import { IoMdSend } from "react-icons/io";
import { BsEmojiSmileFill } from "react-icons/bs";


export default function ChatInput({ handleSendMsg }) {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [Msg, setMsg] = useState("");

    const handleEmojiPickerHideShow = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };

    const handleEmojiClick = (emoji, event) => {
        let message = Msg;
        message += emoji.emoji;
        setMsg(message);
    }

    const sendChat = (event) => {
        event.preventDefault();
        if(Msg.length>0) {
            handleSendMsg(Msg);
            setMsg('')
        }
    }

  return (
    <Container>
        <div className="button-container">
            <div className="emoji">
                <BsEmojiSmileFill onClick={handleEmojiPickerHideShow} />
                {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick}/>}
            </div>
        </div>
        <form className='input-container' onSubmit={(e)=>sendChat(e)}>
            <input type="text" placeholder='Type your message here' value={Msg} onChange={(e)=>setMsg(e.target.value)}/>
            <button type="submit">
                <IoMdSend />
            </button>
        </form>
    </Container>
  )
}

const Container = styled.div`
    display: grid;
    grid-template-columns: 5% 95%;
    align-items: center;
    padding: 0 2rem;
    padding-bottom: 0.3rem;
    .button-container {
        display: flex;
        align-items: center;
        color: #fcfcfc;
        gap: 1rem;
        .emoji {
            position: relative;
            svg {
                font-size: 1.5rem;
                color: #ffff00cb;
                cursor: pointer;
            }
        }
        .emoji-picker-react {
            position: absolute;
            top: -350px;
            background-color: #464646;
            box-shadow: 0 5px 10px #a3a3a3;
            border-color: #a3a3a3;
            .emoji-scroll-wrapper::-webkit-scrollbar {
                background-color: #464646;
                width: 5px;
                &-thumb {
                    background-color: #a3a3a3;
                }
            }
            .emoji-categories {
                button {
                    filter: contrast(0);
                }
            }
            .emoji-search {
                background-color: transparent;
                border-color: #464646;
            }
            .emoji-group:before {
                background-color: #464646;
            }
        }
    }
    .input-container {
        width: 100%;
        border-radius: 2rem;
        display: flex;
        align-content: center;
        gap: 2rem;
        background-color: #ffffff34;
        input {
            width: 90%;
            background-color: transparent;
            color: #fcfcfc;
            border: none;
            padding-left: 1rem;
            font-size: 1.2rem;
            &::selection {
                background-color: #a3a3a3;
            }
            &:focus {
                outline: none;
            }
            button {
                padding: 0.3rem 2rem;
                border-radius: 2rem;
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: #888787;
                border: none;
                svg {
                    font-size: 2rem;
                    color: white;
                }
            }
        }
    }
`;