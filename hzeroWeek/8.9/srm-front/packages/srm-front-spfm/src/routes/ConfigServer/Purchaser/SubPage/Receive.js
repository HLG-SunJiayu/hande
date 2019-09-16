/*
 * 配置中心 - 接收
 * @date: 2018/11/08 14:56:50
 * @author: Liu zhaohui <zhaohui-liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { PureComponent } from 'react';
import { Row, Col, Radio, Form } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import classnames from 'classnames';

import intl from 'utils/intl';

import styles from './index.less';
import PurchaseTransModal from './PurchaseTransModal';
import SubMessage from '../../components/SubMessage';
import SubCheckBox from '../../components/SubCheckBox';

const receivePrompt = 'spfm.configServer.view.receive';
const modelPrompt = 'spfm.configServer.model.purchaser';
const RadioGroup = Radio.Group;
/**
 * 配置中心-采购方-送货单
 * @extends {Component} - React.Component
 * @reactProps {Object} settings - 数据源
 * @reactProps {Object} loading - 数据加载是否完成
 * @return React.element    onChange={onChange}
 */
@Form.create({ fieldNameProp: null })
export default class Deliver extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      purchaseTransVisible: false,
      disabled010404: props.settings['010404'] === 1 || false,
    };
    props.onRef(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { settings } = nextProps;
    if (settings !== prevState.settings) {
      return {
        settings,
      };
    }
    return null;
  }

  /**
   * 采购事务类型配置弹窗
   */
  @Bind()
  handleShowPurchaseTrans() {
    this.setState({ purchaseTransVisible: true });
  }

  /**
   * 接收配置修改回调
   * @param {*} e
   */
  @Bind()
  handleChangeReceiveSystem(e) {
    const {
      onRefStateChange,
      form: { setFieldsValue },
    } = this.props;
    if (e.target.value === '010404') {
      this.setState({ disabled010404: true });
      onRefStateChange('deliveryRef', { disabled010404: true }, { '010305': 0, '010307': 0 });
      setFieldsValue({ '010401': 1, '010402': 1 });
    } else {
      onRefStateChange('deliveryRef', { disabled010404: false });
      this.setState({ disabled010404: false });
    }
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

  render() {
    const { purchaseTransVisible, disabled010404 } = this.state;
    const {
      form: { getFieldDecorator },
      settings,
    } = this.props;
    const purchaseTrans = {
      purchaseTransVisible,
      onHandleShowPurchaseTrans: this.handleStateVisible,
    };
    return (
      <Row className={classnames('tab-content', styles.receive)} id="receive">
        <Col span={3}>
          <span className="label-col">
            {intl.get(`${receivePrompt}.message.receive`).d('接收')}：
          </span>
        </Col>
        <Col span={21} className="sub-item-right">
          <Row>
            <Col span={24}>
              {intl.get(`${receivePrompt}.message.receiveTransactionMatch`).d('接收事务匹配')}
            </Col>
            <SubCheckBox
              content={intl
                .get(`${receivePrompt}.message.010401`)
                .d('采购订单发运行数据自动匹配ERP接收事务')}
              getFieldDecorator={getFieldDecorator}
              initialValue={settings['010401']}
              field="010401"
              disabled={disabled010404}
            />
            <SubMessage
              content={intl
                .get(`${receivePrompt}.message.010401subMsg`)
                .d('勾选自动匹配，则ERP接收事务自动匹配订单并更新相关值。')}
            />
            <SubCheckBox
              content={intl
                .get(`${receivePrompt}.message.010402`)
                .d('送货单数据自动匹配ERP接收事务')}
              getFieldDecorator={getFieldDecorator}
              initialValue={settings['010402']}
              field="010402"
              disabled={disabled010404}
            />
            <SubMessage
              content={intl
                .get(`${receivePrompt}.message.010402subMsg`)
                .d('勾选自动匹配，则ERP接收事务自动匹配送货单并更新相关值。')}
            />
            <Col span={24}>
              {intl.get(`${modelPrompt}.view.purchaseTrans.title`).d('采购事务类型配置')}
              <a onClick={() => this.handleShowPurchaseTrans()} className="operate-item-link">
                {intl.get('hzero.common.button.view').d('查看')}
              </a>
            </Col>
          </Row>
          <Row className="sub-item">
            <Col span={24}>{intl.get(`${receivePrompt}.receiveSystem`).d('接收系统')}</Col>
            <Col span={24}>
              <Form.Item className="receive-system">
                {getFieldDecorator('receiveSystem', {
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${receivePrompt}.receiveSystem`).d('接收系统'),
                      }),
                    },
                  ],
                  initialValue:
                    settings['010403'] === 1
                      ? '010403'
                      : settings['010404'] === 1
                      ? '010404'
                      : null,
                })(
                  <RadioGroup onChange={this.handleChangeReceiveSystem}>
                    <Radio value="010403">
                      {intl.get(`${receivePrompt}.010403`).d('在ERP中做接收')}
                    </Radio>
                    <Radio value="010404">
                      {intl.get(`${receivePrompt}.010404`).d('在SRM中做接收')}
                    </Radio>
                  </RadioGroup>
                )}
                {/* <SubCheckBox
                  content={intl.get(`${receivePrompt}.010403`).d('在ERP中做接收')}
                  getFieldDecorator={getFieldDecorator}
                  initialValue={settings['010403']}
                  field="010403"
                  span={8}
                />
                <SubCheckBox
                  content={intl.get(`${receivePrompt}.010404`).d('在SRM中做接收')}
                  getFieldDecorator={getFieldDecorator}
                  initialValue={settings['010404']}
                  field="010404"
                  span={12}
                /> */}
              </Form.Item>
            </Col>
            <SubMessage
              content={intl
                .get(`${receivePrompt}.010404subMsg`)
                .d('选择在何系统进行接收退货业务，必选且只可选择一个。')}
            />
          </Row>
        </Col>
        {purchaseTransVisible && <PurchaseTransModal {...purchaseTrans} />}
      </Row>
    );
  }
}
