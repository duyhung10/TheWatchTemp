package vn.ssdc.vnpt.erp.core;

import javax.persistence.Id;
import javax.persistence.MappedSuperclass;

@MappedSuperclass
public class ManualIdEntity extends AbstractEntity {
    @Id
    public Long id;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
