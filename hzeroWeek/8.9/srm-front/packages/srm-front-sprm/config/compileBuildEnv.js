/**
 * 打包编译时的环境变量配置
 * compileBuildEnv
 * @author WY <yangg.wang06@hand-china.com>
 * @date 2019-06-17
 * @copyright 2019-06-17 © HAND
 */

module.exports = {
  BASE_PATH: 'BUILD_BASE_PATH',
  PLATFORM_VERSION: 'BUILD_PLATFORM_VERSION',
  WEBSOCKET_HOST: 'BUILD_WEBSOCKET_HOST',
  CLIENT_ID: 'BUILD_CLIENT_ID',
  API_HOST: 'BUILD_API_HOST',
  WFP_EDITOR: 'BUILD_WFP_EDITOR',
  SRC_WEBSOCKET_HOST: 'BUILD_SRC_WEBSOCKET_HOST',
  SRM_MALL_HOST: 'BUILD_SRM_MALL_HOST',
  GENERATE_SOURCEMAP: false,
  PUBLIC_URL: 'BUILD_PUBLIC_URL',
  LOGIN_URL: 'BUILD_LOGIN_URL',
  LOGOUT_URL: 'BUILD_LOGOUT_URL',
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
