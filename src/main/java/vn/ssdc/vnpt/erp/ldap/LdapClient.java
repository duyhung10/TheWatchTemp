package vn.ssdc.vnpt.erp.ldap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ldap.core.support.LdapContextSource;
import org.springframework.ldap.support.LdapUtils;
import org.springframework.stereotype.Component;

import javax.naming.directory.DirContext;


@Component
public class LdapClient {

    private final Logger logger = LoggerFactory.getLogger(LdapClient.class);

    @Autowired
    private LdapContextSource contextSource;

    public String authenticate(String userDn, String credentials) {
        DirContext ctx = null;
        String userName = null;
        try {
            ctx = contextSource.getContext(userDn, credentials);

            /*
            String filter = "(mail=userDn)".replace("userDn", userDn);
            SearchControls ctrl = new SearchControls();
            ctrl.setSearchScope(SearchControls.SUBTREE_SCOPE);
            NamingEnumeration values = ctx.search("", filter, ctrl);

            if (values.hasMoreElements())
            {
                SearchResult result = (SearchResult) values.next();
                Attributes attribs = result.getAttributes();

                if (null != attribs)
                {
                    for (NamingEnumeration ae = attribs.getAll(); ae.hasMoreElements();)
                    {
                        Attribute atr = (Attribute) ae.next();
                        for (Enumeration vals = atr.getAll(); vals.hasMoreElements();) {
                            if(("name").equals(atr.getID())) {
                                userName = vals.nextElement().toString();
                                break;
                            }
                        }
                        if(userName != null) break;
                    }
                }
            }
            values.close();
            logger.debug("Valid ldap user '{}'", userDn);
            */

            //workaround for Ldap: Return username as first part of email instead of querying from ldap
            if(userDn != null && userDn.contains("@")) {
                userName = userDn.split("@")[0];
            }
            return userName;
        }
        catch (Exception e) {
            // Context creation failed - authentication did not succeed
            logger.debug("Invalid ldap user '{}'", userDn);
            return userName;
        }
        finally {
            // It is imperative that the created DirContext instance is always
            // closed
            LdapUtils.closeContext(ctx);
        }
    }

}
