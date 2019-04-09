package vn.ssdc.vnpt.erp.core.errors;

public class RoleHasNoPrivilegeException extends BadRequestAlertException {

    public RoleHasNoPrivilegeException() {
        super("Role has no privilege", "userAndPermission", "roleHasNoPrivilege");
    }
}
