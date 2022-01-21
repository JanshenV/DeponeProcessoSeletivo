create database psDatabase;

create table users(
    id serial,
    nome text not null,
    email text unique not null,
    senha text not null,
    telefone text unique not null
)