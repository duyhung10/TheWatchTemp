-- liquibase formatted sql
-- changeset phuongnd:000004
INSERT INTO base_user_role (user_id, role_id)
SELECT tbUser.id, 2 FROM base_users AS tbUser
WHERE tbUser.id > 2 AND ((SELECT count(*) FROM base_user_role WHERE user_id = tbUser.id AND role_id = 2) = 0);