# Mouse WebHID 项目说明文档

## 技术栈

- **前端框架**: React 19.1.1
- **开发语言**: TypeScript
- **构建工具**: Vite 7.1.0
- **样式框架**: TailwindCSS 4.1.11
- **状态管理**: Zustand 5.0.7
- **路由管理**: React Router DOM 7.8.0
- **国际化**: React-i18next 15.6.1
- **包管理器**: pnpm
- **Node.js 版本**: 21

## 项目结构

```
mouse-webhid/
├── 📁 public/                    # 静态资源目录
│   └── vite.svg                  # Vite 图标
├── 📁 src/                       # 源代码目录
│   ├── 📁 assets/                # 静态资源
│   │   └── react.svg             # React 图标
│   ├── 📁 components/            # 可复用组件
│   │   └── 📁 mouse/             # 鼠标相关组件
│   │       ├── Footer.tsx        # 页脚组件
│   │       ├── Header.tsx        # 页头组件
│   │       ├── MacroModal.tsx    # 宏录制模态框
│   │       ├── SidebarLeft.tsx   # 左侧边栏
│   │       └── 📁 content/       # 内容区组件
│   │           ├── ConfigDpi.tsx      # DPI 配置
│   │           ├── ConfigKey.tsx      # 按键配置
│   │           ├── ConfigPerformance.tsx # 性能配置
│   │           ├── ConfigRgb.tsx      # RGB 灯光配置
│   │           ├── ConfigSleep.tsx    # 睡眠模式配置
│   │           ├── Info.tsx           # 设备信息
│   │           ├── Manual.tsx         # 用户手册
│   │           └── RecordMacro.tsx    # 宏录制
│   ├── 📁 config/                # 设备配置文件
│   │   └── 📁 TMKB-M1/           # TMKB-M1 鼠标配置
│   │       ├── dpi.json          # DPI 配置数据
│   │       └── light-mode.json   # 灯光模式配置
│   ├── 📁 hooks/                 # 自定义 React Hooks
│   │   ├── useConnectDevice.ts   # 设备连接 Hook
│   │   ├── useDarkMode.ts        # 暗黑模式 Hook
│   │   ├── useI18nToggle.ts      # 国际化切换 Hook
│   │   └── useWebHID.ts          # WebHID API Hook
│   ├── 📁 i18n/                  # 国际化配置
│   │   └── index.ts              # i18n 初始化配置
│   ├── 📁 locales/               # 多语言资源
│   │   ├── 📁 en/                # 英文语言包
│   │   │   └── common.json       # 英文翻译文件
│   │   └── 📁 zh/                # 中文语言包
│   │       └── common.json       # 中文翻译文件
│   ├── 📁 router/                # 路由配置
│   │   └── index.tsx             # 路由定义
│   ├── 📁 store/                 # 状态管理
│   │   ├── hidStore.ts           # HID 设备状态
│   │   ├── useDeviceStore.ts     # 设备状态管理
│   │   └── useMouseConfigStore.ts # 鼠标配置状态
│   ├── 📁 styles/                # 样式文件
│   │   └── index.scss            # 主样式文件
│   ├── 📁 types/                 # TypeScript 类型定义
│   │   └── webhid.d.ts           # WebHID API 类型定义
│   ├── 📁 ui/                    # UI 页面组件
│   │   ├── NotFound.tsx          # 404 页面
│   │   ├── 📁 common/            # 通用 UI 组件
│   │   │   └── DeviceConnectModal.tsx # 设备连接模态框
│   │   └── 📁 mouse/             # 鼠标相关页面
│   │       └── Home.tsx          # 鼠标主页
│   ├── 📁 utils/                 # 工具类
│   │   ├── 📁 adapters/          # 设备适配器
│   │   │   ├── BaseAdapter.ts    # 基础适配器
│   │   │   └── GenericMouseAdapter.ts # 通用鼠标适配器
│   │   └── 📁 transports/        # 传输层
│   │       └── WebHIDTransport.ts # WebHID 传输实现
│   ├── App.css                   # 应用主样式
│   ├── App.tsx                   # 应用主组件
│   ├── index.css                 # 全局样式
│   ├── main.tsx                  # 应用入口
│   └── vite-env.d.ts             # Vite 环境类型
├── 📄 配置文件
│   ├── .gitignore                # Git 忽略文件
│   ├── .prettierignore           # Prettier 忽略文件
│   ├── .prettierrc               # Prettier 配置
│   ├── eslint.config.js          # ESLint 配置
│   ├── package.json              # 项目依赖配置
│   ├── pnpm-lock.yaml            # pnpm 锁定文件
│   ├── postcss.config.js         # PostCSS 配置
│   ├── postcss.config.mjs        # PostCSS ES 模块配置
│   ├── tailwind.config.js        # TailwindCSS 配置
│   ├── tsconfig.json             # TypeScript 根配置
│   ├── tsconfig.app.json         # 应用 TypeScript 配置
│   ├── tsconfig.node.json        # Node.js TypeScript 配置
│   └── vite.config.ts            # Vite 配置
├── 📄 文档文件
│   ├── README.md                 # 项目说明文档
│   ├── demo.html                 # 演示页面
│   ├── tailwindcss.html          # TailwindCSS 演示
│   └── index.html                # 主页面模板
└── 📦 dist.tar                   # 构建产物压缩包
```

## 核心功能模块

### 1. 设备连接管理

- **WebHID API 集成**: 使用现代浏览器的 WebHID API 与鼠标设备通信
- **设备检测**: 自动检测和连接支持的鼠标设备
- **连接状态管理**: 实时显示设备连接状态

### 2. 鼠标配置功能

- **DPI 设置**: 多档位 DPI 调节，支持自定义 DPI 值
- **按键映射**: 自定义鼠标按键功能映射
- **RGB 灯光控制**: 多种灯光效果和颜色自定义
- **性能调优**: 鼠标响应速度、滚轮设置等性能参数
- **睡眠模式**: 节能模式配置

### 3. 宏录制系统

- **宏录制**: 录制鼠标和键盘操作序列
- **宏管理**: 宏文件的创建、编辑、删除
- **宏执行**: 一键执行预设的宏操作

### 4. 用户界面

- **响应式设计**: 适配不同屏幕尺寸
- **暗黑模式**: 支持明暗主题切换
- **国际化**: 中英文双语支持
- **现代化 UI**: 基于 TailwindCSS 的现代化界面设计

## 架构设计

### 状态管理架构

- **Zustand**: 轻量级状态管理，管理设备状态和配置数据
- **React Hooks**: 自定义 Hooks 封装业务逻辑
- **组件状态**: 局部状态使用 React 内置状态管理

### 设备通信架构

- **适配器模式**: 不同设备使用对应的适配器
- **传输层抽象**: WebHID 传输层封装
- **配置文件驱动**: 基于 JSON 配置文件的设备参数管理

### 组件架构

- **页面组件** (`ui/`): 完整的页面级组件
- **业务组件** (`components/`): 可复用的业务逻辑组件
- **布局组件**: Header、Footer、Sidebar 等布局组件

## 开发指南

### 环境要求

- Node.js 21+
- pnpm 包管理器
- 支持 WebHID API 的现代浏览器 (Chrome 89+, Edge 89+)

### 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview

# 代码检查
pnpm lint
```

### 开发规范

- **TypeScript**: 严格的类型检查
- **ESLint**: 代码质量检查
- **Prettier**: 代码格式化
- **组件化开发**: 高度模块化的组件设计
- **Hook 优先**: 使用 React Hooks 管理状态和副作用

## 支持的设备

目前项目主要支持 **TMKB-M1** 系列鼠标，配置文件位于 `src/config/TMKB-M1/` 目录下。

### 扩展新设备

1. 在 `src/config/` 下创建新的设备目录
2. 添加设备特定的配置文件 (dpi.json, light-mode.json 等)
3. 在 `src/utils/adapters/` 下创建对应的设备适配器
4. 更新设备检测逻辑

## 国际化支持

项目支持中英文双语，语言文件位于 `src/locales/` 目录：

- `zh/common.json`: 中文翻译
- `en/common.json`: 英文翻译

### 添加新语言

1. 在 `src/locales/` 下创建新的语言目录
2. 复制 `common.json` 并翻译内容
3. 在 `src/i18n/index.ts` 中注册新语言

## 浏览器兼容性

| 浏览器  | 版本要求 | WebHID 支持 |
| ------- | -------- | ----------- |
| Chrome  | 89+      | ✅          |
| Edge    | 89+      | ✅          |
| Firefox | -        | ❌          |
| Safari  | -        | ❌          |

**注意**: WebHID API 目前仅在基于 Chromium 的浏览器中可用。

# 提交发版

```bash
# 上传dist 文件到服务器
scp -P 22 -r /Users/nm/Desktop/jizhi_project/mouse-webhid/dist/* root@8.210.127.55:/var/www/tmkb.openkm.online/test-scp/
# 打包旧站点文件
cd /var/www/tmkb.openkm.online
# 备份旧站点文件
tar -czvf ./backup_dev_$(date +%Y%m%d_%H%M%S).tar.gz -C ./dev .
# 清空旧站点文件
rm -rf /var/www/tmkb.openkm.online/dev/*
# 移动新站点文件到旧站点目录
mv /var/www/tmkb.openkm.online/test-scp/* /var/www/tmkb.openkm.online/dev/
# 重启nginx 服务
systemctl restart nginx
# 检查nginx 服务状态
systemctl status nginx

```

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
