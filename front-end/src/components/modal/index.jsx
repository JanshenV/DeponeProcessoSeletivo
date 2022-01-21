import './styles.css';
import { useState } from 'react';


export default function EditModal({ setModalUp }) {
    
    const [editData, setEditData] = useState({
        nome: '',
        email: '',
        telefone: '',
        senha: ''
    });

    const [error, setError] = useState({
        message: ''
    });

    async function handleSubmit(event) {
        event.preventDefault();

        const { nome, email, telefone, senha } = editData;

        if (!nome && !email && !telefone && !senha) {
            return alert('Ao menos um item é obrigatório.');
        };

        const token = localStorage.getItem('token');
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify(editData)
        };

        const request = await fetch("http://localhost:2700/users", requestOptions);
        const response = await request.json();

        if (request.status !== 200) {
            setError(response);
            return console.log(error.message)
        };

        setModalUp(false);
        setError({ message: '' });
        window.location.reload(true);
    };

    function handleEditDataValues(event) {
        const inputType = event.target.type;
        setError({message: ''});

        if (inputType === 'text') {
            const inputValue = event.target.value;
            setEditData({
                ...editData,
                nome: inputValue
            });
            return;
        };
        
        if (inputType === 'email') {
            const inputValue = event.target.value;
            setEditData({
                ...editData,
                email: inputValue
            });
             return;
        };
        
        if (inputType === 'number') {
            const inputValue = event.target.value;
            setEditData({
                ...editData,
                telefone: inputValue
            });
             return;
        };
        
        if (inputType === 'password') {
            const inputValue = event.target.value;
            setEditData({
                ...editData,
                senha: inputValue
            });
             return;
        }; 
    };


    return (
        <div className='backdrop'>
            <div className='modal-container'>
                <form
                    className="modal-form"
                    onSubmit={(event) => handleSubmit(event)}
                >
                    <label>Nome</label>
                    <input
                        type="text"
                        value={editData.nome}
                        onChange={(event) => handleEditDataValues(event)}
                    />
                    

                    <label>Email</label>
                    <input
                        type="email"
                        value={editData.email}
                        onChange={(event) => handleEditDataValues(event)}
                    />

                    <label>Telefone</label>
                    <input
                        type="number"
                        value={editData.telefone}
                        onChange={(event) => handleEditDataValues(event)}
                    />

                    <label>Senha</label>
                    <input
                        type="password"
                        value={editData.senha}
                        onChange={(event) => handleEditDataValues(event)}
                    />

                    <div className='buttons'>
                        <button
                            className='confirm'
                            type="submit"
                        >Confirmar
                        </button>

                        <button
                            className='cancel'
                            onClick={() => setModalUp(false)}
                            type="button">
                            Cancelar
                        </button>
                        
                    </div>

                    {error.message &&
                        <p className='error'>{error.message}</p>}

                </form>
                
            </div>
        </div>
    );
};