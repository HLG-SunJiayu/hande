/*
 * 配置中心-采购方-送货单
 * @date: 2018/10/09 14:56:50
 * @author: Liu zhaohui <zhaohui-liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { PureComponent } from 'react';
import { Row, Col, Select, Form } from 'hzero-ui';
import classnames from 'classnames';
import { Bind } from 'lodash-decorators';

import intl from 'utils/intl';

import SubMessage from '../../components/SubMessage';
import SubCheckBox from '../../components/SubCheckBox';
import MergeRuleModal from './MergeRuleModal';
import styles from './index.less';

// const RadioGroup = Radio.Group;
const deliveryPrompt = 'spfm.configServer.view.delivery.message';

/**
 * 配置中心-采购方-送货单
 * @extends {Component} - React.Component
 * @reactProps {Object} companyInfo - 数据源
 * @reactProps {Object} loading - 数据加载是否完成
 * @return React.element    onChange={onChange}
 */
@Form.create({ fieldNameProp: null })
export default class Delivery extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      singleRuleVisible: false,
      disabled010404: props.settings['010404'] === 1 || false,
    };
    props.onRef(this);
  }

  @Bind()
  handleSingleRule() {
    this.setState({ singleRuleVisible: true });
  }

  @Bind()
  handleChangeDeliveryApproval() {
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({ '010303': 0 });
  }

  /**
   * erp回传checkbox改变回调
   */
  @Bind()
  handleChange010305() {
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({ '010307': 0 });
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
    const { singleRuleVisible, disabled010404 } = this.state;
    const {
      settings,
      enumMap,
      form: { getFieldDecorator, getFieldValue },
    } = this.props;
    const { templates, mergeRules } = enumMap;

    const singleRuleProps = {
      visible: singleRuleVisible,
      handleModal: this.handleStateVisible,
    };
    return (
      <Row className="tab-content" id="delivery">
        <Col span={3}>
          <span className="label-col">{intl.get(`${deliveryPrompt}.deliver`).d('送货单')}：</span>
        </Col>
        <Col span={21} className="sub-item-right">
          <Row>
            <Col span={24}>{intl.get(`${deliveryPrompt}.singleRule`).d('并单规则')}</Col>
            <Col span={24} className={styles['version-rule']}>
              <Form layout="inline" className={classnames(styles['form-item'], 'sub-item-fields')}>
                <Form.Item
                  label={`${intl
                    .get(`${deliveryPrompt}.010301label`)
                    .d('送货单创建并单规则定义')}：`}
                >
                  {getFieldDecorator('010301', {
                    initialValue: settings['010301'],
                  })(
                    <Select showSearch style={{ width: '150px' }} allowClear>
                      {(mergeRules || []).map(item => (
                        <Select.Option key={item.value} value={item.value}>
                          {item.meaning}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Form>
              {getFieldValue('010301') === 'CUSTOMIZE' && (
                <a onClick={() => this.handleSingleRule()}>
                  {intl.get(`${deliveryPrompt}.010301href`).d('进入定义列表')}
                </a>
              )}
            </Col>
            <SubMessage
              content={intl
                .get(`${deliveryPrompt}.010301subMsg`)
                .d('供应商创建送货单时，会根据所配置的规则判断是否可以合并生成同一张送货单。')}
            />
          </Row>
          <Row className="sub-item">
            <Col span={24}>{intl.get(`${deliveryPrompt}.deliverApproval`).d('送货单审批')}</Col>
            <SubCheckBox
              content={intl.get(`${deliveryPrompt}.010302`).d('启用送货单审批')}
              getFieldDecorator={getFieldDecorator}
              initialValue={settings['010302']}
              field="010302"
              onChange={this.handleChangeDeliveryApproval}
            />
            <SubMessage
              content={intl
                .get(`${deliveryPrompt}.010302subMsg`)
                .d('勾选启用审批，则供应商提交送货单后需要采购方审批。')}
            />
            <SubCheckBox
              content={intl.get(`${deliveryPrompt}.010303`).d('启用送货单复审批')}
              getFieldDecorator={getFieldDecorator}
              initialValue={settings['010303']}
              field="010303"
              disabled={!getFieldValue('010302')}
            />
            <SubMessage
              content={intl
                .get(`${deliveryPrompt}.010303subMsg`)
                .d('勾选启用复审，则审批通过后还需复审。')}
            />
          </Row>
          <Row className="sub-item">
            <Col span={24}>{intl.get(`${deliveryPrompt}.deliverPrint`).d('送货单打印')}</Col>
            <Col span={24} className={classnames(styles['order-print'], 'sub-item-fields')}>
              <div className={styles.templateSelect}>
                <span style={{ lineHeight: '40px' }}>
                  {intl.get(`${deliveryPrompt}.deliverPrintTemplate`).d('送货单打印模板')}
                </span>
                <Form
                  layout="inline"
                  className={classnames(styles['form-item'], styles['margin-form-item'])}
                >
                  <Form.Item label={intl.get(`${deliveryPrompt}.010304label`).d('选择模板')}>
                    {getFieldDecorator('010304', {
                      initialValue: settings['010304'] || 'STD',
                      // rules: [
                      //   {
                      //     required: this.state.dateRequired010304,
                      //     message: intl.get('hzero.common.validation.notNull', {
                      //       name: intl.get(`${deliverPrompt}.010304label`).d('选择模板'),
                      //     }),
                      //   },
                      // ],
                      // TODO 下面的disabled有数据时去掉
                    })(
                      <Select showSearch style={{ width: '150px' }} allowClear disabled>
                        {(templates || []).map(item => (
                          <Select.Option key={item.value} value={item.value}>
                            {/* {item.meaning} */}
                            {}
                          </Select.Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </Form>
              </div>
            </Col>
            <SubMessage
              content={intl
                .get(`${deliveryPrompt}.010304subMsg`)
                .d('送货单打印将根据所选择的模板样式生成。')}
            />
          </Row>
          <Row className="sub-item">
            <Col span={24}>{intl.get(`${deliveryPrompt}.deliverReturn`).d('送货单回传')}</Col>
            <Col span={24}>
              <Row>
                <SubCheckBox
                  content={intl.get(`${deliveryPrompt}.010305`).d('送货单提交回传ERP')}
                  getFieldDecorator={getFieldDecorator}
                  initialValue={settings['010305']}
                  field="010305"
                  span={8}
                  onChange={this.handleChange010305}
                  disabled={disabled010404}
                />
                <SubCheckBox
                  content={intl.get(`${deliveryPrompt}.010307`).d('送货单取消/关闭回传ERP')}
                  getFieldDecorator={getFieldDecorator}
                  initialValue={settings['010307']}
                  field="010307"
                  span={12}
                  disabled={!getFieldValue('010305' || disabled010404)}
                />
              </Row>
            </Col>
            <SubMessage
              content={intl
                .get(`${deliveryPrompt}.010306subMsg`)
                .d('勾选回传，则送货单提交/取消后会回传ERP。')}
            />
          </Row>
          <Row className="sub-item">
            <Col span={24}>{intl.get(`${deliveryPrompt}.deliverClosed`).d('送货单关闭')}</Col>
            <SubCheckBox
              content={intl.get(`${deliveryPrompt}.010308`).d('送货单单次接收后自动关闭')}
              getFieldDecorator={getFieldDecorator}
              initialValue={settings['010308']}
              field="010308"
            />
            <SubMessage
              content={intl
                .get(`${deliveryPrompt}.010308subMsg`)
                .d('勾选自动关闭，则送货单行首次匹配接收事务后，自动关闭，无法再次匹配接收事务。')}
            />
          </Row>
        </Col>
        {singleRuleVisible && <MergeRuleModal {...singleRuleProps} />}
      </Row>
    );
  }
}
