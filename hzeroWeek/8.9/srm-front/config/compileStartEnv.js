/**
 * 开发编译时的环境变量配置
 * compileStartEnv
 * @author WY <yangg.wang06@hand-china.com>
 * @date 2019-06-17
 * @copyright 2019-06-17 © HAND
 */

module.exports = {
  BASE_PATH: '/',
  PLATFORM_VERSION: 'SAAS',
  CLIENT_ID: 'localhost',
  API_HOST: 'http://gateway.dev.going-link.com',
  WEBSOCKET_HOST: 'ws://192.168.16.172:8120',
  PLATFORM_VERSION: 'SAAS',
  SRC_WEBSOCKET_HOST: 'http://192.168.16.127:8412',
  SRM_MALL_HOST: 'http://srm-mall.dev.saas.hand-china.com',
  WFP_EDITOR: 'http://192.168.16.173:8170',
  // 服务合并的环境变量
  routeMap: JSON.stringify({
    "/hpfm": "/hpfm",
    "/iam": "/iam",
    "/hdtt": "/hdtt",
    "/hmsg": "/hmsg",
    "/hptl": "/hptl",
    "/hwfl": "/hwfl",
    "/hdtw": "/hdtw",
    "/hsdr": "/hsdr",
    "/hsgp": "/hsgp",
    "/hitf": "/hitf",
    "/hfle": "/hfle",
    "/oauth": "/oauth",
    "/hagd": "/hagd",
    "/himp": "/himp",
    "/hrpt": "/hrpt",
    "/hcnf": "/hcnf",
    "/hwfp": "/hwfp",
    "/hnlp": "/hnlp"
  }),
};
