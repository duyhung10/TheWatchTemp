package vn.ssdc.vnpt.erp.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(
        prefix = "application",
        ignoreUnknownFields = false
)
public class ApplicationProperties {

    private Activation activation;
    private Ldap ldap;
    private OldSystem oldSystem;

    public ApplicationProperties() {
    }

    public Activation getActivation() {
        return activation;
    }

    public void setActivation(Activation activation) {
        this.activation = activation;
    }

    public Ldap getLdap() {
        return ldap;
    }

    public void setLdap(Ldap ldap) {
        this.ldap = ldap;
    }

    public OldSystem getOldSystem() {
        return oldSystem;
    }

    public void setOldSystem(OldSystem oldSystem) {
        this.oldSystem = oldSystem;
    }

    public static class Activation {
        private long expirePeriod;
        private boolean enableMail;

        public long getExpirePeriod() {
            return expirePeriod;
        }

        public void setExpirePeriod(long expirePeriod) {
            this.expirePeriod = expirePeriod;
        }

        public boolean isEnableMail() {
            return enableMail;
        }

        public void setEnableMail(boolean enableMail) {
            this.enableMail = enableMail;
        }
    }

    public static class OldSystem{
        private String host = "";
        private String apiGetPart = "";
        private String apiGetManufacturer = "";
        private String apiGetSupplier = "";
        private String apiGetPartMan = "";
        private String apiGetPartManPn = "";
        private String apiGetProductLine = "";
        private String apiGetProductLines = "";
        private String apiGetProduct = "";
        private String apiGetPurchaseOrder = "";
        private String apiGetProductOrder= "";
        private String apiGetPartCategories = "";
        private String apiGetSynchronizedBom = "";

        public String getHost() {
            return host;
        }

        public void setHost(String host) {
            this.host = host;
        }

        public String getApiGetPart() {
            return apiGetPart;
        }

        public void setApiGetPart(String apiGetPart) {
            this.apiGetPart = apiGetPart;
        }

        public String getApiGetManufacturer() {
            return apiGetManufacturer;
        }

        public void setApiGetManufacturer(String apiGetManufacturer) {
            this.apiGetManufacturer = apiGetManufacturer;
        }

        public String getApiGetPartMan() {
            return apiGetPartMan;
        }

        public void setApiGetPartMan(String apiGetPartMan) {
            this.apiGetPartMan = apiGetPartMan;
        }

        public String getApiGetPartManPn() {
            return apiGetPartManPn;
        }

        public void setApiGetPartManPn(String apiGetPartManPn) {
            this.apiGetPartManPn = apiGetPartManPn;
        }

        public String getApiGetProductLine() {
            return apiGetProductLine;
        }

        public void setApiGetProductLine(String apiGetProductLine) {
            this.apiGetProductLine = apiGetProductLine;
        }

        public String getApiGetProduct() {
            return apiGetProduct;
        }

        public void setApiGetProduct(String apiGetProduct) {
            this.apiGetProduct = apiGetProduct;
        }

        public String getApiGetProductLines() {
            return apiGetProductLines;
        }

        public void setApiGetProductLines(String apiGetProductLines) {
            this.apiGetProductLines = apiGetProductLines;
        }

        public String getApiGetSupplier() {
            return apiGetSupplier;
        }

        public void setApiGetSupplier(String apiGetSupplier) {
            this.apiGetSupplier = apiGetSupplier;
        }

        public String getApiGetPurchaseOrder() {
            return apiGetPurchaseOrder;
        }

        public void setApiGetPurchaseOrder(String apiGetPurchaseOrder) {
            this.apiGetPurchaseOrder = apiGetPurchaseOrder;
        }

        public String getApiGetProductOrder() {
            return apiGetProductOrder;
        }

        public void setApiGetProductOrder(String apiGetProductOrder) {
            this.apiGetProductOrder = apiGetProductOrder;
        }

        public String getApiGetSynchronizedBom() {
            return apiGetSynchronizedBom;
        }

        public void setApiGetSynchronizedBom(String apiGetSynchronizedBom) {
            this.apiGetSynchronizedBom = apiGetSynchronizedBom;
        }

        public String getApiGetPartCategories() {
            return apiGetPartCategories;
        }

        public void setApiGetPartCategories(String apiGetPartCategories) {
            this.apiGetPartCategories = apiGetPartCategories;
        }
    }

    public static class Ldap {
        private boolean enabled;
        private String url = "";
        private String base = "";
        private String userDN = "";
        private String password = "";

        public Ldap() {
        }

        public boolean isEnabled() {
            return enabled;
        }

        public void setEnabled(boolean enabled) {
            this.enabled = enabled;
        }

        public String getUrl() {
            return url;
        }

        public void setUrl(String url) {
            this.url = url;
        }

        public String getBase() {
            return base;
        }

        public void setBase(String base) {
            this.base = base;
        }

        public String getUserDN() {
            return userDN;
        }

        public void setUserDN(String userDN) {
            this.userDN = userDN;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }

}
