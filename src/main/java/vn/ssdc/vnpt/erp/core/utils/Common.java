package vn.ssdc.vnpt.erp.core.utils;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import cz.jirutka.rsql.parser.RSQLParser;
import cz.jirutka.rsql.parser.ast.Node;
import org.apache.commons.codec.binary.Base64;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.jpa.domain.Specification;
import vn.ssdc.vnpt.erp.core.errors.BadRequestAlertException;
import vn.ssdc.vnpt.erp.core.rsql.CustomRsqlVisitor;
import vn.ssdc.vnpt.erp.inventory.Constants;

import java.awt.font.FontRenderContext;
import java.awt.font.LineBreakMeasurer;
import java.awt.font.TextAttribute;
import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.file.FileSystems;
import java.nio.file.Path;
import java.sql.Timestamp;
import java.text.AttributedString;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

public final class Common {
    private static final Logger logger = LoggerFactory.getLogger(Common.class);
    private Common() {
    }

    public static Boolean containSpecialCharacter(String text){
        Pattern p = Pattern.compile("[^a-z0-9]", Pattern.CASE_INSENSITIVE);
        Matcher m = p.matcher(text);
        return m.find();
    }

    public static String getCurrentDateTime(){
        return  new SimpleDateFormat("ddMMyyyyHHmmss").format(Calendar.getInstance(TimeZone.getTimeZone("Asia/Ho_Chi_Minh")).getTime());
    }

    public static void createDirectory(String path){
        File theDir = new File(path);
        if (!theDir.exists()) {
            try{
                theDir.mkdir();
            }
            catch(SecurityException se){
                throw new BadRequestAlertException("Create new directory fail", "common", "createDirectoryFail");
            }
        }
    }

    public static String convertDateTime(Long time, String pattern){
        if(time != null){
            Date date=new Date(time);
            Calendar cal = Calendar.getInstance(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
            cal.setTime(date);
            String day = Integer.toString(cal.get(Calendar.DAY_OF_MONTH));
            if (cal.get(Calendar.DAY_OF_MONTH)  < 10 ) {
                day = 0 + day;
            }
            pattern = pattern.replace("dd",day);
            String month = Integer.toString(cal.get(Calendar.MONTH) +1);
            if (cal.get(Calendar.MONTH) +1 < 10 ) {
                month = 0 + month;
            }
            pattern = pattern.replace("MM",month);
            pattern = pattern.replace("yyyy",Integer.toString(cal.get(Calendar.YEAR)));
            pattern = pattern.replace("HH",Integer.toString(cal.get(Calendar.HOUR_OF_DAY)));
            pattern = pattern.replace("mm",Integer.toString(cal.get(Calendar.MINUTE)));
            pattern = pattern.replace("ss",Integer.toString(cal.get(Calendar.SECOND)));
            return pattern;
        }
        return null;
    }

    public static  String convertDateTime(Long time){
        if(time !=null){
            Date d = new Date(time);
            DateFormat f = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
            f.setTimeZone(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
            return f.format(d);
        }
        return null;
    }

    public static  String convertDateTime(Object time){
        if(time !=null){
            try {
                String stringToConvert = String.valueOf(time);
                Long convertedLong = Long.parseLong(stringToConvert);
                Date d = new Date(convertedLong);
                DateFormat f = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
                f.setTimeZone(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
                return f.format(d);
            } catch (Exception e){
                return null;
            }
        }
        return null;
    }

    public static Long convertDateTime(String dateTime,String pattern, int addition){
        SimpleDateFormat f = new SimpleDateFormat(pattern);
        f.setTimeZone(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
        Long time = null;
        try {
            Date d = f.parse(dateTime);
            f.setTimeZone(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
            if(addition !=0){
                d = addDays(d, 1);
            }
            time = d.getTime();
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return time;
    }

    public static Long getCurrentDate(){
        Calendar calendar = Calendar.getInstance(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        return calendar.getTime().getTime();
    }

    public static String getCurrentDateString(){
        Long today = getCurrentDate();
        return convertDateTime(today,"yyyy-MM-dd");
    }

    public static Date addDays(Date date, int days)
    {
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        cal.add(Calendar.DATE, days); //minus number would decrement the days
        return cal.getTime();
    }

    public static String removeLastCharacter(String str) {
        if (str != null && str.length() > 0 ) {
            str = str.substring(0, str.length() - 1);
        }
        return str;
    }

    public static String getFileName(String filePath){
        if(filePath == null){
            return null;
        }
        int index = filePath.lastIndexOf("/");
        String fileName = filePath.substring(index + 1);
        return fileName;
    }

    public static void generateQRCodeImage(String text, int width, int height, String filePath, String fileName)
            throws WriterException, IOException {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, width, height);
        File tmp = new File(filePath, fileName+ ".png");
        tmp.createNewFile();
        MatrixToImageWriter.writeToFile(bitMatrix, "PNG", tmp);
    }

    public static String convertSetLongToString(Set<Long> ids){
        if(ids == null || ids.size() == 0){
            return null;
        }
        StringBuilder result = new StringBuilder("(");
        int index =0;
        for (Long id:ids){
            if(index>0){
                result.append(",");
            }
            result.append(id);
            index++;
        }
        result.append(")");
        return result.toString();
    }

    public static Object[] convertMapToObjects(Map<String,String> map){
        String[] keys = new String[map.size()];
        Object[] objects = new Object[map.size()];
        int index = 0;
        for (Map.Entry<String, String> mapEntry : map.entrySet()) {
            keys[index] = mapEntry.getKey();
            objects[index] = mapEntry.getValue();
            index++;
        }
        return objects;
    }

    public static String renameDuplicateFile(String fileName){
        int pos = fileName.lastIndexOf(".");
        if (pos > 0) {
            String name = fileName.substring(0, pos);
            String extension = fileName.substring(pos+1);
            fileName = name + "_" + getCurrentDateTime() + "." + extension;
        } else {
            fileName += getCurrentDateTime();
        }
        return  fileName;
    }

    public static String generateBase64Image(byte[] image)
    {
        return Base64.encodeBase64String(image);
    }

    public static String replaceAt(String origin, String replace, int index){
        if(index + replace.length() <= origin.length()){
            origin = origin.substring(0,index) + replace + origin.substring(index + replace.length());
        } else {
            origin = origin.substring(0,index) + replace;
        }
        return origin;
    }

    public static void autoSizeRow(Sheet currSht, String cellValue, int mergedCellWidth, int rowNum){
        java.awt.Font currFont = new java.awt.Font("Arial", 0, 10);
        AttributedString attrStr = new AttributedString(cellValue);
        attrStr.addAttribute(TextAttribute.FONT, currFont);

// Use LineBreakMeasurer to count number of lines needed for the text
        FontRenderContext frc = new FontRenderContext(null, true, true);
        LineBreakMeasurer measurer = new LineBreakMeasurer(attrStr.getIterator(), frc);
        int nextPos = 0;
        int lineCnt = 0;
        while (measurer.getPosition() < cellValue.length())
        {
            nextPos = measurer.nextOffset(mergedCellWidth); // mergedCellWidth is the max width of each line
            lineCnt++;
            measurer.setPosition(nextPos);
        }

        Row currRow = currSht.getRow(rowNum);
        currRow.setHeight((short)(currRow.getHeight() * lineCnt));
    }

    public static String getCellStringValue(Cell cell){
        String result = null;
        if(cell !=null){
            if(cell.getCellType() == Cell.CELL_TYPE_STRING){
                result = cell.getStringCellValue().trim();
            } else if(cell.getCellType() == Cell.CELL_TYPE_NUMERIC){
                result = Long.toString((long)cell.getNumericCellValue());
            }
        }
        return result;
    }

    private static Integer replaceOrTypeOne(StringBuffer stringBuffer){
        Integer start = 0;
        Integer offset = 0;
        while(offset >= 0){
            offset = stringBuffer.indexOf("'",start);
            if(offset > 0){
                String sub = stringBuffer.substring(start,offset);
                sub = sub.replace(","," OR ");
                stringBuffer.replace(start,offset,sub);
                offset = stringBuffer.indexOf("=(",start);
                start = stringBuffer.indexOf(")",offset);
            }
        }
        offset = start;
        while(offset >= 0){
            offset = stringBuffer.indexOf(",",start);
            if(offset > 0){
                String sub = stringBuffer.substring(start,offset+1);
                sub = sub.replace(","," OR ");
                stringBuffer.replace(start,offset+1,sub);
                start = offset+1;
            }
        }
        return offset;
    }

    public static String convertRsqlToSql(String rSql){
        if (rSql==null || rSql.isEmpty()){
            return rSql;
        }
        StringBuilder origin = new StringBuilder(rSql);
        rSql = rSql.replace("%22", "\'");
        rSql = rSql.replace("\"", "\'");
        StringBuffer stringBuffer = new StringBuffer(rSql);
        Integer start = 0;
        Integer offset = 0;
        try{
            while (offset >= 0){
                offset = stringBuffer.indexOf("=(",start);
                if(offset > 0){
                    String sub = stringBuffer.substring(start,offset);
                    StringBuffer sub2 = new StringBuffer(sub);
                    replaceOrTypeOne(sub2);
                    stringBuffer.replace(start,offset,sub2.toString());
                    offset = stringBuffer.indexOf("=(",start);
                    start = stringBuffer.indexOf(")",offset);
                }
            }
            offset = start;
            StringBuffer sub3 = new StringBuffer(stringBuffer.substring(offset,stringBuffer.length()-1));
            replaceOrTypeOne(sub3);
            stringBuffer.replace(start,stringBuffer.length()-1,sub3.toString());

            rSql = stringBuffer.toString();
            rSql = rSql.replace(";"," AND ");
            rSql = rSql.replace("=='null'"," IS NULL ");
            rSql = rSql.replace("!='null'"," IS NOT NULL ");
            rSql = rSql.replace("==null"," IS NULL ");
            rSql = rSql.replace("!=null"," IS NOT NULL ");
            rSql = rSql.replace("==\'*"," LIKE \'%");
            rSql = rSql.replace("==\'"," LIKE \'");
            rSql = rSql.replace("!=\'*"," NOT LIKE \'%");
            rSql = rSql.replace("*\'","%\'");
            rSql = rSql.replace("!=%22*"," NOT LIKE \'%");
            rSql = rSql.replace("%20", " ");

            rSql = rSql.replace("==", "=");
            rSql = rSql.replace("=in=", " IN ");
            rSql = rSql.replace("=out=", " NOT IN ");
            rSql = rSql.replace("',", "' OR ");
        } catch (Exception e){
            logger.info("Fail to convert rSQL: {}",origin.toString());
        }

        return rSql;
    }

    public static Boolean compareSetLong(Set<Long> set1, Set<Long> set2){
        Boolean result = false;
        if(set1.containsAll(set2) && set2.containsAll(set1)){
            result = true;
        }
        return result;
    }

    public static Boolean compareLongValue(Long l1, Long l2){
        if( (l1 !=null && !l1.equals(l2)) || (l1 == null && l2 !=null)){
            return false;
        }
        return true;
    }

    public static<K,V> Map<K,V> clone(Map<K,V> original) {
        return original.entrySet()
                .stream()
                .collect(Collectors.toMap(Map.Entry::getKey,
                        Map.Entry::getValue));
    }

    public static void main(String[] args) {
        System.out.print(getCurrentDate() - Constants.ONE_DAY);
    }
}

