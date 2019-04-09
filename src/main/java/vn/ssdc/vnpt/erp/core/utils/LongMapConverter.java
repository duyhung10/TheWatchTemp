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
import java.util.HashMap;
import java.util.Map;

@Converter
public class LongMapConverter implements AttributeConverter<Map<Long,Object>,String>{
    private static final Logger log = LoggerFactory.getLogger(LongMapConverter.class);
    private ObjectMapper mapper = new ObjectMapper();
    @Override
    public String convertToDatabaseColumn(Map<Long, Object> stringObjectMap) {
        try {
            return mapper.writeValueAsString(stringObjectMap);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return "";
        }
    }

    @Override
    public Map<Long, Object> convertToEntityAttribute(String s) {
        HashMap<Long,Object> res = new HashMap<>();
        if(!StringUtils.isEmpty(s)) {
            try {
                TypeReference<HashMap<Long,Object>> typeRef = new TypeReference<HashMap<Long, Object>>() {
                };
                res = mapper.readValue(s,typeRef);
            } catch (IOException e) {
                log.error("Error converting attribute",e);
            }
        }
        return res;

    }
}
