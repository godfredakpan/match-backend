/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useRef, useState } from 'react';
import axios from "axios";
import { io } from "socket.io-client";
import { allModeratorsRoute, allPaymentsRoute, createFavoriteRoute, getAllModeratorUsersRoute, host, sendMessageRoute } from "../utils/APIRoutes";

import 'material-react-toastify/dist/ReactToastify.css';
import NavBar from './layouts/navbar';
import './css/creativeTim.css';
import './css/style.css';

import { generateFemaleModerator, generateMaleModerator } from '../services/GenerateUsers';
import { ToastContainer, toast } from "react-toastify";
import { createModeratorUserService, getAllLovers, updateAccountServiceImage } from '../services/user';

import UploadCloudinary from "../services/cloudinary/UploadCloudinary";

import moment from 'moment';
const credentials = {
    loginCode: 'AdminCOdeskn#88dhnn!!',
}

const Admin = () => {
    const socket = useRef();
    const [moderators, setModerators] = useState([]);
    const [users, setUsers] = useState([]);
    const [lovers, setLovers] = useState([]);
    const [payments, setPayments] = useState([]);
    const [currentUser, setCurrentUser] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [account, setAccount] = useState({});
    const [selectedUser, updateSelectedUser] = useState({});
    const [selectedLover, updateSelectedLover] = useState({});

    const loggedIn = sessionStorage.getItem('loggedIn');

    const [showAccountTable, setShowAccountTable] = useState(true);
    const [showUserTable, setShowUserTable] = useState(true);
    const [showLoverTable, setShowLoverTable] = useState(true);
    const [showPaymentTable, setShowPaymentTable] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const [currentLoverPage, setCurrentLoverPage] = useState(1);
    const [currentPaymentPage, setCurrentPaymentPage] = useState(1);

    const [ModeratorPerPage] = useState(20);

    const [UserPerPage] = useState(20);
    const [currentUserPage] = useState(1);

    const [LoverPerPage] = useState(20);

    const [PaymentPerPage] = useState(20);

    const [formState, setFormState] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        message: '',
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

        async function fetchData() {
            setLoading(true);
            // if (!loggedIn) {
            //     const loginCode = prompt('Please enter your login code');
            //     if (loginCode !== credentials.loginCode) {
            //         alert('Invalid login code');
            //         sessionStorage.setItem('loggedIn', false);
            //         return;
            //     }
            // }
            sessionStorage.setItem('loggedIn', true);

            const lovers = await getAllLovers();

            setLovers(lovers);

            const user = JSON.parse(localStorage.getItem('current-user'));

            setCurrentUser(user);

            const moderators = await axios.get(`${allModeratorsRoute}/users`);

            moderators.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            const users = await axios.get(`${getAllModeratorUsersRoute}`);

            setUsers(users.data);

            setModerators(moderators.data);

            const payments = await axios.get(`${allPaymentsRoute}`);

            setPayments(payments.data);

            const selectedChat = localStorage.getItem('selectedChat');

            if (selectedChat) {
                updateSelectedUser(JSON.parse(selectedChat));
            }

            setLoading(false)

        }

        fetchData();

    }, []);

    setTimeout(() => {
        sessionStorage.clear();
    }, 1800000);

    useEffect(() => {
        if (currentUser) {
            socket.current = io(host);
            socket.current.emit("add-user", currentUser._id);
        }
    }, [currentUser]);

    const createModeratorUser = async () => {
        try {
            setFormState({ ...formState });

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


    const updateAccountImage = async () => {
        try {
            setFormState({ ...formState });
            if (!image) {
                toast.error('Please select an image');
                return;
            }
            const body = {
                image: image,
                user_id: account?._id,
            }

            const response = await updateAccountServiceImage(body);

            if (response.status) {
                const newModerators = moderators.map((moderator) => {
                    if (moderator._id === account._id) {
                        return { ...moderator, avatarImage: image }
                    }
                    return moderator;
                });

                setModerators(newModerators);
                toast.success("Image updated successfully");
            } else {
                toast.error("Error, try again");
            }

            setImage(null);

        } catch (err) {
            toast.error("Error, try again");
            setFormState({ ...formState });
        }
    };


    const generateFeMale = async () => {
        const data = await generateFemaleModerator();
        const newModerators = [data, ...moderators];
        setModerators(newModerators);
        toast.success(data.name + ' generated successfully')
    }

    const generateMale = async () => {
        const data = await generateMaleModerator();
        const newModerators = [data, ...moderators];
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

    ////// pagination for lovers
    const indexOfLastLover = currentLoverPage * LoverPerPage;
    const indexOfFirstLover = indexOfLastLover - LoverPerPage;
    const currentLovers = lovers.slice(indexOfFirstLover, indexOfLastLover);

    const paginateLover = pageNumber => setCurrentLoverPage(pageNumber);
    const nextPageLover = () => setCurrentLoverPage(currentPage + 1);
    const prevPageLover = () => setCurrentLoverPage(currentPage - 1);

    const pageNumbersLover = [];
    for (let i = 1; i <= Math.ceil(lovers.length / LoverPerPage); i++) {
        pageNumbersLover.push(i);
    }

    // ////// pagination for payment
    const indexOfLastPayment = currentPaymentPage * PaymentPerPage;
    const indexOfFirstPayment = indexOfLastPayment - PaymentPerPage;
    const currentPayments = payments.slice(indexOfFirstPayment, indexOfLastPayment);

    const paginatePayment = pageNumber => setCurrentPaymentPage(pageNumber);
    const nextPagePayment = () => setCurrentPaymentPage(currentPage + 1);
    const prevPagePayment = () => setCurrentPaymentPage(currentPage - 1);

    const pageNumbersPayment = [];
    for (let i = 1; i <= Math.ceil(payments.length / PaymentPerPage); i++) {
        pageNumbersPayment.push(i);
    }

    const toggleAccountTable = () => {
        setShowAccountTable(!showAccountTable);
    }

    const toggleUserTable = () => {
        setShowUserTable(!showUserTable);
    }

    const toggleLoverTable = () => {
        setShowLoverTable(!showLoverTable);
    }

    const togglePaymentTable = () => {
        setShowPaymentTable(!showPaymentTable);
    }

    const handleFile = async e => {
        setUploadLoading(true);
        const file = e.target.files[0];

        if (!file.type.match('image.*')) {
            toast.error('Please select an image file');
            setUploadLoading(false);
            return;
        }
        if (file.size > 5000000) {
            toast.error('Image size should not exceed 5MB');
            setUploadLoading(false);
            return;
        }
        const upload = await UploadCloudinary(file);
        setImage(upload.secure_url)
        toast.success('Image uploaded successfully');
        setUploadLoading(false);
    }

    const chooseFile = useCallback(() => {
        const dropArea = document.querySelector(".drop_box");
        const button = dropArea.querySelector("button");
        const input = dropArea.querySelector("input");
        button.onclick();
        input.click();
    }, [])


    const addUserToLocalStorage = (user) => {
        localStorage.setItem('selectedChat', JSON.stringify(user));
        updateSelectedUser(user);
        toast.success(`You are now talking to lovers with ${user.name}`);
    }

    const sendMessage = async (e) => {
        if (!formState.message) {
            toast.error('Please enter a message');
            return;
        }
        const selectedChat = JSON.parse(localStorage.getItem('selectedChat'));

        await axios.post(createFavoriteRoute, {
            ...selectedChat,
            id: selectedChat._id,
            user_id: selectedLover._id,
        });

        const message = formState.message;
        const data = await axios.post(sendMessageRoute, {
            from: selectedChat._id,
            to: selectedLover._id,
            message: message,
          });

          console.log(data);

        if (data) {
            toast.success('Message sent successfully');
        } else {
            toast.error('Error, try again');
        }
    }



    if (loading) {
        return (
            <div className="container-fluid col-md-12 align-center">
                <div style={{ width: '100%', height: '100%', marginTop: '100px' }} className="loader">Loading.....</div>
            </div>
        )
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
                                            <><div className="card-body table-responsive">
                                                <div className="card-title">
                                                    <h3>Accounts</h3>
                                                </div>

                                                <table class="table table-striped">

                                                    <thead>
                                                        <tr>
                                                            <th scope="col">#</th>
                                                            <th scope="col">Name</th>
                                                            <th scope="col">Gender</th>
                                                            <th scope="col">Region</th>
                                                            <th scope="col">Email</th>
                                                            <th scope="col">Age</th>
                                                            <th scope="col">Image</th>
                                                            <th scope="col">Action</th>

                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {currentModerators.map((moderator, index) => <tr>
                                                            <th scope="row">{index}</th>
                                                            <td>{moderator.name}</td>
                                                            <td>{moderator.region}</td>
                                                            <td>{moderator.gender}</td>
                                                            <td>{moderator.email}</td>
                                                            <td>{moderator.age}</td>
                                                            <td><img alt={moderator.name} src={moderator.avatarImage} style={{ width: '50px' }} /></td>
                                                            <td><span data-toggle="modal" data-target="#imageModal" onClick={() => setAccount(moderator)} style={{ cursor: 'pointer' }} className='btn-sm btn-primary'><i className='fa fa-image'></i></span>

                                                                <span onClick={() => addUserToLocalStorage(moderator)} style={{ cursor: 'pointer', marginLeft: 10 }} className='btn-sm btn-primary'><i className='fa fa-heart'></i></span>
                                                            </td>
                                                        </tr>)}

                                                    </tbody>
                                                </table>
                                                <div className='pagination-scroll'>
                                                    <nav aria-label="Page navigation example">
                                                        <ul className="pagination ">
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
                                            </div>

                                            </>
                                        }
                                    </div>


                                    {showUserTable &&
                                        <div className="card" style={{ backgroundColor: '#fff' }}>
                                            <div className="card-body table-responsive">
                                                <div className="card-title">
                                                    <h3>Moderators</h3>
                                                </div>

                                                <table class="table table-striped">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col">#</th>
                                                            <th scope="col">Name</th>
                                                            <th scope="col">Username</th>
                                                            <th scope="col">Age</th>
                                                            <th scope="col">Email</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {currentUsers.map((user, index) => <tr>
                                                            <th scope="row">{index}</th>
                                                            <td>{user.name}</td>
                                                            <td>{user.username}</td>
                                                            <td>{user.age}</td>
                                                            <td>{user.email}</td>
                                                        </tr>
                                                        )}
                                                    </tbody>
                                                </table>

                                            </div>
                                            <div className='pagination-scroll'>
                                                <nav aria-label="Page navigation example">
                                                    <ul className="pagination">
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

                                    {showLoverTable &&
                                        <div className="card" style={{ backgroundColor: '#fff' }}>

                                            <div className="card-body table-responsive">
                                                <div className="card-title">
                                                    <h3>Real Users</h3>
                                                </div>

                                                <table class="table table-striped">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col">#</th>
                                                            <th scope="col">Name</th>
                                                            <th scope="col">Username</th>
                                                            <th scope="col">Age</th>
                                                            <th scope="col">Email</th>
                                                            <th scope="col">Gender</th>
                                                            <th scope="col">Password</th>
                                                            <th scope="col">Action</th>

                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {currentLovers.map((user, index) => <tr>
                                                            <th scope="row">{index}</th>
                                                            <td>{user.name}</td>
                                                            <td>{user.username}</td>
                                                            <td>{user.age}</td>
                                                            <td>{user.email}</td>
                                                            <td>{user.gender}</td>
                                                            <td>{user.pass}</td>
                                                            <td><span data-toggle="modal" data-target="#chatModal" onClick={() => updateSelectedLover(user)} style={{ cursor: 'pointer' }} className='btn-sm btn-primary'><i className='fa fa-envelope'></i></span>
                                                            </td>
                                                        </tr>
                                                        )}
                                                    </tbody>
                                                </table>

                                            </div>
                                            <div className='pagination-scroll'>
                                                <nav aria-label="Page navigation example">
                                                    <ul className="pagination">
                                                        <li className="page-item" style={{ marginRight: '5px' }}>
                                                            <button className="btn btn-sm btn-primary" onClick={prevPageLover} disabled={currentLoverPage === 1 ? true : false}><i className="fa fa-angle-double-left"></i></button>
                                                        </li>
                                                        {pageNumbersLover.map(number => (
                                                            <li key={number} className="page-item" style={{ marginRight: '5px' }}>
                                                                <button onClick={() => paginateLover(number)} className={currentLoverPage === number ? 'btn btn-sm btn-primary' : 'btn btn-sm btn-outline-primary'}>{number}</button>
                                                            </li>
                                                        ))}
                                                        <li className="page-item">
                                                            <button className="btn btn-sm btn-primary" onClick={nextPageLover} disabled={currentLoverPage === pageNumbersLover.length ? true : false}><i className="fa fa-angle-double-right"></i></button>
                                                        </li>
                                                    </ul>
                                                </nav>
                                            </div>
                                        </div>
                                    }

                                    {showPaymentTable &&
                                        <div className="card" style={{ backgroundColor: '#fff' }}>

                                            <div className="card-body table-responsive">
                                                <div className="card-title">
                                                    <h3>Payment</h3>
                                                </div>

                                                <table class="table table-striped">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col">#</th>
                                                            <th scope="col">Name</th>
                                                            <th scope="col">Amount</th>
                                                            <th scope="col">Description</th>
                                                            <th scope="col">Date</th>

                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {currentPayments.map((payment, index) => <tr>
                                                            <th scope="row">{index}</th>
                                                            <td>{payment.user}</td>
                                                            <td>{payment.amount}</td>
                                                            <td>{payment.description}</td>
                                                            <td>{moment(payment.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</td>
                                                        </tr>
                                                        )}
                                                    </tbody>
                                                </table>

                                            </div>
                                            <div className='pagination-scroll'>
                                                <nav aria-label="Page navigation example">
                                                    <ul className="pagination">
                                                        <li className="page-item" style={{ marginRight: '5px' }}>
                                                            <button className="btn btn-sm btn-primary" onClick={prevPagePayment} disabled={currentPaymentPage === 1 ? true : false}><i className="fa fa-angle-double-left"></i></button>
                                                        </li>
                                                        {pageNumbersPayment.map(number => (
                                                            <li key={number} className="page-item" style={{ marginRight: '5px' }}>
                                                                <button onClick={() => paginatePayment(number)} className={currentPaymentPage === number ? 'btn btn-sm btn-primary' : 'btn btn-sm btn-outline-primary'}>{number}</button>
                                                            </li>
                                                        ))}
                                                        <li className="page-item">
                                                            <button className="btn btn-sm btn-primary" onClick={nextPagePayment} disabled={currentPaymentPage === pageNumbersPayment.length ? true : false}><i className="fa fa-angle-double-right"></i></button>
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
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                                                <p style={{ color: 'white' }}>Current user</p>
                                                <p style={{ color: 'white' }}>{selectedUser.name}</p>
                                                <img src={selectedUser.avatarImage} alt="" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
                                            </div>
                                            <button onClick={() => generateMale()} class="btn btn-primary btn-sm" data-searchbutton="">Generate Male Account</button>
                                            <button onClick={() => generateFeMale()} class="btn btn-info btn-sm" data-searchbutton="">Generate Female Account</button>
                                            <button data-toggle="modal" data-target="#exampleModal" class="btn btn-warning btn-sm" >Create Moderator</button>

                                            <button onClick={toggleAccountTable} class="btn btn-default btn-sm" >Toggle Accounts</button>

                                            <button onClick={toggleUserTable} class="btn btn-default btn-sm" >Toggle Moderators</button>

                                            <button onClick={toggleLoverTable} class="btn btn-default btn-sm" >Toggle Real Users</button>

                                            <button onClick={togglePaymentTable} class="btn btn-default btn-sm" >Toggle Payment</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    {/* Modal for creating user */}
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

                    {/* Modal for updating image */}
                    <div className="modal fade" id="imageModal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content center">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">Update Image</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
                                </div>
                                {/* update form */}
                                <div className="modal-body">
                                    <div className="row clearfix">
                                        <div className="col-md-12 text-center">

                                            <p>Update {account.name}'s profile</p>

                                            <p>Previous Image</p>
                                            <img alt={account.name} src={account.avatarImage} style={{ width: '100px' }} /><br></br>

                                            <small style={{ color: 'green' }}>Photo: <small className='text-warning'>Image should not exceed 5MB</small></small><br></br>
                                            {uploadLoading && <p className="text-success">Loading...</p>}
                                            {image ? <img width="10%" className="img-profile" src={image} alt="" /> : <img className="img-profile" src={image} width="10%" alt="" />
                                            }
                                            <div className="drop_box">
                                                {/* <label className="btn btn-sm btn-primary">Photo</label> */}
                                                <input name="file" type="file" onChange={handleFile} hidden accept='png, jpg' id="fileID" style={{ display: 'none' }} />
                                                <button onClick={chooseFile} disabled={uploadLoading && true} className="btn-sm btn-upload"><i className="fa fa-upload fa-3x" aria-hidden="true"></i></button>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                    <button onClick={() => updateAccountImage()} className="btn btn-primary">Update</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal fade" id="chatModal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog" role="document" style={{ width: '100%' }}>
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">Chat using {selectedUser.name}</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
                                </div>
                                <div className="modal-body">
                                    <div className="row clearfix">
                                        <div className="col-md-12">
                                            <div className="form-group">
                                                <label>Message {selectedLover.name}</label>
                                                <textarea onChange={updateForm} className='form-control' name='message' value={formState?.message} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                    <button onClick={() => sendMessage()} className="btn btn-primary">Send</button>
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