package vn.ssdc.vnpt.erp.inventory;


import java.util.*;

public class Constants {
    public static final String FIFO = "fifo";
    public static final String LIFO = "lifo";
    public static final String FEFO = "fefo";

    public static final String PHYSICAL_LOCATIONS = "Physical Locations";
    public static final String VIRTUAL_LOCATIONS = "Virtual Locations";
    public static final String PARTNER_LOCATIONS = "Partner Locations";
    public static final String CUSTOMER_LOCATIONS = "Customers";
    public static final String VENDOR_LOCATIONS = "Vendors";
    public static final String SCRAPPED_LOCATIONS = "Scrapped";

    public static final String ONE_STEP = "one_step";
    public static final String TWO_STEP = "two_steps";
    public static final String THREE_STEP = "three_steps";
    public static final String SHIP_ONLY = "ship_only";
    public static final String PICK_SHIP = "pick_ship";
    public static final String PICK_PACK_SHIP = "pick_pack_ship";

    public static final String CONSUMABLE = "consumable";

    public static final Long HQV_WAREHOUSE_ID = 1L;
    public static final Long HL_WAREHOUSE_ID = 2L;

    public static final String NMDT1_STOCK = "Physical Locations/M1";
    public static final String NMDT2_STOCK = "Physical Locations/M2";

    public static final Map<String,String> DEFAULT_ROUTE_NAMES = new HashMap<String,String>(){{
        put(ONE_STEP,"Receipts in one step");
        put(TWO_STEP,"Receipts in two steps");
        put(THREE_STEP,"Receipts in three steps");
        put(SHIP_ONLY,"Ship only");
        put(PICK_SHIP,"Pick + Ship");
        put(PICK_PACK_SHIP,"Pick + Pack + Ship");
    }};

    public static final Map<Integer,String> MADE_OR_BUY = new HashMap<Integer,String>(){{
        put(0,"MADE");
        put(1,"BUY");
    }};

    public static final Map<String,String> BOM_TYPE = new HashMap<String,String>(){{
        put("p","pBom");
        put("m","mBom");
        put("e","eBom");
    }};

    public static final Map<String,String> OBJECT_STATE = new HashMap<String,String>(){{
        put("Transfer","transfers");
        put("Inventory","adjustments");
    }};

    public static final String PRODUCTION_ORDER = "Production Order";

    public static final String INVENTORY_OF_ALL = "all_product";
    public static final String INVENTORY_OF_CATEGORY = "one_product_category";
    public static final String INVENTORY_OF_PRODUCT = "one_product_only";
    public static final String INVENTORY_OF_PRODUCT_MANUALLY = "select_products_manually";
    public static final String INVENTORY_OF_LOT = "one_lot_number";
    public static final String INVENTORY_OF_PACKAGE = "one_package_number";
    public static final String INVENTORY_OF_RANDOM_SAMPLE = "random_sample";

    public static final String IN_DIFF = "in_diff";
    public static final String OUT_DIFF = "out_diff";
    public static final String MOVE = "move";
    public static final String CHANGE = "change";

    public static final String PACKAGE_TEMPLATE = "Hàng mẫu";
    public static final String PACKAGE_TEMPLATE_2 = "HÀNG MẪU";
    public static final String AUTO = "auto";
    public static final String MANUALLY = "manually";

    public static final String[] FINALPRODUCT = {"ONT","DVB_T2","Smartbox &STB","Smartphone"};
    public static final String SEMI ="SEMI";
    public static final String FINAL_PRODUCT ="Final Product";


    public static final String TEMPLATE_PACKINGLIST_VNPT = "/Template_PackingList_VNPT.xlsx";
    public static final String TEMPLATE_PACKINGLIST_ANSV = "/Template_PackingList_ANSV.xlsx";
    public static final String TEMPLATE_TRANSFER_RECEIPT = "/Template_Transfer_Receipt.xlsx";
    public static final String TEMPLATE_TRANSFER_MANUFACTURING_EXPORT = "/Template_Transfer_Manufacturing_Export.xlsx";
    public static final String TEMPLATE_TRANSFER_MANUFACTURING_IMPORT = "/Template_Transfer_Manufacturing_Import.xlsx";
    public static final String TEMPLATE_TRANSFER_MANUFACTURING_RETURN = "/Template_Transfer_Manufacturing_Return.xlsx";
    public static final String TEMPLATE_TRANSFER_DELIVERY = "/Template_Transfer_Delivery.xlsx";
    public static final String TEMPLATE_TRANSFER_INTERNAL = "/Template_Transfer_Internal.xlsx";
    public static final String TEMPLATE_TRANSFER_GENERAL = "/Template_Transfer_General.xlsx";
    public static final String TEMPLATE_WAREHOUSE_AND_LOCATION = "/Warehouse_and_Location.xlsx";
    public static final String TEMPLATE_TRANSFER_REPORT = "/Template_Transfer_Report.xlsx";
    public static final String TEMPLATE_SYNCHRONIZED_REPORT = "/Template_Synchronized_Report.xlsx";
    public static final String TEMPLATE_INVENTORY_REPORT = "/Template_Inventory_Report.xlsx";
    public static final Integer NUMBER_SHEET_LOCATIONS = 2;

    public static final String MANUFACTURING_RETURN = "Manufacturing Return";

    public static final String PRODUCT_NOT_FOUND = "Không tìm thấy sản phẩm. ";
    public static final String PACKAGE_NOT_FOUND = "Không tìm thấy package. ";
    public static final String LOT_NOT_FOUND = "Không tìm thấy Unit ID/Serial. ";
    public static final String PRODUCT_CODE_NOT_FOUND = "Không tìm thấy mã sản phẩm. ";
    public static final String PRODUCT_CODE_EMPTY = "Mã sản phẩm bị trống. ";
    public static final String INVALID_LOT_SERIAL_NUMBER = "Unit ID/Serial sai định dạng. ";
    public static final String DUPLICATE_LOT_SERIAL = "Unit ID/Serial bị trùng trong file. ";
    public static final String DUPLICATE_PACKAGE = "Package bị trùng trong file. ";
    public static final String DUPLICATE_ITEM= "Sản phẩm bị trùng trong file. ";
    public static final String DUPLICATE_ITEM_IN_DB= "Sản phẩm đã tồn tại trong giao dịch này. ";
    public static final String EXISTED_LOT_SERIAL = "Unit ID/Serial đã tồn tại ở vị trí này. ";
    public static final String EXISTED_LOT_SERIAL_IN_SYSTEM = "Unit ID/Serial đã tồn tại trong hệ thống. ";
    public static final String EXISTED_PACKAGE = "Package đã tồn tại ở vị trí. ";
    public static final String EXISTED_PACKAGE_IN_SYSTEM = "Package đã tồn tại trong hệ thống. ";
    public static final String LOT_SERIAL_EMPTY = "Unit ID/Serial bị trống. ";
    public static final String LOT_PRODUCT_INVALID = "Unit ID/Serial không thuộc về sản phẩm này. ";
    public static final String LOT_PACKAGE_NOT_IN_SRC = "Package/ UID SerialNumber không tồn tại trong vị trí nguồn. ";
    public static final String PACKAGE_PRODUCT_INVALID = "Package không thuộc về sản phẩm này. ";
    public static final String MANPN_INVALID = "Man Pn không thuộc về sản phẩm. ";
    public static final String MANID_INVALID = "Mã sản phẩm không thuộc về sản phẩm. ";
    public static final String TEXT_OR_NUMBER_FORMAT_REQUIRE = "Yêu cầu kiểu dữ liệu Text hoặc Number.";
    public static final String NUMBER_FORMAT_REQUIRE = "Yêu cầu kiểu dữ liệu Number.";
    public static final String DUPLICATE_MAC_IN_FILE= "Mac bị trùng trong file. ";
    public static final String DUPLICATE_MAC_IN_SYSTEM= "Mac đã tồn tại trong hệ thống. ";
    public static final String INVALID_MAC = "Mac sai định dạng. ";
    public static final String EMPTY_LOT = "Unit ID/Serial trống. ";
    public static final String INVALID_MAC_LOT = "Mac thuộc về một Unit ID/Serial khác. ";

    public static final String SPLIT_REFERENCE_PREFIX = "SPLIT_";
    public static final String PACKAGE_MOVE_REFERENCE_TEMPLATE = "MOVE_FROM_%s_TO_%s";

    public static final Integer MAX_ADJUSTMENT_DETAIL_FAIL = 100;
    public static final String PROJECT_ALL = "All";
    public static final String SCBOM_ALL = "All";
    public static final String NONE_PROJECT = "None Project";
    public static final String NONE_SCBOM = "None ScBom";
    public static final String NONE_PO = "None PO";

    public static final Integer PROCESSING_SAMPLE = 100;

    public static final Integer FLAT_BOM = 0;
    public static final Integer SIMPLE_BOM = 1;
    public static final Integer COMPLEX_BOM = 2;

    public static final Integer FLAT_PART = 0;
    public static final Integer SIMPLE_PART = 1;
    public static final Integer COMPLEX_PART = 2;

    public static final Integer ON_HAND = 0;
    public static final Integer AVAILABLE = 1;
    public static final Integer FORECAST = 2;

    public static final Map<Integer,String> STOCK_TYPE = new HashMap<Integer,String>(){{
        put(0,"On Hand");
        put(1,"Available");
        put(2,"Forecast");
    }};

    public static final Long ONE_DAY = 86400000L;
    public static final Long LESS_ONE_DAY = 86399000L;
    public static final Long THREE_MONTH = 7776000000L;
    public static final String SYNCHRONIZED_REPORT = "Synchronized_Report";
    public static final String INVENTORY_REPORT = "Inventory_Report";

    public static final String STOCK_CHANGE = "Stock_change";
    public static final String PROJECT_CHANGE = "Project_change";

    public static final String AVAILABLE_BORROW = "Available Borrow";
    public static final String INITIAL_BORROW = "Initial Borrow";
    public static final String REAL_BORROW = "Real Borrow";
    public static final String INTERNAL = "internal";

    public static final String RECEIPTS = "Receipts";
    public static final String MANUFACTURER_RETURN = "Manufacturing Return";

    public static final String BARCODE1 = "device@vnpt-technology.vn";
    public static final String BARCODE2 = "barcodehqv@vnpt-technology.vn";
    public static final String PRINTER1 = "printer1hl@vnpt-technology.vn";
    public static final String PRINTER2 = "printerhqv@vnpt-technology.vn";
    public static final Integer DEVICE_BARCODE = 1;
    public static final Integer DEVICE_PRINTER = 2;

    public static final String BEGIN = "begin";
    public static final String END = "end";
    public static final String OUT = "out";
    public static final String IN = "in";
    public static final String SCRAP = "scrap";

    public static final String GOOD_MATERIAL = "Good";
    public static final String SCRAPPED_MATERIAL = "Scrapped";
    public static final String INCLUDE_SCRAPPED_MATERIAL = "None";
    public static final String RESTORE_MATERIAL = "RESTORE";

    public static final String VALIDATE = "Validate";
    public static final String CHECK_AVALILABILITY = "Check Availability";
    public static final String UN_RESERVED = "Un-Reserved";
    public static final String START_PROGRESS = "Start Progress";
    public static final String VALIDATE_ADJUSTMENT = "Validate Adjustment";
    public static final String FINISH_ADJUSTMENT = "Finish Adjustment";
}
