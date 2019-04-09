package vn.ssdc.vnpt.erp.umgr.services;

import vn.ssdc.vnpt.erp.umgr.models.User;

public interface AuthenticationProvider {
    User authenticate(String email, String password);
}
