create database if not exists mini_instagram;

create table users (
	id uuid primary key default gen_random_uuid(),
	username varchar(40) unique,
	password varchar(255) not null,
	email varchar(254) unique not null,
	firstname varchar(32),
	lastname varchar(32),
	avatar varchar(255),
	birthday timestamptz,
	created_at timestamptz default current_timestamp
);

create table relations (
	id uuid primary key default gen_random_uuid(),
	follower_id uuid references users(id),
	followee_id uuid references users(id),
	created_at timestamptz default current_timestamp
);

ALTER TABLE relations
ADD CONSTRAINT relations_follower_followee_unique
UNIQUE ( follower_id, followee_id );

CREATE OR REPLACE FUNCTION validate_username()
RETURNS TRIGGER AS $$
BEGIN

	-- Run only if username is changed
	IF NEW.username IS DISTINCT FROM OLD.username THEN

		IF NEW.username !~ '^(?=.{5,40}$)[a-z]+(_[a-z]+)*(_[0-9]+|[0-9]*)$' THEN

			RAISE EXCEPTION 'Invalid username format: %', NEW.username
				USING ERRCODE = '22023'
		END IF
	END IF

	RETURN NEW
END
$$ LANGUAGE plpgsql
;

CREATE TRIGGER users_validate_username
BEFORE UPDATE OF username
ON users
FOR EACH ROW
EXECUTE FUNCTION validate_username();