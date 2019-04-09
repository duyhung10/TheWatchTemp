package vn.ssdc.vnpt.erp.core.errors;

public class OperationTypeBelongToTransferException extends BadRequestAlertException {

    public OperationTypeBelongToTransferException() {
        super("Operation belong to transfer", "operation-type", "transfer");
    }
}
