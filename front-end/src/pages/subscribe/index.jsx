import './styles.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';



export default function Subscribe({ }) {
    
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const [subscribeData, setSubscribeData] = useState({
        nome: '',
        email: '',
        senha: '',
        telefone: ''
    });

    const [error, setError] = useState({
        message: ''
    });

   async  function handleSubmit(event) {
        event.preventDefault();

        const requestOptions = {
             method: 'POST',
             headers: {
                 'Content-Type': 'Application/Json'
             },
             body: JSON.stringify(subscribeData)
         }

         const request = await fetch('http://localhost:2700/users', requestOptions);
         const response = await request.json();

       if (request.status !== 201) {
           setError(response);
             return console.log(response);
         };

        setSubscribeData({
            nome: '',
            email: '',
            telefone: '',
            senha: ''
        });
       
         return navigate('/login');
    };

    function handleInputData(event) {
        const inputType = event.target.type;

        if (inputType === 'text') {
            const inputValue = event.target.value;
            setSubscribeData({
                ...subscribeData,
                nome: inputValue
            });
            return;
        };

          if (inputType === 'email') {
            const inputValue = event.target.value;
            setSubscribeData({
                ...subscribeData,
                email: inputValue
            });
            return;
        };

          if (inputType === 'number') {
            const inputValue = event.target.value;
            setSubscribeData({
                ...subscribeData,
                telefone: inputValue
            });
            return;
        };

          if (inputType === 'password') {
            const inputValue = event.target.value;
            setSubscribeData({
                ...subscribeData,
                senha: inputValue
            });
            return;
        };
    };

     useEffect(() => {
        if (token) {
            return navigate('/');
        };
    },['subscribe']);


    return (
        <div className='subscribe-container'>
            <form
                className='subscribe-form'
                onSubmit={(event) => handleSubmit(event)}>
                
                {error && <p className='error'>{error.message}</p>}
                
                <label>Nome</label>
                <input
                    type="text"
                    value={subscribeData.nome}
                    onChange={(event) => handleInputData(event)}
                    required />

                <label>Email</label>
                <input
                    type="email"
                    value={subscribeData.email}
                    onChange={(event) => handleInputData(event)}
                    required />

                <label>Telefone</label>
                <input
                    type="number"
                    value={subscribeData.telefone}
                    onChange={(event) => handleInputData(event)}
                    required />

                <label>Senha</label>
                <input
                    type="password"
                    value={subscribeData.senha}
                    onChange={(event) => handleInputData(event)}
                    required />

                <button>Cadastrar</button>
            </form>

            <div style={
                {
                    color: 'white',
                    fontSize: "20px"
                }
            }>
                Já possui cadastro?
                <button
                    className='login-button'
                    onClick={() => navigate('/Login')}
                >
                    Login
                </button>
            </div>
           
        </div>
    );
}