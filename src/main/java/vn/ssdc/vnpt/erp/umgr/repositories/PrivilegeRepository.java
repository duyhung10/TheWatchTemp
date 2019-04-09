package vn.ssdc.vnpt.erp.umgr.repositories;

import vn.ssdc.vnpt.erp.core.CustomJpaRepository;
import vn.ssdc.vnpt.erp.umgr.models.Privilege;

/**
 * Created by quocvi3t on 11/13/17.
 */
public interface PrivilegeRepository extends CustomJpaRepository<Privilege,Long> {
    Privilege findOneByName(String name);
}
