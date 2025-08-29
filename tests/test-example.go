// Package user 提供用户管理功能
// 包含用户的增删改查操作
package user

import (
	"fmt"
	"time"
)

// User 表示系统中的用户
type User struct {
	ID        int       `json:"id"`        // 用户ID
	Name      string    `json:"name"`      // 用户名
	Email     string    `json:"email"`     // 邮箱地址
	CreatedAt time.Time `json:"createdAt"` // 创建时间
	IsActive  bool      `json:"isActive"`  // 用户状态
}

// NewUser 创建新用户
// name: 用户名
// email: 邮箱地址
// 返回新创建的用户对象
func NewUser(name, email string) *User {
	return &User{
		Name:      name,
		Email:     email,
		CreatedAt: time.Now(),
		IsActive:  true,
	}
}

// GetInfo 获取用户信息
// 返回格式化的用户信息字符串
func (u *User) GetInfo() string {
	return fmt.Sprintf("User{ID: %d, Name: %s, Email: %s, CreatedAt: %s, IsActive: %t}",
		u.ID, u.Name, u.Email, u.CreatedAt.Format("2006-01-02 15:04:05"), u.IsActive)
}

// UpdateInfo 更新用户信息
// newName: 新用户名
// newEmail: 新邮箱地址
func (u *User) UpdateInfo(newName, newEmail string) {
	if newName != "" {
		u.Name = newName // 更新用户名
	}
	if newEmail != "" {
		u.Email = newEmail // 更新邮箱
	}
}

// UserManager 用户管理器
// 负责用户的增删改查操作
type UserManager struct {
	users []*User // 用户列表
}

// NewUserManager 创建用户管理器
func NewUserManager() *UserManager {
	return &UserManager{
		users: make([]*User, 0),
	}
}

// AddUser 添加新用户
// name: 用户名
// email: 邮箱地址
// 返回新创建的用户对象
func (um *UserManager) AddUser(name, email string) *User {
	user := NewUser(name, email)
	user.ID = len(um.users) + 1 // 生成ID
	um.users = append(um.users, user)
	return user
}

// FindUserByEmail 根据邮箱查找用户
// email: 邮箱地址
// 返回用户对象，如果未找到则返回nil
func (um *UserManager) FindUserByEmail(email string) *User {
	for _, user := range um.users {
		if user.Email == email {
			return user
		}
	}
	return nil
}

// GetAllUsers 获取所有用户
// 返回用户列表的副本
func (um *UserManager) GetAllUsers() []*User {
	// 创建副本避免外部修改
	result := make([]*User, len(um.users))
	copy(result, um.users)
	return result
}

// RemoveUser 删除用户
// email: 要删除的用户邮箱
// 返回是否删除成功
func (um *UserManager) RemoveUser(email string) bool {
	for i, user := range um.users {
		if user.Email == email {
			// 从切片中移除用户
			um.users = append(um.users[:i], um.users[i+1:]...)
			return true
		}
	}
	return false
}
