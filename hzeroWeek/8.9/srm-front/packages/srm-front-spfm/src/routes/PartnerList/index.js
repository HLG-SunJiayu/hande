/**
 * index.js - 我的合作伙伴
 * @date: 2018-10-29
 * @author: geekrainy <chao.zheng02@hand-china.com>
 * @version: 0.0.1
 * @copyright: Copyright (c) 2018, Hand
 */

import React, { PureComponent } from 'react';
import { Tabs } from 'hzero-ui';
import { connect } from 'dva';
import { Route, Switch, Redirect } from 'dva/router';
import { Bind } from 'lodash-decorators';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { getRoutes } from 'utils/utils';
import styles from './index.less';

const { TabPane } = Tabs;

@connect(({ global }) => ({
  routerData: global.routerData,
}))
@formatterCollections({
  code: 'spfm.supplier',
})
export default class PartnerList extends PureComponent {
  /**
   * 切换 Tab 标签页回调
   * @param {String} key - Tab 页 key
   */
  @Bind()
  handleTabChange(key) {
    const { history } = this.props;

    if (key === 'supplier') {
      history.push('/spfm/partner-list/supplier');
    } else {
      history.push('/spfm/partner-list/customer');
    }
  }

  render() {
    const { routerData, match, location } = this.props;
    const urlSplitArr = location.pathname.substr(match.url.length + 1).split('/');

    return (
      <React.Fragment>
        <Header title={intl.get('spfm.supplier.view.router.title').d('我的合作伙伴')} />
        <Content className={styles['partner-content']}>
          <Tabs
            defaultActiveKey={`${urlSplitArr[0] || 'supplier'}`}
            animated={false}
            className={styles['partner-tabs']}
            onChange={this.handleTabChange}
          >
            <TabPane
              key="supplier"
              tab={intl.get('spfm.supplier.view.router.supplier').d('我的供应商')}
            />
            <TabPane
              key="customer"
              tab={intl.get('spfm.supplier.view.router.customer').d('我的客户')}
            />
          </Tabs>
          <Switch>
            {getRoutes('/spfm/partner-list', routerData).map(item => {
              return (
                <Route
                  key={item.key}
                  path={item.path}
                  exact={item.exact}
                  component={item.component}
                />
              );
            })}
            <Redirect exact from="/spfm/partner-list" to="/spfm/partner-list/supplier" />
          </Switch>
        </Content>
      </React.Fragment>
    );
  }
}
