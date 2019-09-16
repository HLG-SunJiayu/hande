2019/8/20

# vue

## 一、vue基础

### 1.概念

Vue.js是一套构建用户界面的 渐进式框架。与其他重量级框架不同的是，Vue 采用自底向上增量开发的设计。Vue 的核心库只关注视图层，并且非常容易学习，非常容易与其它库或已有项目整合。另一方面，Vue 完全有能力驱动采用单文件组件和 Vue 生态系统支持的库开发的复杂单页应用。
Vue.js 的目标是通过尽可能简单的 API 实现响应的数据绑定和组合的视图组件。

优点：

​     体积小。接口灵活。侵入性好，可用于页面的一部分，而不是整个页面。扩展性好。源码规范简洁。代码较为活跃。语法简单。

缺点：

​     社区不大，如果有问题可以读源码。功能仅限于view层，Ajax等功能需要额外的库。对开发人员要求较高。开发的话，需要webpack，不然很难用，最好配合es6。

### 2.项目解构

   build/
        此目录包含开发服务器和生产webpack构建的实际配置。 通常，您不需要触摸这些文件，除非您要自定义Webpack加载器，在这种情况下，您应该看看build / webpack.base.conf.js。

   config/index.js
        这是显示构建设置的一些最常见配置选项的主配置文件。 有关详细信息，请参阅开发期间的API代理和后端框架集成。

​    src/
​        这是你的大部分应用程序代码所在的位置。如何构建此目录中的所有内容，主要取决于您; 如果您使用Vuex，您可以查阅Vuex应用程序的建议。

​    static/
​        此目录是您不想使用Webpack进行处理的静态资源的一个逃生舱口。 它们将直接复制到生成webpack建立资产的同一个目录中。

​    test/unit
​        包含单元测试相关文件。 

​    test/e2e
​         包含e2e测试相关文件。

 index.html
         这是我们的单页应用程序的模板index.html。 在开发和构建期间，Webpack将生成资产，并将生成的资产的URL自动注入到此模板中以呈现最终的HTML。

​    package.json
​        包含所有构建依赖项和构建命令的NPM软件包元文件。

### 3.代码规范

Vue开发遵从html5基本开发规范



1. 文件及文件夹命名
          统一采用 小写字母加中划线 方式	file-na me
   2. 组件 name 配置
       统一采用 小写字母加中划线 方式	component-name
   3. Js变量及方法
       统一采用 首字母小写的驼峰 方式	methodName
   4. 组件引用 
       统一采用 首字母大写的驼峰 方式	ComponentName
   5. .env环境变量配置
       统一采用 全大写家下划线 方式	VUE_APP_PARAM

6. 注释

   



## 二、vue语法

### 1.模板语法

插值：
1、文本
	数据绑定最常见的形式就是使用 {{...}}（双大括号）的文本插值：
2、html
	使用 v-html 指令用于输出 html 代码：

       <div v-html="message"></div> 

​        data: { message: '<h1>输出的HTML内容</h1>' }
3、属性
​	HTML 属性中的值应使用 v-bind 指令。
4、表达式
​	Vue.js 都提供了完全的 JavaScript 表达式支持。
   	       {{ number + 1 }}	       {{ ok ? ‘YES’ : ‘NO’ }}	       {{ message.split('').reverse().join('') }}

过滤器-小写转换成大写
<!-- 在两个大括号中 -->
使用：  {{ message | toLocaleUpperCase }} 
定义：
 filters: {             
       toLocaleUpperCase : function (value) {        
                return value.toLocaleUpperCase();     
       },            
} 

### 2.条件语句

1、v-if 、 v-else 、 v-else-if  （ v-else 、v-else-if 必须跟在 v-if 或者 v-else-if之后。）

2、v-show

如果用v-if的话，整个dom结构压根就不会出现在页面上，如果是用v-show的话，要视后面的条件来定，如果是true,则显示，
v-show 不管是ture还是false div元素都会渲染出来（false style的display:none）,如果如果有频繁的切换，我们会首选v-show,减少对dom的频繁操作

### 3.循环语句

循环使用 v-for 指令
v-for 指令需要以 item in list 形式的特殊语法， list是源数据数组并且 item是数组元素迭代的别名。
v-for 可以绑定数据到数组来渲染一个列表。

在用v-for更新已渲染的元素列表的时候，会使用就地复用的策略；这就是说列表数据修改的时候，他会根据key值去判断某个值是否修改，如果修改了就重新渲染，不然就复用之前的元素。

所以我们需要可以想办法让数组中不会变化的数据的key值也不变，所以不能通过index来设置key值，应该设置一个唯一的id来标识数据的唯一性；

### 4.绑定

样式绑定：

一、class属性绑定

​     1、v-bind:class 支持数据变量
​     2、v-bind:class 支持对象，对象改变时会动态更新class
​     3、数组语法

二、style属性绑定

​     1、 使用json格式，直接在行间写
​       2、直接把data中的某个对象，绑定到style
​       3、把data中的对象，作为数组的某一项，绑定到style



事件绑定：

（ v-on:click="" @click="" ）



表单输入绑定：

可以用 v-model 指令在表单 <input>、<textarea> 及 <select> 元素上创建双向数据绑定。它会根据控件类型自动选取正确的方法来更新元素。

### 5.计算属性、方法与侦听器

计算属性computed属性，因为他是属性，所以在用插值表达式取值的时候不用加括号computed：内置变量缓存的功能，当data里面age变量更改时，如果不是计算属性内边的变量更改，那么他就不会渲染computed内部的变量

总结：
我们可以通过methods、computed、watch来实现fullName显示的问题。computed和watch都具备缓存的功能，但是从代码量的编写程度来看，computed属性会更加方便和便捷一些。

## 三、vue组件

### 1.概念

组件（Component）是 Vue.js 最强大的功能之一。
组件可以扩展 HTML 元素，封装可重用的代码。
组件系统让我们可以用独立可复用的小组件来构建大型应用，几乎任意类型的应用的界面都可以抽象为一个组件树

### 2.生命周期

生命周期

beforeCreate（创建前）,
created（创建后）,
beforeMount(载入前),
mounted（载入后）,
beforeUpdate（更新前）,
updated（更新后）,
beforeDestroy（销毁前）,
destroyed（销毁后），

生命周期总结：

beforecreate : 可以在这加个loading事件 
created ：在这结束loading，还做一些初始化，实现函数自执行 
mounted ： 在这发起后端请求，拿回数据，配合路由钩子做一些事情
beforeDestroy： 你确认删除XX吗？ 

destroyed ：当前组件已被删除，清空相关内容**注意**：
组件名开头要大写。

React 会将以小写字母开头的组件视为原生 DOM 标签。例如，< div /> 代表 HTML 的 div 标签，而 < Welcome /> 则代表一个组件，并且需在作用域内使用 Welcome。

### 3.父子组件

定义是父子组件：

 将其他组件引入用自定义标签接收，在当前组件中component里注册该标签，页面上可以直接用<自定义标签></自定义标签>样子使用。当前组件为父组件，被引入的组件为子组件。



父组件的数据、方法传递给子组件：

在父组件里面，子组件以自定义标签，在这些标签里通过:lists= lists’，:detail=’ detail’，形式传递给子组件。:后面跟的是自己定义的参数名，后面子组件接收时用到。’’里面跟的是父组件里的数据，或者方法。 

​        子组件中，用props:[‘lists’, detail’],或者指定接受参数类型的形式接收父组件的数据和方法，注意接收使用的名字跟父组件自己定义的名字要一致，此时如果接收的方法用到了父组件的变量，在子组件中调用时，还是指向父组件的变量。

父组件向子组件传值：是通过属性的方式，子组件向父组件传值：可以通过$emit来触发一个事件。



### 4.vue 组件开发 props 验证

一、type

​     1、使用type来声明这个参数可以接受的数据的类型
​      2、type接受多个类型，当参数可以是多种类型的其中一个的时候，使用数组来表示。

​          type可以是以下类型：String、Number、Boolean、Function、Object、Array、Symbol

二、required、可以使用required选项来声明这个参数是否必须传入。

三、 default，使用default选项来指定当父组件未传入参数时props变量的默认值

四、validator、当校验规则很复杂，默认提供的校验规则无法满足的时候可以使用自定义函数来校验。