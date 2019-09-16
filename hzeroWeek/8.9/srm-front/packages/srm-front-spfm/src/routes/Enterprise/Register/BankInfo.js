/*
 * BankInfo - 企业注册-银行信息
 * @date: 2018/08/07 15:09:40
 * @author: HB <bin.huang02@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { Component, Fragment } from 'react';
import { Form } from 'hzero-ui';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import querystring from 'querystring';

import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { SRM_PLATFORM } from '_utils/config';
import { Content } from 'components/Page';

import BankInfoList from '../Edit/BankInfoList';
import styles from './ProcessInfo.less';

/**
 * 企业注册-银行信息
 * @extends {Component} - React.Component
 * @reactProps {Object} [location={}] - 当前路由信息
 * @reactProps {Object} [match={}] - react-router match路由信息
 * @reactProps {Object} [history={}]
 * @reactProps {Object} loading - 数据加载是否完成
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} [dispatch=function(e) {return e;}] - redux dispatch方法
 * @return React.element
 */
const messagePrompt = 'spfm.bank.view.message';
@Form.create()
@connect(modal => ({
  loading: modal.loading.effects['enterpriseBank/queryBankAccount'],
  bank: modal.enterpriseBank,
}))
@formatterCollections({ code: ['spfm.bank', 'entity.bank'] })
export default class BankInfo extends Component {
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
    history.push(`/spfm/enterprise/register/invoice?companyId=${companyId}`);
  }

  /**
   * 返回上一步回调方法
   */
  @Bind()
  previousCallback() {
    const { history } = this.props;
    const { companyId } = this.state;
    history.push(`${SRM_PLATFORM}/enterprise/register/address?companyId=${companyId}`);
  }

  render() {
    return (
      <Fragment>
        <Content>
          <div className={styles['item-wrapper']}>
            <h3 className={styles['item-wrapper-title']}>
              {intl.get(`entity.bank.info`).d('银行信息')}
            </h3>
            <div>
              {intl
                .get(`${messagePrompt}.description`)
                .d(
                  '提示: 维护账户信息，后续您向合作企业提供付款账号时，可快速复制。至少需要维护一个银行账户。'
                )}
            </div>
          </div>
          <BankInfoList
            companyId={this.state.companyId}
            callback={this.callback}
            previousCallback={this.previousCallback}
            backBtnText={intl.get('hzero.common.button.previous').d('上一步')}
            onRef={ref => {
              this.addressForm = ref;
            }}
            buttonText={intl.get('hzero.common.button.next').d('下一步')}
          />
        </Content>
      </Fragment>
    );
  }
}
