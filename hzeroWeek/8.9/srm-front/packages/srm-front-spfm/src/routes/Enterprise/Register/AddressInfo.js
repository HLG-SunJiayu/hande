/*
 * AddressInfo - 企业注册-地址信息
 * @date: 2018/08/07 15:08:09
 * @author: HB <bin.huang02@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { PureComponent, Fragment } from 'react';
import { Form } from 'hzero-ui';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import querystring from 'querystring';

import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { SRM_PLATFORM } from '_utils/config';
import { Content } from 'components/Page';

import AddressInfoList from '../Edit/AddressInfoList';
import styles from './ProcessInfo.less';

/**
 * 企业注册-地址信息
 * @extends {Component} - React.Component
 * @reactProps {Object} [location={}] - 当前路由信息
 * @reactProps {Object} [match={}] - react-router match路由信息
 * @reactProps {Object} [history={}]
 * @reactProps {Object} loading - 数据加载是否完成
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} [dispatch=function(e) {return e;}] - redux dispatch方法
 * @return React.element
 */
const promptCode = 'spfm.address';
@Form.create()
@connect(modal => ({
  loading: modal.loading.effects['enterpriseAddress/queryAddressList'],
  address: modal.enterpriseAddress,
}))
@formatterCollections({ code: ['spfm.address'] })
export default class AddressInfo extends PureComponent {
  constructor(props) {
    super(props);
    const routerParam = querystring.parse(this.props.history.location.search.substr(1));
    this.state = {
      companyId: routerParam.companyId,
    };
  }

  addressForm;

  static defaultProps = {
    dispatch: e => e,
  };

  /**
   * 点击下一步保存成功后的回调
   * @param {Object} res
   */
  @Bind()
  callback() {
    const { history } = this.props;
    const { companyId } = this.state;
    history.push(`/spfm/enterprise/register/bank?companyId=${companyId}`);
  }

  /**
   * 返回上一步回调方法
   */
  @Bind()
  previousCallback() {
    const { history } = this.props;
    const { companyId } = this.state;
    history.push(`${SRM_PLATFORM}/enterprise/register/contact?companyId=${companyId}`);
  }

  render() {
    return (
      <Fragment>
        <Content>
          <div className={styles['item-wrapper']}>
            <h3 className={styles['item-wrapper-title']}>
              {intl.get(`${promptCode}.view.message.title`).d('地址信息')}
            </h3>
            <div>
              {intl
                .get(`${promptCode}.view.message.description`)
                .d('提示: 您的企业可能在多地有工厂/分公司，建议维护完整信息，展示贵司规模。')}
            </div>
          </div>
          <AddressInfoList
            onRef={ref => {
              this.addressForm = ref;
            }}
            companyId={this.state.companyId}
            callback={this.callback}
            previousCallback={this.previousCallback}
            backBtnText={intl.get('hzero.common.button.previous').d('上一步')}
            buttonText={intl.get('hzero.common.button.next').d('下一步')}
          />
        </Content>
      </Fragment>
    );
  }
}
