一个开发h5页面的微型框架
=================
>工程涉及打包、微信分享、屏幕旋转检测等等。
>
>工程中代码考虑尽量轻量化，所以过重的插件、控件、模块不推荐引入，比如不推荐jquery，替换为zepto等等。

基础环境
--------------------------

1. 安装`node`，windows系统请到<http://nodejs.cn/download/>这里选择`msi`下载安装，mac和其它非windows系统可以自行选择方案。
2. 安装完`node`后，请安装`cnpm`，后续只要出现需要`npm`的地方，几乎可以全部使用`cnpm`替代：
   + `npm install -g cnpm --registry=https://registry.npm.taobao.org`

启动项目
------------

1. 进入`h5`目录
2. 执行`npm install` or `cnpm install`
3. 执行`npm start`，会自动在默认浏览器中打开`http://localhost:9001`，表示启动成功，然后在后面加上app目录下的目录名即可打开一个h5页面，比如`http://localhost:9001/report`。
4. 如果执行`npm start`失败或无效，执行`npm run s`启动，该命令启动后不会自动在浏览器中打开，需要手动输入，也不能监听文件变化来自动刷新浏览器。

新建一个H5项目
------------

1. `gulp new --name=新项目名称`
2. 原理：将`app/_template`目录拷贝一份。
3. <font color='red'>切记：不要手动复制拷贝一个目录来创建一个新的h5页面，一定要使用该命令行创建新的h5页面。</font>

测试生产环境代码
------------
1. 执行`gulp build-test --s=项目名称`或：发布后会启动一个测试窗口测试发布后的代码。
2. 如果上述命令没执行成功，那么执行以下命令：
   + `gulp build --s=项目名称`：单纯的发布
   + `npm test`，然后手动输入`http://localhost:9002/{项目名称}`


发布一个H5项目
------------

1. 发布脚本：
    + `gulp build --s=项目名称`：单纯的发布

2. 会在根目录的`dist`目录下生成该项目的生产环境代码。
3. 发布会做js/css合并压缩、md5命名和路径替换。

如果修改了app/common/less/base.less，请运行：
------------

1. `gulp basecss`
2. 保证`app/common/base.less`和`app/common/base.css`同步。

开发注意事项：
------------

1. 页面所有样式建立在`app/common/less/base.less`或`app/common/css/base.css`之上。
2. 所有页面样式文件尽量采用`less`编写。
3. 项目采用`eslint`作为代码规范检查工具：<font color='red'>（暂时关闭）</font>
    + 全项目通用规则配置在根目录下的`.eslintrc`。
    + 自定义项目的规则配置在本项目的根目录下，如`app/demo/.eslintrc`。
    + 如果项目中有需要排除的文件，需要在本项目中`.eslintrc`中配置`excludes`选项，如在`app/demo/.eslintrc`中配置`{ "excludes": ["js/jquery.min.js"] }`