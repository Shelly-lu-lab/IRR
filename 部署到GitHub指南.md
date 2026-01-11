# IRR测算系统 - GitHub 部署指南

## 一、准备工作

### 1. 安装 Git
如果还没有安装 Git，请先下载安装：https://git-scm.com/downloads

### 2. 配置 Git（首次使用需要）
打开命令行，执行：
```bash
git config --global user.name "你的名字"
git config --global user.email "你的邮箱@example.com"
```

### 3. 创建 GitHub 账号
如果没有 GitHub 账号，请访问 https://github.com 注册

---

## 二、创建 GitHub 仓库

1. 登录 GitHub
2. 点击右上角 "+" → "New repository"
3. 填写信息：
   - Repository name: `irr-calculator`
   - Description: `IRR测算系统 - 网页版`
   - 选择 **Public**
   - **不要**勾选 "Add a README file"
4. 点击 "Create repository"

---

## 三、推送代码到 GitHub

在项目目录下打开命令行（PowerShell 或 CMD），依次执行：

```bash
# 1. 初始化 Git 仓库
git init

# 2. 添加所有文件
git add .

# 3. 提交代码
git commit -m "初始提交：IRR测算系统"

# 4. 添加远程仓库（将 YOUR_USERNAME 替换为你的 GitHub 用户名）
git remote add origin https://github.com/YOUR_USERNAME/irr-calculator.git

# 5. 推送到 GitHub
git branch -M main
git push -u origin main
```

**注意**：首次推送时会提示登录 GitHub，按提示操作即可。

---

## 四、配置 GitHub Pages

1. 打开你的 GitHub 仓库页面
2. 点击 "Settings"（设置）
3. 在左侧菜单找到 "Pages"
4. 在 "Build and deployment" 部分：
   - Source: 选择 **GitHub Actions**
5. 等待几分钟，GitHub Actions 会自动构建和部署

---

## 五、访问你的网站

部署成功后，你的网站地址是：

```
https://你的用户名.github.io/irr-calculator/
```

例如：`https://example.github.io/irr-calculator/`

---

## 六、分享给他人

直接将上面的网址分享给其他人即可！

他们只需要用浏览器打开这个链接就能使用 IRR 测算系统。

---

## 七、更新网站

当你修改了代码后，只需要执行：

```bash
git add .
git commit -m "更新说明"
git push
```

GitHub Actions 会自动重新部署。

---

## 常见问题

### Q: 推送时提示认证失败？
A: 需要配置 GitHub 的 Personal Access Token：
1. 打开 GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. 点击 "Generate new token"
3. 勾选 "repo" 权限
4. 生成后复制 token，在推送时作为密码使用

### Q: 页面显示 404？
A: 
1. 确认 GitHub Pages 已启用（Settings → Pages）
2. 确认 Source 选择的是 "GitHub Actions"
3. 等待 Actions 构建完成（可以在 Actions 标签查看进度）

### Q: 如何使用自定义域名？
A: 
1. 在 Settings → Pages 中添加你的域名
2. 修改 `vite.config.ts` 中的 `base` 为 `/`
3. 在项目根目录创建 `public/CNAME` 文件，内容为你的域名

---

## 快速命令汇总

```bash
# 首次部署
git init
git add .
git commit -m "初始提交"
git remote add origin https://github.com/YOUR_USERNAME/irr-calculator.git
git branch -M main
git push -u origin main

# 后续更新
git add .
git commit -m "更新内容说明"
git push
```

---

**部署成功后，任何人都可以通过链接访问你的 IRR 测算系统！**
