package vn.ssdc.vnpt.erp.core.errors;

import org.zalando.problem.AbstractThrowableProblem;
import org.zalando.problem.Status;

public class TokenExpireTimeException extends AbstractThrowableProblem {

    public TokenExpireTimeException() {
        super(ErrorConstants.TOKEN_EXPIRE_TIME, "Incorrect token or token expire time", Status.BAD_REQUEST);
    }
}
