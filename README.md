![](https://upload-images.jianshu.io/upload_images/12890819-527034962df50506.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


## 简介

**项目已经用 Vue3 + TypeScript + Vite2 + Vuex4 + Vue-Router4 + element-plus 重构完啦！**

Vue2 版本请点这里：[基于 Vue2 全家桶 + TypeScript + Element-UI](https://github.com/biaochenxuying/blog-vue-typescript/tree/vue2) 或者 [v2.0.0](https://github.com/biaochenxuying/blog-vue-typescript/releases/tag/v2.0.0)

---

此项目是基于 Vue3 全家桶 + TypeScript + element-plus 技术栈的简洁时尚博客网站。

项目详情请猛戳该文章：

- [Vue3 全家桶 + TS+ Vite2 + element-plus 搭建简洁时尚的博客网站实战及踩坑记](https://juejin.cn/post/6924687052005081095)


## 效果

效果图：

- pc 端

![](https://upload-images.jianshu.io/upload_images/12890819-9f5f1b384a27c6ff.gif?imageMogr2/auto-orient/strip)


- 移动端

![](https://upload-images.jianshu.io/upload_images/12890819-5370ed6dfbe61051.gif?imageMogr2/auto-orient/strip)


<!-- 完整效果请看：[https://biaochenxuying.cn](https://biaochenxuying.cn) -->


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


[⬆️ 返回顶部](##简介)

## 前端主要技术 

所有技术都是当前最新的。

- vue： ^3.0.5
- typescript : ^4.1.3
- element-plus: ^1.0.2-beta.41
- vue-router : ^4.0.6
- vite: ^2.2.3
- vuex: ^4.0.0
- axios: ^0.21.1
- highlight.js: ^10.7.2
- marked：^2.0.3


[⬆️ 返回顶部](##简介)

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
npm run dev
```

```
# Compiles and minifies for production
npm run build
```


如果要看有后台数据完整的效果，是要和后台项目  **[blog-node](https://github.com/biaochenxuying/blog-node)** 一起运行才行的，不然接口请求会失败。

<!-- 虽然引入了 mock 了，但是还没有时间做模拟数据，想看具体效果，请稳步到我的网站上查看 [https://biaochenxuying.cn](https://biaochenxuying.cn) -->


[⬆️ 返回顶部](##简介)


## 项目地址与文档教程

**项目地址：**

> [vue 前台展示: https://github.com/biaochenxuying/blog-vue-typescript](https://github.com/biaochenxuying/blog-vue-typescript)

> [react 前台展示: https://github.com/biaochenxuying/blog-react](https://github.com/biaochenxuying/blog-react)

> [管理后台：https://github.com/biaochenxuying/blog-react-admin](https://github.com/biaochenxuying/blog-react-admin)

> [后端：https://github.com/biaochenxuying/blog-node](https://github.com/biaochenxuying/blog-node)

> [blog：https://github.com/biaochenxuying/blog](https://github.com/biaochenxuying/blog)

**本博客系统的系列文章：**

- [0. Vue3 全家桶 + TS+ Vite2 + element-plus 搭建简洁时尚的博客网站实战及踩坑记](https://juejin.cn/post/6959174069577220110)
- [0. Vue3 全家桶 + Element Plus + Vite + TypeScript + Eslint 项目配置最佳实践](https://juejin.cn/post/6924687052005081095)
- [1. react + node + express + ant + mongodb 的简洁兼时尚的博客网站](https://juejin.cn/post/6844903718345768973)
- [2. react + Ant Design + 支持 markdown 的 blog-react 项目文档说明](https://juejin.cn/post/6844903719260127239)
- [3. 基于 node + express + mongodb 的 blog-node 项目文档说明](https://juejin.cn/post/6844903721680240653)
- [4. 服务器小白的我,是如何将 node+mongodb 项目部署在服务器上并进行性能优化的](https://juejin.cn/post/6844903721827041293)
- [5. github 授权登录教程与如何设计第三方授权登录的用户表](https://juejin.cn/post/6844903789091094542)
- [6. 一次网站的性能优化之路 -- 天下武功，唯快不破](https://juejin.cn/post/6844903798692020237)
- [7. Vue + TypeScript + Element 搭建简洁时尚的博客网站及踩坑记](https://juejin.cn/post/6844903810457042957)
- [8. 前端解决第三方图片防盗链的办法 - html referrer 访问图片资源403问题](https://juejin.cn/post/6844903869755949069)


[⬆️ 返回顶部](##简介)


## 服务器

笔者觉得每个开发者都应该拥有自己的网站和服务器，这可是很酷的事情，学习 Linux、跑跑脚本、建站、搭博客啥的都行啊。

因为笔者就有自己的服务器，而且有两台了，用于平时的学习，还搭建了自己的网站。

有不少读者问过我，为什么我学的那么快的呢 ？ 怎么在一年内学了那么知识的...

其实也没什么秘决，就是平时有自己的服务器了，就爱折腾，学到的知识能很快得到验证，所以学起来兴致高一点。

特别是大三和大四的学生，买了服务器，搭建个项目给面试官看也香，对找工作和面试都加分，还可以熟悉技术栈。

阿里云、腾讯云、华为云 都有，这里购买就是最优惠： [低于 1 折、89/年、229/3年，比学生机还便宜](https://github.com/biaochenxuying/biaochenxuying/issues/1)）

比如笔者的两个网站：

<!-- > https://biaochenxuying.cn/ -->

> https://www.kwgg2020.com/


[⬆️ 返回顶部](##简介)


## 项目推荐


> 专注于挖掘优秀的前端开源项目，抹平你的前端信息不对称的项目：https://github.com/FrontEndGitHub/FrontEndGitHub

> 以最优惠的方式购买极客时间课程：https://github.com/biaochenxuying/preferential-courses ，涵盖了后端、架构、前端、移动、人工智能、大数据、产品、运营、运维、测试等


[⬆️ 返回顶部](##简介)

<!-- 
## 撩我

如果你觉得该项目不错，或者对你有所帮助，点个 Star，就是对我最大的鼓励，我会更有动力维护好该项目。


| 微信 | 公众号 |
| :------: |  :------: |
| ID：**CB834301747** <div align="center" style="margin-top: 10px;"> ![CB834301747](https://upload-images.jianshu.io/upload_images/12890819-d4d4cae18ddb84c5.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/360) </div> | ID：**QuanZhanXiuLian** <div align="center" style="margin-top: 10px;"> ![](https://upload-images.jianshu.io/upload_images/12890819-50b85ba33dd7ba90.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240) </div> |


> 欢迎关注微信公众号 “**[全栈修炼](https://upload-images.jianshu.io/upload_images/12890819-9a13b43f4feb8f84.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)**”，回复 **电子书** 就送你 **1000+** 本精华编程电子书；回复 **1024** 送你一套完整的 **前端** 视频教程。


![](https://upload-images.jianshu.io/upload_images/12890819-860e00b3a4b6c418.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

有需要的就来拿吧，**绝对免费，无套路获取**。


[⬆️ 返回顶部](##简介) -->