# store 设计

## 紧跟 vuex 步伐

## 公有 state 和私有 state

### 公有 state

> 使用 Store.state 属性配置公有 state。

> 使用 Store.getters、Store.mutations 分别添加 Store.state 各个属性对应的查询和设置方法

### 私有 state

> 定义每个子应用的 state 都是在 Store.modules中，并设定`namespaced=true`

> 创建各 state 对应的 getter、mutation
 
## store配置

### 使用 cross-env 给打包添加参数

`VUE_APP_BUILD` - 区分模式是开发还是部署

`VUE_APP_TARGET` - 判断当前打包子应用

### 配置

> 根据 process.env.VUE_APP_BUILD 值控制是否需要把所有子应用的 state 均包含(开发模式下包含)

> 根据 process.env.VUE_APP_TARGET 值控制动态引入打包所需的子应用 state

> 查看 `src/store/index.js` 及 各子应用 `modules/module-a/store/index.js`

### 使用

> 推荐使用 mapGetters mapMutations 方法调用

#### 公有化调用

```javascript
import { mapGetters, mapMutations } from 'vuex'

export default {   
    methods: {
        ...mapGetters(['getLocationSearch']),
        
        ...mapMutations(['setLocationSearch']),
        
        clickEv(){
            let search = this.getLocationSearch()
            console.log(search)
        },
        
        clickEv2(){
            const search = {}
            this.setLocationSearch(search)
        }
    },
}
```

#### 私有化调用

```javascript
import { mapGetters, mapMutations } from 'vuex'

export default {   
    methods: {
        ...mapGetters({
             moduleAGetSelectedType: 'moduleA/getSelectedType'
        }),
        
        ...mapMutations({
            moduleASetSelectedType: 'moduleA/setSelectedType'
        }),
        
        clickEv(){
            let selectedType = this.moduleAGetSelectedType()
            console.log(selectedType)
        },
        
        clickEv2(){
            const selectedType = {}
            this.moduleASetSelectedType(selectedType)
        }
    },
}
```

