package vn.ssdc.vnpt.erp.umgr.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import vn.ssdc.vnpt.erp.core.IdEntity;

import javax.persistence.*;
import java.util.Set;

/**
 * Created by quocvi3t on 11/16/17.
 */
@Entity
@Table(name="base_roles")
public class Role extends IdEntity {

    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    private String description;

    @ManyToMany
    @JoinTable(
            name = "base_role_privilege",
            joinColumns = @JoinColumn(name="role_id",referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name="privilege_id",referencedColumnName = "id")
    )
    private Set<Privilege> privileges;


    @ManyToMany(mappedBy = "roles")
    @JsonIgnoreProperties({"email","active","firstName","lastName","created","createdBy","updated","updatedBy","roles","authorities"})
    private Set<User> users;

    public Role() {

    }

    public Set<User> getUsers() {
        return users;
    }

    public void setUsers(Set<User> users) {
        this.users = users;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Set<Privilege> getPrivileges() {
        return privileges;
    }

    public void setPrivileges(Set<Privilege> privileges) {
        this.privileges = privileges;
    }
}
