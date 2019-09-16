/**
 * 配置 utils/config 下的常量
 */

/**
 * deps 和 get 必须同时出现
 * get 和 init 是互斥的
 *
 * @typedef {Object|string} CONFIG
 * @property {?Function} init - 返回返回字符串包裹的字符串模板; 参照 CLIENT_ID
 * @property {?boolean} noChange - 是否能改变 false/undefined => 能改变, true => 不能改变; 参照 CLIENT_ID
 * @property {?string[]} deps - 依赖的CONFIG, 当 依赖的CONFIG 改变时 会同时改变; 参照 AUTH_SELF_URL 的配置
 * @property {?Function} get - 依赖改变生成自己的方法; (...deps: string[]) => string; 参照 AUTH_SELF_URL 的配置
 */

/**
 * @type {CONFIG[]}
 */

const config = {
  SRC_WEBSOCKET_HOST: {
    init: () => {
      return '`${process.env.SRC_WEBSOCKET_HOST}`';
    }
  },
  SRM_MDM: '/smdm',
  SRM_PLATFORM: '/spfm',
  SRM_INTERFACE_CONFIG: '/sifc',
  SRM_INTERFACE: '/sitf',
  SRM_SSLM: '/sslm',
  SRM_SODR: '/sodr',
  SRM_SFIN: '/sodr',
  SRM_SQAM: '/sqam',
  SRM_SSRC: '/ssrc',
  SRM_CREDIT: '/seci',
  SRM_SCEC: '/scec',
  SRM_SREQ: '/sodr',
  SRM_SCEI: '/scei',
  SRM_SPCM: '/spcm',
  SRM_MALL_HOST: {
    init: () => {
      return '`${process.env.SRM_MALL_HOST}`';
    }
  }
}

 const prefix = `/**
 * 不要直接修改这个文件, 请修改 config/apiConfig 文件
 * Config - 全局统一配置
 * @date: 2018-6-20
 * @author: niujiaqing <njq.niu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
`;

const suffix = '';

module.exports = {
  config,
  prefix,
  suffix,
};
