
## Frog-UI

### 演示站点
https://frog-ui.vercel.app/

### 安装
#### 使用 `npm` 或 `yarn` 安装
```
npm install frog-ui --save
```
```
yarn add frog-ui
```

如果你的网络环境不佳，推荐使用 `cnpm`。

#### 浏览器引入
在浏览器中使用 `script` 和 `link` 标签直接引入文件，并使用全局变量 `Frog`。

`npm` 发布包内的 `frog-ui/dist` 目录下提供了 `frog.js` `frog.css` 以及 `frog.min.js` `frog.min.css`。你也可以通过 `CDN` 或 `UNPKG` 进行下载。

> 强烈不推荐使用已构建文件，这样无法按需加载。  
> `frog.js` 和 `frog.min.js` 依赖 `react/react-dom`，请确保提前引入这些文件。

### 示例
```
import { Button } from 'frog-ui';

ReactDOM.render(<Button type="primary">按钮<Button>, mountNode);
```

引入样式：
```
import 'frog-ui/dist/frog.min.css';
```

#### 按需加载
`frog-ui` 的 `JS` 代码默认支持基于 `ES modules` 的 `tree shaking`。