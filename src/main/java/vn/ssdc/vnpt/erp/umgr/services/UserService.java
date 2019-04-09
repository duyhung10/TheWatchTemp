package vn.ssdc.vnpt.erp.umgr.services;

import org.aspectj.apache.bcel.classfile.Constant;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import javax.transaction.Transactional;
import vn.ssdc.vnpt.erp.config.ApplicationProperties;
import vn.ssdc.vnpt.erp.core.Constants;
import vn.ssdc.vnpt.erp.core.CrudService;
import vn.ssdc.vnpt.erp.core.errors.*;
import vn.ssdc.vnpt.erp.umgr.endpoints.vm.ResetPasswordVM;
import vn.ssdc.vnpt.erp.umgr.models.Privilege;
import vn.ssdc.vnpt.erp.umgr.models.Role;
import vn.ssdc.vnpt.erp.umgr.repositories.UserRepository;
import vn.ssdc.vnpt.erp.umgr.models.User;
import vn.ssdc.vnpt.erp.umgr.utils.StringUtils;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Set;
import java.util.UUID;
/**
 * Created by quocvi3t on 11/14/17.
 */
@Service
@Transactional
@EnableConfigurationProperties(ApplicationProperties.class)
public class UserService extends CrudService<User,Long>{

    private static Logger logger = LoggerFactory.getLogger(UserService.class);

    private UserRepository userRepository;
    private MailService mailService;
    private RoleService roleService;

    private final ApplicationProperties applicationProperties;
    private List<AuthenticationProvider> authenticationProviders;

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    public void setAuthenticationProviders(List<AuthenticationProvider> authenticationProviders) {
        this.authenticationProviders = authenticationProviders;
    }

    public UserService(UserRepository userRepository, MailService mailService, RoleService roleService, ApplicationProperties applicationProperties) {
        this.repository = this.userRepository = userRepository;
        this.mailService = mailService;
        this.roleService = roleService;
        this.applicationProperties = applicationProperties;
    }

    public Boolean changePassword(Long id, String password, String confirmPassword) {
        logger.debug("Resetting password for user #{}",id);
        if(password == null || !password.equals(confirmPassword)) {
            throw new InvalidPasswordException();
        }
        User user = get(id);
        user.setEncryptedPassword(password);
        this.repository.save(user);
        logger.debug("Successfully reset password for user #{}",id);
        return true;
    }

    public User authenticate(String email, String password) {
        User user;
        try {
            user = findByEmail(email);
            if(user.authenticate(password)) {
                return user;
            } else {
                user = null;
            }
        } catch(EmailNotFoundException ex) {
            user = null;
        }

        //check other authentication provider, ex: Ldap
        if (user == null) {
            for (AuthenticationProvider authenticationProvider : authenticationProviders) {
                user = authenticationProvider.authenticate(email, password);
                if (user != null) {
                    break;
                }
            }
        }
        //if user still null, return invalid credentials exception
        if(user == null) {
            throw new InvalidCredentialsException();
        }
        return user;
    }


    public User findByEmail(String email) {
        User user = this.userRepository.findOneByEmailIgnoreCase(email);
        if(user == null) {
            throw new EmailNotFoundException();
        }
        return user;
    }

    public User findUserWithAuthorities(String email) {
        User user = this.userRepository.findOneWithRolesByEmail(email);
        if(user == null) {
            throw new EmailNotFoundException();
        }
        for(Role role : user.getRoles()) {
            user.getAuthorities().add(role.getName());
            for(Privilege privilege : role.getPrivileges()) {
                user.getAuthorities().add(privilege.getName());
            }
        }
        return user;
    }

    public User findOneWithRoles(Long id) {
        return this.userRepository.findOneWithRolesById(id);
    }

    public void activeUser(Long userId, String activationToken) {
        User user = userRepository.findOne(userId);
        if(user == null) {
            throw new EmailNotFoundException();
        }

        if(user.getActivationToken() != null && activationToken.equals(user.getActivationToken()) && StringUtils.checkExpireTime(user.getActivationTokenCreated(), applicationProperties.getActivation().getExpirePeriod())) {
            user.setActive(true);
            user.setActivationToken(null);
            user.setActivated(System.currentTimeMillis());
            update(userId, user);
            logger.debug("Activated user: #{}", userId);
        } else throw new TokenExpireTimeException();
    }

    public void requestForgotPassword(String email) {
        User user = this.userRepository.findOneByEmailIgnoreCase(email);
        if(user == null) {
            throw new EmailNotFoundException();
        }

        user.setForgotPasswordToken(UUID.randomUUID().toString());
        user.setForgotPasswordTokenCreated(System.currentTimeMillis());
        update(user.getId(), user);
        if(applicationProperties.getActivation().isEnableMail()) mailService.sendPasswordResetMail(user);
        logger.debug("Request forgot password user: #{}", user.getId());
    }

    public void changeForgotPassword(ResetPasswordVM resetPasswordVM) {
        User user = userRepository.findOneByEmailIgnoreCase(resetPasswordVM.getEmail());
        if(user == null) throw new EmailNotFoundException();
        if(!resetPasswordVM.getNewPassword().equals(resetPasswordVM.getConfirmPassword())) throw new ConfirmPasswordException();

        if(user.getForgotPasswordToken() != null && resetPasswordVM.getForgotPasswordToken().equals(user.getForgotPasswordToken()) && StringUtils.checkExpireTime(user.getForgotPasswordTokenCreated(), applicationProperties.getActivation().getExpirePeriod())) {
            user.setPassword(resetPasswordVM.getNewPassword());
            user.setForgotPasswordToken(null);
            update(user.getId(), user);
            logger.debug("Change forgot password user: #{}", user.getId());
        } else throw new TokenExpireTimeException();
    }

    @Override
    protected void beforeCreate(User entity) {
        super.beforeCreate(entity);
        //hash password before saving
        if(entity.getPassword() == null || entity.getPassword().isEmpty()) {
            throw new InvalidPasswordException();
        }
        entity.setEncryptedPassword(entity.getPassword());
        if(!entity.getActive()) {
            entity.setActivationToken(UUID.randomUUID().toString());
            entity.setActivationTokenCreated(System.currentTimeMillis());
            entity.setActive(false);
        }

        // check email is exist
        User user = this.userRepository.findOneByEmailIgnoreCase(entity.getEmail());
        if(user != null) {
            throw new EmailAlreadyUsedException();
        }
    }

    @Override
    protected void afterCreate(User entity) {
        // Set user role default
        Set<Role> roles = entity.getRoles();
        boolean exist = false;
        for (Role role : roles) {
            if(role.getName().equals(Constants.ROLE_USER)) {
                exist = true;
            }
        }
        if(!exist) {
            Role roleUser = roleService.getDefaultUserRole();
            if(roleUser != null) {
                roles.add(roleUser);
            }
        }

        if(entity.getActive()!=null && entity.getActive() && applicationProperties.getActivation().isEnableMail()) {
            mailService.sendCreationEmail(entity);
        }
    }

    @Override
    protected void beforeUpdate(User entity) {
        super.beforeUpdate(entity);
        User old = get(entity.getId());
        //password is not allowed to update here
        entity.setPassword(old.getPassword());
    }

    @Override
    protected void beforeDelete(User entity) {
        super.beforeDelete(entity);
        if(entity.getRoles() != null && !entity.getRoles().isEmpty())
            throw new UserHasRoleCanNotDeleteException();
    }

    @Override
    public User get(Long id) {
        return this.userRepository.findOneWithRolesById(id);
    }

    public void uploadAvatar(Long userId, MultipartFile avatar) {
        try {
            File file = convert(avatar);
            byte[] picInBytes = new byte[(int) file.length()];
            if(picInBytes.length > 64 * 1024) {
                if(file.exists()) {
                    file.delete();
                }
                throw new ImageTooLargeException();
            }

            FileInputStream fileInputStream = new FileInputStream(file);
            fileInputStream.read(picInBytes);
            fileInputStream.close();
            User user = userRepository.findOne(userId);
            if(user != null) {
                user.setUserAvatar(picInBytes);
                update(userId, user);
            }
            if(file.exists()) {
                file.delete();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void deleteAvatar(Long userId) {
        User user = get(userId);
        if(user != null) {
            user.setUserAvatar(null);
            update(userId, user);
        }
    }

    public File convert(MultipartFile file)
    {
        File convFile = new File(file.getOriginalFilename());
        try {
            convFile.createNewFile();
            FileOutputStream fos = new FileOutputStream(convFile);
            fos.write(file.getBytes());
            fos.close();
        } catch (IOException e) {
            logger.error("Exception occurs: ",e);
        }

        return convFile;
    }

    public List<String> findEmailByIds(String ids){
        String query = "SELECT email FROM base_users WHERE id in " + ids;
        Query q = entityManager.createNativeQuery(query);
        return q.getResultList();
    }
}
