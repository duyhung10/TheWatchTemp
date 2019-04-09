package vn.ssdc.vnpt.erp.core.errors;

public class SequenceHasOperationTypeActiveException extends BadRequestAlertException {

    public SequenceHasOperationTypeActiveException() {
        super("Sequence have operation type active", "sequence", "hasOperationTypeActive");
    }
}
