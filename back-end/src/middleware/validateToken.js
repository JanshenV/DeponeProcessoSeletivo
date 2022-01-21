const knex = require('../database/connection');
const jwt = require('jsonwebtoken');


async function ValidateToken(req, res, next) {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(403).json({
            message: 'Não autorizado.'
        });
    };

    try {
        const token = authorization.replace('Bearer ', '').trim();
        const { id } = jwt.verify(token, process.env.SECRET_JWT);

        const user = await knex('users')
            .where({ id })
            .first();

        if (!user) {
            return res.status(404).json({
                message: 'Usuário não encontrado.'
            });
        };

        const { senha: _, ...userData } = user;
        req.user = userData;

        next();

    } catch ({ message }) {
        return res.status(400).json({
            message
        });
    };
};


module.exports = {
    ValidateToken
}