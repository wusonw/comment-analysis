#!/usr/bin/env node

import { program } from 'commander'
import { glob } from 'glob'
import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import Table from 'cli-table3'

// Language configuration
const LANGUAGES = {
  en: {
    // Main messages
    startAnalysis: 'Starting analysis of folder',
    analyzingFiles: 'Analyzing',
    files: 'files',
    noSupportedFiles: 'No supported file types found',
    supportedFileTypes: 'Supported file types',
    excludePatterns: 'Exclude patterns',
    includeExtensions: 'Include specific file extensions',
    analysisFailed: 'Analysis failed',
    pathNotExists: 'Error: Path',
    notExists: 'does not exist',
    notDirectory: 'Error:',
    isNotDirectory: 'is not a directory',

    // Table headers
    fileType: 'File Type',
    fileCount: 'File Count',
    comments: 'Comments',
    empty: 'Empty',
    total: 'Total',
    commentRate: 'Comment Rate',
    totalRow: 'Total',

    // Statistics description
    statisticsDescription: 'Statistics Description',
    fileCountDesc: '• File Count: Total number of files of this type',
    commentsDesc: '• Comments: Number of lines containing comments (single-line, multi-line, and inline comments)',
    emptyDesc: '• Empty: Number of completely empty lines or lines containing only whitespace',
    totalDesc: '• Total: Total number of lines in the file',
    commentRateDesc: '• Comment Rate: Percentage of comment lines to total lines',

    // Comment rate guide
    commentRateGuide: 'Comment Rate Guide',
    excellent: 'Excellent (>30%)',
    good: 'Good (15-30%)',
    needsImprovement: 'Needs Improvement (<15%)',

    // Tool description
    toolDescription: 'Code comment rate analysis tool - supports multiple programming languages and file formats',
    pathArgument: 'Path to the folder to analyze',
    verboseOption: 'Show detailed output information',
    excludeOption: 'Exclude file patterns, separated by commas',
    includeExtOption: 'Only include specific file extensions, separated by commas (e.g., .js,.ts,.vue)',
    langOption: 'Language for output (en/zh-CN)',

    // Supported file types message
    supportedFileTypesMessage: '.vue, .js, .ts, .jsx, .tsx, .py, .html, .css, .scss, .less',
  },
  'zh-CN': {
    // Main messages
    startAnalysis: '开始分析文件夹',
    analyzingFiles: '正在分析',
    files: '个文件',
    noSupportedFiles: '未找到支持的文件类型',
    supportedFileTypes: '支持的文件类型',
    excludePatterns: '排除模式',
    includeExtensions: '包含特定文件扩展名',
    analysisFailed: '分析文件夹失败',
    pathNotExists: '错误: 路径',
    notExists: '不存在',
    notDirectory: '错误:',
    isNotDirectory: '不是一个文件夹',

    // Table headers
    fileType: '文件类型',
    fileCount: '文件数目',
    comments: '注释行数',
    empty: '空行',
    total: '总行数',
    commentRate: '注释率',
    totalRow: '总计',

    // Statistics description
    statisticsDescription: '统计说明',
    fileCountDesc: '  • 文件数目: 该类型文件的总数量',
    commentsDesc: '  • 注释行数: 包含注释的行数（单行、多行、行内注释）',
    emptyDesc: '  • 空行: 完全为空或只包含空白字符的行数',
    totalDesc: '  • 总行数: 文件的总行数',
    commentRateDesc: '  • 注释率: 注释行数占总行数的百分比',

    // Comment rate guide
    commentRateGuide: '注释率说明',
    excellent: '优秀 (>30%)',
    good: '良好 (15-30%)',
    needsImprovement: '需要改进 (<15%)',

    // Tool description
    toolDescription: '代码注释率统计工具 - 支持多种编程语言和文件格式',
    pathArgument: '要分析的文件夹路径',
    verboseOption: '显示详细输出信息',
    excludeOption: '排除的文件模式，用逗号分隔',
    includeExtOption: '只包含指定的文件扩展名，用逗号分隔 (例如: .js,.ts,.vue)',
    langOption: '输出语言 (en/zh-CN)',

    // Supported file types message
    supportedFileTypesMessage: '.vue, .js, .ts, .jsx, .tsx, .py, .html, .css, .scss, .less',
  },
}

// Get language messages
function getMessages(lang = 'en') {
  return LANGUAGES[lang] || LANGUAGES['en']
}

// 支持的文件类型配置
const FILE_TYPES = {
  // Web 开发
  '.vue': {
    name: 'Vue',
    patterns: {
      singleLine: /\/\/.*$/gm,
      multiLine: /\/\*[\s\S]*?\*\//gm,
      htmlComment: /<!--[\s\S]*?-->/gm,
      templateComment: /\/\*[\s\S]*?\*\//gm,
    },
  },
  '.js': {
    name: 'JavaScript',
    patterns: {
      singleLine: /\/\/.*$/gm,
      multiLine: /\/\*[\s\S]*?\*\//gm,
    },
  },
  '.ts': {
    name: 'TypeScript',
    patterns: {
      singleLine: /\/\/.*$/gm,
      multiLine: /\/\*[\s\S]*?\*\//gm,
    },
  },
  '.jsx': {
    name: 'JSX',
    patterns: {
      singleLine: /\/\/.*$/gm,
      multiLine: /\/\*[\s\S]*?\*\//gm,
      jsxComment: /{\/\*[\s\S]*?\*\/}/gm,
    },
  },
  '.tsx': {
    name: 'TSX',
    patterns: {
      singleLine: /\/\/.*$/gm,
      multiLine: /\/\*[\s\S]*?\*\//gm,
      jsxComment: /{\/\*[\s\S]*?\*\/}/gm,
    },
  },
  '.html': {
    name: 'HTML',
    patterns: {
      htmlComment: /<!--[\s\S]*?-->/gm,
    },
  },
  '.css': {
    name: 'CSS',
    patterns: {
      singleLine: /\/\/.*$/gm,
      multiLine: /\/\*[\s\S]*?\*\//gm,
    },
  },
  '.scss': {
    name: 'SCSS',
    patterns: {
      singleLine: /\/\/.*$/gm,
      multiLine: /\/\*[\s\S]*?\*\//gm,
    },
  },
  '.less': {
    name: 'LESS',
    patterns: {
      singleLine: /\/\/.*$/gm,
      multiLine: /\/\*[\s\S]*?\*\//gm,
    },
  },
  '.sass': {
    name: 'Sass',
    patterns: {
      singleLine: /\/\/.*$/gm,
      multiLine: /\/\*[\s\S]*?\*\//gm,
    },
  },
  '.styl': {
    name: 'Stylus',
    patterns: {
      singleLine: /\/\/.*$/gm,
      multiLine: /\/\*[\s\S]*?\*\//gm,
    },
  },

  // 后端开发
  '.py': {
    name: 'Python',
    patterns: {
      singleLine: /#.*$/gm,
      multiLine: /"""[^"]*"""/gm,
      multiLineAlt: /'''[^']*'''/gm,
    },
  },
  '.java': {
    name: 'Java',
    patterns: {
      singleLine: /\/\/.*$/gm,
      multiLine: /\/\*[\s\S]*?\*\//gm,
      javadoc: /\/\*\*[\s\S]*?\*\//gm,
    },
  },
  '.kt': {
    name: 'Kotlin',
    patterns: {
      singleLine: /\/\/.*$/gm,
      multiLine: /\/\*[\s\S]*?\*\//gm,
      kdoc: /\/\*\*[\s\S]*?\*\//gm,
    },
  },
  '.scala': {
    name: 'Scala',
    patterns: {
      singleLine: /\/\/.*$/gm,
      multiLine: /\/\*[\s\S]*?\*\//gm,
      scaladoc: /\/\*\*[\s\S]*?\*\//gm,
    },
  },
  '.go': {
    name: 'Go',
    patterns: {
      singleLine: /\/\/.*$/gm,
      multiLine: /\/\*[\s\S]*?\*\//gm,
      godoc: /\/\/\/.*$/gm,
    },
  },
  '.rs': {
    name: 'Rust',
    patterns: {
      singleLine: /\/\/.*$/gm,
      multiLine: /\/\*[\s\S]*?\*\//gm,
      docComment: /\/\/\/.*$/gm,
      blockDocComment: /\/\*[\s\S]*?\*\//gm,
    },
  },
  '.cpp': {
    name: 'C++',
    patterns: {
      singleLine: /\/\/.*$/gm,
      multiLine: /\/\*[\s\S]*?\*\//gm,
    },
  },
  '.c': {
    name: 'C',
    patterns: {
      singleLine: /\/\/.*$/gm,
      multiLine: /\/\*[\s\S]*?\*\//gm,
    },
  },
  '.cs': {
    name: 'C#',
    patterns: {
      singleLine: /\/\/.*$/gm,
      multiLine: /\/\*[\s\S]*?\*\//gm,
      xmlComment: /\/\/\/.*$/gm,
    },
  },
  '.php': {
    name: 'PHP',
    patterns: {
      singleLine: /\/\/.*$/gm,
      multiLine: /\/\*[\s\S]*?\*\//gm,
      hashComment: /#.*$/gm,
      docComment: /\/\*\*[\s\S]*?\*\//gm,
    },
  },
  '.rb': {
    name: 'Ruby',
    patterns: {
      singleLine: /#.*$/gm,
      multiLine: /=begin[\s\S]*?=end/gm,
      docComment: /##.*$/gm,
    },
  },
  '.swift': {
    name: 'Swift',
    patterns: {
      singleLine: /\/\/.*$/gm,
      multiLine: /\/\*[\s\S]*?\*\//gm,
      docComment: /\/\/\/.*$/gm,
    },
  },
  '.dart': {
    name: 'Dart',
    patterns: {
      singleLine: /\/\/.*$/gm,
      multiLine: /\/\*[\s\S]*?\*\//gm,
      docComment: /\/\/\/.*$/gm,
    },
  },

  // 脚本语言
  '.sh': {
    name: 'Shell',
    patterns: {
      singleLine: /#.*$/gm,
    },
  },
  '.bash': {
    name: 'Bash',
    patterns: {
      singleLine: /#.*$/gm,
    },
  },
  '.zsh': {
    name: 'Zsh',
    patterns: {
      singleLine: /#.*$/gm,
    },
  },
  '.ps1': {
    name: 'PowerShell',
    patterns: {
      singleLine: /#.*$/gm,
      multiLine: /<#[\s\S]*?#>/gm,
    },
  },
  '.lua': {
    name: 'Lua',
    patterns: {
      singleLine: /--.*$/gm,
      multiLine: /--\[\[[\s\S]*?\]\]/gm,
    },
  },
  '.pl': {
    name: 'Perl',
    patterns: {
      singleLine: /#.*$/gm,
      multiLine: /=pod[\s\S]*?=cut/gm,
    },
  },
  '.r': {
    name: 'R',
    patterns: {
      singleLine: /#.*$/gm,
    },
  },
  '.m': {
    name: 'MATLAB',
    patterns: {
      singleLine: /%.*$/gm,
      multiLine: /%\{[\s\S]*?%\}/gm,
    },
  },
  '.jl': {
    name: 'Julia',
    patterns: {
      singleLine: /#.*$/gm,
      multiLine: /#=[\s\S]*?=#/gm,
    },
  },

  // 配置文件
  '.json': {
    name: 'JSON',
    patterns: {
      // JSON 本身不支持注释，但一些扩展格式支持
      singleLine: /\/\/.*$/gm,
    },
  },
  '.yaml': {
    name: 'YAML',
    patterns: {
      singleLine: /#.*$/gm,
    },
  },
  '.yml': {
    name: 'YAML',
    patterns: {
      singleLine: /#.*$/gm,
    },
  },
  '.toml': {
    name: 'TOML',
    patterns: {
      singleLine: /#.*$/gm,
    },
  },
  '.ini': {
    name: 'INI',
    patterns: {
      singleLine: /;.*$/gm,
      hashComment: /#.*$/gm,
    },
  },
  '.xml': {
    name: 'XML',
    patterns: {
      xmlComment: /<!--[\s\S]*?-->/gm,
    },
  },
  '.sql': {
    name: 'SQL',
    patterns: {
      singleLine: /--.*$/gm,
      multiLine: /\/\*[\s\S]*?\*\//gm,
    },
  },
  '.md': {
    name: 'Markdown',
    patterns: {
      htmlComment: /<!--[\s\S]*?-->/gm,
    },
  },
}

// 分析单个文件的注释
function analyzeFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const ext = path.extname(filePath)
    const fileType = FILE_TYPES[ext]

    if (!fileType) {
      return null
    }

    const lines = content.split('\n')
    const totalLines = lines.length
    const emptyLines = lines.filter((line) => line.trim() === '').length

    let commentLines = 0
    let inlineComments = 0

    // 创建用于标记已统计注释行的Set
    const commentedLines = new Set()

    // 统计多行注释
    for (const patternName in fileType.patterns) {
      const pattern = fileType.patterns[patternName]
      const matches = content.match(pattern) || []

      matches.forEach((match) => {
        const matchLines = match.split('\n')
        // 找到这些行在原始内容中的位置
        const startIndex = content.indexOf(match)
        const beforeMatch = content.substring(0, startIndex)
        const lineNumber = beforeMatch.split('\n').length - 1

        matchLines.forEach((_, index) => {
          commentedLines.add(lineNumber + index)
        })
      })
    }

    // 统计单行注释和行内注释
    lines.forEach((line, lineIndex) => {
      const trimmedLine = line.trim()

      // 跳过空行
      if (trimmedLine === '') return

      // 检查是否为纯注释行
      if (fileType.patterns.singleLine && trimmedLine.match(fileType.patterns.singleLine)) {
        commentedLines.add(lineIndex)
      }

      // 检查行内注释
      if (fileType.patterns.singleLine) {
        const codeBeforeComment = line.replace(fileType.patterns.singleLine, '').trim()
        if (codeBeforeComment !== '' && line.includes('//')) {
          inlineComments++
          commentedLines.add(lineIndex)
        }
      }
    })

    commentLines = commentedLines.size

    return {
      fileType: fileType.name,
      totalLines,
      commentLines,
      emptyLines,
      inlineComments,
      codeLines: totalLines - commentLines - emptyLines,
    }
  } catch (error) {
    console.error(chalk.red(`Failed to read file: ${filePath}`), error.message)
    return null
  }
}

// 分析文件夹
function analyzeDirectory(dirPath, excludePatterns = [], lang = 'en', includeExtensions = Object.keys(FILE_TYPES)) {
  const results = {}
  const allExtensions = Object.keys(FILE_TYPES)
  const messages = getMessages(lang)

  try {
    // 获取所有支持的文件
    const pattern = `${dirPath}/**/*.{${allExtensions.map((ext) => ext.slice(1)).join(',')}}`
    const files = glob.sync(pattern, { nodir: true })

    // 过滤掉排除的文件
    const filteredFiles = files.filter((file) => {
      const relativePath = path.relative(dirPath, file)
      return !excludePatterns.some((pattern) => {
        // 支持通配符模式匹配
        const regexPattern = pattern.replace(/\./g, '\\.').replace(/\*/g, '.*').replace(/\?/g, '.')
        const regex = new RegExp(regexPattern, 'i')
        return regex.test(relativePath) || relativePath.includes(pattern)
      })
    })

    // 根据 includeExtensions 进一步过滤
    const finalFiles = filteredFiles.filter((file) => {
      const ext = path.extname(file)
      return includeExtensions.includes(ext)
    })

    console.log(chalk.blue(`${messages.analyzingFiles} ${finalFiles.length} ${messages.files}...`))

    finalFiles.forEach((file) => {
      const result = analyzeFile(file)
      if (result) {
        const fileType = result.fileType

        if (!results[fileType]) {
          results[fileType] = {
            fileCount: 0,
            totalLines: 0,
            commentLines: 0,
            emptyLines: 0,
            inlineComments: 0,
            codeLines: 0,
          }
        }

        results[fileType].fileCount++
        results[fileType].totalLines += result.totalLines
        results[fileType].commentLines += result.commentLines
        results[fileType].emptyLines += result.emptyLines
        results[fileType].inlineComments += result.inlineComments
        results[fileType].codeLines += result.codeLines
      }
    })

    return results
  } catch (error) {
    console.error(chalk.red(messages.analysisFailed + ':'), error.message)
    return {}
  }
}

// 格式化表格输出
function formatTable(results, lang = 'en') {
  const messages = getMessages(lang)

  // 创建表格实例
  const table = new Table({
    head: [
      chalk.cyan.bold(messages.fileType),
      chalk.cyan.bold(messages.fileCount),
      chalk.cyan.bold(messages.comments),
      chalk.cyan.bold(messages.empty),
      chalk.cyan.bold(messages.total),
      chalk.cyan.bold(messages.commentRate),
    ],
    colWidths: [15, 12, 12, 10, 12, 15],
    style: {
      head: ['cyan'],
      border: ['cyan'],
      compact: false,
    },
    chars: {
      top: '═',
      'top-mid': '╤',
      'top-left': '╔',
      'top-right': '╗',
      bottom: '═',
      'bottom-mid': '╧',
      'bottom-left': '╚',
      'bottom-right': '╝',
      left: '║',
      'left-mid': '╟',
      mid: '─',
      'mid-mid': '┼',
      right: '║',
      'right-mid': '╢',
      middle: '│',
    },
  })

  // 计算汇总数据
  let totalFiles = 0
  let totalCommentLines = 0
  let totalEmptyLines = 0
  let totalLines = 0

  // 生成每行数据
  for (const [fileType, data] of Object.entries(results)) {
    const commentRate = ((data.commentLines / data.totalLines) * 100).toFixed(2)
    const rateColor = commentRate > 30 ? chalk.green : commentRate > 15 ? chalk.yellow : chalk.red

    // 为不同类型的文件添加不同的颜色
    const fileTypeColor = getFileTypeColor(fileType)

    table.push([
      fileTypeColor(fileType),
      chalk.white(data.fileCount.toString()),
      chalk.blue(data.commentLines.toString()),
      chalk.gray(data.emptyLines.toString()),
      chalk.white(data.totalLines.toString()),
      rateColor(`${commentRate}%`),
    ])

    totalFiles += data.fileCount
    totalCommentLines += data.commentLines
    totalEmptyLines += data.emptyLines
    totalLines += data.totalLines
  }

  // 添加汇总行
  const totalCommentRate = ((totalCommentLines / totalLines) * 100).toFixed(2)
  const totalRateColor = totalCommentRate > 30 ? chalk.green.bold : totalCommentRate > 15 ? chalk.yellow.bold : chalk.red.bold

  table.push([
    chalk.cyan.bold(messages.totalRow),
    chalk.cyan.bold(totalFiles.toString()),
    chalk.cyan.bold(totalCommentLines.toString()),
    chalk.cyan.bold(totalEmptyLines.toString()),
    chalk.cyan.bold(totalLines.toString()),
    totalRateColor(`${totalCommentRate}%`),
  ])

  // 输出表格
  console.log('\n' + table.toString() + '\n')

  // 添加注释率说明
  console.log(
    chalk.gray(messages.commentRateGuide + ': ') + chalk.green(messages.excellent) + chalk.gray(' | ') + chalk.yellow(messages.good) + chalk.gray(' | ') + chalk.red(messages.needsImprovement)
  )
}

// 获取文件类型颜色
function getFileTypeColor(fileType) {
  const colors = {
    // Web 开发
    Vue: chalk.magenta,
    JavaScript: chalk.yellow,
    TypeScript: chalk.blue,
    JSX: chalk.cyan,
    TSX: chalk.blue,
    HTML: chalk.red,
    CSS: chalk.magenta,
    SCSS: chalk.magenta,
    LESS: chalk.magenta,
    Sass: chalk.magenta,
    Stylus: chalk.magenta,

    // 后端开发
    Python: chalk.green,
    Java: chalk.red,
    Kotlin: chalk.blue,
    Scala: chalk.red,
    Go: chalk.cyan,
    Rust: chalk.yellow,
    'C++': chalk.blue,
    C: chalk.blue,
    'C#': chalk.magenta,
    PHP: chalk.blue,
    Ruby: chalk.red,
    Swift: chalk.orange,
    Dart: chalk.blue,

    // 脚本语言
    Shell: chalk.green,
    Bash: chalk.green,
    Zsh: chalk.green,
    PowerShell: chalk.blue,
    Lua: chalk.blue,
    Perl: chalk.blue,
    R: chalk.blue,
    MATLAB: chalk.yellow,
    Julia: chalk.purple,

    // 配置文件
    JSON: chalk.yellow,
    YAML: chalk.cyan,
    TOML: chalk.blue,
    INI: chalk.gray,
    XML: chalk.green,
    SQL: chalk.cyan,
    Markdown: chalk.blue,
  }
  return colors[fileType] || chalk.white
}

// 主函数
function main() {
  program
    .name('comment-analysis')
    .description('Code comment rate analysis tool - supports multiple programming languages and file formats')
    .version('1.0.0')
    .argument('<path>', 'Path to the folder to analyze')
    .option('-v, --verbose', 'Show detailed output information')
    .option('-e, --exclude <patterns>', 'Exclude file patterns, separated by commas', 'node_modules,dist,build,.git')
    .option('-i, --include-ext <extensions>', 'Only include specific file extensions, separated by commas (e.g., .js,.ts,.vue)')
    .option('-l, --lang <language>', 'Language for output (en/zh-CN)', 'en')
    .action((dirPath, options) => {
      const lang = options.lang || 'en'
      const messages = getMessages(lang)

      if (!fs.existsSync(dirPath)) {
        console.error(chalk.red(`${messages.pathNotExists} "${dirPath}" ${messages.notExists}`))
        process.exit(1)
      }

      if (!fs.statSync(dirPath).isDirectory()) {
        console.error(chalk.red(`${messages.notDirectory} "${dirPath}" ${messages.isNotDirectory}`))
        process.exit(1)
      }

      console.log(chalk.green(`${messages.startAnalysis}: ${dirPath}`))

      if (options.verbose) {
        console.log(chalk.blue(messages.supportedFileTypes + ':'))
        Object.entries(FILE_TYPES).forEach(([ext, config]) => {
          console.log(chalk.gray(`  ${ext} - ${config.name}`))
        })
        console.log('')
      }

      // 解析排除模式
      const excludePatterns = options.exclude ? options.exclude.split(',').map((p) => p.trim()) : []

      if (options.verbose && excludePatterns.length > 0) {
        console.log(chalk.blue(`${messages.excludePatterns}: ${excludePatterns.join(', ')}`))
      }

      // 解析包含的文件扩展名
      let includeExtensions = Object.keys(FILE_TYPES)
      if (options.includeExt) {
        const userExtensions = options.includeExt.split(',').map((ext) => ext.trim())
        // 确保扩展名以 . 开头
        const normalizedExtensions = userExtensions.map((ext) => (ext.startsWith('.') ? ext : `.${ext}`))
        // 过滤出用户指定的且支持的文件类型
        includeExtensions = normalizedExtensions.filter((ext) => FILE_TYPES[ext])

        if (includeExtensions.length === 0) {
          console.error(chalk.red(`错误: 指定的文件扩展名都不被支持: ${userExtensions.join(', ')}`))
          console.log(chalk.gray(`支持的文件类型: ${Object.keys(FILE_TYPES).join(', ')}`))
          process.exit(1)
        }

        if (options.verbose) {
          console.log(chalk.blue(`${messages.includeExtensions}: ${includeExtensions.join(', ')}`))
        }
      }

      const results = analyzeDirectory(dirPath, excludePatterns, lang, includeExtensions)

      if (Object.keys(results).length === 0) {
        console.log(chalk.yellow(messages.noSupportedFiles))
        console.log(chalk.gray(messages.supportedFileTypesMessage))
        return
      }

      formatTable(results, lang)

      if (options.verbose) {
        console.log(chalk.blue(messages.statisticsDescription + ':'))
        console.log(chalk.gray(messages.fileCountDesc))
        console.log(chalk.gray(messages.commentsDesc))
        console.log(chalk.gray(messages.emptyDesc))
        console.log(chalk.gray(messages.totalDesc))
        console.log(chalk.gray(messages.commentRateDesc))
      }
    })

  program.parse()
}

main()
