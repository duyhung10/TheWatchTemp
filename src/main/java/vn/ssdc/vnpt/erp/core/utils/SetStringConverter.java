package vn.ssdc.vnpt.erp.core.utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.StringUtils;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;
import java.io.IOException;
import java.util.HashSet;
import java.util.Set;

@Converter
public class SetStringConverter implements AttributeConverter<Set<String>,String> {
    private static final Logger log = LoggerFactory.getLogger(SetStringConverter.class);
    private ObjectMapper mapper = new ObjectMapper();
    @Override
    public String convertToDatabaseColumn(Set<String> o) {
        try {
            return mapper.writeValueAsString(o);
        } catch (JsonProcessingException e) {
            log.error("Error when converting to database column",e);
            return "";
        }
    }

    @Override
    public Set<String> convertToEntityAttribute(String o) {
        Set<String> res = new HashSet<>();
        if(!StringUtils.isEmpty(o)) {
            try {
                TypeReference<Set<String>> typeRef = new TypeReference<Set<String>>() {
                };
                res = mapper.readValue(o,typeRef);
            } catch (IOException e) {
                log.error("Error when converting to entity attribute",e);
            }
        }

        return res;
    }
}
