package vn.ssdc.vnpt.erp.core.errors;

public class LocationAlreadyUsedArchiveException extends BadRequestAlertException {

    public LocationAlreadyUsedArchiveException() {
        super("Location is in used", "locaion", "canNotArchiveUsedLocation");
    }
}
