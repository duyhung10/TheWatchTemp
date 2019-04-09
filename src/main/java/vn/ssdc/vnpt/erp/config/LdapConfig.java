package vn.ssdc.vnpt.erp.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.core.support.LdapContextSource;

@Configuration
@EnableConfigurationProperties(ApplicationProperties.class)
public class LdapConfig {

    private final ApplicationProperties applicationProperties;

    @Autowired
    public LdapConfig(ApplicationProperties applicationProperties) {
        this.applicationProperties = applicationProperties;
    }

    @Bean
    public LdapContextSource getContextSource() throws Exception{
        LdapContextSource ldapContextSource = new LdapContextSource();
        ldapContextSource.setUrl(applicationProperties.getLdap().getUrl());
        ldapContextSource.setBase(applicationProperties.getLdap().getBase());
        ldapContextSource.setUserDn(applicationProperties.getLdap().getUserDN());
        ldapContextSource.setPassword(applicationProperties.getLdap().getPassword());
        return ldapContextSource;
    }

    @Bean
    public LdapTemplate ldapTemplate() throws Exception{
        LdapTemplate ldapTemplate = new LdapTemplate(getContextSource());
        ldapTemplate.setIgnorePartialResultException(true);
        ldapTemplate.setContextSource(getContextSource());
        return ldapTemplate;
    }

}
