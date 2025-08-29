# 测试文件说明

这个文件夹包含了用于测试代码注释率统计工具的示例文件。

## 文件列表

- `test-example.js` - JavaScript示例文件，包含各种类型的注释
- `test-example.vue` - Vue示例文件，包含template、script和style部分的注释
- `test-example.py` - Python示例文件，包含单行注释和文档字符串

## 使用方法

```bash
# 分析测试文件夹
node ../index.js . --verbose

# 或者从项目根目录分析
node index.js test-files --verbose
```

## 测试文件特点

### JavaScript文件
- 单行注释 (`//`)
- 多行注释 (`/* */`)
- 行内注释
- JSDoc注释

### Vue文件
- HTML注释 (`<!-- -->`)
- JavaScript注释 (`//`, `/* */`)
- CSS注释 (`/* */`)
- 行内注释

### Python文件
- 单行注释 (`#`)
- 文档字符串 (`""" """`, `''' '''`)
- 行内注释

这些文件涵盖了工具支持的主要注释类型，可以用来验证统计功能的准确性。
