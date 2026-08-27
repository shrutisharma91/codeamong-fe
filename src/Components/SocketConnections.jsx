import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import Chats from './Chats';
import './SocketConnection.css';
import VideoLobby from './VideoLobby';

const socket = io.connect("https://codeamong-chats.onrender.com");

const Connections = () => {
    const { roomId } = useParams();
    const { username } = useParams();
    const [user, setUsername] = useState("");
    const [room, setRoom] = useState(roomId);

    useEffect(() => {
        setRoom(roomId);
    }, [roomId]);

    useEffect(() => {
        setUsername(username);
    }, [username]);

    useEffect(() => {
        joinRoom();
    });
    
    const joinRoom = () => {
        if (user !== "" && room !== "") {
            socket.emit("join_room", room);
        }
    };
    
    return (
        <div className='App'>
            <VideoLobby />
            <Chats socket={socket} user={user} room={room} />
        </div>
    );
};

export default Connections;
