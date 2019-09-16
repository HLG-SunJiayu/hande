/**
 * 通过 ../config/apiConfig 生成 utils/config 文件
 * @author WY <yang.wang06@hand-china.com>
 * @date 2019-05-22
 * @copyright ® HAND
 */
const {config, prefix, suffix} = require('../config/apiConfig');

const helpFuncMap = {};
const initLang = [];
const changeRouteSwitch = new Map(); // 存储 case 代码
const configChangeFunc = [];
const exportConfig = [];

Object.entries(config).forEach(([key, value]) => {

  // #region exportConfig
  exportConfig.push(key);
  // #endregion

  // #region initConfig
  let varType = 'let';
  if (value.noChange) {
    varType = 'const';
  }

  //  init  lang
  if (value.init) {
    initLang.push(`${varType} ${key} = ${value.init()};`);
  } else if (value.get) {
    //  get  config  return  body;
    // TODO: 初始化时也调用方法
    // const retBody = value.get.toString().match(/return ([\S\s]+);/);
    // initLang.push(`${varType} ${key} = ${(retBody && retBody[1] || '')};`);
    initLang.push(
      `${varType} ${key} = change${key}(${value.deps.join(', ')});`);
  } else {
    initLang.push(`${varType} ${key} = '${value}';`);
  }
  // #endregion

  if (value.noChange) {
    // noChange 不能在运行时更改
    return;
  }

  // #region help  func
  const curHelp = helpFuncMap[key] || {changeConfig: [], depBy: []};
  helpFuncMap[key] = curHelp;
  if (value.deps) {
    value.deps.forEach((depKey) => {
      const depHelp = helpFuncMap[depKey] || {changeConfig: [], depBy: []};
      helpFuncMap[depKey] = depHelp;
      depHelp.changeConfig.push(key);
      curHelp.depBy.push(key);
    });
  }
  curHelp.changeConfig.push(key);
  // #endregion

  // #region change  route  func
  const curCase = changeRouteSwitch.get(key) || [];
  changeRouteSwitch.set(key, curCase);
  if (value.deps) {
    //  if  have  deps,  must  have  get
    value.deps.forEach((depKey, depIndex) => {
      const depCase = changeRouteSwitch.get(depKey) || [];
      changeRouteSwitch.set(depKey, depCase);
      const newDep = [...value.deps];
      newDep[depIndex] = 'value';
      depCase.push(`${key} = change${key}(${newDep.join(', ')});`);
    });
    const changeFuncLines = value.get.toString().split('\n');
    changeFuncLines[0] = `function change${key} (${value.deps.join(', ')}) {`;
    const lastLineNo = changeFuncLines.length - 1;
    configChangeFunc.push(
      changeFuncLines.map((line, lineNo) => {
        if (lineNo === 0 || lineNo === lastLineNo) {
          return line.trim();
        } else {
          return `  ${line.trim()}`;
        }
      }).join('\n'));
  }
  // every config can change it self
  curCase.push(`${key} = value;`);
  // #endregion

});

function renderChangeRouteSwitch() {
  const strs = [
    'window.srmChangeRoute = function srmChangeRoute(key, value)  {',
    '  if(key && value)  {',
    '    switch(key)  {',
  ];
  for ([key, value] of changeRouteSwitch.entries()) {
    if (value.noChange) {
      return;
    }
    const curCase = (value || []);
    strs.push(`      case '${key}':`,
      curCase.map(str => {
        return `        ${str}`;
      }).join('\n'),
      '        break;',
    );
  }
  strs.push('',
    '    }',
    '  } else {',
    '    helpMethod(key);',
    '  }',
    '};',
  );
  return strs.join('\n');
}

function renderHelpMethod() {
  const strs = [];
  strs.push(`const helpMethodAssist = ${JSON.stringify(helpFuncMap)};`,
    'function helpMethod(key) {',
    '  if(key && helpMethodAssist[key]) {',
    `     console.error(\`\${key} 会更改: [\${helpMethodAssist[key].changeConfig.join(', ')}], 被级连更改: [\${helpMethodAssist[key].depBy.join(', ')}]\`)`,
    '  } else {',
    `    console.error('使用 changeRoute() 查看可以更改的参数');`,
    `    console.error('使用 changeRoute("参数") 查看具体改变');`,
    `    console.error('使用 changeRoute("参数", "参数值") 更改参数');`,
    `    console.error(\`可以更改的配置: [\${Object.keys(helpMethodAssist).join(', ')}]\`);`,
    '  }',
    '}');
  return strs.join('\n');
}

function renderExportsConfig() {
  return ['export {', exportConfig.join(',\n  '), '};'].join('\n');
}

const configData = [
  prefix,
  '// #region initConfig',
  initLang.join('\n'),
  '// #endregion',
  '',
  '// #region changeConfig Funcs',
  configChangeFunc.join('\n'),
  '// #endregion',
  '',
  '// #region changeRoute',
  renderChangeRouteSwitch(),
  '// #endregion',
  '',
  '// #region helpMethod',
  renderHelpMethod(),
  '// #endregion',
  '',
  '// #regioin exportsConfig',
  renderExportsConfig(),
  '// #endregion',
  suffix,
];

require('fs').
  writeFileSync(
    require('path').resolve(__dirname, '../src/utils/config.js'),
    configData.join('\n'),
  );
