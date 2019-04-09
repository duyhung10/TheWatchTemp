package vn.ssdc.vnpt.erp.umgr.endpoints;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import vn.ssdc.vnpt.erp.config.ApplicationProperties;
import vn.ssdc.vnpt.erp.core.CrudApiEndpoint;
import vn.ssdc.vnpt.erp.umgr.endpoints.vm.ResetPasswordVM;
import vn.ssdc.vnpt.erp.umgr.models.User;
import vn.ssdc.vnpt.erp.umgr.services.UserService;
import vn.ssdc.vnpt.erp.umgr.utils.SecurityUtils;

/**
 * Created by quocvi3t on 11/14/17.
 */
@RestController
@RequestMapping("/api/users")
@EnableConfigurationProperties(ApplicationProperties.class)
public class UserApiEndpoint extends CrudApiEndpoint<User,Long> {

    private static Logger logger = LoggerFactory.getLogger(UserApiEndpoint.class);
    private UserService userService;

    @Autowired
    public UserApiEndpoint(UserService service) {
        super(service);
        this.userService = service;
        this.baseUrl = "/api/users";
    }

    @RequestMapping(path="{id}/change-password", method = RequestMethod.POST)
    public void changePassword(@PathVariable("id") Long id,
                               @RequestParam("password") String password,
                               @RequestParam("confirmPassword") String confirmPassword) {
        userService.changePassword(id,password,confirmPassword);
    }

    @RequestMapping(path = "/current", method = RequestMethod.GET)
    public User currentUser() {
        String email = SecurityUtils.getCurrentUserLogin();
        return userService.findUserWithAuthorities(email);
    }

    @RequestMapping(path = "/forgot-password/init", method = RequestMethod.POST)
    public void requestForgotPassword(@RequestParam("email") String email) {
        userService.requestForgotPassword(email);
    }

    @RequestMapping(path = "/forgot-password/finish", method = RequestMethod.POST)
    public void changeForgotPassword(@RequestBody ResetPasswordVM resetPasswordVM) {
        userService.changeForgotPassword(resetPasswordVM);
    }

    @RequestMapping(path = "{userId}/activate", method = RequestMethod.POST)
    public void activateUser(@PathVariable("userId") Long userId, @RequestParam("token") String activationToken) {
        userService.activeUser(userId, activationToken);
    }

    @RequestMapping(path = "{userId}/uploadAvatar", method = RequestMethod.POST)
    public void uploadAvatar(@PathVariable("userId") Long userId, @RequestParam("file") MultipartFile file) {
        userService.uploadAvatar(userId, file);
    }

    @RequestMapping(path = "{userId}/deleteAvatar", method = RequestMethod.POST)
    public void deleteAvatar(@PathVariable("userId") Long userId) {
        userService.deleteAvatar(userId);
    }
}
