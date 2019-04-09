package vn.ssdc.vnpt.erp.core;

import javax.persistence.Column;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;

@MappedSuperclass
public class NamedEntity extends AbstractEntity{
    @Id
    @Column(name = "name")
    private String id;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
}
