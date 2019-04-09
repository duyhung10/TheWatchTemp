package vn.ssdc.vnpt.erp.umgr.repositories;


import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.stereotype.Repository;
import vn.ssdc.vnpt.erp.core.CustomJpaRepository;
import vn.ssdc.vnpt.erp.umgr.models.User;
/**
 * Created by quocvi3t on 11/13/17.
 */
@Repository
public interface UserRepository extends CustomJpaRepository<User,Long> {
    User findOneByEmailIgnoreCase(String  email);

    @EntityGraph(attributePaths = "roles")
    User findOneWithRolesById(Long id);

    @EntityGraph(attributePaths = "roles")
    User findOneWithRolesByEmail(String email);
}
