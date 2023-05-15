/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react';
import axios from "axios";
import { io } from "socket.io-client";
import { allMessagesRoute, allModeratorsRoute, allUsersRoute, host } from "../utils/APIRoutes";

import ChatContainer from "../components/Chat/ChatContainer";
import Contacts from "../components/Chat/Contacts";
import Welcome from "../components/Chat/Welcome";

import 'material-react-toastify/dist/ReactToastify.css';
import NavBar from './layouts/navbar';
import './css/creativeTim.css';
import './css/style.css';

const Dashboard = () => {
    const socket = useRef();
    const [contacts, setContacts] = useState([]);
    const [moderators, setModerators] = useState([]);
    const [messages, setMessages] = useState([]);
    const [conversation, setConversations] = useState([]);
    const [currentChat, setCurrentChat] = useState(undefined);
    const [currentUser, setCurrentUser] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const moderator = JSON.parse(localStorage.getItem('current-moderator'));
 
    const user = JSON.parse(localStorage.getItem('current-user'));

    if (!user) {
        window.location.href = "/login";
    }

    useEffect(() => {
        setLoading(true);
        async function fetchData() {

            const user = JSON.parse(localStorage.getItem('current-user'));

            setCurrentUser(user);

            const data = await axios.get(`${allUsersRoute}`);

            const moderators = await axios.get(`${allModeratorsRoute}/users`);

            const messages = await axios.get(`${allMessagesRoute}`);
            
            const groups = messages.data.reduce((groups, message) => {
                const date = message.createdAt.split('T')[0];

                if(message.sentByClient === 'false'){
                    return groups;
                }
                
                if (!groups[date]) {
                    groups[date] = [];
                }
                groups[date].push(message);
                return groups;
            }, {});

            // set conversations state
            setConversations(Object.values(groups));
            setMessages(messages.data);
            setContacts(data.data);
            setModerators(moderators.data);
        }

        fetchData();
        setLoading(false)
    }, []);

    useEffect(() => {
        if (currentUser) {
            socket.current = io(host);
            socket.current.emit("add-user", currentUser._id);
        }
    }, [currentUser]);


    const handleChatChange = (chat) => {
        setCurrentChat(chat);
        // localStorage.setItem('lovedContact', JSON.stringify(chat));
    };

    if (loading) {
        return (
            <div className='loader'>
                <p>Loading...</p>
            </div>
        )
    }

    return (
        <>
            <div className="light white-content">
                <div className="wrapper">
                    {/* sidebar starts */}
                    <>
                        <div className="sidebar">
                            <div className="sidebar-wrapper">
                                <ul className="nav">
                                    <Contacts moderators={moderators} conversation={conversation} contacts={contacts} changeChat={handleChatChange} />
                                </ul>
                            </div>
                        </div>
                    </>
                    {/* sidebar end */}
                    <div className="main-panel">
                        <NavBar />
                        <div className="content">
                            <div className="row">
                                <div className="col-md-3">
                                    <div className="card card-user">
                                        <div className="card-body">
                                            <p className="card-text">
                                                <div className="author">
                                                    <div className="block block-one"></div>
                                                    <div className="block block-two"></div>
                                                    <div className="block block-three"></div>
                                                    <div className="block block-four"></div>
                                                    <a href="#">
                                                        <img src={currentChat?.avatarImage} width="250px"
                                                            alt="" />
                                                        <h3 className="title">{currentChat?.username}</h3>
                                                    </a>

                                                </div>
                                            </p>
                                            <div className="card-description">

                                                <p className="description">

                                                    <b>Bio: {currentChat?.about}</b>

                                                </p>

                                                <p className="description">
                                                    <b>Email:</b>{currentChat?.email}
                                                </p>

                                                <p className="description">
                                                    <b>Email:</b>{currentChat?.gender}
                                                </p>

                                            </div>
                                        </div>
                                        <div className="card-footer">
                                            <div className="button-container">

                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="card" style={{ backgroundColor: '#080420' }}>
                                        <div className="card-body">
                                            {/* chat */}
                                            <div className="container">
                                                {currentChat === undefined ? (
                                                    <Welcome />
                                                ) : (
                                                    <ChatContainer currentChat={currentChat} socket={socket} />
                                                )}
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="card card-user">
                                        <div className="card-body">
                                            <p className="card-text">
                                                <div className="author">
                                                    <div className="block block-one"></div>
                                                    <div className="block block-two"></div>
                                                    <div className="block block-three"></div>
                                                    <div className="block block-four"></div>
                                                    <a href="#">

                                                        <img src={moderator?.avatarImage} width="250px"
                                                            alt="" />

                                                        <h3 className="title">{moderator?.name}</h3>
                                                    </a>

                                                </div>
                                            </p>
                                            <div className="card-description">


                                                <p className="description">

                                                    <b>Bio: {moderator?.about}</b>

                                                </p>


                                                <p className="description">

                                                    <b>Email:</b> <a href="#">{moderator?.email}</a>
                                                </p>

                                                <p className="description">
                                                    <b>Gender: no Gender yet</b>
                                                </p>



                                            </div>
                                        </div>
                                        <div className="card-footer">
                                            <div className="button-container">

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;