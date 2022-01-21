import './styles.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


export default function Login() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const [userLogin, setUserLogin] = useState({
        email: '',
        senha: ''
    });

    const [error, setError] = useState({
        message: ''
    })

     async function handleSubmit(event) {
         event.preventDefault();

         const requestOptions = {
             method: 'POST',
             headers: {
                 'content-type': 'application/json'
             },
             body: JSON.stringify(userLogin)
         }

         const request = await fetch('http://localhost:2700/users/login', requestOptions);
         const response = await request.json();

         if (request.status !== 200) {
             setError(response);
             return console.log(response);
         };

         localStorage.setItem('token', response);

         setUserLogin({
             email: '',
             senha: ''
         });

        return  navigate('/');
    };

    function handleInput(event) {
        const inputType = event.target.type;
        setError('');


        if (inputType === 'email') {
            const inputValue = event.target.value;
            setUserLogin({
                ...userLogin,
                email: inputValue
            });
        };

        if (inputType === 'password') {
            const inputValue = event.target.value;
            setUserLogin({
                ...userLogin,
                senha: inputValue
            });
        };
    };


    useEffect(() => {
        if (token) {
            return navigate('/');
        };
    },['login']);


    return (
        <div className='login-container'>
           
            <form
                className='login-form'
                onSubmit={(event) => handleSubmit(event)}>
                    
                     {error && <p className='error'>{error.message}</p>}

                <label>Email</label>
                <input
                    type="email"
                    value={userLogin.email}
                    onChange={(event) => handleInput(event)}
                    required />

                
                <label>Senha</label>
                <input
                    type="password"
                    value={userLogin.senha}
                    onChange={(event) => handleInput(event)}
                    required />
                
                <button>Login</button>
            </form>
            
            <button
                className='subscribe-button'
                onClick={() => navigate('/subscribe')}
            >Cadastre-se
            </button>

        </div>
    );
};