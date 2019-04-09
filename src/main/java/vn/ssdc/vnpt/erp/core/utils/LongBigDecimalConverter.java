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
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Converter
public class LongBigDecimalConverter implements AttributeConverter<Map<Long, BigDecimal>,String>{
    private static final Logger log = LoggerFactory.getLogger(LongBigDecimalConverter.class);
    private ObjectMapper mapper = new ObjectMapper();
    @Override
    public String convertToDatabaseColumn(Map<Long, BigDecimal> stringObjectMap) {
        try {
            return mapper.writeValueAsString(stringObjectMap);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return "";
        }
    }

    @Override
    public Map<Long, BigDecimal> convertToEntityAttribute(String s) {
        HashMap<Long,BigDecimal> res = new HashMap<>();
        if(!StringUtils.isEmpty(s)) {
            try {
                TypeReference<HashMap<Long,BigDecimal>> typeRef = new TypeReference<HashMap<Long, BigDecimal>>() {
                };
                res = mapper.readValue(s,typeRef);
            } catch (IOException e) {
                log.error("Error converting attribute",e);
            }
        }
        return res;

    }
}
