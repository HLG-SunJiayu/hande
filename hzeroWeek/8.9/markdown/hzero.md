2019/8/14

# Hzero

## 一、环境搭建

### 1.开发环境

1. [nodejs](https://nodejs.org/en/) 推荐使用 `10.16.0(最新的lts版本)`
2. [yarn](https://yarnpkg.com/en/docs/getting-started) `npm install -g yarn`
3. [lerna](https://github.com/lerna/lerna) `npm install -g lerna`
4. [hzero-front-cli](https://code.choerodon.com.cn/hzero-hzero/hzero-front-cli/) `npm install -g hzero-front-cli --registry=http://nexus.saas.hand-china.com/content/groups/hzero-npm-group/`

### 2.设置流程

1. 设置环境变量，避免下载puppeteer(windows如果输入命令还会下载puppeteer,就把1命令(linux的)也执行以下)
   1. `export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=1` #macos/linux
   2. `set PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=1` #windows
2. `yarn config set registry http://nexus.saas.hand-china.com/content/groups/srm-npm-group/`: 将源设置为公司服务器的地址
3. `lerna bootstrap`: 安装本项目packages依赖
4. `yarn build:dll`: 将第三方公共库抽离出来，如果子模块下`yarn start`报dll not found, 就执行这条命令（根加packages里俩）
5. `lerna run transpile`: 将src下的内容用babel转译到lib下
6. `yarn start`: 去对应的`packages/模块`路径下执行启动webpack-dev-server, 我们的路径是`packages/srm-front-sprm`

### 3.开发流程

​    1.config/routers.js新增对应的path,models,component
​    2.src/routes下面新增对应的文件夹，然后写组件component
​    3.src/models/模块 新增对应的model
​    4.src/services/模块 新增对应的service

### 4.问题

![](D:/Fork/201907-B-Train/25785-%E5%AD%99%E4%BD%B3%E9%92%B0/hzeroWeek/8.9/markdown/imgs/1.png)

​    先在Visual里搜索一下没有找到模块的路径，除去lib下的文件，其他的注释掉，并且将最后方的相关代码也注释掉。

​    若注释掉后还遇到此问题，可能是packages下的srm-front-spfm和srm-front-sprm没有dll文件，需要在相应目录下执行yarn build:dll

![](D:/Fork/201907-B-Train/25785-%E5%AD%99%E4%BD%B3%E9%92%B0/hzeroWeek/8.9/markdown/imgs/2.png)

   此命令要在Git Bash上执行



## 二、项目

### 1.目录

![](D:/Fork/201907-B-Train/25785-%E5%AD%99%E4%BD%B3%E9%92%B0/hzeroWeek/8.9/markdown/imgs/3.png)

![](D:/Fork/201907-B-Train/25785-%E5%AD%99%E4%BD%B3%E9%92%B0/hzeroWeek/8.9/markdown/imgs/4.png)

### 2.src 主要源码目录

| 目录名     | 说明                          |
| :--------- | :---------------------------- |
| assets     | 资源文件，主要存放图片,字体等 |
| common     | 全局通用文件，目前只有路由    |
| components | 通用组件                      |
| layouts    | 通用布局组件                  |
| models     | Model 组件                    |
| routes     | 所有路由组件                  |
| services   | 所有服务组件                  |
| utils      | 通用工具类                    |

### 3.LOV组件

| 参数           | 说明                                                         | 类型     | 默认值 | 必输 |
| :------------- | :----------------------------------------------------------- | :------- | :----- | :--- |
| code           | 值集编码                                                     | string   | “      | 是   |
| originTenantId | 值集所属租户，该属性将会在查询值集的接口上映射名为`tenantId`的查询条件 | number   | 无     | 否   |
| textField      | 映射显示字段                                                 | string   | 无     | 否   |
| textValue      | 显示值                                                       | string   | “      | 否   |
| allowClear     | 是否显示清除按钮                                             | boolean  | true   | 否   |
| onOk           | onOk                                                         | function |        | 否   |
| onCancel       | onCancel                                                     | function |        | 否   |
| onClick        | onClick                                                      | function |        | 否   |
| onClear        | onClear                                                      | function |        | 否   |
| onChange       | onChange                                                     | function |        | 否   |

引入LOV组件

```
import Lov from 'components/Lov';

<Form.Item
  label={intl.get('hsdr.concPermission.model.permission.concPragramId').d('请求名称')}
>
  {getFieldDecorator('concurrentId', {})(
    <Lov
      textField="concurrentName"
      code="HSDR.CONCURRENT"
    />
  )}
</Form.Item>
```

### 4.导出组件

| 参数             | 说明                                                         | 类型          | 默认值 | 必输 |
| :--------------- | :----------------------------------------------------------- | :------------ | :----- | :--- |
| requestUrl       | 后台开发的请求接口，该接口将会被调用两次， 第一次获取可以选择导出的列， 第二次执行导出，下载 Excel | string        | “      | 是   |
| method           | 请求的类型                                                   | string        | GET    | 是   |
| queryParams      | 功能模块的查询参数                                           | object        | 无     | 是   |
| queryFormItem    | 额外的导出条件，将会渲染在导出窗口中                         | React.element | 无     | 否   |
| otherButtonProps | 导出按钮的属性，支持Button的所有属性                         | object        | 无     | 否   |

示例

```
// 1. 引入导出组件
import ExcelExport from 'components/ExcelExport';

// 2. 引用，配置props
import { HZERO_PLATFORM } from 'utils/config'; // 引入具体的服务，配置requestUrl

<ExcelExport
  requestUrl={`${HZERO_PLATFORM}/v1/events/export`}
  queryParams={this.props.form.getFieldsValue()} // 此处为页面的查询表单
  queryFormItem={this.renderExportTree()}
/>

// 额外的导出条件，非必填，此处为示例
renderExportTree() {
    const { platform: { code: { authorityType = [] } = {} } } = this.props;
    const { expandedKeys, checkedKeys } = this.state;
    if (isEmpty(authorityType)) {
      return null;
    } else {
      return (
        <Tree
          checkable
          onExpand={this.handleExpand}
          expandedKeys={expandedKeys}
          defaultExpandedKeys={['authorityType']}
          onCheck={this.handleSelect}
          checkedKeys={checkedKeys}
        >
          <TreeNode
            title={intl.get('hiam.subAccount.model.user.authorityType').d('权限维度')}
            key="authorityType"
          >
            {map(authorityType, item => {
              return <TreeNode title={item.meaning} key={item.value} />;
            })}
          </TreeNode>
        </Tree>
      );
    }
  }
```

### 5.编辑组件

CodeMirror

| 参数            | 说明                                             | 类型                                    | 默认值           | 必输 |
| :-------------- | :----------------------------------------------- | :-------------------------------------- | :--------------- | :--- |
| value           | 编辑器的初始值，可以是字符串或文档               | `string`                                | “                | 否   |
| className       | 编辑器的class样式                                | `string`                                | hzero-codemirror | 否   |
| fetchCodeMirror | 获取编辑器对象                                   | `function(editor)`                      | e => e           | 否   |
| onChange        | 组件值变化的监听事件                             | `function(editor, data,value)`          | 否               |      |
| onBeforeChange  | 组件值变化前的监听事件                           | `function(editor, data, value, [next])` | 否               |      |
| options         | 用于配置组件其他属性，比如组件主题，详见下方描述 | `object`                                | {}               | 否   |

options参数

| 参数         | 说明                                               | 类型             | 默认值           | 必输 |
| :----------- | :------------------------------------------------- | :--------------- | :--------------- | :--- |
| theme        | 编辑器主题风格                                     | `string`         | ‘default’        | 否   |
| className    | 编辑器的class样式                                  | `string`         | hzero-codemirror | 否   |
| lineNumbers  | 显示行号                                           | `boolean`        | true             | 否   |
| mode         | 以什么格式高亮代码                                 | `string`         | yaml             | 是   |
| autoFocus    | 自动获取焦点                                       | `boolean`        | true             | 否   |
| readOnly     | 是否只读，设置为`nocursor`后将只读且不自动获取焦点 | `boolean/string` | false            | 否   |
| cursorHeight | 设置行高                                           | `number`         | 0.85             | 否   |



## 6.前端权限组件

可以根据需求控制`按钮`、`表单域`禁用/隐藏状态，`表格列`的显示/隐藏。

**页面控制组件**：`Button`、`FormItem`、`Fields`、`TablePermission`；

在页面加载时，根据权限组件的`permissionList`属性设置的权限集编码进行鉴权。

> 其中 `Button`、`FormItem` 除了新增 `permissionList` 属性外与原生的 hzero-ui 组件无异，可以代替原生的 Button、FormItem 来使用；

