/**
 * CommonIndex 平台服务-采购商配置
 * @date: 2018-8-27
 * @author dengtingmin <tingmin.deng@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import classnames from 'classnames';

import Menu from '../Menu';
import Common from './Common';
import styles from '../index.less';

@connect(({ configServer }) => ({
  configServer,
}))
export default class CommonIndex extends Component {
  constructor(props) {
    super(props);
    props.onRef(this);
  }

  render() {
    const menuList = [{ key: 1, href: 'content', title: '首页展示内容' }];
    return (
      <div className={styles.content}>
        <div className={styles['left-wrapper']}>
          <Menu menuList={menuList} getContainer={() => document.getElementById('scrollArea')} />
        </div>
        <div id="scrollArea" className={styles['right-wrapper']}>
          <div className={classnames(styles['config-content'])}>
            <div id="content">
              <Common
                onRef={node => {
                  this.commonRef = node;
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
