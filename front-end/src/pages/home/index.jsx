import './styles.css';
import logoutIcon from '../../assets/logout.png';
import editIcon from '../../assets/edit.png';
import deleteIcon from '../../assets/delete.png';
import EditModal from '../../components/modal/index';
import ModalDelete from '../../components/modalDelete/index';
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
    const [modalDeleteUp, setModalDeleteUp] = useState(false);

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
        if (modalDeleteUp) setModalDeleteUp(false);
        navigate('/login');
    };

    function handleEdit() {
        setModalUp(true);
    };

    function handleDelete() {
        setModalDeleteUp(true)
    };

    return (
        <div className='home-container'>
            <div className='home-header'>
                <div className='user-info'>
                    <span> Olá {userData.nome}</span>
                    <span> Email: {userData.email}</span>
                    <span> Telefone {userData.telefone}</span>

               
                </div>

                <div className="buttons-icons">
                     <img
                    src={editIcon}
                    onClick={() => handleEdit()}
                    alt='edit' />
                
                <img src={deleteIcon}
                    onClick={() => handleDelete()}
                    alt='delete'
                />

                <img
                    src={logoutIcon}
                    onClick={() => handleLogout()}
                    alt='logout' />
                </div>
            </div>
            
            <h1>Bem Vindo a home</h1>
            {modalUp && <EditModal setModalUp={setModalUp} />}
            {modalDeleteUp && <ModalDelete
                setModalDeleteUp={setModalDeleteUp}
                user={userData}
                token={token}
                navigate={navigate}
            />}
        </div>
    );
};