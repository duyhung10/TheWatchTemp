package vn.ssdc.vnpt.erp.core;


import org.javers.core.metamodel.annotation.DiffIgnore;

import javax.persistence.*;
import java.io.Serializable;

/**
 * Created by quocvi3t on 11/11/17.
 */
@MappedSuperclass
public class AbstractEntity implements Serializable {

    private Long created;
    @DiffIgnore
    private Long updated;
    private String createdBy;
    @DiffIgnore
    private String updatedBy;
    private Boolean active;

    public void setActive(Boolean active) {
        this.active = active;
    }


    public Boolean getActive() {
        return active;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public String getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }



    public Long getCreated() {
        return created;
    }

    public void setCreated(Long created) {
        this.created = created;
    }

    public Long getUpdated() {
        return updated;
    }

    public void setUpdated(Long updated) {
        this.updated = updated;
    }
}
