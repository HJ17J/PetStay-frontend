-- Active: 1714700537319@@127.0.0.1@3306@sesac


show tables;
DESC user;
SELECT * FROM users;
INSERT INTO users (useridx, userid, userpw, name, address, img, usertype) VALUES (123, "sabb12", "123", "leo", "마포구", "https://picsum.photos/200/300", "sitter");
INSERT INTO users (useridx, userid, userpw, name, address, img, usertype) VALUES (132, "sabb12", "123", "leo", "마포구", "https://picsum.photos/200/300", "sitter");
INSERT INTO users (useridx, userid, userpw, name, address, img, usertype) VALUES (122, "sabb12", "123", "leo", "마포구", "https://picsum.photos/200/300", "sitter");

DESC sitters;
SELECT * FROM sitters;

INSERT INTO sitters (id, type, license, career, oneLineIntro, selfIntroduction, pay, confirm, useridx) VALUES (2, "2", "안녕하세요", "study", "hi", "asdf", 1200, true, 123);
