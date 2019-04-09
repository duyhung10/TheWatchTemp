package vn.ssdc.vnpt.erp.umgr.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.stereotype.Service;
import vn.ssdc.vnpt.erp.config.ApplicationProperties;
import vn.ssdc.vnpt.erp.core.CrudService;
import vn.ssdc.vnpt.erp.umgr.models.Student;
import vn.ssdc.vnpt.erp.umgr.repositories.StudentRepository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;

@Service
@Transactional
@EnableConfigurationProperties(ApplicationProperties.class)
public class StudentService extends CrudService<Student, Long> {
    private static Logger logger = LoggerFactory.getLogger(StudentService.class);

    private StudentRepository studentRepository;

    @PersistenceContext
    private EntityManager entityManager;
    public StudentService(StudentRepository studentRepository) {
        this.repository = this.studentRepository = studentRepository;
    }

}
