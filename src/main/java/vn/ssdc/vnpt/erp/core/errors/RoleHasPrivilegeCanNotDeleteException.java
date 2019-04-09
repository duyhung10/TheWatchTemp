package vn.ssdc.vnpt.erp.core.errors;

public class RoleHasPrivilegeCanNotDeleteException extends BadRequestAlertException {

    public RoleHasPrivilegeCanNotDeleteException() {
        super("Can not delete Role", "userAndPermission", "roleHasPrivilege");
    }
}
