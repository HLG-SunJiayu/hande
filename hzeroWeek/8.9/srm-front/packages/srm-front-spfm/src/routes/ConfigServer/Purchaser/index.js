/**
 * PurchaserIndex 平台服务-采购商配置
 * @date: 2018-8-27
 * @author dengtingmin <tingmin.deng@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import classnames from 'classnames';
import { Bind } from 'lodash-decorators';

import intl from 'utils/intl';

import Order from './SubPage/Order';
import Delivery from './SubPage/Delivery';
import Finance from './SubPage/Finance';
import Menu from '../Menu/index';
import SupplierManage from './SubPage/SupplierManage';
import PurchaseContract from './SubPage/PurchaseContract';
import OrderDefineListModal from './SubPage/OrderDefineListModal';
import PurchaseRequisitionApprovalConfig from './SubPage/PurchaseRequisitionApprovalConfig';
import PurchaseRequisitionSendBackPurchaseRequest from './SubPage/PurchaseRequisitionSendBackPurchaseRequest';
import Receive from './SubPage/Receive';
import DemandPool from './SubPage/DemandPool';
import OrderMergeRuleModal from './SubPage/OrderMergeRuleModal';
import CatalogPurchase from './SubPage/CatalogPurchase';
import SplitOrderRuleModal from './SubPage/SplitOrderRuleModal';
import SupplierAddMonitorModal from './SubPage/SupplierAddMonitorModal';
import RiskScanModal from './SubPage/RiskScanModal';
import styles from '../index.less';

const titlePrompt = 'spfm.configServer.view.title.purchaser';
@connect(({ configServer }) => ({
  configServer,
}))
export default class PurchaserIndex extends Component {
  constructor(props) {
    super(props);
    if (props.onRef) {
      props.onRef(this);
    }
    this.state = {
      purchaseRACVisible: false, // 采购申请审批配置
      orderMergeRulesVisible: false, // 订单并单规则
      splitOrderRulesVisible: false, // 目录化采购拆单规则
      supplierAddMonitorVisible: false, // 供应商加入监控
      riskScanVisible: false, // 未加入监控企业的风险扫描
      billUpdateRuleVisible: false, // 需求池采购申请回传
    };
  }

  /**
   * 改变state
   * @param {*} param
   * @param {*} flag
   * @param {*} [otherParams={}]
   */
  @Bind()
  handleStateVisible(param, flag, otherParams = {}) {
    this.setState({
      [param]: !!flag,
      ...otherParams,
    });
  }

  @Bind()
  handleRefStateChange(ref, state, fields) {
    if (this[ref]) {
      this[ref].setState(state);
    }
    if (fields && this[ref].props.form) {
      this[ref].props.form.setFieldsValue(fields);
    }
  }

  render() {
    const menuList = [
      { key: 1, href: 'sslm', title: intl.get(`${titlePrompt}.sslm`).d('供应商管理') },
      { key: 2, href: 'catalogPurchase', title: '目录化采购' },
      // { key: 3, href: 'source', title: '寻源' },
      {
        key: 4,
        href: 'purchaseContract',
        title: intl.get(`spfm.configServer.view.purchaseContract.message.title`).d('采购协议'),
      },
      { key: 5, href: 'demandPoll', title: '需求池' },
      { key: 6, href: 'order', title: intl.get(`${titlePrompt}.order`).d('订单') },
      { key: 7, href: 'delivery', title: intl.get(`${titlePrompt}.delivery`).d('送货单') },
      { key: 8, href: 'receive', title: intl.get(`${titlePrompt}.receive`).d('接收') },
      { key: 9, href: 'finance', title: intl.get(`${titlePrompt}.finance`).d('财务') },
      // { key: 10, href: 'quality', title: '质量' },
      // { key: 11, href: 'notice', title: '公告' },
    ];
    const {
      configServer: { settings, enumMap = {} },
    } = this.props;
    const {
      documentCategory,
      priceShieldVisible,
      purchaseRACVisible,
      orderMergeRulesVisible,
      splitOrderRulesVisible,
      supplierAddMonitorVisible,
      riskScanVisible,
      billUpdateRuleVisible,
    } = this.state;
    const supplierManageProps = {
      settings,
      onRef: node => {
        this.supplierManageRef = node;
      },
      handleModal: this.handleStateVisible,
    };
    const purchaseRACProps = {
      visible: purchaseRACVisible,
      handleModal: this.handleStateVisible,
    };
    const billUpdateProps = {
      visible: billUpdateRuleVisible,
      handleModal: this.handleStateVisible,
    };
    const orderMergeRuleProps = {
      visible: orderMergeRulesVisible,
      handleModal: this.handleStateVisible,
    };
    const receiveProps = {
      settings,
      onHandleShowPurchaseTrans: this.handleStateVisible,
      onRef: node => {
        this.receiveRef = node;
      },
      onRefStateChange: this.handleRefStateChange,
    };
    const financeProps = {
      settings,
      onHandleShowMergeRules: this.handleStateVisible,
      // onHandleShowPurchaseTrans: this.handleStateVisible,
      onHandleOnlyInvoiceRule: this.handleStateVisible,
      onHandleBillUpdateRule: this.handleStateVisible,
      onHidePriceDefine: this.handleStateVisible,
      onRef: node => {
        this.financeRef = node;
      },
    };
    const demandPollProps = {
      enumMap,
      settings,
      handleModal: this.handleStateVisible,
      onRef: node => {
        this.demandPollRef = node;
      },
    };

    const purchaseContractProps = {
      enumMap,
      settings,
      handleModal: this.handleStateVisible,
      onRef: node => {
        this.purchaseContractRef = node;
      },
    };

    // 目录化采购
    const catalogPurchaseProps = {
      enumMap,
      settings,
      handleModal: this.handleStateVisible,
      onRef: node => {
        this.catalogRef = node;
      },
    };

    const splitOrderProps = {
      visible: splitOrderRulesVisible,
      handleModal: this.handleStateVisible,
    };

    const supplierAddMonitorProps = {
      supplierAddMonitorVisible,
      handleModal: this.handleStateVisible,
    };

    const riskScanProps = {
      riskScanVisible,
      handleModal: this.handleStateVisible,
    };

    return (
      <div className={styles.content}>
        <div className={styles['left-wrapper']}>
          <Menu
            menuList={menuList}
            getContainer={() => document.getElementById('config-server-purchaser-scroll-area')}
          />
        </div>
        <div id="config-server-purchaser-scroll-area" className={styles['right-wrapper']}>
          <div className={classnames(styles['config-content'])}>
            <SupplierManage {...supplierManageProps} />
            <CatalogPurchase {...catalogPurchaseProps} />
            <PurchaseContract {...purchaseContractProps} />
            <DemandPool {...demandPollProps} />
            <Order
              enumMap={enumMap}
              onHandleStateChange={this.handleStateVisible}
              onOrderConfig={this.handleStateVisible}
              settings={settings}
              onRef={node => {
                this.orderRef = node;
              }}
            />
            <Delivery
              enumMap={enumMap}
              settings={settings}
              handleModal={this.handleStateVisible}
              onRef={node => {
                this.deliveryRef = node;
              }}
            />
            <Receive {...receiveProps} />
            <Finance {...financeProps} />
          </div>
        </div>
        {priceShieldVisible && (
          <OrderDefineListModal
            documentCategory={documentCategory}
            onHidePriceDefine={this.handleStateVisible}
            priceShieldVisible={priceShieldVisible}
          />
        )}
        {splitOrderRulesVisible && <SplitOrderRuleModal {...splitOrderProps} />}
        {purchaseRACVisible && <PurchaseRequisitionApprovalConfig {...purchaseRACProps} />}
        {billUpdateRuleVisible && (
          <PurchaseRequisitionSendBackPurchaseRequest {...billUpdateProps} />
        )}
        {orderMergeRulesVisible && <OrderMergeRuleModal {...orderMergeRuleProps} />}
        {supplierAddMonitorVisible && <SupplierAddMonitorModal {...supplierAddMonitorProps} />}
        {riskScanVisible && <RiskScanModal {...riskScanProps} />}
      </div>
    );
  }
}
