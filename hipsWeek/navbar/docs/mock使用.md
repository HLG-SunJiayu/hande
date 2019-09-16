# mock

## 使用mock实现完全的前后端分离

### 不需要依赖后端接口，可以模拟接口返回

### 与后端确定好入参和回参后，即可独立开发

## 文档

[mockjs](https://github.com/nuysoft/Mock/wiki)

## 开发

### 设置 process.env.VUE_APP_MOCK = yes 会使用mock模拟数据。

### 目录

| 目录 | 描述 |
|--|--|
| mocks | mock配置 |
| mocks/index.js | 默认mocks入口 |
| mocks/utils.js | mock工具 |
| mocks/modules | mock 模块化 |
| mocks/modules/**.js | 模块mock配置 |

### 配置

* 在 `mocks/modules` 目录下建立模块js，开发相应js(参看user.js)

* 在 `mocks/index.js` 中引入模块js，并调用 `createMock` 方法

```javascript
import User from './modules/user'

createMock(Mock, User)
```

### mock方法

#### 设计每一个mock对象包含如下参数

| 值 | 描述 | 类型 |
|--|--|--|
| rurl | 匹配路径 | String|正则表达式 |
| rtype | 方法 | post|get|put|delete |
| template | 返回值 | - |
| callback | 回调方法，参数options，可以从options中获取url、type、body | function |

> 请参看 user.js

#### mock.random

* basic

| 方法 | 描述 | 示例 |
|--|--|--|
| boolean | 返回一个随机的布尔值 | Random.boolean() |
| natural | 返回一个随机的自然数（大于等于 0 的整数）| Random.natural() |
| integer | 生成1到100之间的整数 | Random.integer(1, 100) |
| float | 生成0到100之间的浮点数,小数点后尾数为0到5位 | Random.float(0, 100, 0, 5) |
| character | 生成随机字符,可加参数定义规则 | Random.character() |
| string | 返回一个随机字符串 | Random.string('壹贰叁肆伍陆柒捌玖拾', 3, 5) |
| range | 生成一个随机数组 | Random.range(0, 10, 2) |

* date

| 方法 | 描述 | 示例 |
|--|--|--|
| date | 生成一个随机日期,可加参数定义日期格式 | Random.date('yyyy-MM-dd') |
| time | 获取一个随机时间 | Random.time('HH:mm:ss') |
| datetime | 返回一个随机的日期和时间字符串 | Random.datetime() |
| now | 返回当前的日期和时间字符串 | Random.now() |

* image

| 方法 | 描述 | 示例 |
|--|--|--|
| image | 生成一个随机的图片地址 | Random.image('200x100', '#00405d', '#FFF', 'Mock.js') |
| dataImage | 生成一段随机的 Base64 图片编码 | Random.dataImage(Random.size, 'hello') |

* color

| 方法 | 描述 | 示例 |
|--|--|--|
| color | 随机生成一个有吸引力的颜色，格式为 '#RRGGBB' | Random.color() |
| hex | 随机生成一个有吸引力的颜色，格式为 '#RRGGBB' | Random.hex() |
| rgb | 随机生成一个有吸引力的颜色，格式为 'rgb(r, g, b)' | Random.rgb() |
| rgba | 随机生成一个有吸引力的颜色，格式为 'rgba(r, g, b, a)' | Random.rgba() |
| hsl | 随机生成一个有吸引力的颜色，格式为 'hsl(h, s, l)' | Random.hsl() |

* text

| 方法 | 描述 | 示例 |
|--|--|--|
| paragraph | 随机生成一段文本 | Random.paragraph(3, 7) |
| cparagraph | 随机生成一段中文文本 | Random.cparagraph(1, 3) |
| sentence | 随机生成一个句子，第一个单词的首字母大写 | Random.sentence(1, 3) |
| csentence | 随机生成一段中文文本 | Random.csentence(1, 3) |
| word | 随机生成一个单词 | Random.word(1, 3) |
| cword | 生成中文10到15个 | Random.cword('零一二三四五六七八九十', 10, 15) |
| title | 随机生成一句标题，其中每个单词的首字母大写 | Random.title(3, 5) |
| ctitle | 随机生成一句中文标题 | Random.ctitle(3, 7) |

* name

| 方法 | 描述 | 示例 |
|--|--|--|
| first | 随机生成一个常见的英文名 | Random.first() |
| last | 随机生成一个常见的英文姓 | Random.last() |
| name | 随机生成一个常见的英文姓名 | Random.name() |
| cfirst | 随机生成一个常见的中文名 | Random.cfirst() |
| clast | 随机生成一个常见的中文姓 | Random.clast() |
| cname | 随机生成一个常见的中文姓名 | Random.cname() |

* web

| 方法 | 描述 | 示例 |
|--|--|--|
| url | 随机生成一个 URL | Random.url('http', 'baidu.com') |
| protocol | 随机生成一个 URL 协议 | Random.protocol() |
| domain | 随机生成一个域名 | Random.domain() |
| tld | 随机生成一个顶级域名 | Random.tld() |
| email | 随机生成一个邮箱 | Random.email('qq.com') |
| ip | 随机生成一个 IP 地址 | Random.ip() |

* address

| 方法 | 描述 | 示例 |
|--|--|--|
| region | 随机生成一个（中国）大区 | Random.region() |
| province | 随机生成一个（中国）省（或直辖市、自治区、特别行政区） | Random.province() |
| city | 指示是否生成所属的省 | Random.city(true) |
| county | 随机生成一个（中国）县 | Random.county(true) |
| zip | 随机生成一个邮政编码（六位数字） | Random.zip() |
| address | 生成地址 | Random.province() |

* helper

| 方法 | 描述 | 示例 |
|--|--|--|
| capitalize | 把字符串的第一个字母转换为大写 | Random.capitalize('hello') |
| upper | 把字符串转换为大写 | Random.upper('hello') |
| lower | 把字符串转换为小写 | Random.lower('HELLO') |
| pick | 从数组中随机选取一个元素，并返回 | Random.pick(['a', 'e', 'i', 'o', 'u']) |
| shuffle | 打乱数组中元素的顺序，并返回 | Random.shuffle(['a', 'e', 'i', 'o', 'u']) |

* miscellaneous

| 方法 | 描述 | 示例 |
|--|--|--|
| guid | 随机生成一个 GUID | Random.guid() |
| id | 随机生成一个 18 位身份证 | Random.id() |
| increment | 生成一个全局的自增整数。自增为2 | Random.increment(2) |