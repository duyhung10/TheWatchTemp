package vn.ssdc.vnpt.erp.umgr.repositories;

import org.springframework.stereotype.Repository;
import vn.ssdc.vnpt.erp.umgr.models.Student;
import vn.ssdc.vnpt.erp.core.CustomJpaRepository;

@Repository
public interface StudentRepository extends CustomJpaRepository<Student,Long> {

}
