import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4, validate } from 'uuid';
import { Toaster, toast } from 'react-hot-toast';
import logo from '../assets/logo.svg'
import { Flex } from '@chakra-ui/react'
import './Home.css'
import githubLogo from '../assets/github-logo.png';
import linkedinLogo from '../assets/linkedin-logo.png';

const Home = () => {

    const navigate = useNavigate();
    const [roomId, setRoomId] = useState("")
    const [username, setUsername] = useState("")
    const [loading, setLoading] = useState(false)

    const handleRoomChange = (e) => {
        const value = e.target.value;
        setRoomId(value);
        if (!validate(value)) {
            toast.error("Incorrect room ID");
        }
    }

    const handleRoomSubmit = async(e) => {
        setLoading(true)
        e.preventDefault()
        if (!validate(roomId)) {
            toast.error("Incorrect room ID");
            return
        }
        const rest=await fetch('https://codeamong-backend.onrender.com/test')

        setLoading(true);
        username && navigate(`/room/${username}/${roomId}`, { state: { username } })
    }

    const createRoomId = (e) => {
        try {
            setRoomId(uuidv4())
        } catch (error) {
            console.log("error occurred in generation of room id")
        }
    }

    return (
        <div className='joinBoxWrapper'>
            <div className='title-logo'>
                <img src={logo} alt="Logo" className="title-img" />
                <h1>CodeAmong</h1>
            </div>
            <form className='joinBox' onSubmit={handleRoomSubmit}>
                <p>Paste your invitation code down below</p>
                <div className="joinBoxInputWrapper">
                    <input
                        className='joinBoxInput'
                        type='text'
                        placeholder='Enter room ID'
                        required
                        onChange={handleRoomChange}
                        value={roomId}
                    />
                </div>
                <div className="joinBoxInputWrapper">
                    <input
                        className="joinBoxInput"
                        type="text"
                        placeholder="Enter Guest Username"
                        required
                        value={username}
                        onChange={e => { setUsername(e.target.value) }}
                    />
                </div>
                <button className='joinBoxBtn' >
                    {loading ? <span className="loader"></span> : <span>Join</span>}
                </button>
                <p>Don't have an invite code?</p>
                <p className='createown'> Create your <span
                    style={{ textDecoration: "underline", cursor: "pointer" }}
                    onClick={createRoomId}
                >own room</span></p>
            </form>
            <p className='footer'>Created by: Shruti Sharma</p>
            <Flex mt={3}>
                <a href="https://github.com/shrutisharma91" target="_blank" rel="noopener noreferrer">
                    <img src={githubLogo} alt="GitHub Logo" width="30" height="30" style={{ marginRight: '10px' }} />
                </a>
                <a href="https://www.linkedin.com/in/shruti-sharma-70425b371/" target="_blank" rel="noopener noreferrer">
                    <img src={linkedinLogo} alt="LinkedIn Logo" width="30" height="30" />
                </a>
            </Flex>
            <Toaster />
        </div>
    )
}

export default Home;
