package vn.ssdc.vnpt.erp.core.errors;

import org.zalando.problem.AbstractThrowableProblem;
import org.zalando.problem.Status;

public class ConfirmPasswordException extends AbstractThrowableProblem {

    public ConfirmPasswordException() {
        super(ErrorConstants.CONFIRM_PASSWORD, "Password and confirm password don't match", Status.BAD_REQUEST);
    }
}
