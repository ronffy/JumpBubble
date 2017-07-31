# JumpBubble

酷炫实用的态度气泡，通过canvas实现

### [点我预览效果吧](https://wanghairong-i.github.io/JumpBubble/)

## 介绍

-   该插件无任何依赖，纯原生js写成
-   兼容IE9+
-   API丰富，使用简单
-   webpack + es6 跑项目

## 项目怎么跑起来  HOW TO RUN

### ES6环境

```javascript

//安装
npm install  

//启动
npm start

//产出
npm run build

```

### 非ES6环境

在html文件中引入dist/bubble.js即可

## 怎么使用 HOW TO USE

```javascript

const bubble = new JumpBubble(canvasNode);

bubble.create(imgsrcStr);

```
