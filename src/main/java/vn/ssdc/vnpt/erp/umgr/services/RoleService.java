package vn.ssdc.vnpt.erp.umgr.services;

import org.springframework.stereotype.Service;
import vn.ssdc.vnpt.erp.core.Constants;
import vn.ssdc.vnpt.erp.core.CrudService;
import vn.ssdc.vnpt.erp.core.errors.RoleAlreadyUsedException;
import vn.ssdc.vnpt.erp.core.errors.RoleHasNoPrivilegeException;
import vn.ssdc.vnpt.erp.core.errors.RoleHasPrivilegeCanNotDeleteException;
import vn.ssdc.vnpt.erp.umgr.models.Role;
import vn.ssdc.vnpt.erp.umgr.repositories.RoleRepository;

import javax.transaction.Transactional;

/**
 * Created by quocvi3t on 11/16/17.
 */
@Service
@Transactional
public class RoleService extends CrudService<Role,Long> {
    RoleRepository roleRepository;
    public RoleService(RoleRepository repository) {
        this.repository = this.roleRepository = repository;
    }

    @Override
    public Role get(Long id) {
        return this.roleRepository.findOneWithPrivilegesById(id);
    }

    @Override
    protected void beforeCreate(Role entity) {
        super.beforeCreate(entity);

        if(entity != null && entity.getPrivileges() != null && entity.getPrivileges().isEmpty())
            throw new RoleHasNoPrivilegeException();

        if(entity != null) {
            Role exist = this.roleRepository.findOneByName(entity.getName());
            if(exist != null)
                throw new RoleAlreadyUsedException();
        }
    }

    @Override
    protected void beforeUpdate(Role entity) {
        super.beforeUpdate(entity);

        Role role = this.roleRepository.findOneByName(entity.getName());
        if(role != null && !role.getId().equals(entity.getId())) {
            throw new RoleAlreadyUsedException();
        }
    }

    @Override
    protected void beforeDelete(Role entity) {
        super.beforeDelete(entity);

        if(entity.getPrivileges() != null && !entity.getPrivileges().isEmpty())
            throw new RoleHasPrivilegeCanNotDeleteException();
    }

    public Role getDefaultUserRole() {
        return this.roleRepository.findOneByName(Constants.ROLE_USER);
    }
}
