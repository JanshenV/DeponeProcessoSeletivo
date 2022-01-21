import './styles.css';
import { useState } from 'react';


export default function ModalDelete({
    setModalDeleteUp,
    user,
    token,
    navigate
}) {

    const [confirmPassword, setConfirmPassword] = useState({
        senha: ''
    });
    const [inputUp, setInputUp] = useState(false);
    const [error, setError] = useState({
        message: ''
    });

       function handleInputValue(event) {
        const inputValue = event.target.value;
           setConfirmPassword({ senha: inputValue });
           setError('');
    };

    async function HandleDelete() {
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'Application/json',
                'Authorization': token
            },
            body: JSON.stringify(confirmPassword)
        };


        const request = await fetch('http://localhost:2700/users', requestOptions);
        const response = await request.json();

        if (request.status !== 200) {
            setError(response);
            return console.log(response);
        };

        setInputUp(false);
        setModalDeleteUp(false);
        localStorage.removeItem('token');
        navigate('/login');

    };

    return (
        <div className="delete-backdrop">
            <div className="modal-delete">

                <p className="title">Tem certeza que deseja deletar usuário {user.nome} ?</p>

                {error && <p className='error'>{error.message}</p>}

                {inputUp &&
                    <div className='confirm-password'>
                        <input
                            type="password"
                            value={confirmPassword.senha}
                            onChange={(event) => handleInputValue(event)}
                            placeholder='Confirme sua senha'
                        />

                        <button
                            className='cancel'
                            onClick={() => {
                                setInputUp(false)
                            }}
                        >
                            Cancelar
                        </button>

                        <button
                            className='confirm'
                            onClick={() => {
                                HandleDelete()
                            }}
                        >
                            Confirmar
                        </button>
                    </div>
                }

                {!inputUp &&
                    <div className="delete-buttons">
                        <button
                            className="confirm"
                            onClick={() => setInputUp(true)}
                        >
                            Confirmar
                        </button>

                        <button
                            className="cancel"
                            onClick={() => setModalDeleteUp(false)}
                        >
                            Cancelar
                        </button>
                    </div>}
            </div>
        </div>

    );
}