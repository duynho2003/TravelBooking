package com.mytech.travelbookingservice.entities;

import java.util.HashSet;
import java.util.Set;

import com.mytech.travelbookingservice.enums.Gender;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import static org.springframework.data.jpa.domain.AbstractPersistable_.id;

@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper=false)
@Entity
@Table(name = "users")
public class User extends AbstractEntity {

    private static final long serialVersionUID = -3040936926883879912L;

    public User(String email, @NotNull String password, @NotNull String firstName, @NotNull String lastName) {
        super();
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    @Column(length = 64, nullable = false, unique = true)
    @Email
    private String email;

    @Column(length = 128, nullable = false)
    @NotNull
    private String password;

    @Column(name = "first_name", length = 45, nullable = false)
    @NotNull
    private String firstName;

    @Column(name = "last_name", length = 45, nullable = false)
    @NotNull
    private String lastName;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column(length = 1024)
    private String photo;

    @Column(columnDefinition = "tinyint(1) default 1")
    private boolean enabled;

    @Column(columnDefinition = "tinyint(1) default 1")
    private boolean changePassword;

    @Column(name = "reset_password_token", length = 128)
    private String resetPasswordToken;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "users_roles", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles = new HashSet<>();

    public void addRole(Role role) {
        this.roles.add(role);
    }

    @Override
    public String toString() {
        return "User [id=" + id + ", email=" + email + ", firstName=" + firstName + ", lastName=" + lastName
                + ", roles=" + roles + "]";
    }

    @Transient
    public String getPhotosImagePath() {
        if (id == null || photo == null)
            return "/images/default-user.png";

        return "/user-photos/" + this.id + "/" + photo;
    }

    @Transient
    public String getFullName() {
        return firstName + " " + lastName;
    }

    @Transient
    public boolean hasRole(String roleName) {
        if (roleName == null) {
            return false;
        }
        for (Role role : roles) {
            if (roleName.equals(role.getName())) {
                return true;
            }
        }
        return false;
    }
}
