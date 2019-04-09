package vn.ssdc.vnpt.erp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import vn.ssdc.vnpt.erp.core.filters.JwtFilter;

/**
 * Created by quocvi3t on 11/13/17.
 */
@Configuration
@EnableJpaRepositories("vn.ssdc.vnpt.erp")
@EnableTransactionManagement
public class SsdcErpConfig {

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        config.addAllowedOrigin("*");
        source.registerCorsConfiguration("/api/**",config);
        return new CorsFilter(source);
    }

    @Bean
    public JwtFilter jwtFilter() {
        return new JwtFilter();
    }
}
