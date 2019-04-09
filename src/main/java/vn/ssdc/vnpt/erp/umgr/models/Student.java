package vn.ssdc.vnpt.erp.umgr.models;

import org.hibernate.validator.constraints.Email;
import vn.ssdc.vnpt.erp.core.IdEntity;

import javax.persistence.*;
import javax.validation.constraints.Size;

@Entity
@Table(name = "base_students")
public class Student extends IdEntity {
    private String name;
    @Email
    @Size(min = 5, max = 100)
    @Column(length = 100, unique = true)
    private String email;
    private String phone;
    private String address;

    public Student(){

    }

    public Student(String name, String email, String phone, String address) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.address = address;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}
