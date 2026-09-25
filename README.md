# 百业长安 · 3D 财富漫游

一款原创的 Three.js 3D 大富翁风格单机游戏：1 名玩家 + 3 名 AI，在 40 格山海百业城中掷骰、买地、竞拍、升级、抵押、抽机缘卡并争夺最终财富。

## 角色

- 嘟嘟：熊猫掌柜，米黄唐装与彩色斜挎带
- 唐糖：唐代仕女，青绿上襦、湖蓝裙与牡丹团扇
- 三太子：双丸子头少年，红衫、工装裤与老虎挂件
- 德小文：棕发金瞳探险家，白色探险服与皮革背带

首屏会显示四张原创二维 SVG 头像卡牌。选中的角色由玩家操控，其余三位转为 AI。每位角色都有独立技能：嘟嘟减免租金、唐糖周期分红抽卡、三太子重掷骰子、德小文每圈免费升级。

## 本地运行

```bash
npm install
npm run dev
```

打开终端显示的本地地址即可。生产构建：

```bash
npm run build
npm run preview
```

## 自动测试

```bash
npm test
```

规则层不依赖 DOM/Three.js，覆盖移动、起点俸禄、买地、升级、竞拍、商路/公共设施估值、监狱与破产判定。

## GitHub Pages

仓库根目录已包含 `.github/workflows/pages.yml`。将本目录作为仓库内容推送到 `main` 分支后，在 GitHub 仓库的 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**，工作流会自动发布到：

```text
https://<用户名>.github.io/<仓库名>/
```

## 技术

- Vite 8 + Three.js 0.186
- PBR 材质、程序化 Canvas 木纹/织物/团扇纹理
- 透视镜头 + OrbitControls + UnrealBloomPass
- 盛唐微缩剧场材质：漆器、青瓷、绢纱、石材、氧化金属、纸张与发丝纹理
- 程序化资产细节：窗格、屋檐、旗帜、栏杆、花盆、器物、衣缝、扣子与角色饰品
- Web Audio 合成音效，无外部音频资源
- localStorage 自动存档
- 无后端、无需登录
