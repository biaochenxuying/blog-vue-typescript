![](https://upload-images.jianshu.io/upload_images/12890819-052c33403c8a0157.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


## 简介

此项目是基于 Vue 全家桶 + TypeScript + Element-UI 技术栈的简洁时尚博客网站。

项目详情请猛戳该文章： [Vue + TypeScript + Element 搭建简洁时尚的博客网站及踩坑记](https://biaochenxuying.cn/articleDetail?article_id=5c9d8ce5f181945ddd6b0ffc)

TypeScript 具有类型系统，且是 JavaScript 的超集，TypeScript 在 2018年 势头迅猛，可谓遍地开花。

Vue3.0 将使用 TS 重写，重写后的 Vue3.0 将更好的支持 TS。2019 年 TypeScript 将会更加普及，能够熟练掌握 TS，并使用 TS 开发过项目，将更加成为前端开发者的优势。


## 效果

效果图：

- pc 端

![](https://upload-images.jianshu.io/upload_images/12890819-9f5f1b384a27c6ff.gif?imageMogr2/auto-orient/strip)


- 移动端

![](https://upload-images.jianshu.io/upload_images/12890819-5370ed6dfbe61051.gif?imageMogr2/auto-orient/strip)


完整效果请看：[https://biaochenxuying.cn](https://biaochenxuying.cn)


## 功能

### 已经完成功能

- [x] 登录  
- [x] 注册  
- [x] 文章列表
- [x] 文章归档
- [x] 标签  
- [x] 关于  
- [x] 点赞与评论
- [x] 留言
- [x] 历程
- [x] 文章详情（支持代码语法高亮）
- [x] 文章详情目录
- [x] 移动端适配
- [x] github 授权登录

### 待优化或者实现

笔者也是刚学的 TypeScript，对 TS 的运用还有待提高，后续会触入更多的 TypeScript 特性。

- [ ] 使用 vuex-class
- [ ] 更多 TypeScript 的优化技巧
- [ ] 等出了 Vue3.0，用 Vue3.0 进行重构
- [ ] 服务器渲染 SSR

## 前端主要技术 

所有技术都是当前最新的。

- vue： ^2.6.6
- typescript : ^3.2.1
- element-ui： 2.6.3
- vue-router : ^3.0.1
- webpack： 4.28.4
- vuex: ^3.0.1
- axios：0.18.0
- highlight.js： 9.15.6
- marked：0.6.1


## Build Setup 

``` 
 # clone
git clone https://github.com/biaochenxuying/blog-vue-typescript.git
```

```
# cd
cd  blog-vue-typescript
```

```
# install dependencies
npm install
```

```
# Compiles and hot-reloads for development
npm run serve
```

```
# Compiles and minifies for production
npm run build
```


如果要看有后台数据完整的效果，是要和后台项目  **[blog-node](https://github.com/biaochenxuying/blog-node)** 一起运行才行的，不然接口请求会失败。

虽然引入了 mock 了，但是还没有时间做模拟数据，想看具体效果，请稳步到我的网站上查看 [https://biaochenxuying.cn](https://biaochenxuying.cn)

## 项目地址与文档教程

**项目地址：**

> [vue 前台展示: https://github.com/biaochenxuying/blog-vue-typescript](https://github.com/biaochenxuying/blog-vue-typescript)

> [react 前台展示: https://github.com/biaochenxuying/blog-react](https://github.com/biaochenxuying/blog-react)

> [管理后台：https://github.com/biaochenxuying/blog-react-admin](https://github.com/biaochenxuying/blog-react-admin)

> [后端：https://github.com/biaochenxuying/blog-node](https://github.com/biaochenxuying/blog-node)

> [blog：https://github.com/biaochenxuying/blog](https://github.com/biaochenxuying/blog)

**本博客系统的系列文章：**

- [1. react + node + express + ant + mongodb 的简洁兼时尚的博客网站](https://biaochenxuying.cn/articleDetail?article_id=5bf57a8f85e0f13af26e579b)
- [2. react + Ant Design + 支持 markdown 的 blog-react 项目文档说明](https://biaochenxuying.cn/articleDetail?article_id=5bf6bb5e85e0f13af26e57b7)
- [3. 基于 node + express + mongodb 的 blog-node 项目文档说明](https://biaochenxuying.cn/articleDetail?article_id=5bf8c57185e0f13af26e7d0d)
- [4. 服务器小白的我,是如何将node+mongodb项目部署在服务器上并进行性能优化的](https://biaochenxuying.cn/articleDetail?article_id=5bfa728bb54f044b4f9da240)
- [5. github 授权登录教程与如何设计第三方授权登录的用户表](https://biaochenxuying.cn/articleDetail?article_id=5c7bd34e42b55e2ecc90976d)
- [6. 一次网站的性能优化之路 -- 天下武功，唯快不破](https://biaochenxuying.cn/articleDetail?article_id=5c8ca2d3b87b8a04f1860c9a)
- [7. Vue + TypeScript + Element 搭建简洁时尚的博客网站及踩坑记](https://biaochenxuying.cn/articleDetail?article_id=5c9d8ce5f181945ddd6b0ffc)
- [8. 前端解决第三方图片防盗链的办法 - html referrer 访问图片资源403问题](https://biaochenxuying.cn/articleDetail?article_id=5cfcc6798090bd3c84138a08)


## 权衡

如何更好的利用 JS 的动态性和 TS 的静态特质，我们需要结合项目的实际情况来进行综合判断。一些建议：

* 如果是中小型项目，且生命周期不是很长，那就直接用 JS 吧，不要被 TS 束缚住了手脚。
* 如果是大型应用，且生命周期比较长，那建议试试 TS。
* 如果是框架、库之类的公共模块，那更建议用 TS 了。

**至于到底用不用TS，还是要看实际项目规模、项目生命周期、团队规模、团队成员情况等实际情况综合考虑。**

其实本项目也是小项目来的，其实并不太适合加入 TypeScript ，不过这个项目是个人的项目，是为了练手用的，所以就无伤大大雅。


## 最后


如果你觉得该项目不错，或者对你有所帮助，点个 Star 、或者真心赞赏一下 都是对我最大的鼓励，我会更有动力维护好该项目。

> **江山父老能容我，不使人间造孽钱**。

![](https://upload-images.jianshu.io/upload_images/12890819-ffab7bd24d08c00d.jpeg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

