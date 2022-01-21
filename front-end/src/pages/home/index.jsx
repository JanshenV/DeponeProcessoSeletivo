import './styles.css';
import logoutIcon from '../../assets/logout.png';
import editIcon from '../../assets/edit.png';
import  EditModal  from '../../components/modal/index';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';


export default function Home() {
    const navigate = useNavigate();
     const token = localStorage.getItem('token');

    const [userData, setUserData] = useState({
        id: '',
        nome: '',
        email: '',
        telefone: ''
    });

    const [modalUp, setModalUp] = useState(false);

    useEffect(() => {
        if (!token) {
            navigate('/login');
        };
    }, ['Home']);

    async function handleUserData() {

        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'Application/json',
                'authorization': token
            }
        };

        const request = await fetch('http://localhost:2700/profile', requestOptions);
        const response = await request.json();

        if (request.status !== 200) {
            return console.log(response);
        };

        setUserData({
            id: response.id,
            nome: response.nome,
            email: response.email,
            telefone: response.telefone
        });
        return;
    };

    useEffect(() => {
        handleUserData();
    }, ['Home']);
       
    function handleLogout() {
        localStorage.removeItem('token');
        if (modalUp) setModalUp(false);
        navigate('/login');
    };

    function handleEdit() {
        setModalUp(true);
    };

    return (
        <div className='home-container'>
            <div className='home-header'>
                <div className='user-info'>
                    <span> Olá {userData.nome}</span>
                    <span> Email: {userData.email}</span>
                    <span> Telefone {userData.telefone}</span>

               
                </div>

                <img
                    src={editIcon}
                    onClick={() => handleEdit()}
                    alt='edit' />

                <img
                    src={logoutIcon}
                    onClick={() => handleLogout()}
                    alt='logout' />
            </div>
            
            <h1>Bem Vindo a home</h1>
            {modalUp && <EditModal setModalUp={setModalUp}/>}
        </div>
    );
};