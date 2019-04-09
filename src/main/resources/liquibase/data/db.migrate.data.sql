SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for sys_part_category
-- ----------------------------
DROP TABLE IF EXISTS `sys_part_category`;
CREATE TABLE `sys_part_category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(225) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `level` int(1) NOT NULL DEFAULT '0',
  `code` varchar(13) DEFAULT NULL COMMENT 'prefix code cua danh muc',
  `tmp` text CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `created_by` varchar(50) DEFAULT NULL,
  `updated_by` varchar(50) DEFAULT NULL,
  `pn` varchar(5) DEFAULT NULL COMMENT 'ma cua danh muc',
  `full_pn` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `parent_id` (`parent_id`) USING BTREE,
  KEY `name` (`name`) USING BTREE,
  KEY `level` (`level`) USING BTREE,
  KEY `code` (`code`) USING BTREE
) ENGINE=FEDERATED CONNECTION='mysql://root:ssdc123!@10.1.30.138:3306/erp/sys_part_category'
	AUTO_INCREMENT=587 DEFAULT CHARSET=utf8;

truncate table master_product_categories;

insert into master_product_categories(name,parent_id,pn,created,updated,active)
values('PART',null,null,ROUND(UNIX_TIMESTAMP(NOW(3))*1000),ROUND(UNIX_TIMESTAMP(NOW(3))*1000),1);
insert into master_product_categories(name,parent_id,pn,created,updated,active)
values('SEMI',null,null,ROUND(UNIX_TIMESTAMP(NOW(3))*1000),ROUND(UNIX_TIMESTAMP(NOW(3))*1000),1);
insert into master_product_categories(name,parent_id,pn,created,updated,active)
values('FINAL PRODUCT',null,null,ROUND(UNIX_TIMESTAMP(NOW(3))*1000),ROUND(UNIX_TIMESTAMP(NOW(3))*1000),1);

-- select count(*) from sys_part_category

insert into master_product_categories(name,parent_id,pn,created,updated,old_id, parent_old_id,active)
select name,0,pn,ROUND(UNIX_TIMESTAMP(NOW(3))*1000),ROUND(UNIX_TIMESTAMP(NOW(3))*1000),id,parent_id,1
from sys_part_category;

-- select * from sys_part_category limit 10;

update master_product_categories T1 INNER JOIN master_product_categories T2 ON T1.parent_old_id = T2.old_id
set T1.parent_id = T2.id;

delete from master_product_categories where parent_id=0 and id>3 and parent_old_id > 0;
-- select * from master_product_categories where parent_id=2 and id>3;
update master_product_categories set parent_id=2 where name in ('Product','Other') and parent_id=0 and id>3;
update master_product_categories set parent_id=1 where parent_id=0 and id>3;

-- ----------------------------
-- Table structure for sys_part
-- ----------------------------
DROP TABLE IF EXISTS `sys_part`;
CREATE TABLE `sys_part` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `part_category_id` int(11) DEFAULT NULL,
  `image` int(11) DEFAULT NULL,
  `name` varchar(128) DEFAULT NULL,
  `description_pn` varchar(225) DEFAULT NULL,
  `vnpt_pn` varchar(100) DEFAULT NULL,
  `type` varchar(1) DEFAULT NULL,
  `semi_type` tinyint(1) DEFAULT '0' COMMENT '0 là kiểu linh kiện, 1 là kiểu bán thành phẩm',
  `datasheet` int(11) DEFAULT NULL,
  `material` longtext,
  `size` varchar(50) DEFAULT NULL,
  `operation_rate` int(11) DEFAULT NULL COMMENT 'ti le tieu hao x 100',
  `unit` int(11) DEFAULT NULL,
  `made_or_buy` tinyint(1) DEFAULT '1',
  `note` mediumtext,
  `updated_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `sub_desciption` varchar(512) DEFAULT NULL,
  `reference_price` float DEFAULT NULL,
  `selection_reason` varchar(512) DEFAULT NULL,
  `quality` int(1) DEFAULT '0' COMMENT '0: OK, 1: NOK',
  `old_partnumber` varchar(200) DEFAULT '',
  `packing_code_id` int(11) DEFAULT NULL COMMENT 'link sys_packing_code',
  `old_description_pn` varchar(255) DEFAULT NULL COMMENT 'description cũ của Part',
  `user_import` int(11) DEFAULT NULL,
  `date_import` datetime DEFAULT NULL,
  `file_import_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `vnpt_pn` (`vnpt_pn`) USING BTREE,
  KEY `idx_sys_part` (`part_category_id`) USING BTREE,
  KEY `name` (`name`) USING BTREE,
  KEY `description_pn` (`description_pn`) USING BTREE
) AUTO_INCREMENT=4315 DEFAULT CHARSET=utf8
ENGINE=FEDERATED CONNECTION='mysql://root:ssdc123!@10.1.30.138:3306/erp/sys_part';

truncate table master_products;

insert into master_products(name,description,category_id,old_name,created, updated,active,type,old_id, category_old_id)
select vnpt_pn,description_pn,0,old_partnumber,ROUND(UNIX_TIMESTAMP(NOW(3))*1000),ROUND(UNIX_TIMESTAMP(NOW(3))*1000),
1,0,id,part_category_id
from sys_part;

update master_products T1 INNER JOIN master_product_categories T2 ON T1.category_old_id = T2.old_id
set T1.category_id = T2.id;

-- CHAY TAY -- (lay Id cau query trc, lam param cho cau query tiep theo)
select * from master_product_categories where parent_id = 2 -- 4
select * from master_product_categories where parent_id in (4) -- 5, 35
select * from master_product_categories where parent_id in (5, 35)

update master_products set type = 2 where category_id in (4,6,100,101,104,181,187,189,202,222,232,234,240,243,279,300,323,327,336,356,440,442,451,468,482,490,36,44);
-- end chay tay

update master_products set type = 1 where type =0;
delete from master_products where category_id =0;

-- select * from master_product_categories
-- select count(*) from sys_part;
-- select * from sys_part limit 100;
-- select * from master_products
-- select * from sys_part

-- ----------------------------
-- Table structure for sys_product_line
-- ----------------------------
DROP TABLE IF EXISTS `sys_product_line`;
CREATE TABLE `sys_product_line` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `code` varchar(100) DEFAULT NULL,
  `description` text CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `parent_id` int(11) DEFAULT '0',
  `level` int(1) DEFAULT '0',
  `is_product` int(11) DEFAULT '1' COMMENT '=0: là line product, = 1: là product',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `image_id` int(11) DEFAULT NULL,
  `unit` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL COMMENT 'đơn vị sản phẩm: chiếc, cái, bộ...',
  `debit_account_identify` int(11) DEFAULT NULL COMMENT 'mã số định danh TK nợ',
  `credit_account_identify` int(11) DEFAULT NULL COMMENT 'mã số định danh TK có',
  `trade_name_product` varchar(255) DEFAULT NULL,
  `trade_code_product` varchar(255) DEFAULT NULL,
  `deleted` int(1) DEFAULT '0',
  `schematic_id` int(11) DEFAULT NULL COMMENT 'Import file',
  `geber_file_pcb_id` int(11) DEFAULT NULL COMMENT 'Import file co version',
  `schematic_version` varchar(250) DEFAULT NULL,
  `geber_file_pcb_version` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`id`)
) AUTO_INCREMENT=339 DEFAULT CHARSET=utf8
ENGINE=FEDERATED CONNECTION='mysql://root:ssdc123!@10.1.30.138:3306/erp/sys_product_line';

-- select * from sys_product_line limit 10;
-- CHAY TAY --
select MAX(id) from master_product_categories -- Max id: 468
select MAX(id) from master_products -- Max id: 3970

insert into master_product_categories(name,parent_id,pn,created,updated,old_id, parent_old_id,active)
select name,0,null,ROUND(UNIX_TIMESTAMP(NOW(3))*1000),ROUND(UNIX_TIMESTAMP(NOW(3))*1000),id,parent_id,1
from sys_product_line where is_product = 0;

update master_product_categories set parent_id = 3 where parent_id=0 and parent_old_id=0 and id > 3;

update master_product_categories T1 INNER JOIN master_product_categories T2 ON T1.parent_old_id = T2.old_id
set T1.parent_id = T2.id where T1.parent_id = 0 and T2.parent_id in (0,3);

-- select * from master_product_categories where parent_id = 0 and parent_old_id > 0 and id > 3;
-- select * from master_product_categories

-- PUSH Final product --> master_products

-- select * from sys_product_line where is_product = 1;
insert into master_products(name,description,category_id,old_name,created, updated,active,type,old_id, category_old_id)
select name,code,0,null,ROUND(UNIX_TIMESTAMP(NOW(3))*1000),ROUND(UNIX_TIMESTAMP(NOW(3))*1000),
1,3,id,parent_id
from sys_product_line where is_product = 1

-- CHAY TAY -- Insert Max id
update master_products T1 INNER JOIN master_product_categories T2 ON T1.category_old_id = T2.old_id
set T1.category_id = T2.id where T2.id > 468 and T1.id > 3970;

-- ----------------------------
-- Table structure for sys_product
-- ----------------------------
DROP TABLE IF EXISTS `sys_product`;
CREATE TABLE `sys_product` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category_id` int(11) DEFAULT NULL COMMENT 'category của product',
  `name` varchar(200) DEFAULT NULL,
  `code` varchar(100) DEFAULT NULL,
  `vnpt_pn` varchar(50) DEFAULT NULL COMMENT 'part number',
  `version` int(11) DEFAULT NULL,
  `description` text,
  `made_buy` tinyint(4) DEFAULT '1' COMMENT '1-made\r\n0-buy',
  `schematic_id` int(11) DEFAULT NULL COMMENT 'Import file',
  `geber_file_pcb_id` int(11) DEFAULT NULL COMMENT 'Import file co version',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `part_number` varchar(20) DEFAULT NULL,
  `image_id` int(11) DEFAULT NULL,
  `deleted` int(1) DEFAULT '0',
  `unit` varchar(50) DEFAULT NULL COMMENT 'đơn vị sản phẩm: chiếc, cái, bộ...',
  `debit_account_identify` int(11) DEFAULT NULL COMMENT 'mã số định danh TK nợ',
  `credit_account_identify` int(11) DEFAULT NULL COMMENT 'mã số định danh TK có',
  `schematic_version` varchar(250) DEFAULT NULL,
  `geber_file_pcb_version` varchar(250) DEFAULT NULL,
  `trade_name_product` varchar(255) DEFAULT NULL,
  `trade_code_product` varchar(255) DEFAULT NULL,
  `sys_product_line_id` int(11) DEFAULT NULL,
  `name_product` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) AUTO_INCREMENT=68 DEFAULT CHARSET=utf8
ENGINE=FEDERATED CONNECTION='mysql://root:ssdc123!@10.1.30.138:3306/erp/sys_product';

truncate table master_product_versions;

-- select count(*) from sys_product;
-- select * from sys_product limit 10;
insert into master_product_versions(name, product_id, version, description, created, updated, old_id, product_old_id, active)
select name,0,version,code,ROUND(UNIX_TIMESTAMP(NOW(3))*1000),ROUND(UNIX_TIMESTAMP(NOW(3))*1000),
id,sys_product_line_id,1
from sys_product

-- CHAY TAY -- INSERT ID BEGIN FINAL PRODUCT CATEGORIES
update master_product_versions T1 INNER JOIN master_products T2 ON T1.product_old_id = T2.old_id
set T1.product_id = T2.id
where T2.id > 3970;

-- select * from master_product_versions

-- ----------------------------
-- Table structure for sys_manufacturer
-- ----------------------------
DROP TABLE IF EXISTS `sys_manufacturer`;
CREATE TABLE `sys_manufacturer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(300) COLLATE utf8_unicode_ci DEFAULT NULL,
  `logo` varchar(150) CHARACTER SET latin1 DEFAULT NULL,
  `address` varchar(150) CHARACTER SET latin1 DEFAULT NULL,
  `city` varchar(150) CHARACTER SET latin1 DEFAULT NULL,
  `state` varchar(150) CHARACTER SET latin1 DEFAULT NULL,
  `country_id` int(11) DEFAULT NULL,
  `contact_name` varchar(200) CHARACTER SET latin1 DEFAULT NULL,
  `position` varchar(150) CHARACTER SET latin1 DEFAULT NULL,
  `email` varchar(150) CHARACTER SET latin1 DEFAULT NULL,
  `phone` char(50) CHARACTER SET latin1 DEFAULT NULL,
  `title` varchar(150) CHARACTER SET latin1 DEFAULT NULL,
  `note` text CHARACTER SET latin1,
  `rate` int(11) DEFAULT NULL,
  `create_at` datetime DEFAULT NULL,
  `update_at` datetime DEFAULT NULL,
  `code` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `create_by` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `update_by` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `alias` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `description` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) AUTO_INCREMENT=380 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci
ENGINE=FEDERATED CONNECTION='mysql://root:ssdc123!@10.1.30.138:3306/erp/sys_manufacturer';

-- ----------------------------
-- Table structure for sys_supplier
-- ----------------------------
DROP TABLE IF EXISTS `sys_supplier`;
CREATE TABLE `sys_supplier` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(150) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `address` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `phone` char(50) DEFAULT NULL,
  `city` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `email` char(100) DEFAULT NULL,
  `contact_name` varchar(150) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `contact_email` varchar(200) DEFAULT NULL,
  `contact_phone` varchar(20) DEFAULT NULL,
  `contact_position` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `contact_description` text CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `rate_sample` varchar(200) DEFAULT NULL COMMENT 'danh gia chat luong linh kien sau khi test',
  `rate_leadtime` varchar(200) DEFAULT NULL,
  `rate_support` varchar(200) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `country_id` int(11) DEFAULT NULL,
  `website` varchar(150) DEFAULT NULL,
  `delivery_term_id` int(11) DEFAULT NULL,
  `title` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `fax` char(50) DEFAULT NULL,
  `follower_id` int(11) DEFAULT NULL,
  `create_at` datetime DEFAULT NULL,
  `update_at` datetime DEFAULT NULL,
  `rate` int(11) DEFAULT NULL,
  `image_id` int(11) DEFAULT NULL,
  `create_by` varchar(255) DEFAULT NULL,
  `update_by` varchar(255) DEFAULT NULL,
  `alias` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `contact_address` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) AUTO_INCREMENT=158 DEFAULT CHARSET=utf8
ENGINE=FEDERATED CONNECTION='mysql://root:ssdc123!@10.1.30.138:3306/erp/sys_supplier';

truncate table master_companies;
-- select * from sys_manufacturer
-- select count(*) from sys_manufacturer
insert into master_companies(name, email,city,country_id,type,address_line_1, alias, company_code,phone_number,
fax_number,rating, created,updated,old_id,active)
select name,email,city, null,'man',address,alias,code,phone,null,rate,
ROUND(UNIX_TIMESTAMP(NOW(3))*1000),ROUND(UNIX_TIMESTAMP(NOW(3))*1000),id,1
from sys_manufacturer;

-- select * from sys_supplier
-- select count(*) from sys_supplier
insert into master_companies(name, email,city,country_id,type,address_line_1, alias, company_code,phone_number,
fax_number,rating, created,updated,old_id,active)
select name,email,city, null,'sup',address,alias,NULL,phone,null,rate,
ROUND(UNIX_TIMESTAMP(NOW(3))*1000),ROUND(UNIX_TIMESTAMP(NOW(3))*1000),id,1
from sys_supplier;

-- select * from master_companies

-- ---------------------------master_product_manpn-------------------------------------------------------------

-- ----------------------------
-- Table structure for sys_part_manufacturer
-- ----------------------------
DROP TABLE IF EXISTS `sys_part_manufacturer`;
CREATE TABLE `sys_part_manufacturer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `part_id` int(11) DEFAULT NULL,
  `comment` mediumtext,
  `consumption_rate` float DEFAULT NULL COMMENT 'Ti le tieu hao',
  `manufacturer_id` int(11) DEFAULT NULL,
  `manufacturer_pn` varchar(255) DEFAULT NULL,
  `vnpt_man_pn_backup` varchar(26) DEFAULT NULL,
  `vote` int(1) DEFAULT '0',
  `type` varchar(1) DEFAULT 'm',
  `made_or_buy` int(1) DEFAULT '0' COMMENT '0: made,1 :buy',
  `vnpt_pn` varchar(100) DEFAULT NULL,
  `image` int(11) DEFAULT NULL,
  `datasheet` int(11) DEFAULT NULL,
  `size` int(11) DEFAULT NULL,
  `sub_desciption` text,
  `reference_price` float DEFAULT NULL,
  `selection_reason` varchar(512) DEFAULT NULL,
  `quality` int(1) DEFAULT '0' COMMENT '0: OK, 1: NOK',
  `vnpt_man_pn` varchar(26) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_sys_part_manufacter` (`part_id`) USING BTREE
) AUTO_INCREMENT=16516 DEFAULT CHARSET=utf8
ENGINE=FEDERATED CONNECTION='mysql://root:ssdc123!@10.1.30.138:3306/erp/sys_part_manufacturer';

truncate table master_product_manpn;
-- select * from sys_part_manufacturer;
-- select count(*) from sys_part_manufacturer;
insert into master_product_manpn(manufacturer_id,product_id,manufacturer_pn,created,updated,old_id,manufacturer_old_id,product_old_id,active)
select 0,0,IF((manufacturer_pn is null) OR (LENGTH(manufacturer_pn) = 0), NULL, TRIM(manufacturer_pn)),
ROUND(UNIX_TIMESTAMP(NOW(3))*1000),ROUND(UNIX_TIMESTAMP(NOW(3))*1000),id,manufacturer_id,part_id,1
from sys_part_manufacturer;
-- select * from master_product_manpn;

update master_product_manpn T1 INNER JOIN master_products T2 ON T1.product_old_id = T2.old_id
set T1.product_id = T2.id where T2.type in (1,2);

-- select * from master_product_manpn where product_id = 0;
delete from master_product_manpn where product_id = 0;

update master_product_manpn T1 INNER JOIN master_companies T2 ON T1.manufacturer_old_id = T2.old_id
set T1.manufacturer_id = T2.id where T2.type = 'man';

-- REMOVE DUPLICATE
DROP TABLE IF EXISTS master_product_manpn_duplicate;
CREATE TABLE master_product_manpn_duplicate(
	id BIGINT,
	id_min BIGINT,
	product_id BIGINT,
	manufacturer_id BIGINT,
	manufacturer_pn VARCHAR(500)
) DEFAULT CHARSET=utf8 ENGINE=INNODB;

DROP TABLE IF EXISTS master_product_manpn_min;
CREATE TABLE master_product_manpn_min(
	id BIGINT,
	id_min BIGINT,
	product_id BIGINT,
	manufacturer_id BIGINT,
	manufacturer_pn VARCHAR(500)
) DEFAULT CHARSET=utf8 ENGINE=INNODB;

CREATE TABLE master_product_manpn_copy AS SELECT * FROM master_product_manpn;

update master_product_manpn_copy set manufacturer_pn='' where manufacturer_pn is null;

insert into master_product_manpn_duplicate(id, product_id, manufacturer_id, manufacturer_pn)
select id, product_id, manufacturer_id, manufacturer_pn from master_product_manpn_copy
where (product_id, manufacturer_id, manufacturer_pn) in (
	select product_id, manufacturer_id, manufacturer_pn
	from master_product_manpn_copy
	group by product_id, manufacturer_id, manufacturer_pn having count(id) > 1
) ;

insert into master_product_manpn_min(product_id, manufacturer_id, manufacturer_pn, id_min)
select product_id, manufacturer_id, manufacturer_pn, min(id)
from master_product_manpn_copy
group by product_id, manufacturer_id, manufacturer_pn having count(id) > 1;

update master_product_manpn_duplicate T1 INNER JOIN master_product_manpn_min T2
ON T1.product_id = T2.product_id AND T1.manufacturer_id = T2.manufacturer_id AND T1.manufacturer_pn = T2.manufacturer_pn
SET T1.id_min = T2.id_min;

-- select * from master_product_manpn_duplicate order by id_min;

delete from master_product_manpn
where id in (select id from master_product_manpn_duplicate)
and id not in (select id_min from master_product_manpn_duplicate);

drop table if exists master_product_manpn_copy;
drop table if exists master_product_manpn_min;
drop table if exists master_product_manpn_duplicate;

-- --------------------master_product_manufacturers-------------------------------
truncate table master_product_manufacturers;

insert into master_product_manufacturers(manufacturer_id,product_id,created, updated,active)
select manufacturer_id,product_id,created, updated,active
from master_product_manpn;

-- select * from master_companies

update master_product_manufacturers T1
INNER JOIN master_products T2 ON T1.product_id = T2.id
INNER JOIN master_companies T3 ON T1.manufacturer_id = T3.id
set internal_reference = CONCAT(T2.name,IF((company_code is null) OR (LENGTH(company_code) = 0), NULL, TRIM(company_code)))
where T3.type = 'man';
-- select * from master_product_manufacturers

-- delete duplicate product_id, manufacturer_id
delete from master_product_manufacturers
where (product_id, manufacturer_id) in
(select product_id, manufacturer_id from (select product_id, manufacturer_id from master_product_manufacturers
GROUP BY product_id, manufacturer_id having count(id) > 1) a)
and id not in (select id from (
select min(id) as id from master_product_manufacturers
GROUP BY product_id, manufacturer_id having count(id) > 1) b);

-- -------------------------------master_product_suppliers-----------------------------
-- ----------------------------
-- Table structure for sys_supplier_manufacturer_part
-- ----------------------------
DROP TABLE IF EXISTS `sys_supplier_manufacturer_part`;
CREATE TABLE `sys_supplier_manufacturer_part` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `supplier_id` int(11) DEFAULT NULL,
  `manufacturer_id` int(11) DEFAULT NULL,
  `part_id` int(11) DEFAULT NULL,
  `vnpt_pn` varchar(200) DEFAULT NULL COMMENT 'Phuc vu search, kho phai joint bang',
  `price` decimal(10,0) DEFAULT NULL,
  `comment` mediumtext,
  `spq_id` int(11) DEFAULT NULL,
  `moq_id` int(11) DEFAULT NULL,
  `lead_time` int(11) DEFAULT NULL,
  `payment_term_id` int(11) DEFAULT NULL,
  `manufacturer_pn` varchar(200) DEFAULT NULL COMMENT 'Mã manufacturer ứng với từng linh kiện',
  `rate` int(11) DEFAULT '0',
  `rate_comment` mediumtext,
  `code` varchar(200) DEFAULT NULL COMMENT 'Mã sau khi nối vnpt vào hãng sản xuất',
  PRIMARY KEY (`id`),
  KEY `idx_sys_part_supplier` (`part_id`) USING BTREE,
  KEY `idx_sys_part_supplier_0` (`supplier_id`) USING BTREE,
  KEY `idx_sys_part_supplier_1` (`manufacturer_id`) USING BTREE
) AUTO_INCREMENT=2189 DEFAULT CHARSET=utf8
ENGINE=FEDERATED CONNECTION='mysql://root:ssdc123!@10.1.30.138:3306/erp/sys_supplier_manufacturer_part';

truncate table master_product_suppliers;

insert into master_product_suppliers(product_id,supplier_id, manufacturer_id,old_id,product_old_id,supplier_old_id,manufacturer_old_id,
created, updated,active)
select 0,0,0,id,part_id,supplier_id,manufacturer_id,ROUND(UNIX_TIMESTAMP(NOW(3))*1000),ROUND(UNIX_TIMESTAMP(NOW(3))*1000),1
from sys_supplier_manufacturer_part;
-- select * from sys_supplier_manufacturer_part;

update master_product_suppliers T1 INNER JOIN master_products T2 ON T1.product_old_id = T2.old_id
set T1.product_id = T2.id where T2.type = 1;
-- select * from master_product_manpn where product_id = 0;
delete from master_product_suppliers where product_id = 0;

update master_product_suppliers T1 INNER JOIN master_companies T2 ON T1.manufacturer_old_id = T2.old_id
set T1.manufacturer_id = T2.id where T2.type = 'man';
update master_product_suppliers T1 INNER JOIN master_companies T2 ON T1.supplier_old_id = T2.old_id
set T1.supplier_id = T2.id where T2.type = 'sup';

-- select * from master_product_suppliers;
-- select * from master_product_suppliers where supplier_id = 0;
-- select * from master_product_suppliers where manufacturer_id = 0;

-- ------------------------------------master_routings---------------------------
-- ----------------------------
-- Table structure for fac_routing_product
-- ----------------------------
DROP TABLE IF EXISTS `fac_routing_product`;
CREATE TABLE `fac_routing_product` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `code` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `factory_id` int(11) DEFAULT NULL,
  `routing_type` int(11) DEFAULT NULL COMMENT '1: cơ bản, 2:ứng dụng',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `created_by` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `updated_by` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `routing_parent` int(11) DEFAULT NULL COMMENT 'id routing clone/cha',
  `description` text COLLATE utf8_unicode_ci,
  `takt_time` decimal(11,2) DEFAULT NULL,
  `performance` int(11) DEFAULT NULL COMMENT 'số sản phẩm trên h',
  PRIMARY KEY (`id`)
) AUTO_INCREMENT=155 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci
ENGINE=FEDERATED CONNECTION='mysql://root:ssdc123!@10.1.30.138:3306/erp/fac_routing_product';

-- ----------------------------
-- Table structure for sys_routing
-- ----------------------------
DROP TABLE IF EXISTS `sys_routing`;
CREATE TABLE `sys_routing` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `parent_id` int(11) DEFAULT NULL COMMENT 'Routing con chứa parent_id của cha',
  `name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `routing_product_id` int(11) DEFAULT NULL,
  `description` varchar(500) COLLATE utf8_unicode_ci DEFAULT NULL,
  `position` int(11) DEFAULT NULL COMMENT 'Thứ tự',
  `cycle_time` float DEFAULT NULL COMMENT 'hiệu năng, đối với các thao tác',
  `routing_before` int(11) DEFAULT NULL COMMENT 'Thao tác trước nó',
  `routing_after` int(11) DEFAULT NULL COMMENT 'Thao tác sau nó',
  `code` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT 'số hiệu',
  `file_sop` varchar(250) COLLATE utf8_unicode_ci DEFAULT NULL,
  `file_repository` varchar(250) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) AUTO_INCREMENT=3760 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci
ENGINE=FEDERATED CONNECTION='mysql://root:ssdc123!@10.1.30.138:3306/erp/sys_routing';

truncate table master_routings;
-- select * from fac_routing_product
-- select count(*) from fac_routing_product
insert into master_routings(name,active,created,updated,old_id)
select name,1,ROUND(UNIX_TIMESTAMP(NOW(3))*1000),ROUND(UNIX_TIMESTAMP(NOW(3))*1000),id
from fac_routing_product;

-- select * from master_routings

truncate table master_routing_operations;
-- select * from sys_routing
insert into master_routing_operations(routing_id, workcenter_id,name,active,created, updated,
parent_id,old_id,routing_old_id, parent_old_id)
select 0,null,name,1,ROUND(UNIX_TIMESTAMP(NOW(3))*1000),ROUND(UNIX_TIMESTAMP(NOW(3))*1000),0,id,routing_product_id,parent_id
from sys_routing;

update master_routing_operations T1 INNER JOIN master_routing_operations T2 ON T1.parent_old_id = T2.old_id
set T1.parent_id = T2.id;

update master_routing_operations T1 INNER JOIN master_routings T2 ON T1.routing_old_id = T2.old_id
set T1.routing_id = T2.id;

update master_routing_operations set routing_id = null where routing_id = 0;
update master_routing_operations set parent_id = null where parent_id = 0;
-- select * from master_routing_operations

-- --------------------------------master_workcenters-----------------------------------------------
-- ----------------------------
-- Table structure for fac_work_center
-- ----------------------------
DROP TABLE IF EXISTS `fac_work_center`;
CREATE TABLE `fac_work_center` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `type` varchar(45) DEFAULT NULL COMMENT 'loại: máy móc, con người, máy móc và con người',
  `position` varchar(200) DEFAULT NULL COMMENT 'vị trí trong nhà máy',
  `performance` int(11) DEFAULT NULL COMMENT 'năng lực tiêu chuẩn',
  `factory_id` int(11) NOT NULL,
  `routing_id` int(11) NOT NULL,
  `work_center_parent` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`,`factory_id`,`routing_id`)
) AUTO_INCREMENT=136 DEFAULT CHARSET=utf8
ENGINE=FEDERATED CONNECTION='mysql://root:ssdc123!@10.1.30.138:3306/erp/fac_work_center';

truncate table master_workcenters;
-- select * from fac_work_center;
insert into master_workcenters(name,created, updated,active,old_id)
select name,ROUND(UNIX_TIMESTAMP(NOW(3))*1000),ROUND(UNIX_TIMESTAMP(NOW(3))*1000),1,id
from fac_work_center;
-- select * from master_workcenters;

-- -----------------------------------------master_bom-------------------------------------------
-- ----------------------------
-- Table structure for sys_bom
-- ----------------------------
DROP TABLE IF EXISTS `sys_bom`;
CREATE TABLE `sys_bom` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `product_id` bigint(20) NOT NULL,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `version` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `description` text CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `bom_type` varchar(10) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `created_by` varchar(50) DEFAULT NULL COMMENT 'Tên user tạo',
  `updated_by` varchar(50) DEFAULT NULL COMMENT 'Tên user cập nhật cuối',
  `status` int(5) DEFAULT '0' COMMENT '0: rd, 1: man, 2: sc',
  `schematic_id` int(11) DEFAULT NULL COMMENT 'Import file',
  `geber_file_pcb_id` int(11) DEFAULT NULL COMMENT 'Import file co version',
  `schematic_version` varchar(250) DEFAULT NULL,
  `geber_file_pcb_version` varchar(250) DEFAULT NULL,
  `reason` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `count_approved` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`) USING BTREE,
  KEY `name` (`name`) USING BTREE,
  KEY `status` (`status`) USING BTREE
) AUTO_INCREMENT=81 DEFAULT CHARSET=utf8
ENGINE=FEDERATED CONNECTION='mysql://root:ssdc123!@10.1.30.138:3306/erp/sys_bom';

-- ----------------------------
-- Table structure for fac_bom_man
-- ----------------------------
DROP TABLE IF EXISTS `fac_bom_man`;
CREATE TABLE `fac_bom_man` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `version` int(11) DEFAULT NULL,
  `description` text,
  `version_current` int(11) DEFAULT NULL,
  `bom_man_parent` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `bom_rd_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) AUTO_INCREMENT=87 DEFAULT CHARSET=utf8
ENGINE=FEDERATED CONNECTION='mysql://root:ssdc123!@10.1.30.138:3306/erp/fac_bom_man';

-- ----------------------------
-- Table structure for sc_bom
-- ----------------------------
DROP TABLE IF EXISTS `sc_bom`;
CREATE TABLE `sc_bom` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) DEFAULT NULL COMMENT 'Có thể lấy tên R&D được render',
  `version` varchar(200) DEFAULT NULL COMMENT 'Trùng với version của R&D',
  `description` text,
  `bom_type` varchar(10) DEFAULT NULL COMMENT 'Lấy theo R&D BoM',
  `sc_plan_id` int(11) DEFAULT NULL COMMENT 'id plan sc',
  `sc_plan_product_id` int(11) DEFAULT NULL COMMENT 'id plan product của SC',
  `product_id` int(11) DEFAULT NULL COMMENT 'id sản phẩm trong plan',
  `bom_id` int(11) DEFAULT NULL COMMENT 'id bom theo sản phẩm trong plan',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `assign` varchar(50) DEFAULT NULL COMMENT 'user dc assign',
  PRIMARY KEY (`id`)
) AUTO_INCREMENT=45 DEFAULT CHARSET=utf8
ENGINE=FEDERATED CONNECTION='mysql://root:ssdc123!@10.1.30.138:3306/erp/sc_bom';

-- ----------------------------
-- Table structure for sys_bom_part
-- ----------------------------
DROP TABLE IF EXISTS `sys_bom_part`;
CREATE TABLE `sys_bom_part` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `sys_bom_id` bigint(20) NOT NULL,
  `part_id` bigint(20) NOT NULL,
  `vnpt_pn` varchar(100) DEFAULT NULL,
  `description_pn` varchar(200) DEFAULT NULL,
  `level` varchar(20) DEFAULT NULL,
  `qty_per_product` float(15,6) DEFAULT NULL,
  `manufacturer_id` int(5) DEFAULT NULL,
  `manufacturer_pn` varchar(200) DEFAULT NULL,
  `reference` varchar(1024) DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `status` int(1) DEFAULT '0' COMMENT '0: Part của R&D, 1: Part BCN bổ sung',
  `made_or_buy` tinyint(1) DEFAULT '1' COMMENT '0: made, 1: buy',
  `bom_type` tinyint(1) DEFAULT '0' COMMENT '0: mBom, 1: eBom, 2: pBoM',
  `operation_rate` float DEFAULT '0',
  `warranty_rate` float DEFAULT '0',
  `experiment_rate` float DEFAULT '0',
  `unit` int(11) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `part_id` (`part_id`) USING BTREE,
  KEY `sys_bom_id` (`sys_bom_id`) USING BTREE,
  KEY `status` (`status`) USING BTREE
) AUTO_INCREMENT=73086 DEFAULT CHARSET=utf8
ENGINE=FEDERATED CONNECTION='mysql://root:ssdc123!@10.1.30.138:3306/erp/sys_bom_part';

-- ----------------------------
-- Table structure for fac_bom_man_part
-- ----------------------------
DROP TABLE IF EXISTS `fac_bom_man_part`;
CREATE TABLE `fac_bom_man_part` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `part_id` int(11) DEFAULT NULL,
  `routing_id` int(11) DEFAULT NULL,
  `number_part` float(15,6) DEFAULT NULL,
  `part_type` int(11) DEFAULT NULL COMMENT '1: Chính, 2: Phụ, 3: Tiêu hao, 4:Output',
  `bom_man_id` int(11) DEFAULT NULL,
  `reference` varchar(1024) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `manufacturer_id` int(11) DEFAULT NULL,
  `note` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `flag_add_new` int(11) DEFAULT '0',
  `user_id_add` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) AUTO_INCREMENT=17837 DEFAULT CHARSET=utf8
ENGINE=FEDERATED CONNECTION='mysql://root:ssdc123!@10.1.30.138:3306/erp/fac_bom_man_part';

-- ----------------------------
-- Table structure for sc_bom_part
-- ----------------------------
DROP TABLE IF EXISTS `sc_bom_part`;
CREATE TABLE `sc_bom_part` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sc_bom_id` int(11) DEFAULT NULL COMMENT 'id của sc bom',
  `sc_plan_id` int(11) DEFAULT NULL,
  `sc_plan_product_id` int(11) DEFAULT NULL,
  `product_id` int(20) DEFAULT NULL COMMENT 'Trường phụ liên kết sản phẩm',
  `bom_id` int(20) DEFAULT NULL COMMENT 'Trường phụ liên kết sản phẩm',
  `part_id` bigint(20) DEFAULT NULL,
  `vnpt_pn` varchar(300) DEFAULT NULL COMMENT 'vnpt pn của linh kiện',
  `description_pn` varchar(500) DEFAULT NULL COMMENT 'description của linh kiện',
  `manufacturer_id` int(20) DEFAULT NULL,
  `manufacturer` varchar(200) DEFAULT NULL COMMENT 'Tên hãng sản xuất',
  `manufacturer_pn` varchar(200) DEFAULT NULL COMMENT 'mã hãng sản xuất',
  `qty_per_product` float(15,6) DEFAULT NULL COMMENT 'số lượng linh kiện trên một sản phẩm',
  `operationr_rate` float DEFAULT '0' COMMENT 'Tỉ lệ tiêu hao',
  `warranty_rate` float DEFAULT '0' COMMENT 'Tỉ lệ bảo hành',
  `experiment_rate` float DEFAULT NULL,
  `qty_in_stock` bigint(20) DEFAULT '0' COMMENT 'Số lượng Part tồn kho',
  `total_need` float(15,6) DEFAULT '0.000000' COMMENT 'Số lượng cần đặt hàng',
  `status` int(1) DEFAULT '0' COMMENT '0: Chưa đặt hàng, 1: Đã đặt hàng',
  `stock` bigint(20) DEFAULT '0' COMMENT 'Số lượng dư đưa vào tồn kho',
  `choose_suppier` varchar(512) DEFAULT NULL COMMENT ''''': chua chon: !'''': da chon',
  `level` varchar(20) DEFAULT NULL,
  `made_or_buy` tinyint(1) DEFAULT '1' COMMENT '0: made, 1: buy',
  `bom_type` tinyint(1) DEFAULT '0' COMMENT '0: mBom, 1: eBom, 2: pBoM',
  `vnpt_man_pn` varchar(20) DEFAULT NULL COMMENT 'mã full vnpt_pn của part va man',
  `order_quantity` float(20,2) DEFAULT '0.00' COMMENT 'Số lượng đặt hàng cho mỗi linh kiện',
  `is_hide` int(1) DEFAULT '0' COMMENT 'Co duoc add vao khi di negotiate: 0: dc hien thi, 1: an',
  `user_selected` varchar(50) DEFAULT NULL COMMENT 'id người dùng chọn lựa part để mua sắm',
  `date_checked` datetime DEFAULT NULL,
  `vnpt_man_pn_fix` varchar(20) DEFAULT NULL COMMENT 'mã full vnpt_pn của part va man',
  PRIMARY KEY (`id`),
  KEY `sc_plan_product_id` (`sc_plan_product_id`) USING BTREE,
  KEY `status` (`status`) USING BTREE
) AUTO_INCREMENT=20711 DEFAULT CHARSET=utf8
ENGINE=FEDERATED CONNECTION='mysql://root:ssdc123!@10.1.30.138:3306/erp/sc_bom_part';

truncate table master_bom;

-- select * from sys_bom;
insert into master_bom(product_id,name,version,type,routing_id,active,created,updated,ref_bom_id,old_id,ref_bom_old_id,product_version)
select 0,name,version,1,null,1,ROUND(UNIX_TIMESTAMP(NOW(3))*1000),ROUND(UNIX_TIMESTAMP(NOW(3))*1000),
null,id,null,product_id
from sys_bom;

-- select max(id) from master_bom;
-- select * from fac_bom_man;
insert into master_bom(product_id,name,version,type,routing_id,active,created,updated,ref_bom_id,old_id,ref_bom_old_id,product_version)
select 0,name,version,2,NULL,1,ROUND(UNIX_TIMESTAMP(NOW(3))*1000),ROUND(UNIX_TIMESTAMP(NOW(3))*1000),
null,id,bom_rd_id,product_id
from fac_bom_man;

-- select max(id) from master_bom;
-- select * from sc_bom;
insert into master_bom(product_id,name,version,type,routing_id,active,created,updated,ref_bom_id,old_id,ref_bom_old_id,product_version)
select 0,name,version,3,NULL,1,ROUND(UNIX_TIMESTAMP(NOW(3))*1000),ROUND(UNIX_TIMESTAMP(NOW(3))*1000),
null,id,bom_id,product_id
from sc_bom;

-- update product_version (master_product_versions)
update master_bom T1 INNER JOIN master_product_versions T2 ON T1.product_version = T2.old_id
set T1.product_version = T2.id;

-- update product_id (master_products)
update master_bom T1 INNER JOIN master_product_versions T2 ON T1.product_version = T2.id
set T1.product_id = T2.product_id;
-- select * from master_product_versions

-- update ref_bom_id
update master_bom T1 INNER JOIN master_bom T2 ON T1.ref_bom_old_id = T2.old_id
set T1.ref_bom_id = T2.id
where T1.type in (2,3) and T2.type in (1);

-- update routing_id (master_routings)
DROP TABLE IF EXISTS `view_bom_routing`;
CREATE TABLE `view_bom_routing` (
  bom_man_id INT(11) DEFAULT NULL,
  sys_routing_id INT(11) DEFAULT NULL,
	sys_routing_product_id INT(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

insert into view_bom_routing(bom_man_id,sys_routing_id,sys_routing_product_id)
select distinct bom_man_id, routing_id,null from fac_bom_man_part;
-- select * from view_bom_routing;

update view_bom_routing T1 INNER JOIN sys_routing T2 ON T1.sys_routing_id = T2.id
set T1.sys_routing_product_id = T2.routing_product_id;
-- select * from sys_routing

update master_bom T1 INNER JOIN view_bom_routing T2 ON T1.old_id = T2.bom_man_id
set T1.routing_id = T2.sys_routing_product_id
where T1.type = 2;
-- select * from master_bom where type = 2 and routing_id is null;
-- select * from master_routings where id = 76
-- select * from master_bom;

-- ------------------------------------master_bom_components-------------------------------
truncate table master_bom_components;

insert into master_bom_components(product_id,product_quantity,level,bom_id,operation_id,operation_name,uom_id,
manufacturer_id,product_type,part_type,reference,note,bom_type,created, updated,
operation_old_id,bom_old_id,product_old_id,active)
select 0,qty_per_product,level,0,null,null,0,
manufacturer_id,1,1,reference,notes,1,ROUND(UNIX_TIMESTAMP(NOW(3))*1000),ROUND(UNIX_TIMESTAMP(NOW(3))*1000),
null,sys_bom_id,part_id,1
from sys_bom_part;
-- select * from sys_bom_part

insert into master_bom_components(product_id,product_quantity,level,bom_id,operation_id,operation_name,uom_id,
manufacturer_id,product_type,part_type,reference,note,bom_type,created, updated,
operation_old_id,bom_old_id,product_old_id,active)
select 0,number_part,null,0,null,null,0,
manufacturer_id,1,part_type,reference,note,2,ROUND(UNIX_TIMESTAMP(NOW(3))*1000),ROUND(UNIX_TIMESTAMP(NOW(3))*1000),
routing_id,bom_man_id,part_id,1
from fac_bom_man_part;

update master_bom_components set product_type=2 where part_type = 4;
-- select * from fac_bom_man_part

insert into master_bom_components(product_id,product_quantity,level,bom_id,operation_id,operation_name,uom_id,
manufacturer_id,product_type,part_type,reference,note,bom_type,created, updated,
operation_old_id,bom_old_id,product_old_id,active)
select 0,qty_per_product,level,0,null,null,0,
manufacturer_id,1,1,null,null,3,ROUND(UNIX_TIMESTAMP(NOW(3))*1000),ROUND(UNIX_TIMESTAMP(NOW(3))*1000),
null,sc_bom_id,part_id,1
from sc_bom_part;
-- select * from sc_bom_part

-- update manufacturer_id
update master_bom_components T1 INNER JOIN master_companies T2 ON T1.manufacturer_id = T2.old_id
set T1.manufacturer_id = T2.id
where T2.type = 'man';

-- update product_id
update master_bom_components T1 INNER JOIN master_products T2 ON T1.product_old_id = T2.old_id
set T1.product_id = T2.id
where T2.type in (1,2);

-- update bom_id
update master_bom_components T1 INNER JOIN master_bom T2 ON T1.bom_old_id = T2.old_id
set T1.bom_id = T2.id
where T1.bom_type = 1 and T2.type = 1;

update master_bom_components T1 INNER JOIN master_bom T2 ON T1.bom_old_id = T2.old_id
set T1.bom_id = T2.id
where T1.bom_type = 2 and T2.type = 2;

update master_bom_components T1 INNER JOIN master_bom T2 ON T1.bom_old_id = T2.old_id
set T1.bom_id = T2.id
where T1.bom_type = 3 and T2.type = 3;

-- update operation_id,operation_name
update master_bom_components T1 INNER JOIN master_routing_operations T2 ON T1.operation_old_id = T2.old_id
set T1.operation_id = T2.id, T1.operation_name = T2.`name`
where T1.bom_type = 2 ;

-- select * from master_bom_components