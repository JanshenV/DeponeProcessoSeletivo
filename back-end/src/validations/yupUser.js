const yup = require('./yup');

const yupCreateUser = yup.object().shape({
    nome: yup.string().required().min(3),
    email: yup.string().email().required(),
    senha: yup.string().min(6).required(),
    telefone: yup.string().min(11).max(11)
});

const yupEditUser = yup.object().shape({
    nome: yup.string(),
    email: yup.string().email(),
    senha: yup.string(),
    telefone: yup.string()
});

const yupUserLogin = yup.object().shape({
    email: yup.string().email().required(),
    senha: yup.string().min(6).required()
});



module.exports = {
    yupCreateUser,
    yupEditUser,
    yupUserLogin
}