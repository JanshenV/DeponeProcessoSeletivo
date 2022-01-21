const express = require('express');
const routes = express();

const {
    CreateUser,
    EditUser,
    UserLogin,
    DeleteUser,
    EveryUser,
    UnitUser,
    UserProfile
} = require('./controllers/users');

const { ValidateToken } = require('./middleware/validateToken');

routes.get('/users', EveryUser);
routes.get('/users/:id', UnitUser);
routes.post('/users', CreateUser);
routes.post('/users/login', UserLogin);

routes.use(ValidateToken);

routes.get('/profile', UserProfile)
routes.put('/users', EditUser);
routes.delete('/users', DeleteUser);


module.exports = routes;