package vn.ssdc.vnpt.erp.umgr.endpoints;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.web.bind.annotation.*;
import vn.ssdc.vnpt.erp.config.ApplicationProperties;
import vn.ssdc.vnpt.erp.core.CrudApiEndpoint;
import vn.ssdc.vnpt.erp.umgr.models.Student;
import vn.ssdc.vnpt.erp.umgr.services.StudentService;

import java.util.LinkedList;
import java.util.List;


@RestController
@RequestMapping("/api/students")
@EnableConfigurationProperties(ApplicationProperties.class)
public class StudentApiEndpoint extends CrudApiEndpoint<Student, Long> {
    private static Logger logger = LoggerFactory.getLogger(UserApiEndpoint.class);
    private StudentService studentService;

    @Autowired
    public StudentApiEndpoint(StudentService service){
        super(service);
        this.studentService = service;
        this.baseUrl = "/api/students";
    }

    @RequestMapping(path = "/add-student", method = RequestMethod.POST)
    public void addNewStudent(@RequestBody Student student){
        studentService.create(student);
    }

    @RequestMapping(path = "/show-student", method = RequestMethod.GET)
    public List<Student> getListStudent() {
        List<Student> listStudent = studentService.findAll();
        return listStudent;
    }
}
