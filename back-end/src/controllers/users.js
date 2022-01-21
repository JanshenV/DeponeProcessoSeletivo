const knex = require('../database/connection');
const bcrypt = require('bcrypt');
const {
    yupCreateUser,
    yupEditUser,
    yupUserLogin
} = require('../validations/yupUser');
const jwt = require('jsonwebtoken');


async function CreateUser(req, res) {
    const {
        nome,
        email,
        senha,
        telefone
    } = req.body;

    try {
        await yupCreateUser.validate(req.body);

        const existingEmail = await knex('users')
            .where({ email })
            .first();

        const existingTelefone = await knex('users')
            .where({ telefone })
            .first();

        if (existingEmail || existingTelefone) {
            return res.status(400).json({
                message: 'Email ou telefone já em uso por outro usuário.'
            });
        };

        const encryptedSenha = await bcrypt.hash(String(senha), 10);

        const newUserData = {
            nome,
            email,
            senha: encryptedSenha,
            telefone
        };

        await knex('users')
            .insert(newUserData);

        return res.status(201).json({
            message: 'Usuário cadastrado com sucesso.'
        });
    } catch ({ message }) {
        return res.status(400).json({
            message
        });
    };
};

async function UserLogin(req, res) {
    const { email, senha } = req.body;

    try {
        await yupUserLogin.validate(req.body);

        const user = await knex('users')
            .where({ email })
            .first();

        if (!user) {
            return res.status(404).json({
                message: 'Email ou senha não conferem.'
            });
        };

        const passwordCompare = await bcrypt.compare(String(senha), user.senha);

        if (!passwordCompare) {
            return res.status(404).json({
                message: 'Email ou senha não conferem.'
            });
        };

        const token = jwt.sign({ id: user.id },
            process.env.SECRET_JWT);

        return res.status(200).json(token);


    } catch ({ message }) {
        return res.status(400).json({
            message
        });
    };
};

async function UserProfile(req, res) {
    const user = req.user;

    return res.status(200).json(user);
}

async function EveryUser(req, res) {
    try {
        const users = await knex('users');
        const userWithoutSenha = [];

        for (const user of users) {
            const { senha: _, ...userData } = user;
            userWithoutSenha.push(userData);
        };

        return res.status(200).json(
            userWithoutSenha
        );
    } catch ({ message }) {
        return res.status(400).json({
            message
        });
    };
};

async function UnitUser(req, res) {
    const { id } = req.params;

    try {
        const user = await knex('users')
            .where({ id })
            .first();

        if (!user) {
            return res.status(404).json({
                message: 'Usuário não encontrado.'
            });
        };

        const { senha: _, ...userData } = user;

        return res.status(200).json(
            userData
        );

    } catch ({ message }) {
        return res.status(400).json({
            message
        });
    };
};

async function EditUser(req, res) {
    const {
        nome,
        email,
        senha,
        telefone
    } = req.body;

    const { id } = req.user;

    const reqBodyItems = Object.keys(req.body).length;
    if (reqBodyItems === 0) {
        return res.status(400).json({
            message: 'Ao menos um item é necessário para edição de usuário.'
        });
    };

    try {
        await yupEditUser.validate(req.body);

        const user = await knex('users')
            .where({ id })
            .first();

        if (email && email !== user.email) {
            const existingEmail = await knex('users')
                .where({ email })
                .first();

            if (existingEmail) {
                return res.status(400).json({
                    message: 'Email já em uso por outro usuário.'
                });
            };
        };

        if (telefone && telefone !== user.telefone) {
            const existingTelefone = await knex('users')
                .where({ telefone })
                .first();

            if (existingTelefone) {
                return res.status(400).json({
                    message: 'Telefone já em uso por outro usuário.'
                });
            };
        };

        let encryptedSenha;
        if (senha) {
            if (senha.length < 6) {
                return res.status(400).json({
                    message: 'Senha deve ter no mínimo 6 caractéres.'
                });
            };

            encryptedSenha = await bcrypt.hash(String(senha), 10);
        };

        const editUserData = {
            nome: nome ? nome : user.nome,
            email: email ? email : user.email,
            senha: senha ? encryptedSenha : user.senha,
            telefone: telefone ? telefone : user.telefone
        };

        await knex('users')
            .where({ id: user.id })
            .update(editUserData);


        return res.status(200).json({
            message: 'Usuário modificado.'
        });

    } catch ({ message }) {
        return res.status(400).json({
            message
        });
    };
};

async function DeleteUser(req, res) {
    const { id } = req.user;
    const { senha } = req.body;

    if (!senha || senha.length < 6) {
        return res.status(400).json({
            message: 'Senha tem de ter no mínimo 6 caractéres. '
        });
    };

    try {
        const user = await knex('users')
            .where({ id })
            .first();

        const passwordCompare = await bcrypt.compare(String(senha), user.senha);

        if (!passwordCompare) {
            return res.status(403).json({
                message: 'Senha não confere'
            });
        };

        await knex('users')
            .where({ id })
            .del();

        return res.status(200).json({
            message: 'Usuário deletado.'
        });

    } catch ({ message }) {
        return res.status(400).json({
            message
        });
    };
};


module.exports = {
    CreateUser,
    EditUser,
    EveryUser,
    UserLogin,
    UnitUser,
    DeleteUser,
    UserProfile
}