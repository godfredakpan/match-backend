/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react';
import axios from "axios";
import { io } from "socket.io-client";
import { allModeratorsRoute, getAllModeratorUsersRoute, host } from "../utils/APIRoutes";

import 'material-react-toastify/dist/ReactToastify.css';
import NavBar from './layouts/navbar';
import './css/creativeTim.css';
import './css/style.css';

import { generateFemaleModerator, generateMaleModerator } from '../services/GenerateUsers';
import {  ToastContainer, toast } from "react-toastify";
import { createModeratorUserService } from '../services/user';

const Admin = () => {
    const socket = useRef();
    const [moderators, setModerators] = useState([]);
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(undefined);
    const [loading, setLoading] = useState(false);
 
    const [showAccountTable, setShowAccountTable] = useState(true);
    const [showUserTable, setShowUserTable] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const [ModeratorPerPage] = useState(20);

    const [UserPerPage] = useState(20);
    const [currentUserPage] = useState(1);


    const [formState, setFormState] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
    });

    const updateForm = (e) => {
        const { value, name } = e.target;
        setFormState({
            ...formState,
            [name]: value,
        });
    };

    const user = JSON.parse(localStorage.getItem('current-user'));

    if (!user) {
        window.location.href = "/login";
    }

    useEffect(() => {
        setLoading(true);

        async function fetchData() {

            const user = JSON.parse(localStorage.getItem('current-user'));

            setCurrentUser(user);

            const moderators = await axios.get(`${allModeratorsRoute}/users`);

            moderators.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            const users = await axios.get(`${getAllModeratorUsersRoute}`);

            setUsers(users.data);

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

    const createModeratorUser = async () => {
        try {
            setFormState({ ...formState });
            // if em
            if (!formState?.name || !formState?.username || !formState?.email || !formState?.password) {
                toast.error('Please fill all the fields');
                return;
            }
            const body = {
                name: formState?.name,
                username: formState?.username,
                email: formState?.email,
                password: formState?.password,
            }
            if (!body.name || !body.username || !body.email || !body.password) {
                toast.error('Please fill all the fields');
                return;
            }
            const response = await createModeratorUserService(body);

            if (response._id) {
                toast.success("Moderator created successfully");
            } else {
                toast.error("Error, try again");
            }

            setFormState({
                name: '',
                username: '',
                email: '',
                password: '',

            });
        } catch (err) {
            toast.error("Error, try again");
            setFormState({ ...formState });
        }
    };


    const generateFeMale = async () => {
        const data = await generateFemaleModerator();
        const newModerators = [data,...moderators];
        setModerators(newModerators);
        toast.success(data.name + ' generated successfully')
    }

    const generateMale = async () => {
        const data = await generateMaleModerator();
        const newModerators = [data,...moderators];
        setModerators(newModerators);
        toast.success(data.name + ' generated successfully');
    }
    ////// pagination for accounts
    const indexOfLastModerator = currentPage * ModeratorPerPage;
    const indexOfFirstModerator = indexOfLastModerator - ModeratorPerPage;
    const currentModerators = moderators.slice(indexOfFirstModerator, indexOfLastModerator);

    const paginate = pageNumber => setCurrentPage(pageNumber);
    const nextPage = () => setCurrentPage(currentPage + 1);
    const prevPage = () => setCurrentPage(currentPage - 1);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(moderators.length / ModeratorPerPage); i++) {
        pageNumbers.push(i);
    }

    ////// pagination for users
    const indexOfLastUser = currentUserPage * UserPerPage;
    const indexOfFirstUser = indexOfLastUser - UserPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    const paginateUser = pageNumber => setCurrentPage(pageNumber);
    const nextPageUser = () => setCurrentPage(currentPage + 1);
    const prevPageUser = () => setCurrentPage(currentPage - 1);

    const pageNumbersUser = [];
    for (let i = 1; i <= Math.ceil(users.length / UserPerPage); i++) {
        pageNumbersUser.push(i);
    }

    if (loading) {
        return (
            <div className='loader'>
                <p>Loading...</p>
            </div>
        )
    }

    const toggleAccountTable = () => {
        setShowAccountTable(!showAccountTable);
    }

    const toggleUserTable = () => {
        setShowUserTable(!showUserTable);
    }

    return (
        <>
            <div className="light white-content">
                <ToastContainer />
                <div className="wrapper">
                    {/* sidebar starts */}
                    <>
                        <div className="sidebar">
                            <div className="sidebar-wrapper">
                                <ul className="nav">
                                    {/* sidebar */}
                                </ul>
                            </div>
                        </div>
                    </>
                    {/* sidebar end */}
                    <div className="main-panel">
                        <NavBar />
                        <div className="content">
                            <div className="row">
                                <div className="col-md-10">
                                    <div className="card" style={{ backgroundColor: '#fff' }}>
                                    {showAccountTable &&
                                        <><div className="card-body">
                                                <div className="card-title">
                                                    <h3>Accounts</h3>
                                                </div>

                                                <table class="table table-striped">

                                                    <thead>
                                                        <tr>
                                                            <th scope="col">#</th>
                                                            <th scope="col">Name</th>
                                                            <th scope="col">Gender</th>
                                                            <th scope="col">Email</th>
                                                            <th scope="col">Image</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {currentModerators.map((moderator, index) => <tr>
                                                            <th scope="row">{index}</th>
                                                            <td>{moderator.name}</td>
                                                            <td>{moderator.gender}</td>
                                                            <td>{moderator.email}</td>
                                                            <td><img alt={moderator.name} src={moderator.avatarImage} style={{ width: '50px' }} /></td>
                                                        </tr>)}

                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className=''>
                                                    <nav aria-label="Page navigation example">
                                                        <ul className="pagination justify-content-end">
                                                            <li className="page-item" style={{ marginRight: '5px' }}>
                                                                <button className="btn btn-sm btn-primary" onClick={prevPage} disabled={currentPage === 1 ? true : false}><i className="fa fa-angle-double-left"></i></button>
                                                            </li>
                                                            {pageNumbers.map(number => (
                                                                <li key={number} className="page-item" style={{ marginRight: '5px' }}>
                                                                    <button onClick={() => paginateUser(number)} className={currentPage === number ? 'btn btn-sm btn-primary' : 'btn btn-sm btn-outline-primary'}>{number}</button>
                                                                </li>
                                                            ))}
                                                            <li className="page-item">
                                                                <button className="btn btn-sm btn-primary" onClick={nextPage} disabled={currentPage === pageNumbers.length ? true : false}><i className="fa fa-angle-double-right"></i></button>
                                                            </li>
                                                        </ul>
                                                    </nav>
                                                </div>
                                                </>
                                    }
                                    </div>
                                    

                                        
                                    {showUserTable && 
                                    <div className="card" style={{ backgroundColor: '#fff' }}>

                                        <div className="card-body">
                                                <div className="card-title">
                                                    <h3>Users</h3>
                                                </div>

                                                <table class="table table-striped">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col">#</th>
                                                            <th scope="col">Name</th>
                                                            <th scope="col">Username</th>
                                                            <th scope="col">Email</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {currentUsers.map((user, index) => <tr>
                                                            <th scope="row">{index}</th>
                                                            <td>{user.name}</td>
                                                            <td>{user.username}</td>
                                                            <td>{user.email}</td>
                                                        </tr>
                                                        )}
                                                    </tbody>
                                                </table>

                                            </div>
                                            <div className=''>
                                                    <nav aria-label="Page navigation example">
                                                        <ul className="pagination justify-content-end">
                                                            <li className="page-item" style={{ marginRight: '5px' }}>
                                                                <button className="btn btn-sm btn-primary" onClick={prevPageUser} disabled={currentUserPage === 1 ? true : false}><i className="fa fa-angle-double-left"></i></button>
                                                            </li>
                                                            {pageNumbersUser.map(number => (
                                                                <li key={number} className="page-item" style={{ marginRight: '5px' }}>
                                                                    <button onClick={() => paginate(number)} className={currentUserPage === number ? 'btn btn-sm btn-primary' : 'btn btn-sm btn-outline-primary'}>{number}</button>
                                                                </li>
                                                            ))}
                                                            <li className="page-item">
                                                                <button className="btn btn-sm btn-primary" onClick={nextPageUser} disabled={currentUserPage === pageNumbersUser.length ? true : false}><i className="fa fa-angle-double-right"></i></button>
                                                            </li>
                                                        </ul>
                                                    </nav>
                                                </div>
                                    </div>
                                    }
                                </div>
                                <div className="col-md-2">
                                    <div className="card" style={{ backgroundColor: '#080420' }}>
                                        <div className="card-body">
                                        <button onClick={()=>generateMale()}  class="btn btn-primary btn-sm" data-searchbutton="">Generate Male Account</button>
                                        <button onClick={()=>generateFeMale()}  class="btn btn-info btn-sm" data-searchbutton="">Generate Female Account</button>
                                        <button data-toggle="modal" data-target="#exampleModal"  class="btn btn-warning btn-sm" >Create Moderator</button>

                                        <button onClick={toggleUserTable}  class="btn btn-default btn-sm" >Toggle Users</button>

                                        <button onClick={toggleAccountTable}  class="btn btn-default btn-sm" >Toggle Accounts</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    {/* Modal */}
                    <div className="modal fade" id="exampleModal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">Create Moderator</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
                                </div>
                                {/* update form */}
                                <div className="modal-body">
                                    <div className="row clearfix">
                                        <div className="col-md-12">
                                            <div className="form-group">
                                                <label>Name</label>
                                                <input type='text' onChange={updateForm} className='form-control' name='name' value={formState?.name} />
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="form-group">
                                                <label>Email</label>
                                                <input type='text' onChange={updateForm} className='form-control' name='email' value={formState?.email} />
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="form-group">
                                                <label>Username</label>
                                                <input type='text' onChange={updateForm} className='form-control' name='username' value={formState?.username} />
                                            </div>
                                        </div>

                                        <div className="col-md-12">
                                            <div className="form-group">
                                                <label>Password</label>
                                                <input type='password' onChange={updateForm} className='form-control' name='password' value={formState?.password} />
                                                </div>
                                                </div>

                                                
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                    <button onClick={() => createModeratorUser()} className="btn btn-primary">Create</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Admin;