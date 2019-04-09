package vn.ssdc.vnpt.erp.core.errors;

public class OperationTypeBelongToValuationException extends BadRequestAlertException {

    public OperationTypeBelongToValuationException() {
        super("Operation belong to valuation report", "operation-type", "valuation");
    }
}
