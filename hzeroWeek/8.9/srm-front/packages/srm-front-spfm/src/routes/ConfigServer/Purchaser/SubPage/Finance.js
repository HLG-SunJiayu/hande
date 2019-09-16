/*
 * Finance - 财务
 * @date: 2018/11/07 19:17:21
 * @author: HB <bin.huang02@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import { withRouter } from 'react-router-dom';
import React, { Component } from 'react';
import { Row, Col, Form } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import classnames from 'classnames';

import Checkbox from 'components/Checkbox';
import ValueList from 'components/ValueList';
import intl from 'utils/intl';

import DocMergeRulesModal from '../../../sodr/DocMergeRulesModal';
import OnlyInvoiceRule from '../../../sodr/OnlyInvoiceRule';
import BillUpdateRule from '../../../sodr/BillUpdateRule';
import InvoiceRuleModal from '../../../sodr/InvoiceUpdateRule';
import ToleranceRuleModal from '../../../sodr/ToleranceRule';
import SubMessage from '../../components/SubMessage';
import SubCheckBox from '../../components/SubCheckBox';
import styles from './index.less';

const financePrompt = 'spfm.configServer.view.finance.message';
/**
 * 配置中心-采购方-财务
 * @extends {Component} - React.Component
 * @reactProps {Object} settings - 数据源
 * @reactProps {Object} loading - 数据加载是否完成
 * @return React.element    onChange={onChange}
 */
@withRouter
@Form.create({ fieldNameProp: null })
export default class Finance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      docMergeRulesVisible: false,
      onlyInvoiceRuleVisible: false, // 开票即对账规则
      billUpdateRuleVisible: false, // 对账单价修改规则
      invoiceRuleVisible: false, // 开具发票规则
      toleranceRuleVisible: false, // 发票允差
    };
    props.onRef(this);
  }

  @Bind()
  openTabTo(path) {
    this.props.history.push(path);
  }

  /**
   * 改变state
   */
  @Bind()
  handleStateChange(field, value, otherParams) {
    this.setState({ [field]: value, ...otherParams });
  }

  // 打开价格配置弹窗
  @Bind()
  handleHidePriceDefine(flag, documentCategory) {
    const { onHidePriceDefine } = this.props;
    if (onHidePriceDefine) {
      onHidePriceDefine('priceShieldVisible', !!flag, { documentCategory });
    }
  }

  render() {
    const {
      docMergeRulesVisible,
      onlyInvoiceRuleVisible,
      billUpdateRuleVisible,
      invoiceRuleVisible,
      toleranceRuleVisible,
    } = this.state;
    const {
      settings,
      form: { getFieldDecorator, getFieldValue },
    } = this.props;
    const docMergeRules = {
      docMergeRulesVisible,
      onHandleShowMergeRules: this.handleStateChange,
    };
    const onlyInvoiceRuleProps = {
      visible: onlyInvoiceRuleVisible,
      handleModal: this.handleStateChange,
    };
    const billUpdateRuleProps = {
      visible: billUpdateRuleVisible,
      handleModal: this.handleStateChange,
    };
    const invoiceRuleProps = {
      visible: invoiceRuleVisible,
      handleModal: this.handleStateChange,
    };
    const toleranceRuleProps = {
      visible: toleranceRuleVisible,
      handleModal: this.handleStateChange,
    };
    return (
      <Row className="tab-content" id="finance">
        <Col span={3}>
          <span className="label-col">
            {intl.get(`${financePrompt}.message.finance`).d('财务')}：
          </span>
        </Col>
        <Col span={21} className="sub-item-right">
          <Row>
            <Col span={24}>{intl.get(`${financePrompt}.accountStatement`).d('对账单')}</Col>
            <Col span={24} className="sub-item-fields">
              {getFieldDecorator('010501', {
                initialValue: settings['010501'],
              })(
                <Checkbox>
                  {intl
                    .get(`${financePrompt}.010501`)
                    .d('在对账单创建、维护及查询页面不展示单价、金额等价格信息。')}
                </Checkbox>
              )}
              {getFieldValue('010501') === 1 && (
                <a
                  onClick={() => this.handleHidePriceDefine(true, 'BILL')}
                  style={{ marginLeft: '8px' }}
                >
                  {intl.get(`${financePrompt}.010501href`).d('进入定义列表')}
                </a>
              )}
            </Col>
            <SubMessage
              content={intl
                .get(`${financePrompt}.010501subMsg`)
                .d(
                  '勾选并定义规则后，所定义的内部角色/外部供应商在对账单相关界面的单价、总额等金额相关字段将显示为***'
                )}
            />
            <Col span={24} className="sub-item-fields">
              {getFieldDecorator('010503', {
                initialValue: settings['010503'],
              })(
                <Checkbox>
                  {intl.get(`${financePrompt}.010503`).d('允许供应商在对账时修改单价。')}
                </Checkbox>
              )}
              {getFieldValue('010503') === 1 && (
                <a
                  onClick={() => this.handleStateChange('billUpdateRuleVisible', true)}
                  className="operate-item-link"
                >
                  {intl.get(`${financePrompt}.010501href`).d('进入定义列表')}
                </a>
              )}
            </Col>
            <SubMessage
              content={intl
                .get(`${financePrompt}.010503subMsg`)
                .d('勾选并定义规则后，所定义的供应商将可以在发起对账时修改对账的基准价。')}
            />
            <Col span={24} className={styles['version-rule']}>
              <Form layout="inline" className={classnames(styles['form-item'], 'sub-item-fields')}>
                <Form.Item
                  label={`${intl
                    .get(`${financePrompt}.010504label`)
                    .d('对账和开票参考价来源为')}：`}
                >
                  {getFieldDecorator('010504', {
                    initialValue: settings['010504'],
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${financePrompt}.010504`).d('对账和开票参考价'),
                        }),
                      },
                    ],
                  })(
                    <ValueList
                      allowClear
                      lovCode="SFIN.SOURCE_REFERENCE_PRICE"
                      style={{ width: '150px' }}
                      lazyLoad={false}
                    />
                  )}
                </Form.Item>
              </Form>
            </Col>
            <SubMessage
              content={intl
                .get(`${financePrompt}.010504subMsg`)
                .d('对账事务和发票行物料的参考价格来源。')}
            />
            <Col span={24} className={styles['version-rule']}>
              <Form layout="inline" className={classnames(styles['form-item'], 'sub-item-fields')}>
                <Form.Item
                  label={`${intl.get(`${financePrompt}.010505label`).d('对账及开票基准价为')}：`}
                >
                  {getFieldDecorator('010505', {
                    initialValue: settings['010505'],
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${financePrompt}.010505`).d('对账及开票基准价'),
                        }),
                      },
                    ],
                  })(
                    <ValueList
                      allowClear
                      lovCode="SFIN.BENCHMARK_PRICE"
                      style={{ width: '150px' }}
                      lazyLoad={false}
                    />
                  )}
                </Form.Item>
              </Form>
            </Col>
            <SubMessage
              content={intl
                .get(`${financePrompt}.010505subMsg`)
                .d('选择不同基准价，影响税额计算。')}
            />
            <Col span={24} className="sub-item-fields">
              {intl.get(`${financePrompt}.010506`).d('对账单和发票并单规则设置')}
              <a
                onClick={() => this.handleStateChange('docMergeRulesVisible', true)}
                className="operate-item-link"
              >
                {intl.get('hzero.common.button.view').d('查看')}
              </a>
            </Col>
            <Col span={24} className="sub-item-fields">
              {/* {getFieldDecorator('010502', {
                initialValue: settings['010502'],
              })(
                <Checkbox>
                  {intl.get(`${financePrompt}.010502`).d('无需单独对账，创建发票即对账。')}
                </Checkbox>
              )}
              {getFieldValue('010502') === 1 && (
                <a onClick={() => this.handleOnlyInvoiceRule()} className="operate-item-link">
                  {intl.get(`${financePrompt}.010501href`).d('进入定义列表')}
                </a>
              )} */}
              {intl.get(`${financePrompt}.010502.temp`).d('对账规则配置')}
              <a
                onClick={() => this.handleStateChange('onlyInvoiceRuleVisible', true)}
                className="operate-item-link"
              >
                {intl.get('hzero.common.button.view').d('查看')}
              </a>
            </Col>
            <SubMessage
              content={intl
                .get(`${financePrompt}.010502subMsg.temp`)
                .d('配置采用不同对账方式的对账规则。')}
            />
            {/* <Col span={24} className="sub-item-fields">
              {intl.get(`${financePrompt}.010514`).d('采购事务类型配置')}
              <a onClick={() => this.handleShowPurchaseTrans()} className="operate-item-link">
                {intl.get('hzero.common.button.view').d('查看')}
              </a>
            </Col>
            <SubMessage
              content={intl
                .get(`${financePrompt}.010506subMsg`)
                .d(
                  '勾选并定义规则后，所定义的供应商将被允许跳过对账单流程，可直接进入网上发票创建流程。'
                )}
            /> */}
            <SubCheckBox
              content={intl.get(`${financePrompt}.010507`).d('暂估价不允许对账及开票')}
              getFieldDecorator={getFieldDecorator}
              initialValue={settings['010507']}
              field="010507"
            />
            <SubMessage
              content={intl
                .get(`${financePrompt}.010507subMsg`)
                .d('当订单行上价格有暂估价标识时，勾选则对应的入库事务不允许进入对账和开票流程。')}
            />
          </Row>
          <Row className="sub-item">
            <Col span={24}>{intl.get(`${financePrompt}.invoice`).d('发票')}</Col>
            <Col span={24} className="sub-item-fields">
              {getFieldDecorator('010508', {
                initialValue: settings['010508'],
              })(
                <Checkbox>
                  {intl
                    .get(`${financePrompt}.010508`)
                    .d('在发票创建、维护及查询页面不展示单价、金额等价格信息。')}
                </Checkbox>
              )}
              {getFieldValue('010508') === 1 && (
                <a
                  onClick={() => this.handleHidePriceDefine(true, 'INVOICE')}
                  style={{ marginLeft: '8px' }}
                >
                  {intl.get(`${financePrompt}.010501href`).d('进入定义列表')}
                </a>
              )}
            </Col>
            <SubMessage
              content={intl
                .get(`${financePrompt}.010508subMsg`)
                .d(
                  '勾选并定义规则后，所定义的内部角色/外部供应商在发票创建相关界面的单价、总额等金额相关字段将显示为***'
                )}
            />
            <Col span={24} className="sub-item-fields">
              {intl.get(`${financePrompt}.010509`).d('开具发票规则设置')}
              <a
                onClick={() => this.handleStateChange('invoiceRuleVisible', true)}
                className="operate-item-link"
              >
                {intl.get('hzero.common.button.view').d('查看')}
              </a>
            </Col>
            <SubMessage
              content={intl
                .get(`${financePrompt}.010509subMsg`)
                .d('定义供应商用户在开具发票时的相关规则')}
            />
            <Col span={24} className="sub-item-fields">
              {getFieldDecorator('010510', {
                initialValue: settings['010510'],
              })(
                <Checkbox>{intl.get(`${financePrompt}.010510`).d('允许应付发票允差。')}</Checkbox>
              )}
              {getFieldValue('010510') === 1 && (
                <a
                  onClick={() => this.handleStateChange('toleranceRuleVisible', true)}
                  style={{ marginLeft: '8px' }}
                >
                  {intl.get(`${financePrompt}.010501href`).d('进入定义列表')}
                </a>
              )}
            </Col>
            <SubMessage
              content={intl
                .get(`${financePrompt}.010510subMsg`)
                .d('勾选表示允许PO总额和发票金额存在差异，点击明细可以设置允差。')}
            />
            <SubCheckBox
              content={intl.get(`${financePrompt}.010511`).d('SRM发票审核之后无需复核。')}
              getFieldDecorator={getFieldDecorator}
              initialValue={settings['010511']}
              field="010511"
            />
            <SubMessage
              content={intl
                .get(`${financePrompt}.010511subMsg`)
                .d('勾选表示应付发票审核之后自动复核，不需要人工复核。')}
            />
            <SubCheckBox
              content={intl.get(`${financePrompt}.010512`).d('SRM发票复核通过的同时执行导入ERP。')}
              getFieldDecorator={getFieldDecorator}
              initialValue={settings['010512']}
              field="010512"
            />
            <SubMessage
              content={intl
                .get(`${financePrompt}.010512subMsg`)
                .d(
                  '勾选表示在发票复核时，复核通过的同时执行将发票导入ERP操作，不勾选则需要用户在导入功能中单独执行导入操作。'
                )}
            />
            <SubCheckBox
              content={intl.get(`${financePrompt}.010513`).d('SRM发票退回时直接退回至供应商。')}
              getFieldDecorator={getFieldDecorator}
              initialValue={settings['010513']}
              field="010513"
            />
            <SubMessage
              content={intl
                .get(`${financePrompt}.010513subMsg`)
                .d('勾选则表示直接退回至供应商维护；不勾选表示发票退回时，需要逐级退回。')}
            />
          </Row>
        </Col>
        {docMergeRulesVisible && <DocMergeRulesModal {...docMergeRules} />}
        {onlyInvoiceRuleVisible && <OnlyInvoiceRule {...onlyInvoiceRuleProps} />}
        {billUpdateRuleVisible && <BillUpdateRule {...billUpdateRuleProps} />}
        {invoiceRuleVisible && <InvoiceRuleModal {...invoiceRuleProps} />}
        {toleranceRuleVisible && <ToleranceRuleModal {...toleranceRuleProps} />}
      </Row>
    );
  }
}
