-- liquibase formatted sql
-- changeset phuongnd:000005

--------------------------------------------------
--------------------------------------------------
-- Delete privileges of `ROLE_IMP_EXP_STAFF_L1` --
--------------------------------------------------
--------------------------------------------------

-- Delete privileges: Warehouse Create, Update, Delete, Super
DELETE FROM `base_role_privilege`
WHERE role_id in (SELECT id AS role_id FROM base_roles WHERE name = 'ROLE_IMP_EXP_STAFF_L1')
AND privilege_id IN ( SELECT id AS priv_id FROM base_privileges
WHERE name IN ('priv_wh_Warehouse_create', 'priv_wh_Warehouse_update', 'priv_wh_Warehouse_delete', 'priv_wh_Warehouse_super'));

-- Delete privileges: Route Create, Update, Delete, Super
DELETE FROM `base_role_privilege`
WHERE role_id in (SELECT id AS role_id FROM base_roles WHERE name = 'ROLE_IMP_EXP_STAFF_L1')
AND privilege_id IN ( SELECT id AS priv_id FROM base_privileges
WHERE name IN ('priv_wh_Route_create', 'priv_wh_Route_update', 'priv_wh_Route_delete', 'priv_wh_Route_super'));

-- Delete privileges: Sequence Create, Update, Delete, Super
DELETE FROM `base_role_privilege`
WHERE role_id in (SELECT id AS role_id FROM base_roles WHERE name = 'ROLE_IMP_EXP_STAFF_L1')
AND privilege_id IN ( SELECT id AS priv_id FROM base_privileges
WHERE name IN ('priv_base_Sequence_create', 'priv_base_Sequence_update', 'priv_base_Sequence_delete', 'priv_base_Sequence_super'));

-- Delete privileges: OperationType Create, Update, Delete, Super
DELETE FROM `base_role_privilege`
WHERE role_id in (SELECT id AS role_id FROM base_roles WHERE name = 'ROLE_IMP_EXP_STAFF_L1')
AND privilege_id IN ( SELECT id AS priv_id FROM base_privileges
WHERE name IN ('priv_wh_OperationType_create', 'priv_wh_OperationType_update', 'priv_wh_OperationType_delete', 'priv_wh_OperationType_super'));

-- Delete privileges: Adjustment Create, Update, Delete, Super
DELETE FROM `base_role_privilege`
WHERE role_id in (SELECT id AS role_id FROM base_roles WHERE name = 'ROLE_IMP_EXP_STAFF_L1')
AND privilege_id IN ( SELECT id AS priv_id FROM base_privileges
WHERE name IN ('priv_wh_AdjustmentInput_create', 'priv_wh_AdjustmentInput_update', 'priv_wh_AdjustmentInput_delete', 'priv_wh_AdjustmentInput_super'));

DELETE FROM `base_role_privilege`
WHERE role_id in (SELECT id AS role_id FROM base_roles WHERE name = 'ROLE_IMP_EXP_STAFF_L1')
AND privilege_id IN ( SELECT id AS priv_id FROM base_privileges
WHERE name IN ('priv_wh_AdjustmentDetails_create', 'priv_wh_AdjustmentDetails_update', 'priv_wh_AdjustmentDetails_delete', 'priv_wh_AdjustmentDetails_super'));

-- Delete privileges: User Privilege
DELETE FROM `base_role_privilege`
WHERE role_id in (SELECT id AS role_id FROM base_roles WHERE name = 'ROLE_IMP_EXP_STAFF_L1')
AND privilege_id IN ( SELECT id AS priv_id FROM base_privileges WHERE name LIKE 'priv_base_User%');

-- Delete privileges: Role Privilege
DELETE FROM `base_role_privilege`
WHERE role_id in (SELECT id AS role_id FROM base_roles WHERE name = 'ROLE_IMP_EXP_STAFF_L1')
AND privilege_id IN ( SELECT id AS priv_id FROM base_privileges WHERE name LIKE 'priv_base_Role%');

-- Delete privileges: Privilege
DELETE FROM `base_role_privilege`
WHERE role_id in (SELECT id AS role_id FROM base_roles WHERE name = 'ROLE_IMP_EXP_STAFF_L1')
AND privilege_id IN ( SELECT id AS priv_id FROM base_privileges WHERE name LIKE 'priv_base_Privilege%');

--------------------------------------------------
--------------------------------------------------
-- Delete privileges of `ROLE_IMP_EXP_STAFF_L2` --
--------------------------------------------------
--------------------------------------------------

-- Delete privileges: Transfer Create, Update, Delete, Super
DELETE FROM `base_role_privilege`
WHERE role_id in (SELECT id AS role_id FROM base_roles WHERE name = 'ROLE_IMP_EXP_STAFF_L2')
AND privilege_id IN ( SELECT id AS priv_id FROM base_privileges
WHERE name IN ('priv_wh_Transfer_create', 'priv_wh_Transfer_update', 'priv_wh_Transfer_delete', 'priv_wh_Transfer_super'));

-- Delete privileges: Warehouse Create, Update, Delete, Super
DELETE FROM `base_role_privilege`
WHERE role_id in (SELECT id AS role_id FROM base_roles WHERE name = 'ROLE_IMP_EXP_STAFF_L2')
AND privilege_id IN ( SELECT id AS priv_id FROM base_privileges
WHERE name IN ('priv_wh_Warehouse_create', 'priv_wh_Warehouse_update', 'priv_wh_Warehouse_delete', 'priv_wh_Warehouse_super'));

-- Delete privileges: Location Create, Update, Delete, Super
DELETE FROM `base_role_privilege`
WHERE role_id in (SELECT id AS role_id FROM base_roles WHERE name = 'ROLE_IMP_EXP_STAFF_L2')
AND privilege_id IN ( SELECT id AS priv_id FROM base_privileges
WHERE name IN ('priv_wh_Warehouse_create', 'priv_wh_Warehouse_update', 'priv_wh_Warehouse_delete', 'priv_wh_Warehouse_super'));

-- Delete privileges: Location Create, Update, Delete, Super
DELETE FROM `base_role_privilege`
WHERE role_id in (SELECT id AS role_id FROM base_roles WHERE name = 'ROLE_IMP_EXP_STAFF_L2')
AND privilege_id IN ( SELECT id AS priv_id FROM base_privileges
WHERE name IN ('priv_wh_Location_create', 'priv_wh_Location_update', 'priv_wh_Location_delete', 'priv_wh_Location_super'));

-- Delete privileges: Route Create, Update, Delete, Super
DELETE FROM `base_role_privilege`
WHERE role_id in (SELECT id AS role_id FROM base_roles WHERE name = 'ROLE_IMP_EXP_STAFF_L2')
AND privilege_id IN ( SELECT id AS priv_id FROM base_privileges
WHERE name IN ('priv_wh_Route_create', 'priv_wh_Route_update', 'priv_wh_Route_delete', 'priv_wh_Route_super'));

-- Delete privileges: Sequence Create, Update, Delete, Super
DELETE FROM `base_role_privilege`
WHERE role_id in (SELECT id AS role_id FROM base_roles WHERE name = 'ROLE_IMP_EXP_STAFF_L2')
AND privilege_id IN ( SELECT id AS priv_id FROM base_privileges
WHERE name IN ('priv_base_Sequence_create', 'priv_base_Sequence_update', 'priv_base_Sequence_delete', 'priv_base_Sequence_super'));

-- Delete privileges: OperationType Create, Update, Delete, Super
DELETE FROM `base_role_privilege`
WHERE role_id in (SELECT id AS role_id FROM base_roles WHERE name = 'ROLE_IMP_EXP_STAFF_L2')
AND privilege_id IN ( SELECT id AS priv_id FROM base_privileges
WHERE name IN ('priv_wh_OperationType_create', 'priv_wh_OperationType_update', 'priv_wh_OperationType_delete', 'priv_wh_OperationType_super'));

-- Delete privileges: Package Create, Update, Delete, Super
DELETE FROM `base_role_privilege`
WHERE role_id in (SELECT id AS role_id FROM base_roles WHERE name = 'ROLE_IMP_EXP_STAFF_L2')
AND privilege_id IN ( SELECT id AS priv_id FROM base_privileges
WHERE name IN ('priv_wh_Package_create', 'priv_wh_Package_update', 'priv_wh_Package_delete', 'priv_wh_Package_super'));

-- Delete privileges: UID/Serial Create, Update, Delete, Super
DELETE FROM `base_role_privilege`
WHERE role_id in (SELECT id AS role_id FROM base_roles WHERE name = 'ROLE_IMP_EXP_STAFF_L2')
AND privilege_id IN ( SELECT id AS priv_id FROM base_privileges
WHERE name IN ('priv_wh_Lot_create', 'priv_wh_Lot_update', 'priv_wh_Lot_delete', 'priv_wh_Lot_super'));

-- Delete privileges: Report Create, Update, Delete, Super
DELETE FROM `base_role_privilege`
WHERE role_id in (SELECT id AS role_id FROM base_roles WHERE name = 'ROLE_IMP_EXP_STAFF_L2')
AND privilege_id IN ( SELECT id AS priv_id FROM base_privileges
WHERE name IN ('priv_wh_Inventory_create', 'priv_wh_Inventory_update', 'priv_wh_Inventory_delete', 'priv_wh_Inventory_super'));

DELETE FROM `base_role_privilege`
WHERE role_id in (SELECT id AS role_id FROM base_roles WHERE name = 'ROLE_IMP_EXP_STAFF_L2')
AND privilege_id IN ( SELECT id AS priv_id FROM base_privileges
WHERE name IN ('priv_base_FilterStorage_create', 'priv_base_FilterStorage_update', 'priv_base_FilterStorage_delete', 'priv_base_FilterStorage_super'));

DELETE FROM `base_role_privilege`
WHERE role_id in (SELECT id AS role_id FROM base_roles WHERE name = 'ROLE_IMP_EXP_STAFF_L2')
AND privilege_id IN ( SELECT id AS priv_id FROM base_privileges
WHERE name IN ('priv_wh_SynchronizedReport_create', 'priv_wh_SynchronizedReport_update', 'priv_wh_SynchronizedReport_delete', 'priv_wh_SynchronizedReport_super'));

-- Delete privileges: Adjustment Create, Update, Delete, Super
DELETE FROM `base_role_privilege`
WHERE role_id in (SELECT id AS role_id FROM base_roles WHERE name = 'ROLE_IMP_EXP_STAFF_L2')
AND privilege_id IN ( SELECT id AS priv_id FROM base_privileges
WHERE name IN ('priv_wh_AdjustmentInput_create', 'priv_wh_AdjustmentInput_update', 'priv_wh_AdjustmentInput_delete', 'priv_wh_AdjustmentInput_super'));

DELETE FROM `base_role_privilege`
WHERE role_id in (SELECT id AS role_id FROM base_roles WHERE name = 'ROLE_IMP_EXP_STAFF_L2')
AND privilege_id IN ( SELECT id AS priv_id FROM base_privileges
WHERE name IN ('priv_wh_AdjustmentDetails_create', 'priv_wh_AdjustmentDetails_update', 'priv_wh_AdjustmentDetails_delete', 'priv_wh_AdjustmentDetails_super'));

-- Delete privileges: Scrap Create, Update, Delete, Super
DELETE FROM `base_role_privilege`
WHERE role_id in (SELECT id AS role_id FROM base_roles WHERE name = 'ROLE_IMP_EXP_STAFF_L2')
AND privilege_id IN ( SELECT id AS priv_id FROM base_privileges
WHERE name IN ('priv_wh_Scrap_create', 'priv_wh_Scrap_update', 'priv_wh_Scrap_delete', 'priv_wh_Scrap_super'));

-- Delete privileges: User Privilege
DELETE FROM `base_role_privilege`
WHERE role_id in (SELECT id AS role_id FROM base_roles WHERE name = 'ROLE_IMP_EXP_STAFF_L2')
AND privilege_id IN ( SELECT id AS priv_id FROM base_privileges WHERE name LIKE 'priv_base_User%');

-- Delete privileges: Role Privilege
DELETE FROM `base_role_privilege`
WHERE role_id in (SELECT id AS role_id FROM base_roles WHERE name = 'ROLE_IMP_EXP_STAFF_L2')
AND privilege_id IN ( SELECT id AS priv_id FROM base_privileges WHERE name LIKE 'priv_base_Role%');

-- Delete privileges: Privilege
DELETE FROM `base_role_privilege`
WHERE role_id in (SELECT id AS role_id FROM base_roles WHERE name = 'ROLE_IMP_EXP_STAFF_L2')
AND privilege_id IN ( SELECT id AS priv_id FROM base_privileges WHERE name LIKE 'priv_base_Privilege%');