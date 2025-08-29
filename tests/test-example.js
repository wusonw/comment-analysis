// 这是一个测试文件，用于演示注释统计功能

/**
 * 用户管理模块
 * 包含用户的增删改查功能
 * @author 开发者
 * @version 1.0.0
 */

// 导入依赖
import { createUser, updateUser, deleteUser } from './user-service.js';

// 用户类定义
class User {
  constructor(name, email) {
    this.name = name; // 用户名
    this.email = email; // 邮箱地址
    this.createdAt = new Date(); // 创建时间
  }

  /**
   * 获取用户信息
   * @returns {Object} 用户信息对象
   */
  getInfo() {
    return {
      name: this.name,
      email: this.email,
      createdAt: this.createdAt
    };
  }

  // 更新用户信息
  updateInfo(newInfo) {
    this.name = newInfo.name || this.name; // 如果提供了新名字就更新
    this.email = newInfo.email || this.email; // 如果提供了新邮箱就更新
  }
}

// 用户管理函数
function manageUsers() {
  const users = []; // 用户数组

  // 添加用户
  function addUser(name, email) {
    const user = new User(name, email);
    users.push(user);
    return user;
  }

  // 删除用户
  function removeUser(email) {
    const index = users.findIndex(user => user.email === email);
    if (index !== -1) {
      users.splice(index, 1);
      return true;
    }
    return false;
  }

  return {
    addUser,
    removeUser,
    getUsers: () => users // 返回用户列表
  };
}

// 导出模块
export default manageUsers;
