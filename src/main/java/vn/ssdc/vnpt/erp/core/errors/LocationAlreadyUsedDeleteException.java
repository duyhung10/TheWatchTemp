package vn.ssdc.vnpt.erp.core.errors;

public class LocationAlreadyUsedDeleteException extends BadRequestAlertException {

    public LocationAlreadyUsedDeleteException() {
        super("Location is in used", "locaion", "canNotDeleteUsedLocation");
    }
}
