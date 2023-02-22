# 说明

根据 `mini-program-iconfont-cli` 修改而成

`github: ` https://github.com/iconfont-cli/mini-program-iconfont-cli

# Step 1

安装依赖

```bash
yarn
```

# Step 2

生成配置文件

```bash
yarn iconfont-init
```

此时项目根目录会生成一个`iconfont.json`的文件，内容如下：

```json
{
  "symbol_url": "//at.alicdn.com/t/c/font_3897230_r8a7xzqhb5r.js",
  "save_dir": "../src/icon/iconfont",
  "demo_dir": "../src/icon/demo",
  "trim_icon_prefix": "icon",
  "default_icon_size": 18
}
```

### 配置参数说明：

#### symbol_url

默认为：`//at.alicdn.com/t/c/font_3897230_r8a7xzqhb5r.js`

请直接复制[iconfont](http://iconfont.cn)官网提供的项目链接。请务必看清是`.js`后缀而不是`.css`后缀。

#### save_dir

根据 iconfont 图标生成的组件存放的位置。每次生成组件之前，该文件夹都会被清空。

#### trim_icon_prefix

通用的前缀。

# Step 3

生成 taro 小程序标准组件

```bash
yarn iconfont-cli
```

# 更新图标

当您在 iconfont.cn 中的图标有变更时，只需更改配置`symbol_url`，然后再次执行`Step 3`即可生成最新的图标组件。

```bash
# 修改 symbol_url 配置后执行：
yarn iconfont-cli
```
