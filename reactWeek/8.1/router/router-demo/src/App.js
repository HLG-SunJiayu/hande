import React from "react";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import './App.css';
import { blue } from "ansi-colors";
import Jianjie from './pages/jianjie';
import Introduction from './pages/Introduction'
import Jichu from './pages/jichu'
// Each logical "route" has two components, one for
// the sidebar and one for the main area. We want to
// render both of them in different places when the
// path matches the current URL.
/*const routes = [
  {
    path: "/",
    exact: true,
    
    main: () => 
    <section>
      <h1 id="-react-router-%E4%B8%AD%E6%96%87%E6%96%87%E6%A1%A3-https-github-com-react-guide-react-router-cn"><a href="https://github.com/react-guide/react-router-cn" target="_blank">React Router 中文文档</a></h1><hr/>
      <p>在线 Gitbook 地址：<a href="http://react-guide.github.io/react-router-cn/" target="_blank">http://react-guide.github.io/react-router-cn/</a></p>
      <p>英文原版：<a href="https://github.com/rackt/react-router/tree/master/docs" target="_blank">https://github.com/rackt/react-router/tree/master/docs</a></p>
      <p>React Router 是完整的 React 路由解决方案</p>
      <p>React Router 保持 UI 与 URL 同步。它拥有简单的 API 与强大的功能例如代码缓冲加载、动态路由匹配、以及建立正确的位置过渡处理。你第一个念头想到的应该是 URL，而不是事后再想起。</p>
      <p><strong>重点：这是 React Router 的 <code>master</code> 分支，其中包含了很多还没有发布的修改。如果要看到最新公布的代码，请浏览 <a href="https://github.com/rackt/react-router/tree/latest" target="_blank"><code>latest</code> 标签</a>。</strong></p>
      <h3 id="%E6%96%87%E6%A1%A3-%E5%B8%AE%E5%8A%A9">文档 &amp; 帮助</h3>
      <ul>
          <li><a href="docs">API 文档与指南</a></li>
          <li><a href="https://github.com/rackt/react-router/blob/master/CHANGELOG.md" target="_blank">Change Log</a></li>
          <li><a href="http://stackoverflow.com/questions/tagged/react-router" target="_blank">Stack Overflow</a></li>
          <li><a href="http://codepen.io/anon/pen/xwQZdy?editors=001" target="_blank">Codepen Boilerplate</a> 用于反馈 bug</li>
      </ul>
      <p><strong>注意：</strong> <strong>如果你仍然使用的是 React Router 0.13.x，可以在 <a href="https://github.com/rackt/react-router/tree/0.13.x" target="_blank">the 0.13.x branch</a> 找到 <a href="https://github.com/rackt/react-router/tree/0.13.x/docs/guides" target="_blank">文档</a>。升级信息可以查看 <a href="https://github.com/rackt/react-router/blob/master/CHANGELOG.md" target="_blank">change log</a>。</strong></p>
      <p>如果有疑问和技术难点，请到<a href="https://discord.gg/0ZcbPKXt5bYaNQ46" target="_blank">我们的 Reactiflux 频道</a>或 <a href="http://stackoverflow.com/questions/tagged/react-router" target="_blank">Stack Overflow</a> 提问。这里的 issue 是<strong>专门</strong>为反馈 bug 和新特性提出所设立的。</p>
      <h3 id="%E6%B5%8F%E8%A7%88%E5%99%A8%E6%94%AF%E6%8C%81">浏览器支持</h3>
      <p>我们支持所有的浏览器和环境中运行 React。</p>
      <h3 id="%E5%AE%89%E8%A3%85">安装</h3>
      <p>首先通过 <a href="https://www.npmjs.com/" target="_blank">npm</a> 安装：</p>
      <pre><code>$ npm install <span class="token operator">--</span>save react<span class="token operator">-</span>router
      </code></pre>
      

    
    </section>
  },
  {
    path: "/jianjie",
    
    main: () =>
    <section>
      <h1>简介</h1>
      <p>React Router 是一个基于 React 之上的强大路由库，它可以让你向应用中快速地添加视图和数据流，同时保持页面与 URL 间的同步。

为了向你说明 React Router 解决的问题，让我们先来创建一个不使用它的应用。所有文档中的示例代码都会使用 ES6/ES2015 语法和语言特性。</p>
      <h3>不使用React Router</h3>
      <pre>
        <code>
        
        <span class="token keyword">import</span> React from
        <span class="token string">'react'</span>
        <span class="token keyword">import</span>
        
          
        
        </code>
      </pre>
    </section>   
  },
  {
    path: "/jichu",

    main: () =>
    <section>
    <h1>基础</h1>
    <ul>
      <li><a href="RouteConfiguration.html">路由配置</a></li>
      <li><a href="RouteMatching.html">路由匹配原理</a></li>
      <li><a href="Histories.html">History</a></li>
      <li><a href="IndexRoutes.html">默认路由（IndexRoute）与 IndexLink</a></li>
    </ul>
    </section>
  },
  {
    path: "/luyoupeizhi",
    
    main: () => <h1>路由配置</h1>
  },
  {
    path: "/luyoupipeiyuanli",
    
    main: () => <h1>路由匹配原理</h1>
  },
  {
    path: "/History",
    
    main: () => <h1>History</h1>
  },
  {
    path: "/morenluyou",
    
    main: () => <h1>默认路由（IndexRoute）与 IndexLink</h1>
  }
];*/

function SidebarExample() {
  return (
    <Router>
      <div style={{ display: "flex" }}>
        <div
          style={{
            padding: "10px",
            width: "23%",
            height: "1000px",
            overflow: "auto scroll",
            background: "#f0f0f0"
          }}
        >
          <ul style={{ listStyleType: "none", padding: 0 }}>
            <li >
              <Link to="/">Introduction</Link>
            </li>
            <li>
              <Link to="/jianjie">1.简介</Link>
            </li>
            <li>
              
              <Link to="/jichu">2.基础</Link>
              <ul class="jcfz">
              <li><Link to="/luyoupeizhi">2.1路由配置</Link></li>
              <li><Link to="/luyoupipeiyuanli">2.2路由匹配原理</Link></li>
              <li><Link to="/History">2.3History</Link></li>
              <li><Link to="/morenluyou">2.4默认路由（IndexRoute）与 IndexLink</Link></li>
              </ul>
            </li>
          </ul>
        </div>

        <div style={{ flex: 1, padding: "10px" ,margin:"0px 0px 0px 50px"}}>
          <Switch>
          <Route
              key="jianjie"
              path="/jianjie"
              exact
              component={Jianjie}
            />
            <Route
              
              path="/"
              exact
              component={Introduction}
            />
            <Route
              
              path="/jichu"
              exact
              component={Jichu}
            />
          </Switch>
          {/* {routes.map((route, index) => (
            // Render more <Route>s with the same paths as
            // above, but different components this time.
            <Route
              key={index}
              path={route.path}
              exact={route.exact}
              component={route.main}
            />
          ))} */}
        </div>
      </div>
    </Router>
  );
}

export default SidebarExample;