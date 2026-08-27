import React, { useEffect, useState } from 'react';
import ScrollToBottom from "react-scroll-to-bottom";

function Chats({ socket, user, room }) {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const [isExpanded, setIsExpanded] = useState(false); // State to manage expansion

    const sendMessage = async () => {
        if (currentMessage !== "") {
            const messageData = {
                room: room,
                author: user,
                message: currentMessage,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
            };
            await socket.emit("send_message", messageData);
            setMessageList((list) => [...list, messageData]); // By this user can see his own message
            setCurrentMessage("");
        }
    };

    useEffect(() => {
        socket.off("receive_message").on("receive_message", (data) => {
            setMessageList((list) => [...list, data]);
        });
    }, [socket]);

    return (
        <div className={`chat-window ${isExpanded ? "expanded" : ""}`}>
            <div className="chat-header" onClick={() => setIsExpanded(!isExpanded)}>
                <p>Live Chat</p>
            </div>
            {isExpanded && (
                <div className="chat-body">
                    <ScrollToBottom className="message-container">
                        {messageList.map((messageContent, index) => {
                            return (
                                <div key={index} className={`message ${user === messageContent.author ? "you" : "other"}`}>
                                    <div>
                                        <div className="message-content">
                                            <p>{messageContent.message}</p>
                                        </div>
                                        <div className="message-meta">
                                            <p className='time'>{messageContent.time}</p>
                                            <p className='author'>{messageContent.author}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </ScrollToBottom>
                </div>
            )}
            {isExpanded && (
                <div className="chat-footer">
                    <input
                        type="text"
                        placeholder='Hey...'
                        onChange={(e) => { setCurrentMessage(e.target.value) }}
                        onKeyPress={(event) => { event.key === "Enter" && sendMessage() }}
                        value={currentMessage}
                    />
                    <button onClick={sendMessage}>&#9658;</button>
                </div>
            )}
        </div>
    );
}

export default Chats;
