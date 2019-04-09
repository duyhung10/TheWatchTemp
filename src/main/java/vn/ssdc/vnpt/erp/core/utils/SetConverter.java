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
public class SetConverter implements AttributeConverter<Set<Long>,String> {
    private static final Logger log = LoggerFactory.getLogger(SetConverter.class);
    private ObjectMapper mapper = new ObjectMapper();
    @Override
    public String convertToDatabaseColumn(Set<Long> o) {
        try {
            return mapper.writeValueAsString(o);
        } catch (JsonProcessingException e) {
            log.error("Error when converting to database column",e);
            return "";
        }
    }

    @Override
    public Set<Long> convertToEntityAttribute(String o) {
        Set<Long> res = new HashSet<>();
        if(!StringUtils.isEmpty(o)) {
            try {
                TypeReference<Set<Long>> typeRef = new TypeReference<Set<Long>>() {
                };
                res = mapper.readValue(o,typeRef);
            } catch (IOException e) {
                log.error("Error when converting to entity attribute",e);
            }
        }

        return res;
    }
}
