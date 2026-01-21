CREATE TABLE users(
	id integer primary key autoincrement,
	username varchar not null,
	password varchar not null,

	constraint uk_username unique (username)
);

CREATE TABLE tasks(
	id integer primary key autoincrement,
	title varchar not null,
	description varchar default null,
	finished boolean not null default false,
	user_id varchar not null,

	constraint fk_user_id foreign key (user_id) references users(id)
);

insert into users(id, username, password) values
(1, 'user', '123'),
(2, 'user2', '456');

insert into tasks(title, description, 'user_id') values
('Sleep', 'i need to sleep today', 1),
('Work',  'i need to work today', 1),
('Eat',   'i need to eat today', 1),
('Play',  'i would like to play today', 1),
('Sleep', 'i need to sleep today too', 2),
('Work',  'i need to work today too', 2),
('Eat',   'i need to eat today too', 2),
('Play',  'i would like to play today too', 2);
