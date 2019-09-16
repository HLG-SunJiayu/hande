2019/7/30
# react
## 一、react相关知识
### 1.概念
React 是一个用于构建用户界面的 JavaScript 库。
### 2.将JSX 添加到项目
步骤 1： 执行
``` 
npm init -y 
```
步骤 2： 执行 
```
npm install babel-cli@6 babel-preset-react-app@3
```
### 3.运行 JSX 预处理器
创建一个名为 src 的文件夹并执行这个终端命令：
```
npx babel --watch src --out-dir . --presets react-app/prod 
```
**注意**：
1.npx 不是拼写错误 —— 它是 npm 5.2+ 附带的 package 运行工具。
2.不要等待它运行结束 —— 这个命令启动了一个对 JSX 的自动监听器。
## 二、JSX相关知识
### 1.概念
JSX是一个 JavaScript 的语法扩展，就是用来声明 React 当中的元素。在 React 中配合使用 JSX，JSX 可以很好地描述 UI 应该呈现出它应有交互的本质形式。JSX 可能会使人联想到模版语言，但它具有 JavaScript 的全部功能。
### 2.优点
- JSX 执行更快，因为它在编译为 JavaScript 代码后进行了优化。
- 它是类型安全的，在编译过程中就能发现错误。
- 使用 JSX 编写模板更加简单快速。
### 3.jsx特定属性
可以通过使用引号，来将属性值指定为字符串字面量：
```
const element = <div tabIndex="0"></div>;
```
也可以使用大括号，来在属性值中插入一个 JavaScript 表达式：
```
const element = <img src={user.avatarUrl}></img>;
```
在属性中嵌入 JavaScript 表达式时，不要在大括号外面加上引号。你应该仅使用引号（对于字符串值）或大括号（对于表达式）中的一个，对于同一属性不能同时使用这两种符号。

**注意**：
因为 JSX 语法上更接近 JavaScript 而不是 HTML，所以 React DOM 使用 camelCase（小驼峰命名）来定义属性的名称，而不使用 HTML 属性名称的命名约定。
### 4.JSX 表示对象
Babel 会把 JSX 转译成一个名为 React.createElement() 函数调用。

以下两种示例代码完全等效：
```
jsx版

const element = (
  <h1 className="greeting">
    Hello, world!
  </h1>
);
```
```
react版

const element = React.createElement(
  'h1',
  {className: 'greeting'},
  'Hello, world!'
);
```
React.createElement() 会预先执行一些检查，以帮助你编写无错代码。
### 5.jsx表达式
在编译之后，JSX 表达式会被转为普通 JavaScript 函数调用，并且对其取值后得到 JavaScript 对象。

也就是说，你可以在 if 语句和 for 循环的代码块中使用 JSX，将 JSX 赋值给变量，把 JSX 当作参数传入，以及从函数中返回 JSX
```
function getGreeting(user) {
  if (user) {
    return <h1>Hello, {formatName(user)}!</h1>;
  }
  return <h1>Hello, Stranger.</h1>;
}
```

在 JSX 中不能使用 if else 语句，但可以使用 conditional (三元运算) 表达式来替代。
```
ReactDOM.render(
    <div>
      <h1>{i == 1 ? 'True!' : 'False'}</h1>
    </div>
    ,
    document.getElementById('example')
);
```
## 三、组件相关知识
### 1.概念
组件类似于 JavaScript 函数。它接受任意的入参（即 “props”），并返回用于描述页面展示内容的 React 元素。
### 2.函数组件
函数是一个有效的 React 组件，因为它接收唯一带有数据的 “props”（代表属性）对象与并返回一个 React 元素。这类组件被称为“函数组件”，因为它本质上就是 JavaScript 函数。
```
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```
**注意**：
组件名开头要大写。

React 会将以小写字母开头的组件视为原生 DOM 标签。例如，< div /> 代表 HTML 的 div 标签，而 < Welcome /> 则代表一个组件，并且需在作用域内使用 Welcome。
### 3.class组件
可以使用 ES6 的 class 来定义组件：
（与上面的函数组件等价）
```
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```
### 4.渲染组件
 React 元素是 DOM 标签：
 ```
 const element = <div />;
 ```
 React 元素是用户自定义的组件：
 ```
 const element = <Welcome name="Sara" />;
 ```
 当 React 元素为用户自定义组件时，它会将 JSX 所接收的属性（attributes）转换为单个对象传递给组件，这个对象被称之为 “props”。
 
 **例**：
 ```
 function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

const element = <Welcome name="Sara" />;
ReactDOM.render(
  element,
  document.getElementById('root')
);
```
执行步骤：
1.调用 ReactDOM.render() 函数，并传入 <Welcome name="Sara" /> 作为参数。
2.React 调用 Welcome 组件，并将 {name: 'Sara'} 作为 props 传入。
3.Welcome 组件将 < h1 >Hello, Sara< /h1 > 元素作为返回值。
4.React DOM 将 DOM 高效地更新为 < h1 >Hello, Sara< /h1 >。
### 5.组合组件
组件可以在其输出中引用其他组件。可以让我们用同一组件来抽象出任意层次的细节。按钮，表单，对话框，甚至整个屏幕的内容：在 React 应用程序中，这些通常都会以组件的形式表示。

 **例**：
 多次渲染 Welcome 组件的 App 组件：
 ```
 function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

function App() {
  return (
    <div>
      <Welcome name="Sara" />
      <Welcome name="Cahal" />
      <Welcome name="Edite" />
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
```
### 6.提取组件
将组件拆分为更小的组件。
**例**：
```
function Comment(props) {
  return (
    <div className="Comment">
      <div className="UserInfo">
        <img className="Avatar"
          src={props.author.avatarUrl}
          alt={props.author.name}
        />
        <div className="UserInfo-name">
          {props.author.name}
        </div>
      </div>
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}
```
首先，我们将提取 Avatar 组件：
```
function Avatar(props) {
  return (
    <img className="Avatar"
      src={props.user.avatarUrl}
      alt={props.user.name}
    />

  );
}
```
然后，提取 UserInfo 组件：
```
function UserInfo(props) {
  return (
    <div className="UserInfo">
      <Avatar user={props.user} />
      <div className="UserInfo-name">
        {props.user.name}
      </div>
    </div>
  );
}
```
最后，进一步简化 Comment 组件：
```
function Comment(props) {
  return (
    <div className="Comment">
      <UserInfo user={props.author} />
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}
```
