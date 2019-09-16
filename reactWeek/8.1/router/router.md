2019/8/1

# React Router

## 一、基本组件

### 1.概念

React Router中有三种类型的组件：路由器组件，路由匹配组件和导航组件。

### 2.路由器

每个React Router应用程序的核心应该是路由器组件。对于Web项目，`react-router-dom`提供`<BrowserRouter>`和`<HashRouter>`路由器。这两个都创建一个专门的`history`对象。一般来说，`<BrowserRouter>`如果有一台响应请求的服务器，并且`<HashRouter>`使用的是静态文件服务器，则应使用a 。

```
import { BrowserRouter } from "react-router-dom";
ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  holder
);
```

### 3.路线匹配

有两个路由匹配组件：`<Route>`和`<Switch>`

```
import { Route, Switch } from "react-router-dom";
```

路由匹配一个由比较完成`<Route>`的`path`道具到当前位置的`pathname`。当`<Route>`匹配时它将呈现其内容，当它不匹配时，它将呈现`null`。`<Route>`没有路径的A 将始终匹配。

```
// when location = { pathname: '/about' }
<Route path='/about' component={About}/> // renders <About/>
<Route path='/contact' component={Contact}/> // renders null
<Route component={Always}/> // renders <Always/>
```

您可以根据`<Route>`位置包含要呈现内容的任何位置。列出`<Route>`彼此相邻的多个可能的s 通常是有意义的。该`<Switch>`组件用于将`<Route>`s组合在一起。

```jsx
<Switch>
  <Route exact path="/" component={Home} />
  <Route path="/about" component={About} />
  <Route path="/contact" component={Contact} />
</Switch>
```

在`<Switch>`不需要分组`<Route>`S，但它可以是非常有用的。A `<Switch>`将迭代其所有子`<Route>`元素，并仅渲染与当前位置匹配的第一个子元素。当多个路径的路径匹配相同的路径名，动画路由之间的转换，以及识别何时没有路径与当前位置匹配时（这样您可以渲染“404”组件），这会有所帮助。

```jsx
<Switch>
  <Route exact path="/" component={Home} />
  <Route path="/about" component={About} />
  <Route path="/contact" component={Contact} />
  {/* when none of the above match, <NoMatch> will be rendered */}
  <Route component={NoMatch} />
</Switch>
```

### 4.路线渲染道具

对于给定的一个组件中的三点支柱的选择`<Route>`：`component`，`render`，和`children`。

`component`当具有`React.Component`要呈现的现有组件（无或无状态功能组件）时，应使用此方法。`render`采用内联函数的方法只应在必须将范围内变量传递给要渲染的组件时使用。不使用`component`道具与内联函数通过调查范围内的变量，因为会得到期望分量卸除/重新装载。

```jsx
const Home = () => <div>Home</div>;

const App = () => {
  const someVariable = true;

  return (
    <Switch>
      {/* these are good */}
      <Route exact path="/" component={Home} />
      <Route
        path="/about"
        render={props => <About {...props} extra={someVariable} />}
      />
      {/* do not do this */}
      <Route
        path="/contact"
        component={props => <Contact {...props} extra={someVariable} />}
      />
    </Switch>
  );
};
```

### 5.导航

React Router提供了一个`<Link>`组件来在您的应用程序中创建链接。无论在何处呈现a `<Link>`，`<a>`都会在应用程序的HTML中呈现anchor（）。

**例：**

```
<Link to="/">Home</Link>
// <a href='/'>Home</a>
```

这`<NavLink>`是一种特殊类型，`<Link>`当它的`to`道具与当前位置匹配时，它可以将自己定型为“活动” 。

```
// location = { pathname: '/react' }
<NavLink to="/react" activeClassName="hurray">
  React
</NavLink>
// <a href='/react' className='hurray'>React</a>
```

任何时候你想强制导航，你可以渲染一个`<Redirect>`。当`<Redirect>`呈现，它将导航使用它的`to`道具。

```jsx
<Redirect to="/login" />
```



## 二、属性

- path属性，字符串类型，它的值就是用来匹配url的。
- component属性，它的值是一个组件。在`path`匹配成功之后会绘制这个组件。
- exact属性，这个属性用来指明这个路由是不是排他的匹配。
- strict属性，  这个属性指明路径只匹配以斜线结尾的路径。

还有其他的一些属性，可以用来代替`component`属性。

- render属性，一个返回React组件的方法。传说中的[rencer-prop](https://reactjs.org/docs/render-props.html)就是从这里来的。
- children属性，返回一个React组件的方法。只不过这个总是会绘制，即使没有匹配的路径的时候。

多数的时候是用`component`属性就可以满足。但是，某些情况下你不得不使用`render`或`children`属性。

- match

- location

- history

  如：
  使用组件：

  ```
  <Route exact path="/" component={HomePage} />
  ```

使用`render`属性实现内联绘制：

```
<Route path="/" render={()=><div>HomePage</div>} />
```

```
const FadingRoute = ({ component, ...rest }) => (
  <Route {...rest} render={(props) => (
    <FadeIn>
      <componnet {...props} />
    </FadeIn>
  )} />
)

<FadingRoute path="/cool" component={Something} />
```

使用`children`：

<ul>
  <ListItemLink to="/somewhere" />
  <LinkItemLink to="/somewhere-else" />
</ul>

const ListItemLink = ({to, ...rest}) => (
  <Route path={to} children={({math}) => (
    <li className={match ? 'active' : ''}>
      <Link to={to} {...rest} />
    </li>
  )} />
)

### 三、URL / Path / Route的参数

通常情况下，我们都会在路径里添加参数。这样方便在不同的组件之间传递一些必要的数据。那么我们如何才能获取到这些传递的参数，并传递给组件中呢？我们只需要在路径的最后加上`/:param`。如：

```
<Route path="/:param1" component={HomePage} />

const HomePage = ({match}) => (
  <div>
    <h1> parameter => {match.params.param1}
  </div>
);

```

一旦有路径可以匹配成功，那么就会穿件一个拥有如下属性的对象，并传入绘制的组件里：

- url: 匹配的url。
- path：就是path。
- isExact：如果`path`和当前的`widnow.location`的path部分完全相同的话。
- params：在URL里包含的参数。

### 四、使用<Redirect>组件实现重定向

无论何时你要重定向到另外一个地址的时候，都可以使用`Redirect`组件：

```
<Redirect to {{
  pathname: '/register',
  search: '?utm=something',
  state: { referrer: someplage.com }
}}>
```

或者

```
<Redirect to="register" />
```

这使得别的组件可以通过 JSX 嵌套，将任意组件作为子组件传递给它们。

```
function WelcomeDialog() {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        Welcome
      </h1>
      <p className="Dialog-message">
        Thank you for visiting our spacecraft!
      </p>
    </FancyBorder>
  );
}
```



