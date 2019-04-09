package vn.ssdc.vnpt.erp.config;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.reflections.Reflections;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Component;
import vn.ssdc.vnpt.erp.umgr.models.Privilege;
import vn.ssdc.vnpt.erp.umgr.services.PrivilegeService;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.transaction.Transactional;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class InitialDataLoader implements
        ApplicationListener<ContextRefreshedEvent> {

    private static final Logger log = LoggerFactory.getLogger(InitialDataLoader.class);

    @Autowired
    private PrivilegeService privilegeService;


    @Override
    @Transactional
    public void onApplicationEvent(ContextRefreshedEvent event) {
        createDefaultPrivileges();
    }

    private void createDefaultPrivileges() {
        log.info(">>>>>> Creating default privileges <<<<<<<<<<<<");
        String packageName = "vn.ssdc.vnpt.erp";
        String[] suffixes = new String[]{"create","read","update","delete","super"};
        Reflections reflections = new Reflections(packageName);
        for(Class<?> clazz : reflections.getTypesAnnotatedWith(Entity.class)) {
            String tableName = clazz.getAnnotation(Table.class).name();
            String[] tmp = tableName.split("_");
            String moduleName = tmp.length > 1 ? tmp[0] : "base";
            for(String suffix : suffixes) {
                Privilege privilege = new Privilege();
                String privilegeName = String.format("priv_%s_%s_%s",moduleName,clazz.getSimpleName(),suffix);
                privilege.setName(privilegeName);
                privilege.setCreatedBy("system");
                if(privilegeService.findOneByName(privilegeName) == null) {
                    try {
                        privilegeService.create(privilege);
                    } catch (Exception e) {
                        //do nothing
                    }
                }

            }
        }
        log.info(">>>>>> Finished creating default privileges <<<<<<<<<<<<");
    }

}
