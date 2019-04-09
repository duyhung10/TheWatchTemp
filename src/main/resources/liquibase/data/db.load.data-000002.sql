-- liquibase formatted sql
-- changeset thangnc:000002
INSERT INTO `master_uom_categories`(id,name,parent_id,active) VALUES ('1', 'All', null, 1);
INSERT INTO `master_uom_categories`(id,name,parent_id,active) VALUES ('2', 'Unit', '1', 1);
INSERT INTO `master_uom_categories`(id,name,parent_id,active) VALUES ('3', 'Working time', '1', 1);
INSERT INTO `master_uom_categories`(id,name,parent_id,active) VALUES ('4', 'Length-Distance', '1', 1);
INSERT INTO `master_uom_categories`(id,name,parent_id,active) VALUES ('5', 'Length', '4', 1);
INSERT INTO `master_uom_categories`(id,name,parent_id,active) VALUES ('6', 'Distance', '4', 1);
INSERT INTO `master_uom_categories`(id,name,parent_id,active) VALUES ('7', 'Volume ', '1', 1);
INSERT INTO `master_uom_categories`(id,name,parent_id,active) VALUES ('8', 'Weight', '1', 1);