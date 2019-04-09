package vn.ssdc.vnpt.erp.umgr.utils;

import vn.ssdc.vnpt.erp.inventory.Constants;

import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.TimeZone;

public class StringUtils {

    public static String convertDate(String date, String fromFormat, String toFormat) {
        String result = null;
        try {

            // Declare date
            DateFormat dateFormat = new SimpleDateFormat(fromFormat);
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat(toFormat);

            // Convert date time
            Date dateDf = dateFormat.parse(date);
            result = simpleDateFormat.format(dateDf);

        } catch (ParseException e) {
            result = null;
            e.printStackTrace();
        }

        return result;
    }

    public static String convertDateWithTimeZone(String date, String fromFormat, TimeZone fromTimeZone, String toFormat, TimeZone toTimeZone) {
        String result = null;
        try {

            // Declare date
            DateFormat dateFormat = new SimpleDateFormat(fromFormat);
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat(toFormat);

            // Set time zone
            dateFormat.setTimeZone(fromTimeZone);
            simpleDateFormat.setTimeZone(toTimeZone);

            // Convert date time
            Date dateDf = dateFormat.parse(date);
            result = simpleDateFormat.format(dateDf);

        } catch (ParseException e) {
            result = null;
            e.printStackTrace();
        }

        return result;
    }

    public static Long convertDatetimeToTimestamp(String dateTime, String fromFormat) {
        Long result = null;
        try {
            SimpleDateFormat dateFormat = new SimpleDateFormat(fromFormat);
            Date date = dateFormat.parse(dateTime);
            Timestamp timestamp = new Timestamp(date.getTime());
            result = timestamp.getTime();
        } catch (ParseException e) {
            result = null;
            e.printStackTrace();
        }
        return result;
    }

    public static String convertDateToString(int interval) {
        Calendar cal = Calendar.getInstance();
        if (interval > 0) {
            cal.add(Calendar.MINUTE, -interval);
        }
        return new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(cal.getTime());
    }

    public static long convertDateToLong(String date, String format) throws ParseException {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat(format);
        // Convert date time
        Date dateDf = simpleDateFormat.parse(date);
        return dateDf.getTime();
    }

    public static boolean checkExpireTime(long created, long expireTime) {
        if((System.currentTimeMillis() - expireTime*1000) < created) return true;
        return false;
    }


    //TODO add comments
    public static int compareLevel(String level1, String level2) {
        if(Constants.CONSUMABLE.equals(level1)) {
            return 1;
        }
        if(Constants.CONSUMABLE.equals(level2)) {
            return -1;
        }
        if(level1==null||level2==null) {
            return -1;
        }

        //compare when have multiple level
        if(level1.contains(",") && level2.contains(",")){
            return 0;
        }else if(level1.contains(",") && !level2.contains(",")){
            return 1;
        }else if(!level1.contains(",") && level2.contains(",")){
            return -1;
        }

        if(level1.equals("0")) {
            return -1;
        }
        if(level2.equals("0")) {
            return 1;
        }
        if(level1.equals(level2)) {
            return 0;
        }
        String[] tmp1 = level1.split("\\.");
        String[] tmp2 = level2.split("\\.");

        int i = 0;
        int res;
        while(i < tmp1.length && i < tmp2.length) {
            res = comparePart(tmp1[i],tmp2[i]);
            if(res != 0) {
                return res;
            }
            i++;
        }
        if(tmp1.length == tmp2.length) {
            return 0;
        }
        return tmp1.length < tmp2.length ? -1 : 1;

    }

    //TODO add comments
    private static int comparePart(String s1,String s2) {
        char c1 = s1.charAt(s1.length() - 1);
        char c2 = s2.charAt(s2.length() - 1);
        String tmp1 = s1.substring(0,s1.length() - 1);
        String tmp2 = s2.substring(0,s2.length() - 1);

        Integer i1 = Character.isAlphabetic(c1) ? Integer.valueOf(tmp1) : Integer.valueOf(s1);
        Integer i2 = Character.isAlphabetic(c2) ? Integer.valueOf(tmp2) : Integer.valueOf(s2);

        int res = i1.compareTo(i2);
        if(res == 0) {
            if(Character.isAlphabetic(c1) && Character.isAlphabetic(c2)) {
                return res = Character.valueOf(c1).compareTo(Character.valueOf(c2));
            }
            if(Character.isAlphabetic(c1) && !Character.isAlphabetic(c2)) {
                return -1;
            }
            if(!Character.isAlphabetic(c1) && Character.isAlphabetic(c2)) {
                return 1;
            }
        }
        return res;
    }
}
