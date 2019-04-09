package vn.ssdc.vnpt.erp.umgr.models;

import vn.ssdc.vnpt.erp.core.IdEntity;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * Created by quocvi3t on 11/16/17.
 */
@Entity
@Table(name = "base_privileges")
public class Privilege extends IdEntity {

    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    private String description;

    public Privilege() {

    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
