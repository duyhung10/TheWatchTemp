package vn.ssdc.vnpt.erp.umgr.services;

import org.springframework.stereotype.Service;
import vn.ssdc.vnpt.erp.core.CrudService;
import vn.ssdc.vnpt.erp.umgr.models.Privilege;
import vn.ssdc.vnpt.erp.umgr.repositories.PrivilegeRepository;

import javax.transaction.Transactional;

/**
 * Created by quocvi3t on 11/16/17.
 */
@Service
@Transactional
public class PrivilegeService extends CrudService<Privilege,Long> {
    private  PrivilegeRepository privilegeRepository;
    public PrivilegeService(PrivilegeRepository repository) {
        this.repository = this.privilegeRepository = repository;
    }

    public Privilege findOneByName(String name) {
        return this.privilegeRepository.findOneByName(name);
    }
}
