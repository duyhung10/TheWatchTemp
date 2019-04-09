-- liquibase formatted sql
-- changeset phuongnd:000003
INSERT INTO `base_roles` (name, description, created_by) VALUES
 ('ROLE_WAREHOUSE_MANAGER','Quản lý toàn bộ qui trình nhập xuất kho vật tư, số liệu tồn kho, các kho vật lý','admin'),
 ('ROLE_IMP_EXP_STAFF_L1','Nhân viên phụ trách thực hiện qui trình nhập xuất kho có quyền sửa','admin'),
 ('ROLE_IMP_EXP_STAFF_L2','Nhân viên phụ trách thực hiện qui trình nhập xuất kho không có quyền sửa','admin');


DELETE FROM base_role_privilege WHERE role_id IN
(SELECT id FROM base_roles WHERE name != 'ROLE_ADMIN' and name != 'ROLE_USER');

INSERT INTO base_role_privilege (role_id, privilege_id)
(SELECT base_roles.id AS role_id, base_privileges.id AS priv_id
FROM base_roles CROSS JOIN base_privileges
WHERE base_roles.name != 'ROLE_ADMIN' AND base_roles.name != 'ROLE_USER'
ORDER BY role_id, priv_id);