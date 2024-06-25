package com.example.city_tours.config;

import com.example.city_tours.entity.Permission;
import com.example.city_tours.entity.Role;
import com.example.city_tours.entity.User;
import com.example.city_tours.enums.UserStatus;
import com.example.city_tours.repository.PermissionRepository;
import com.example.city_tours.repository.RoleRepository;
import com.example.city_tours.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class SetupDataLoader implements
        ApplicationListener<ContextRefreshedEvent> {

    boolean alreadySetup = false;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PermissionRepository permissionRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void onApplicationEvent(ContextRefreshedEvent event) {

        if (alreadySetup) {
            return;
        }

        User existingAdmin = userRepository.findByUsername("admin");

        if (existingAdmin != null) {
            alreadySetup = true;
            return;
        }

        if (alreadySetup)
            return;

        // Permissions
        Permission readPermission
                = createPermissionIfNotFound("READ_PERMISSION");
        Permission createPermission
                = createPermissionIfNotFound("CREATE_PERMISSION");
        Permission updatePermission
                = createPermissionIfNotFound("UPDATE_PERMISSION");

        // Website info
        Permission readWebInfo
                = createPermissionIfNotFound("READ_WEB_INFO");
        Permission createWebInfo
                = createPermissionIfNotFound("CREATE_WEB_INFO");
        Permission updateWebInfo
                = createPermissionIfNotFound("UPDATE_WEB_INFO");

        // Account
        Permission readAccount
                = createPermissionIfNotFound("READ_ACCOUNT");
        Permission createAccount
                = createPermissionIfNotFound("CREATE_ACCOUNT");
        Permission updateAccount
                = createPermissionIfNotFound("UPDATE_ACCOUNT");

        // Tours
        Permission readTour
                = createPermissionIfNotFound("READ_TOUR");
        Permission createTour
                = createPermissionIfNotFound("CREATE_TOUR");
        Permission updateTour
                = createPermissionIfNotFound("UPDATE_TOUR");

        // Hotels
        Permission readHotel
                = createPermissionIfNotFound("READ_HOTEL");
        Permission createHotel
                = createPermissionIfNotFound("CREATE_HOTEL");
        Permission updateHotel
                = createPermissionIfNotFound("UPDATE_HOTEL");

        // Chats
        Permission readChat
                = createPermissionIfNotFound("READ_CHAT");
        Permission createChat
                = createPermissionIfNotFound("CREATE_CHAT");

        List<Permission> adminPermissions = Arrays.asList(
                readPermission, createPermission, updatePermission,
                readWebInfo, createWebInfo, updateWebInfo,
                readAccount, createAccount, updateAccount,
                readTour, createTour, updateTour,
                readHotel, createHotel, updateHotel,
                readChat, createChat);

        List<Permission> staffPermissions = Arrays.asList(
                readChat, createChat);

        List<Permission> customerPermissions = Arrays.asList(
                readPermission, readTour, readHotel);

        createRoleIfNotFound("ROLE_ADMIN", adminPermissions);
        createRoleIfNotFound("ROLE_STAFF", staffPermissions);
        createRoleIfNotFound("ROLE_CUSTOMER", customerPermissions);

        // Save admin account
        Role adminRole = roleRepository.findByName("ROLE_ADMIN");
        User admin = new User();
        admin.setUsername("admin");
        admin.setEmail("admin@gmail.com");
        admin.setPassword(passwordEncoder.encode("admin"));
        admin.setStatus(UserStatus.ACTIVE);

        Set<Role> adminRoles = new HashSet<>();
        adminRoles.add(adminRole);
        admin.setRoles(adminRoles);

        userRepository.save(admin);

        // Save staff account
        Role staffRole = roleRepository.findByName("ROLE_STAFF");
        User staff = new User();
        staff.setUsername("staff");
        staff.setEmail("staff@gmail.com");
        staff.setPassword(passwordEncoder.encode("staff"));
        staff.setStatus(UserStatus.ACTIVE);

        Set<Role> staffRoles = new HashSet<>();
        staffRoles.add(staffRole);
        staff.setRoles(staffRoles);

        userRepository.save(staff);

        alreadySetup = true;
    }

    @Transactional
    Permission createPermissionIfNotFound(String name) {

        Permission permission = permissionRepository.findByName(name);
        if (permission == null) {
            permission = new Permission();
            permission.setName(name);
            permissionRepository.save(permission);
        }
        return permission;
    }

    @Transactional
    Role createRoleIfNotFound(
            String name, List<Permission> permissions) {

        Role role = roleRepository.findByName(name);
        if (role == null) {
            role = new Role();
            role.setName(name);

            Set<Permission> permissionSet = permissions.stream().collect(Collectors.toSet());
            role.setPermissions(permissionSet);

            roleRepository.save(role);
        }
        return role;
    }
}
