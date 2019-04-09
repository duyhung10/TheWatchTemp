package vn.ssdc.vnpt.erp.inventory.utils;

public class StringUtils {
    public static Boolean isLot(String str) {
        return str != null && (str.startsWith("LOT") || str.startsWith("UID"));
    }

    public static Boolean isPack(String str) {
        return str != null && (str.startsWith("PACK"));
    }
}
