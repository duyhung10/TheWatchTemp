package vn.ssdc.vnpt.erp.umgr.endpoints;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.ssdc.vnpt.erp.config.ApplicationProperties;
import vn.ssdc.vnpt.erp.core.CrudApiEndpoint;
import vn.ssdc.vnpt.erp.umgr.models.Privilege;
import vn.ssdc.vnpt.erp.umgr.models.Role;
import vn.ssdc.vnpt.erp.umgr.services.PrivilegeService;
import vn.ssdc.vnpt.erp.umgr.services.RoleService;

import java.util.List;

/**
 * Created by quocvi3t on 11/14/17.
 */
@RestController
@RequestMapping("/api/roles")
@EnableConfigurationProperties(ApplicationProperties.class)
public class RoleApiEndpoint extends CrudApiEndpoint<Role,Long> {

    private static Logger logger = LoggerFactory.getLogger(RoleApiEndpoint.class);
    private RoleService roleService;

    @Autowired
    public RoleApiEndpoint(RoleService service) {
        super(service);
        this.roleService = service;
        this.baseUrl = "/api/roles";
    }
}