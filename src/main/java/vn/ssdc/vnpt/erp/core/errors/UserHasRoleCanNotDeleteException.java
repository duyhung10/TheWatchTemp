package vn.ssdc.vnpt.erp.core.errors;

public class UserHasRoleCanNotDeleteException extends BadRequestAlertException {

    public UserHasRoleCanNotDeleteException() {
        super("Can not delete User", "userAndPermission", "userHasRole");
    }
}
