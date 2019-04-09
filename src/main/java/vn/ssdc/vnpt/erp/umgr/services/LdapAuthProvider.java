package vn.ssdc.vnpt.erp.umgr.services;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import vn.ssdc.vnpt.erp.config.ApplicationProperties;
import vn.ssdc.vnpt.erp.ldap.LdapClient;
import vn.ssdc.vnpt.erp.umgr.models.Role;
import vn.ssdc.vnpt.erp.umgr.models.User;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
@EnableConfigurationProperties(ApplicationProperties.class)
public class LdapAuthProvider implements AuthenticationProvider {

    private LdapClient ldapClient;
    private UserService userService;
    private RoleService roleService;

    private final ApplicationProperties applicationProperties;

    public LdapAuthProvider(LdapClient ldapClient, UserService userService, RoleService roleService, ApplicationProperties applicationProperties) {
        this.ldapClient = ldapClient;
        this.userService = userService;
        this.roleService = roleService;
        this.applicationProperties = applicationProperties;
    }

    public User authenticate(String email, String password) {
        User user = handleLDAP(email, password);
        return user;
    }

    public User handleLDAP(String email, String password) {
        if(!applicationProperties.getLdap().isEnabled()) {
            return null;
        }

        User userLDAP = null;
        String checkLDAP = ldapClient.authenticate(email, password);
        if(checkLDAP != null) {
            userLDAP = userService.findByEmail(email);
            if(userLDAP == null) {
                // inser new user
                List<Role> roleList = roleService.search("name==ROLE_USER", null).getContent();
                Set<Role> roles = new HashSet<>();
                roles.add(roleList.get(0));

                userLDAP = new User();
                userLDAP.setEmail(email);
                userLDAP.setEncryptedPassword(password);
                userLDAP.setActive(true);
                userLDAP.setRoles(roles);

                if(!StringUtils.isEmpty(checkLDAP)) {
                    String userName[] = checkLDAP.split(" ");
                    userLDAP.setLastName(userName[0]);
                    String firstName = "";
                    for(int i = 1; i < userName.length; i++) {
                        firstName = firstName + userName[i] + " ";
                    }
                    if(!("").equals(firstName)){
                        firstName = firstName.substring(0, firstName.length() - 1);
                        userLDAP.setFirstName(firstName);
                    }
                }

                userLDAP = userService.create(userLDAP);
            }
        }
        return userLDAP;
    }
}
