// http://eslint.org/docs/user-guide/configuring
module.exports = {
  "root": true,
  "env": {
    "node": true,     // node 环境及全局变量
    "browser": true,  // 浏览器环境及全局变量
    "es6": true       // es6环境及全局变量
  },
  "globals": {
    "navigator": false, // 禁用navigator全局变量
  },
  "plugins": [
    "vue"
  ],
  "extends": [
    "eslint:recommended",     // 使用 recommended 配置
    "plugin:vue/recommended"  // 使用 vue/recommended 配置
  ],
  "rules": {
    "arrow-parens": 2,    // 要求箭头函数的参数使用圆括号
    "generator-star-spacing": 0,  // 强制 generator 函数中 * 号周围使用一致的空格
    "no-debugger": 2, // 禁用 debugger
    "block-scoped-var": 2,  // 强制把变量的使用限制在其定义的作用域范围内
    "no-multi-spaces": 0, // 禁止使用多个空格
    "no-console": 0, // 禁用 console
    "eqeqeq": 1, // 强制强类型判断===,!==
    "no-else-return": 1,  // 禁止 if 语句中 return 语句之后有 else 块
    "comma-dangle": [2, {
      "arrays": "always-multiline", // 数组末尾换行需要逗号
      "objects": "always-multiline", // 对象末尾换行需要逗号
      "imports": "always-multiline", // imports末尾换行需要逗号
      "exports": "always-multiline", // exports数组末尾换行需要逗号
      "functions": "always-multiline", // 方法数组末尾换行需要逗号
    }],
    "array-bracket-newline": [1,
      {
        "multiline": true,  // 如果数组元素内或元素间有换行，则要求换行。
        "minItems": 3 // 如果数组元素的个数大于等于3的整数，则要求换行。
      }
    ],
    "array-bracket-spacing": [1,
      "always",
      {
        "objectsInArrays": false, // 禁止在数组的方括号和数组内的对象元素的大括号之间，即 [{ 或 }]出现空格
        "arraysInArrays": false // 禁止在数组的方括号和数组内的数组元素的方括号之间，即 [[ 或 ]]出现空格
      }
    ],
    "block-spacing": [1,
      "always"  // 强制在代码块中开括号前和闭括号后有空格
    ],
    "brace-style": [1,
      "1tbs"
    ],
    "camelcase": [1,
      { "properties": "always" }  // 强制属性名称为驼峰风格
    ],
    "no-var": 1 // 禁止使用 var
  },
  "parserOptions": {
    "parser": "babel-eslint"
  }
}
