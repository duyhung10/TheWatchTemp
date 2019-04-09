package vn.ssdc.vnpt.erp.umgr.repositories;

import org.springframework.data.jpa.repository.EntityGraph;
import vn.ssdc.vnpt.erp.core.CustomJpaRepository;
import vn.ssdc.vnpt.erp.umgr.models.Role;

/**
 * Created by quocvi3t on 11/13/17.c
 */
public interface RoleRepository extends CustomJpaRepository<Role,Long> {
    @EntityGraph(attributePaths = {"privileges","users"})
    Role findOneWithPrivilegesById(Long id);

    Role findOneByName(String name);

}

