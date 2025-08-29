#!/bin/bash

# 用户管理脚本
# 提供用户的增删改查功能
# 作者: 开发者
# 版本: 1.0.0

# 用户数据文件
USER_FILE="users.txt"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 初始化用户文件
init_user_file() {
    if [ ! -f "$USER_FILE" ]; then
        touch "$USER_FILE"
        echo "# 用户数据文件" > "$USER_FILE"
        echo "# 格式: ID|用户名|邮箱|创建时间|状态" >> "$USER_FILE"
    fi
}

# 显示帮助信息
show_help() {
    echo "用户管理脚本使用说明:"
    echo "  add <用户名> <邮箱>     - 添加新用户"
    echo "  list                   - 显示所有用户"
    echo "  find <邮箱>            - 查找用户"
    echo "  remove <邮箱>          - 删除用户"
    echo "  help                   - 显示此帮助信息"
    echo ""
}

# 生成用户ID
generate_id() {
    if [ ! -f "$USER_FILE" ]; then
        echo "1"
    else
        # 获取最大ID并加1
        max_id=$(grep -v '^#' "$USER_FILE" | cut -d'|' -f1 | sort -n | tail -1)
        if [ -z "$max_id" ]; then
            echo "1"
        else
            echo $((max_id + 1))
        fi
    fi
}

# 添加用户
add_user() {
    local name="$1"
    local email="$2"
    
    # 检查参数
    if [ -z "$name" ] || [ -z "$email" ]; then
        echo -e "${RED}错误: 请提供用户名和邮箱${NC}"
        return 1
    fi
    
    # 检查邮箱是否已存在
    if grep -q "|$email|" "$USER_FILE"; then
        echo -e "${RED}错误: 邮箱 $email 已存在${NC}"
        return 1
    fi
    
    # 生成用户ID
    local id=$(generate_id)
    local created_at=$(date '+%Y-%m-%d %H:%M:%S')
    
    # 添加用户到文件
    echo "$id|$name|$email|$created_at|active" >> "$USER_FILE"
    
    echo -e "${GREEN}用户添加成功:${NC}"
    echo "  ID: $id"
    echo "  用户名: $name"
    echo "  邮箱: $email"
    echo "  创建时间: $created_at"
}

# 显示所有用户
list_users() {
    if [ ! -f "$USER_FILE" ] || [ ! -s "$USER_FILE" ]; then
        echo -e "${YELLOW}暂无用户数据${NC}"
        return
    fi
    
    echo -e "${BLUE}用户列表:${NC}"
    echo "ID  | 用户名  | 邮箱                    | 创建时间           | 状态"
    echo "----|---------|-------------------------|-------------------|-------"
    
    # 跳过注释行，显示用户数据
    grep -v '^#' "$USER_FILE" | while IFS='|' read -r id name email created_at status; do
        printf "%-3s | %-7s | %-23s | %-17s | %s\n" "$id" "$name" "$email" "$created_at" "$status"
    done
}

# 查找用户
find_user() {
    local email="$1"
    
    if [ -z "$email" ]; then
        echo -e "${RED}错误: 请提供邮箱地址${NC}"
        return 1
    fi
    
    # 查找用户
    local user_line=$(grep "|$email|" "$USER_FILE")
    
    if [ -z "$user_line" ]; then
        echo -e "${YELLOW}未找到邮箱为 $email 的用户${NC}"
        return 1
    fi
    
    echo -e "${GREEN}找到用户:${NC}"
    IFS='|' read -r id name email created_at status <<< "$user_line"
    echo "  ID: $id"
    echo "  用户名: $name"
    echo "  邮箱: $email"
    echo "  创建时间: $created_at"
    echo "  状态: $status"
}

# 删除用户
remove_user() {
    local email="$1"
    
    if [ -z "$email" ]; then
        echo -e "${RED}错误: 请提供邮箱地址${NC}"
        return 1
    fi
    
    # 检查用户是否存在
    if ! grep -q "|$email|" "$USER_FILE"; then
        echo -e "${RED}错误: 未找到邮箱为 $email 的用户${NC}"
        return 1
    fi
    
    # 删除用户（保留注释行）
    sed -i "/|$email|/d" "$USER_FILE"
    
    echo -e "${GREEN}用户删除成功: $email${NC}"
}

# 主函数
main() {
    # 初始化
    init_user_file
    
    # 解析命令行参数
    case "$1" in
        "add")
            add_user "$2" "$3"
            ;;
        "list")
            list_users
            ;;
        "find")
            find_user "$2"
            ;;
        "remove")
            remove_user "$2"
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        *)
            echo -e "${RED}未知命令: $1${NC}"
            echo "使用 'help' 查看可用命令"
            exit 1
            ;;
    esac
}

# 如果直接运行此脚本
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
