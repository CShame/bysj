# BYSJ

## 运行环境介绍

本脚手架运行环境为( base on command: `ionic info`):

```bash
Ionic:

   ionic (Ionic CLI)  : 4.1.2
   Ionic Framework    : ionic-angular 3.9.2
   @ionic/app-scripts : 3.1.11

Cordova:

   cordova (Cordova CLI) : 8.1.2
   Cordova Platforms     : android 7.1.4
   Cordova Plugins       : no whitelisted plugins (0 plugins total)

System:

   NodeJS            : v8.11.3
   npm               : 6.1.0
   OS                : Windows 10
```

## 使用

### 首次使用

1. git clone git@github.com:CShame/bysj.git
2. npm install // 安装依赖、插件
3. gulp dev    // 代码打包
4. ionic serve // 在浏览器中查看代码 （npm install 后的任何时候都能运行）
5. ionic cordova platform add android@7.1.4 // 添加android平台
6. ionic cordova build android              // 生成安装包
7. ionic cordova run android                // 生成安装包并且安装到手机上


### 代码有更新

1. git pull
2. npm install // 如果有插件或者依赖更新，没有的话请忽略，一般不会经常有
3. gulp dev
4. ionic serve // 在浏览器中查看代码
...            // 接下来跟上面差不多了


### 代码提交

1. git add .  
2. git commit -m '这里写你的描述'
3. git push        // 可能要输密码
