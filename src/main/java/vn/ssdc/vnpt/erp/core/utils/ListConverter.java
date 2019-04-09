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
import java.util.LinkedList;
import java.util.List;
import java.util.Set;

@Converter
public class ListConverter implements AttributeConverter<List<Long>,String> {
    private static final Logger log = LoggerFactory.getLogger(ListConverter.class);
    private ObjectMapper mapper = new ObjectMapper();
    @Override
    public String convertToDatabaseColumn(List<Long> o) {
        try {
            return mapper.writeValueAsString(o);
        } catch (JsonProcessingException e) {
            log.error("Error when converting to database column",e);
            return "";
        }
    }

    @Override
    public List<Long> convertToEntityAttribute(String o) {
        List<Long> res = new LinkedList<>();
        if(!StringUtils.isEmpty(o)) {
            try {
                TypeReference<List<Long>> typeRef = new TypeReference<List<Long>>() {
                };
                res = mapper.readValue(o,typeRef);
            } catch (IOException e) {
                log.error("Error when converting to entity attribute",e);
            }
        }

        return res;
    }
}
