/**
 * 用户管理类
 * 提供用户的增删改查功能
 * @author 开发者
 * @version 1.0.0
 */
package com.example.user;

import java.util.List;
import java.util.ArrayList;
import java.time.LocalDateTime;

/**
 * 用户实体类
 * 表示系统中的用户信息
 */
public class User {
    private Long id; // 用户ID
    private String name; // 用户名
    private String email; // 邮箱地址
    private LocalDateTime createdAt; // 创建时间
    private boolean isActive; // 用户状态

    /**
     * 构造函数
     * @param name 用户名
     * @param email 邮箱地址
     */
    public User(String name, String email) {
        this.name = name;
        this.email = email;
        this.createdAt = LocalDateTime.now();
        this.isActive = true;
    }

    // Getter 和 Setter 方法
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    /**
     * 获取用户信息
     * @return 用户信息字符串
     */
    public String getInfo() {
        return String.format("User{id=%d, name='%s', email='%s', createdAt=%s, isActive=%s}",
                id, name, email, createdAt, isActive);
    }
}

/**
 * 用户管理服务类
 * 负责用户的业务逻辑处理
 */
public class UserService {
    private List<User> users; // 用户列表

    public UserService() {
        this.users = new ArrayList<>();
    }

    /**
     * 添加新用户
     * @param name 用户名
     * @param email 邮箱地址
     * @return 新创建的用户对象
     */
    public User addUser(String name, String email) {
        User user = new User(name, email);
        users.add(user);
        return user;
    }

    /**
     * 根据邮箱查找用户
     * @param email 邮箱地址
     * @return 用户对象，如果未找到则返回null
     */
    public User findUserByEmail(String email) {
        return users.stream()
                .filter(user -> user.getEmail().equals(email))
                .findFirst()
                .orElse(null);
    }

    /**
     * 获取所有用户
     * @return 用户列表
     */
    public List<User> getAllUsers() {
        return new ArrayList<>(users); // 返回副本避免外部修改
    }
}
