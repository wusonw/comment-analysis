//! 用户管理模块
//! 提供用户的增删改查功能

use std::collections::HashMap;
use chrono::{DateTime, Utc};

/// 用户结构体
/// 表示系统中的用户信息
#[derive(Debug, Clone)]
pub struct User {
    pub id: u64,                    // 用户ID
    pub name: String,               // 用户名
    pub email: String,              // 邮箱地址
    pub created_at: DateTime<Utc>,  // 创建时间
    pub is_active: bool,            // 用户状态
}

impl User {
    /// 创建新用户
    /// 
    /// # Arguments
    /// * `name` - 用户名
    /// * `email` - 邮箱地址
    /// 
    /// # Returns
    /// 新创建的用户对象
    pub fn new(name: String, email: String) -> Self {
        Self {
            id: 0, // 稍后设置
            name,
            email,
            created_at: Utc::now(),
            is_active: true,
        }
    }

    /// 获取用户信息
    /// 
    /// # Returns
    /// 格式化的用户信息字符串
    pub fn get_info(&self) -> String {
        format!(
            "User {{ id: {}, name: {}, email: {}, created_at: {}, is_active: {} }}",
            self.id, self.name, self.email, self.created_at, self.is_active
        )
    }

    /// 更新用户信息
    /// 
    /// # Arguments
    /// * `new_name` - 新用户名
    /// * `new_email` - 新邮箱地址
    pub fn update_info(&mut self, new_name: Option<String>, new_email: Option<String>) {
        if let Some(name) = new_name {
            self.name = name; // 更新用户名
        }
        if let Some(email) = new_email {
            self.email = email; // 更新邮箱
        }
    }
}

/// 用户管理器
/// 负责用户的增删改查操作
pub struct UserManager {
    users: HashMap<u64, User>, // 用户存储
    next_id: u64,              // 下一个用户ID
}

impl UserManager {
    /// 创建用户管理器
    pub fn new() -> Self {
        Self {
            users: HashMap::new(),
            next_id: 1,
        }
    }

    /// 添加新用户
    /// 
    /// # Arguments
    /// * `name` - 用户名
    /// * `email` - 邮箱地址
    /// 
    /// # Returns
    /// 新创建的用户对象
    pub fn add_user(&mut self, name: String, email: String) -> User {
        let mut user = User::new(name, email);
        user.id = self.next_id;
        self.next_id += 1;
        
        self.users.insert(user.id, user.clone());
        user
    }

    /// 根据邮箱查找用户
    /// 
    /// # Arguments
    /// * `email` - 邮箱地址
    /// 
    /// # Returns
    /// 用户对象，如果未找到则返回None
    pub fn find_user_by_email(&self, email: &str) -> Option<&User> {
        self.users.values().find(|user| user.email == email)
    }

    /// 获取所有用户
    /// 
    /// # Returns
    /// 用户列表
    pub fn get_all_users(&self) -> Vec<&User> {
        self.users.values().collect()
    }

    /// 删除用户
    /// 
    /// # Arguments
    /// * `email` - 要删除的用户邮箱
    /// 
    /// # Returns
    /// 是否删除成功
    pub fn remove_user(&mut self, email: &str) -> bool {
        if let Some(user_id) = self.users
            .iter()
            .find(|(_, user)| user.email == email)
            .map(|(id, _)| *id) {
            self.users.remove(&user_id);
            true
        } else {
            false
        }
    }
}

/// 用户管理器的默认实现
impl Default for UserManager {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    /// 测试创建用户
    #[test]
    fn test_create_user() {
        let user = User::new("张三".to_string(), "zhangsan@example.com".to_string());
        assert_eq!(user.name, "张三");
        assert_eq!(user.email, "zhangsan@example.com");
        assert!(user.is_active);
    }

    /// 测试用户管理器
    #[test]
    fn test_user_manager() {
        let mut manager = UserManager::new();
        
        // 添加用户
        let user = manager.add_user("李四".to_string(), "lisi@example.com".to_string());
        assert_eq!(user.id, 1);
        
        // 查找用户
        let found_user = manager.find_user_by_email("lisi@example.com");
        assert!(found_user.is_some());
        assert_eq!(found_user.unwrap().name, "李四");
        
        // 删除用户
        let removed = manager.remove_user("lisi@example.com");
        assert!(removed);
        
        // 确认用户已删除
        let found_user = manager.find_user_by_email("lisi@example.com");
        assert!(found_user.is_none());
    }
}
