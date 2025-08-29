#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
用户管理模块
包含用户的增删改查功能
作者: 开发者
版本: 1.0.0
"""

import json
from datetime import datetime
from typing import List, Dict, Optional


class User:
    """用户类，用于表示系统中的用户"""
    
    def __init__(self, name: str, email: str):
        """
        初始化用户对象
        
        Args:
            name: 用户名
            email: 邮箱地址
        """
        self.name = name  # 用户名
        self.email = email  # 邮箱地址
        self.created_at = datetime.now()  # 创建时间
        self.is_active = True  # 用户状态
    
    def get_info(self) -> Dict:
        """
        获取用户信息
        
        Returns:
            包含用户信息的字典
        """
        return {
            'name': self.name,
            'email': self.email,
            'created_at': self.created_at.isoformat(),
            'is_active': self.is_active
        }
    
    def update_info(self, new_info: Dict) -> None:
        """
        更新用户信息
        
        Args:
            new_info: 包含新信息的字典
        """
        if 'name' in new_info:
            self.name = new_info['name']  # 更新用户名
        if 'email' in new_info:
            self.email = new_info['email']  # 更新邮箱
        if 'is_active' in new_info:
            self.is_active = new_info['is_active']  # 更新状态


class UserManager:
    """用户管理器，负责用户的增删改查操作"""
    
    def __init__(self):
        """初始化用户管理器"""
        self.users: List[User] = []  # 用户列表
        self._load_users()  # 加载用户数据
    
    def add_user(self, name: str, email: str) -> User:
        """
        添加新用户
        
        Args:
            name: 用户名
            email: 邮箱地址
            
        Returns:
            新创建的用户对象
        """
        # 检查邮箱是否已存在
        if self.get_user_by_email(email):
            raise ValueError(f"邮箱 {email} 已存在")
        
        user = User(name, email)  # 创建新用户
        self.users.append(user)  # 添加到用户列表
        self._save_users()  # 保存到文件
        return user
    
    def remove_user(self, email: str) -> bool:
        """
        删除用户
        
        Args:
            email: 要删除的用户邮箱
            
        Returns:
            是否删除成功
        """
        user = self.get_user_by_email(email)
        if user:
            self.users.remove(user)  # 从列表中移除
            self._save_users()  # 保存更改
            return True
        return False
    
    def get_user_by_email(self, email: str) -> Optional[User]:
        """
        根据邮箱查找用户
        
        Args:
            email: 邮箱地址
            
        Returns:
            用户对象，如果未找到则返回None
        """
        for user in self.users:
            if user.email == email:
                return user
        return None
    
    def get_all_users(self) -> List[User]:
        """
        获取所有用户
        
        Returns:
            用户列表
        """
        return self.users.copy()  # 返回副本避免外部修改
    
    def _load_users(self) -> None:
        """从文件加载用户数据"""
        try:
            with open('users.json', 'r', encoding='utf-8') as f:
                data = json.load(f)
                self.users = [User(**user_data) for user_data in data]
        except FileNotFoundError:
            # 文件不存在时创建空列表
            self.users = []
        except json.JSONDecodeError:
            # JSON格式错误时重置为空列表
            print("警告: 用户数据文件格式错误，重置为空列表")
            self.users = []
    
    def _save_users(self) -> None:
        """保存用户数据到文件"""
        data = [user.get_info() for user in self.users]
        with open('users.json', 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)


# 主函数
def main():
    """主函数，演示用户管理功能"""
    manager = UserManager()  # 创建用户管理器
    
    # 添加一些测试用户
    try:
        user1 = manager.add_user("张三", "zhangsan@example.com")
        user2 = manager.add_user("李四", "lisi@example.com")
        print(f"添加用户成功: {user1.name}, {user2.name}")
    except ValueError as e:
        print(f"添加用户失败: {e}")
    
    # 显示所有用户
    users = manager.get_all_users()
    print(f"当前共有 {len(users)} 个用户:")
    for user in users:
        print(f"  - {user.name} ({user.email})")


if __name__ == "__main__":
    main()  # 运行主函数
