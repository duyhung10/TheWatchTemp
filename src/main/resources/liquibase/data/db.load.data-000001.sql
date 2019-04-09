-- liquibase formatted sql
-- changeset vietnq:000001
INSERT INTO base_roles (id,name,description) VALUES (1,'ROLE_ADMIN','Admin role');
INSERT INTO base_roles (id,name,description) VALUES (2,'ROLE_USER','User role');
INSERT INTO base_users (id,email,password) VALUES (1,'admin','$2a$10$xBgWuEPtOrSsdyvNJU9Fourp/c5m3Mk24N1su4uH.69xNpCEgCsmG');
INSERT INTO base_user_role (user_id,role_id) VALUES (1,1);