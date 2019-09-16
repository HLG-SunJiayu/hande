/**
 * AppStore - 应用商城
 * @date: 2019-07-09
 * @author: zjx <jingxi.zhang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Tabs, Row, Col, Carousel, Icon } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { Link } from 'dva/router';

import { getCurrentOrganizationId } from 'utils/utils';
import notification from 'utils/notification';

import ServiceTabPane from './ServiceTabPane';

import style from './index.less';
import qrcode from '../../../assets/qrcode.png';

const organizationId = getCurrentOrganizationId();

@connect(({ loading, appStore, shoppingCart }) => ({
  loading: loading.effects['appStore/fetchClientModule'],
  serviceLoading: loading.effects['appStore/fetchClientService'],
  appStore,
  shoppingCart,
}))
export default class AppStore extends Component {
  state = {
    moduleList: [],
    moduleId: '',
  };

  componentDidMount() {
    this.fetchClientModule();
  }

  /**
   * 查询模块
   */
  @Bind()
  fetchClientModule() {
    const { dispatch } = this.props;
    dispatch({
      type: 'appStore/fetchClientModule',
      payload: {
        clientCode: 'HZERO',
      },
    }).then(res => {
      if (res) {
        this.setState({
          moduleList: res,
        });
        this.fetchClientService();
      }
    });
  }

  /**
   * 切换tab
   */
  @Bind()
  handleTabsChange(key) {
    let moduleId = key;
    if (moduleId === 'allService') {
      moduleId = '';
    }
    this.setState(
      {
        moduleId,
      },
      () => {
        this.fetchClientService();
      }
    );
  }

  /**
   * 查询模块下服务
   */
  @Bind()
  fetchClientService(params = {}) {
    const { moduleId } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'appStore/fetchClientService',
      payload: {
        page: 0,
        size: 10,
        moduleId,
        crmTenant: organizationId,
        ...params,
      },
    });
  }

  /**
   * 加入购物车
   */
  @Bind()
  handleAddCart(params) {
    const { dispatch } = this.props;
    const { moduleId } = this.state;
    const { partnerId, partnerServiceId } = params;
    dispatch({
      type: 'appStore/addCart',
      payload: {
        client: 'HZERO',
        crmTenant: organizationId,
        moduleId: Number(moduleId),
        partnerId,
        partnerServiceId,
      },
    }).then(res => {
      if (res) {
        notification.success();
        dispatch({
          type: 'shoppingCart/fetchList',
          payload: { crmTenant: organizationId, tenantId: organizationId },
        });
      }
    });
  }

  render() {
    const { moduleList = [] } = this.state;
    const {
      serviceLoading,
      appStore: { serviceList = [], servicePagination = {} },
    } = this.props;
    const paneProps = {
      serviceLoading,
      serviceList,
      servicePagination,
      onHandleFetch: this.fetchClientService,
      onAddCart: this.handleAddCart,
    };
    const imagList = [
      {
        url: 'http://gateway.dev.going-link.com/oauth/static/default/img/login/pad_1.jpg',
      },
      {
        url: 'http://gateway.dev.going-link.com/oauth/static/default/img/login/pad_1.jpg',
      },
    ];
    return (
      <React.Fragment>
        <div className={style['body-content']}>
          <Row className={style['app-store-top']} gutter={8}>
            <Col span={18}>
              <div>
                <Carousel>
                  {imagList.map(item => {
                    return <img className={style['store-banner']} src={item.url} alt="" />;
                  })}
                </Carousel>
              </div>
            </Col>
            <Col span={6} className={style['store-top-right']}>
              <Row>
                <Col span={8}>
                  <Link to="/spfm/amkt-servelog/list">
                    <div className={style['open-service']}>
                      <Icon className={style['top-icon']} type="file-text" />
                      <p>服务开通记录</p>
                    </div>
                  </Link>
                </Col>
                <Col span={8}>
                  <div className={style['auth-info']}>
                    <Icon className={style['top-icon']} type="book" />
                    <p>认证信息</p>
                  </div>
                </Col>
                <Col span={8}>
                  <Link to="/spfm/amkt-appstore/shopping-cart">
                    <div className={style['buy-cart']}>
                      <Icon className={style['top-icon']} type="shopping-cart" />
                      <p>购物车</p>
                    </div>
                  </Link>
                </Col>
              </Row>
              <div className={style['link-us']}>
                <Row>
                  <Col span={12}>
                    <p className={style['link-us-title']}>联系我们</p>
                    <div className={style['link-us-box']}>
                      <Icon type="phone" className={style['link-us-icon']} />
                      <div className={style['link-us-type']}>
                        <p>咨询电话</p>
                        <p>13111111111</p>
                      </div>
                    </div>
                    <div className={style['link-us-box']}>
                      <Icon type="wechat" className={style['link-us-icon']} />
                      <div className={style['link-us-type']}>
                        <p>企业微信</p>
                        <p>13111111111</p>
                      </div>
                    </div>
                  </Col>
                  <Col span={12} className={style['focus-us']}>
                    <p className={style['link-us-title']}>关注我们</p>
                    <img className={style['link-us-qrcode']} src={qrcode} alt="" />
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
          <Tabs
            defaultActiveKey="allService"
            animated={false}
            className={style['service-tab']}
            onChange={this.handleTabsChange}
          >
            <Tabs.TabPane tab="全部服务" key="allService">
              <ServiceTabPane {...paneProps} />
            </Tabs.TabPane>
            {moduleList.length > 0 &&
              moduleList.map(item => {
                return (
                  <Tabs.TabPane tab={item.moduleName} key={item.moduleId}>
                    <ServiceTabPane {...paneProps} />
                  </Tabs.TabPane>
                );
              })}
          </Tabs>
        </div>
      </React.Fragment>
    );
  }
}
