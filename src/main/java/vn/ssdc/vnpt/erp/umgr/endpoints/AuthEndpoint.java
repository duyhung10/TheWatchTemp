package vn.ssdc.vnpt.erp.umgr.endpoints;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Required;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.ssdc.vnpt.erp.core.Constants;
import vn.ssdc.vnpt.erp.umgr.endpoints.vm.LoginVM;
import vn.ssdc.vnpt.erp.umgr.services.AuthService;

/**
 * Created by quocvi3t on 11/17/17.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthEndpoint {
    private AuthService authService;
    @Autowired
    public AuthEndpoint(AuthService authService) {
        this.authService = authService;
    }

    @RequestMapping(path = "/token", method = RequestMethod.POST)
    public ResponseEntity<JWTToken> token(@RequestBody LoginVM loginVM) {
        String token = this.authService.token(loginVM.getEmail(),loginVM.getPassword(),loginVM.getRememberMe());
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add(Constants.AUTH_HEADER_STRING,"Bearer " + token);
        JWTToken jwtToken = new JWTToken(token);
        return new ResponseEntity<JWTToken>(jwtToken,httpHeaders, HttpStatus.OK);
    }

    /**
     * Object to return as body in JWT Authentication.
     */
    static class JWTToken {

        private String idToken;

        JWTToken(String idToken) {
            this.idToken = idToken;
        }

        @JsonProperty("id_token")
        String getIdToken() {
            return idToken;
        }

        void setIdToken(String idToken) {
            this.idToken = idToken;
        }
    }
}
