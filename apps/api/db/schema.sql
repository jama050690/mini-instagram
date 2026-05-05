create database if not exists mini_instagram;

create table users (
	id uuid primary key default gen_random_uuid(),
	username varchar(40) unique,
	password varchar(255) not null,
	email varchar(254) unique not null,
	firstname varchar(32),
	lastname varchar(32),
	avatar varchar(255),
	birthday timestamptz default current_timestamp
);
