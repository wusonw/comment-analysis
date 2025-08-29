# Code Comment Rate Analysis Tool

A command-line tool for analyzing comment rates in code files, supporting multiple programming languages and file formats.

## Features

- 🎯 Support for multiple file types: Vue, JavaScript, TypeScript, JSX, TSX, Python, HTML, CSS, SCSS, LESS, Go, Rust, Java
- 📊 Statistics for multiple comment types: single-line comments, multi-line comments, inline comments
- 📈 Generate detailed statistics tables with file types, file counts, comment lines, empty lines, total lines, and comment rates
- 🎨 Beautiful colored output using chalk library
- 📁 Support for recursive analysis of folders and subfolders
- 🌍 Multi-language support (English/Chinese)

## Installation

### Method 1: Install from source

1. Clone or download the project to your local machine
2. Install dependencies:

```bash
pnpm install
```

### Method 2: Global installation (Recommended)

```bash
npm install -g comment-analysis
```

## Usage

### Basic Usage

```bash
# Analyze specified folder
comment-analysis /path/to/your/project

# Or run from source
node index.js /path/to/your/project
pnpm start /path/to/your/project
```

### Language Options

```bash
# Use English (default)
comment-analysis /path/to/your/project

# Use Chinese
comment-analysis /path/to/your/project --lang zh-CN
comment-analysis /path/to/your/project -l zh-CN
```

### Examples

```bash
# Analyze current directory
comment-analysis .

# Analyze specific project folder
comment-analysis /home/user/my-project

# Analyze relative path
comment-analysis ./src

# Analyze with Chinese output
comment-analysis . --lang zh-CN
```

## Output Example

```
Starting analysis of folder: /path/to/project
Analyzing 3 files...

╔═══════════════╤════════════╤════════════╤══════════╤════════════╤═══════════════╗
║ File Type     │ File Count │ Comments   │ Empty    │ Total      │ Comment Rate  ║
╟───────────────┼────────────┼────────────┼──────────┼────────────┼───────────────╢
║ Vue           │ 1          │ 24         │ 19       │ 141        │ 17.02%        ║
╟───────────────┼────────────┼────────────┼──────────┼────────────┼───────────────╢
║ Python        │ 1          │ 90         │ 33       │ 172        │ 52.33%        ║
╟───────────────┼────────────┼────────────┼──────────┼────────────┼───────────────╢
║ JavaScript    │ 1          │ 25         │ 11       │ 70         │ 35.71%        ║
╟───────────────┼────────────┼────────────┼──────────┼────────────┼───────────────╢
║ Total         │ 3          │ 139        │ 63       │ 383        │ 36.29%        ║
╚═══════════════╧════════════╧════════════╧══════════╧════════════╧═══════════════╝

Comment Rate Guide: Excellent (>30%) | Good (15-30%) | Needs Improvement (<15%)
```

## Supported File Types

| File Type  | Extension | Supported Comment Types                                    |
| ---------- | --------- | ---------------------------------------------------------- |
| Vue        | .vue      | // single-line, /\* \*/ multi-line, <!-- --> HTML comments |
| JavaScript | .js       | // single-line, /\* \*/ multi-line                         |
| TypeScript | .ts       | // single-line, /\* \*/ multi-line                         |
| JSX        | .jsx      | // single-line, /\* _/ multi-line, {/_ \*/} JSX comments   |
| TSX        | .tsx      | // single-line, /\* _/ multi-line, {/_ \*/} JSX comments   |
| Python     | .py       | # single-line, """ """ multi-line, ''' ''' multi-line      |
| HTML       | .html     | <!-- --> HTML comments                                     |
| CSS        | .css      | // single-line, /\* \*/ multi-line                         |
| SCSS       | .scss     | // single-line, /\* \*/ multi-line                         |
| LESS       | .less     | // single-line, /\* \*/ multi-line                         |
| Go         | .go       | // single-line, /\* \*/ multi-line                         |
| Rust       | .rs       | // single-line, /\* \*/ multi-line                         |
| Java       | .java     | // single-line, /\* _/ multi-line, /\*\* _/ documentation  |

## Statistics Description

- **File Count**: Total number of files of this type
- **Comments**: Number of lines containing comments (including single-line, multi-line, and inline comments)
- **Empty**: Number of completely empty lines or lines containing only whitespace
- **Total**: Total number of lines in the file
- **Comment Rate**: Percentage of comment lines to total lines

## Project Structure

```
comment-analysis/
├── index.js          # Main program file
├── package.json      # Project configuration and dependencies
├── README.md         # English documentation
├── README.zh-CN.md   # Chinese documentation
├── .gitignore        # Git ignore file configuration
└── tests/            # Test files folder
    ├── README.md     # Test files description
    ├── test-example.js   # JavaScript test file
    ├── test-example.vue  # Vue test file
    ├── test-example.py   # Python test file
    ├── test-example.go   # Go test file
    ├── test-example.rs   # Rust test file
    └── test-example.java # Java test file
```

## Dependencies

- `commander`: Command line argument parsing
- `glob`: File pattern matching
- `chalk`: Terminal color output
- `cli-table3`: Beautiful table output

## License

MIT License
