<!-- 用户管理组件 -->
<template>
  <div class="user-management">
    <!-- 用户列表 -->
    <div class="user-list">
      <h2>用户列表</h2>
      <ul>
        <li v-for="user in users" :key="user.id">
          {{ user.name }} - {{ user.email }}
        </li>
      </ul>
    </div>

    <!-- 添加用户表单 -->
    <div class="add-user-form">
      <h3>添加新用户</h3>
      <form @submit.prevent="addUser">
        <input v-model="newUser.name" placeholder="用户名" />
        <input v-model="newUser.email" placeholder="邮箱" />
        <button type="submit">添加</button>
      </form>
    </div>
  </div>
</template>

<script>
// 用户管理组件
export default {
  name: 'UserManagement',
  
  data() {
    return {
      users: [], // 用户数组
      newUser: {
        name: '', // 新用户名
        email: '' // 新用户邮箱
      }
    };
  },

  methods: {
    /**
     * 添加新用户
     * @param {Event} event - 表单提交事件
     */
    addUser(event) {
      if (this.newUser.name && this.newUser.email) {
        const user = {
          id: Date.now(), // 生成唯一ID
          name: this.newUser.name,
          email: this.newUser.email
        };
        
        this.users.push(user); // 添加到用户列表
        
        // 重置表单
        this.newUser.name = '';
        this.newUser.email = '';
      }
    },

    // 删除用户
    removeUser(userId) {
      const index = this.users.findIndex(user => user.id === userId);
      if (index !== -1) {
        this.users.splice(index, 1); // 从数组中移除用户
      }
    }
  },

  mounted() {
    // 组件挂载时初始化数据
    console.log('用户管理组件已加载');
  }
};
</script>

<style scoped>
/* 用户管理组件样式 */
.user-management {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.user-list {
  margin-bottom: 30px; /* 底部间距 */
}

.user-list h2 {
  color: #333; /* 标题颜色 */
  margin-bottom: 15px;
}

.user-list ul {
  list-style: none;
  padding: 0;
}

.user-list li {
  padding: 10px;
  border-bottom: 1px solid #eee; /* 底部边框 */
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.add-user-form {
  background: #f5f5f5; /* 背景色 */
  padding: 20px;
  border-radius: 8px;
}

.add-user-form h3 {
  margin-bottom: 15px;
  color: #555;
}

.add-user-form input {
  display: block;
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.add-user-form button {
  background: #007bff; /* 按钮背景色 */
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.add-user-form button:hover {
  background: #0056b3; /* 悬停时的背景色 */
}
</style>
