import React, { useState } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import { Button } from 'react-bootstrap';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import getAllUsers from '../fauna/getUsers';


const credentials = {
    loginCode: 'pUrpLeQWERTY20',
}

const columns = [
    {
        dataField: 'fname',
        text: 'First Name',
    },
    {
        dataField: 'mname',
        text: 'Middle Name',
    },
    {
        dataField: 'lname',
        text: 'Last Name',
    },
    {
        dataField: 'gender',
        text: 'Gender',
    },
    {
        dataField: 'dob',
        text: 'Date of Birth',
    },
    {
        dataField: 'email',
        text: 'Email',
    },
    {
        dataField: 'phone',
        text: 'Phone',
    },
    {
        dataField: 'address',
        text: 'Address',
    },
    {
        dataField: 'bank_name',
        text: 'Bank Name',
    },
    {
        dataField: 'account_number',
        text: 'Acct Number',
    },
    {
        dataField: 'account_name',
        text: 'Account Name',
    },

];


const options = {
    sizePerPage: 10,
    hideSizePerPage: false,
    hidePageListOnlyOnePage: true,
    alwaysShowAllBtns: true,
};

function Users() {
    const [selectedRows, setSelectedRows] = useState([]);
    const [users, setUsers] = useState([]);

    const loggedIn = sessionStorage.getItem('loggedIn');

    React.useEffect(() => {
        async function fetchData() {
            if (!loggedIn) {
                const loginCode = prompt('Please enter your login code');
                if (loginCode !== credentials.loginCode) {
                    alert('Invalid login code');
                    sessionStorage.setItem('loggedIn', false);
                    return;
                }
            }
            sessionStorage.setItem('loggedIn', true);
            const users = await getAllUsers();
            const reformedUsers = users.map((user) => {
                return { ...user.data, id: user.ref.id };
            });
            setUsers(reformedUsers);
        }
        fetchData();
    }, [loggedIn])

    const handleSelect = (row, isSelected) => {
        if (isSelected) {
            setSelectedRows([...selectedRows, row]);
        } else {
            setSelectedRows(selectedRows.filter((r) => r.id !== row.id));
        }
    };


    const handleExportClick = () => {
        const selectedData = selectedRows.length > 0 ? selectedRows : users;

        const sheetData = [
            ['First Name', 'Middle Name', 'Last Name', 'Gender', 'Date of Birth', 'Email', 'Phone', 'Address', 'Bank Name', 'Account Number', 'Account Name'],
            ...selectedData.map((d) => [d.fname, d.mname, d.lname, d.gender, d.dob, d.email, d.phone, d.address, d.bank_name, d.account_number, d.account_name]),
        ];

        const sheetName = 'Purple Data';

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

        const excelBuffer = XLSX.write(workbook, {
            bookType: 'xlsx',
            type: 'array',
        });

        saveAs(
            new Blob([excelBuffer], { type: 'application/octet-stream' }),
            `${sheetName}.xlsx`
        );
    };


    setTimeout(() => {
        sessionStorage.clear();
    }, 1800000);

    return (
        <>
            <div className="container mt-5 card">
                <div className="row card-body" >
                    <div className="col-md-2" >
                    <button className="btn btn-danger btn-sm" onClick={() => { sessionStorage.clear(); window.location.reload(); } }>Logout</button>
                    </div>
                </div>
            </div><div className="container mt-5 card">
                <div className="row card-body">
                    <div className="col-md-12">
                        {users.length === 0 && <h4>Loading...</h4>}
                        {users.length > 0 && <h4>Entries</h4>}
                        <button className='btn-success btn btn-sm' style={{ marginBottom: '20px' }} onClick={handleExportClick}>Export to Excel</button>
                        <BootstrapTable
                            keyField="id"
                            data={users}
                            columns={columns}
                            selectRow={{ mode: 'checkbox', onSelect: handleSelect }}
                            pagination={paginationFactory(options)}
                            wrapperClasses="table-responsive" />
                    </div>
                </div>
            </div></>
    );
}

export default Users;
