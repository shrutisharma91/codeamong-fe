import React, { useState, useEffect } from 'react';
import AceEditor from 'react-ace';
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { generateColor } from '../utils/generateColor';
import logo from '../assets/logo.svg'
import './Editor.css';
import ChatFeature from './SocketConnections'

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-typescript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-yaml";
import "ace-builds/src-noconflict/mode-golang";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-css";

import "ace-builds/src-noconflict/keybinding-emacs";
import "ace-builds/src-noconflict/keybinding-vim";

import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/ext-searchbox";

const Editor = ({ socket }) => {
    const navigate = useNavigate();
    const { roomId } = useParams();
    const [fetchedUsers, setFetchedUsers] = useState([]);
    const [fetchedCode, setFetchedCode] = useState("");
    const [language, setLanguage] = useState("javascript");
    const [codeKeybinding, setCodeKeybinding] = useState(undefined);

    const languagesAvailable = ["javascript", "java", "c_cpp", "python", "typescript", "golang", "yaml", "html"];
    const codeKeybindingsAvailable = ["default", "emacs", "vim"];

    function onChange(newValue) {
        setFetchedCode(newValue);
        socket.emit("update code", { roomId, code: newValue });
        socket.emit("syncing the code", { roomId: roomId });
    }

    function handleLanguageChange(e) {
        setLanguage(e.target.value);
        socket.emit("update language", { roomId, languageUsed: e.target.value });
        socket.emit("syncing the language", { roomId: roomId });
    }

    function handleCodeKeybindingChange(e) {
        setCodeKeybinding(e.target.value === "default" ? undefined : e.target.value);
    }

    function handleLeave() {
        socket.disconnect();
        !socket.connected && navigate('/', { replace: true, state: {} });
    }

    function copyToClipboard(text) {
        try {
            navigator.clipboard.writeText(text);
            toast.success('Room ID copied');
        } catch (exp) {
            console.error(exp);
        }
    }

    useEffect(() => {
        socket.on("updating client list", ({ userslist }) => {
            setFetchedUsers(userslist);
        });

        socket.on("on language change", ({ languageUsed }) => {
            setLanguage(languageUsed);
        });

        socket.on("on code change", ({ code }) => {
            setFetchedCode(code);
        });

        socket.on("new member joined", ({ username }) => {
            toast(`${username} joined`);
        });

        socket.on("member left", ({ username }) => {
            toast(`${username} left`);
        });

        const backButtonEventListner = window.addEventListener("popstate", function (e) {
            const eventStateObj = e.state;
            if (!('usr' in eventStateObj) || !('username' in eventStateObj.usr)) {
                socket.disconnect();
            }
        });

        return () => {
            window.removeEventListener("popstate", backButtonEventListner);
        };
    }, [socket]);

    return (
        <div className="room">
            <div className='logo-container'>
                <Link to='/' className='logo'>
                    <img src={logo} alt="Logo" className="logo-img" />
                    <h1 className="logo-text">CodeAmong</h1>
                </Link>
            </div>
            <div className="left">
                <div className="upper-section">
                    <div className="language-field-wrapper-a">
                        <select className="language-field" name="language" id="language" value={language} onChange={handleLanguageChange}>
                            {languagesAvailable.map(eachLanguage => (
                                <option key={eachLanguage} value={eachLanguage}>{eachLanguage}</option>
                            ))}
                        </select>
                    </div>
                    <div className="language-field-wrapper-b">
                        <select className="language-field" name="codeKeybinding" id="codeKeybinding" value={codeKeybinding} onChange={handleCodeKeybindingChange}>
                                {codeKeybindingsAvailable.map(eachKeybinding => (
                                <option key={eachKeybinding} value={eachKeybinding}>{eachKeybinding}</option>
                        ))}
                        </select>
                    </div>
                    <div className="room-sidebar-users-wrapper">
                        <p>Connected Users:</p>
                        <div className="room-sidebar-users">
                            {fetchedUsers.map((each) => (
                                <div key={each} className="room-sidebar-users-each">
                                    <div className="room-sidebar-users-each-avatar" style={{ backgroundColor: `${generateColor(each)}` }}>{each.slice(0, 2).toUpperCase()}</div>
                                    <div className="room-sidebar-users-each-name">{each}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <AceEditor
                    placeholder="Write your code here."
                    className="room-code-editor"
                    mode={language}
                    keyboardHandler={codeKeybinding}
                    theme="monokai"
                    name="collabEditor"
                    width="auto"
                    height="auto"
                    value={fetchedCode}
                    onChange={onChange}
                    fontSize={17}
                    showPrintMargin={false}
                    showGutter={false}
                    highlightActiveLine={true}
                    enableLiveAutocompletion={true}
                    enableBasicAutocompletion={false}
                    enableSnippets={false}
                    wrapEnabled={true}
                    tabSize={2}
                    editorProps={{
                        $blockScrolling: true
                    }}
                />
            </div>
            <div className="right">
                <ChatFeature />
                <div className="room-sidebar">
                    <button className="room-sidebar-copy-btn" onClick={() => { copyToClipboard(roomId) }}>Copy Room id</button>
                    <button className="room-sidebar-btn" onClick={() => { handleLeave() }}>Leave</button>
                </div>
                <Toaster />
            </div>
        </div>
    );
}

export default Editor;
