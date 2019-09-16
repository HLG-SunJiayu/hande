/**
 * index - 服务开通记录
 * @date: 2019-07-10
 * @author: WY <yang.wang08@hand-china.com>
 * @version: 0.0.1
 * @copyright: Copyright (c) 2019, Hand
 */
import React, { Component, Fragment } from 'react';
import { Spin, Tabs } from 'hzero-ui';
import { Bind } from 'lodash-decorators';

import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';

import ApplyTable from './ApplyTable/index.js';
import DredgeTable from './DredgeTable/index.js';

const promptCode = 'spfm.serveLog';
const { TabPane } = Tabs;

@formatterCollections({ code: ['spfm.serveLog'] })
export default class ServeLog extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  /**
   * 跳转服务开通明细
   */
  @Bind
  goDetail(record = {}) {
    const { history } = this.props;
    history.push(`/spfm/amkt-servelog/detail/${record.requestHeaderId}`);
  }

  render() {
    const tableProps = {
      onGoDetail: this.goDetail,
    };
    return (
      <Fragment>
        <Header title={intl.get(`${promptCode}.view.message.title`).d('服务开通记录')} />
        <Content>
          <Spin spinning={false}>
            <Tabs defaultActiveKey="1" animated={false}>
              <TabPane
                tab={intl.get(`${promptCode}.view.message.tab.applyTable`).d('服务申请单')}
                key="1"
              >
                <ApplyTable {...tableProps} />
              </TabPane>
              <TabPane
                tab={intl.get(`${promptCode}.view.message.tab.dredgeTable`).d('已开通服务')}
                key="2"
              >
                <DredgeTable />
              </TabPane>
            </Tabs>
          </Spin>
        </Content>
      </Fragment>
    );
  }
}
