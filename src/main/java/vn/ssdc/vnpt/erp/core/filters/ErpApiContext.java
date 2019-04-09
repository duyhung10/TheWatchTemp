package vn.ssdc.vnpt.erp.core.filters;

import java.util.UUID;

public class ErpApiContext {
    private static final ThreadLocal<String> id = new ThreadLocal<>();

    public static String getId() {
        String requestId = id.get();
        if(requestId == null) {
            requestId = UUID.randomUUID().toString();
            setId(requestId);
            return requestId;
        }
        return requestId;
    }

    public static void setId(String requestId) {
        id.set(requestId);
    }
}
