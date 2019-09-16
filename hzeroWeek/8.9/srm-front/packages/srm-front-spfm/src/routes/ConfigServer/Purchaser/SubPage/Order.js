/*
 * Order - 配置中心-采购方-订单
 * @date: 2018/09/07 14:51:47
 * @author: HB <bin.huang02@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { Component } from 'react';
import { Row, Col, Select, Form } from 'hzero-ui';
import classnames from 'classnames';
import { withRouter } from 'dva/router';
import { Bind } from 'lodash-decorators';

import intl from 'utils/intl';
import Checkbox from 'components/Checkbox';

import OrderConfigModal from './OrderConfigModal';
import SubMessage from '../../components/SubMessage';
import SubCheckBox from '../../components/SubCheckBox';
import styles from './index.less';

const orderPrompt = 'spfm.configServer.view.order.message';
/**
 * 配置中心-采购方-订单
 * @extends {Component} - React.Component
 * @reactProps {Object} settings - 数据源
 * @reactProps {Object} loading - 数据加载是否完成
 * @return React.element    onChange={onChange}
 */
@withRouter
@Form.create({ fieldNameProp: null })
export default class Order extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderPrintFlag: false,
      disabled010205: props.settings['010205'] || false,
      // disabled010212: props.settings['010205'] || false,
      disabled010203: props.settings['10203'] || false,
      disabled010204: props.settings['010204'] || false,
      disabled010206: props.settings['010210'] || false,
      dateRequired010208: props.settings['010207'] || false,
      settings: props.settings || {},
      orderConfigVisible: false,
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
   * 打开和关闭订单打印弹窗
   */
  @Bind()
  handleOrderPrint() {
    const { orderPrintFlag } = this.state;
    this.setState({
      orderPrintFlag: !orderPrintFlag,
    });
  }

  /**
   * 改变state的visible
   * @param {*} field
   * @param {*} value
   */
  @Bind()
  handleStateVisible(field, value, otherParams = {}) {
    this.setState({ [field]: value, ...otherParams });
  }

  /**
   * 父组件state改变回调
   */
  @Bind()
  handleParentFieldChange(field, value, otherParams) {
    const { onOrderConfig } = this.props;
    if (onOrderConfig) {
      onOrderConfig(field, !!value, otherParams);
    }
  }

  /**
   * 设置承诺交货日期是否必输
   * @param {event} e
   */
  @Bind()
  handleChangeDateRequired(e) {
    const {
      form: { setFieldsValue },
    } = this.props;
    this.setState(
      {
        disabled010205: e.target.checked === 1,
        disabled010206: e.target.checked === 1,
      },
      () => {
        if (e.target.checked === 1) {
          setFieldsValue({ '010205': 1 });
          // setFieldsValue({ '010206': '010206' });
        }
      }
    );
  }
  /**
   * 设置订单审批状态回传ERP是否必输
   * @param {event} e
   */
  // @Bind()
  // handleChangeOrderApproval(e) {
  //   const { form: { setFieldsValue } } = this.props;
  //   this.setState(
  //     {
  //       disabled010212: e.target.checked === 1,
  //     },
  //     () => {
  //       if (e.target.checked === 1) {
  //         setFieldsValue({ '010212': 1 });
  //       }
  //     }
  //   );
  // }

  @Bind()
  handleChangeOrderPrice(e) {
    const {
      form: { setFieldsValue },
    } = this.props;
    this.setState(
      {
        disabled010203: e.target.checked === 1,
        disabled010204: e.target.checked === 1,
      },
      () => {
        if (e.target.checked === 1) {
          setFieldsValue({ '010203': 1 });
          setFieldsValue({ '010204': 1 });
        }
      }
    );
  }

  /**
   * 改变订单打印校验
   * @param {Object} e
   */
  @Bind()
  handleChangeOrderPrintRequired(e) {
    this.setState(
      {
        dateRequired010208: e.target.checked === 1,
      },
      () => {
        this.props.form.validateFields(['010208'], { force: true });
      }
    );
  }

  render() {
    const {
      form: { getFieldDecorator, getFieldValue },
      enumMap = {},
    } = this.props;
    const { settings, orderConfigVisible } = this.state;
    const { delivery = [], templates = [], rules = [], approval = [], mergeRules = [] } = enumMap;
    const orderConfigProps = {
      visible: orderConfigVisible,
      onOrderConfig: this.handleStateVisible,
    };
    return (
      <Row className="tab-content" id="order">
        <Col span={3}>
          <span className="label-col">{intl.get(`${orderPrompt}.order`).d('订单')}：</span>
        </Col>
        <Col span={21} className="sub-item-right">
          <Row>
            <Col span={24}>{intl.get(`${orderPrompt}.singleRule`).d('订单创建')}</Col>
            <Col span={24} className={styles['version-rule']}>
              <Form layout="inline" className={classnames(styles['form-item'], 'sub-item-fields')}>
                <Form.Item
                  label={`${intl
                    .get(`${orderPrompt}.010214label`)
                    .d('采购订单创建并单规则定义')}：`}
                >
                  {getFieldDecorator('010214', {
                    initialValue: settings['010214'],
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
              {getFieldValue('010214') === 'CUSTOMIZE' && (
                <a onClick={() => this.props.onHandleStateChange('orderMergeRulesVisible', true)}>
                  {intl.get(`${orderPrompt}.010214href`).d('进入定义列表')}
                </a>
              )}
            </Col>
            <SubMessage
              content={intl
                .get(`${orderPrompt}.010214subMsg`)
                .d('引用采购申请创建SRM订单时，会根据所配置的规则判断是否可以合并生成同一张订单。')}
            />
          </Row>
          <Row className="sub-item">
            <Col span={24}>{intl.get(`${orderPrompt}.orderApproval`).d('订单审批')}</Col>
            <Col
              span={24}
              className={classnames(styles['version-rule'], 'sub-item-fields')}
              style={{ marginTop: '-10px', lineHeight: '39px' }}
            >
              {getFieldDecorator('010211', {
                initialValue: settings['010211'],
              })(
                <Checkbox onChange={this.handleChangeOrderApproval}>
                  {intl.get(`${orderPrompt}.010211label`).d('启用SRM订单审批')}
                </Checkbox>
              )}
              {getFieldValue('010211') === 1 && (
                <Form layout="inline" className={classnames(styles['form-item'])}>
                  <Form.Item>
                    {getFieldDecorator('010213', {
                      initialValue: settings['010213'],
                    })(
                      <Select showSearch style={{ width: '150px' }} allowClear>
                        {approval.map(item => (
                          <Select.Option key={item.value} value={item.value}>
                            {item.meaning}
                          </Select.Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </Form>
              )}
            </Col>
            <SubMessage
              content={intl
                .get(`${orderPrompt}.010211subMsg`)
                .d(
                  '启用SRM订单审批，则订单需在SRM通过功能或工作流完成审批，工作流审批需配合工作流定义使用。'
                )}
            />
            <SubCheckBox
              content={intl.get(`${orderPrompt}.010212`).d('订单审批状态回传ERP')}
              getFieldDecorator={getFieldDecorator}
              initialValue={settings[0]}
              field="010212"
              disabled
            />
            <SubMessage
              content={intl
                .get(`${orderPrompt}.010212subMsg`)
                .d('勾选回传，则订单审批状态自动回传ERP。')}
            />
          </Row>
          <Row className="sub-item">
            <Col span={24}>{intl.get(`${orderPrompt}.orderRelease`).d('订单发布')}</Col>
            <SubCheckBox
              content={intl.get(`${orderPrompt}.010201`).d('采购订单手工发布')}
              getFieldDecorator={getFieldDecorator}
              initialValue={settings['010201']}
              field="010201"
            />
            <SubMessage
              content={intl
                .get(`${orderPrompt}.010201subMsg`)
                .d(
                  '勾选手工发布，则订单需通过“采购订单发布”功能手工点击发布，不勾选则订单自动发布'
                )}
            />
            <Col span={24} className={styles['version-rule']}>
              <Form layout="inline" className={classnames(styles['form-item'], 'sub-item-fields')}>
                <Form.Item
                  label={`${intl.get(`${orderPrompt}.010209label`).d('订单版本管理规则')}：`}
                >
                  {getFieldDecorator('010209', {
                    initialValue: settings['010209'],
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${orderPrompt}.010209label`).d('订单版本管理规则'),
                        }),
                      },
                    ],
                  })(
                    <Select showSearch style={{ width: '150px' }} allowClear>
                      {rules.map(item => (
                        <Select.Option key={item.value} value={item.value}>
                          {item.meaning}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Form>
              {getFieldValue('010209') !== (0 || undefined) && (
                <a onClick={() => this.handleStateVisible('orderConfigVisible', true)}>
                  {intl.get(`${orderPrompt}.010202href`).d('进入定义列表')}
                </a>
              )}
            </Col>
            <SubMessage
              content={intl
                .get(`${orderPrompt}.010209subMsg`)
                .d(
                  '订单基于ERP管理，则订单版本显示ERP订单版本；订单基于SRM管理，则订单版本根据SRM订单版本升级规则进行管理，可在关键字段定义界面进行规则配置。'
                )}
            />
          </Row>
          <Row className="sub-item">
            <Col span={24}>{intl.get(`${orderPrompt}.orderPrice`).d('订单价格')}</Col>
            <Col span={24} className="sub-item-fields">
              {getFieldDecorator('010202', {
                initialValue: settings['010202'],
              })(
                <Checkbox onChange={this.handleChangeOrderPrice}>
                  {intl
                    .get(`${orderPrompt}.010202`)
                    .d('在订单确认、查询页面，不展示单价、总额等价格信息')}
                </Checkbox>
              )}
              {getFieldValue('010202') === 1 && (
                <a
                  onClick={() =>
                    this.handleParentFieldChange('priceShieldVisible', true, {
                      documentCategory: 'PO',
                    })
                  }
                  style={{ marginLeft: '8px' }}
                >
                  {intl.get(`${orderPrompt}.010202href`).d('进入定义列表')}
                </a>
              )}
            </Col>
            <SubMessage
              content={intl
                .get(`${orderPrompt}.010202subMsg`)
                .d(
                  '勾选并定义屏蔽规则后，所定义的内部角色/外部供应商在订单确认、查询界面，单价、总额等字段将显示为***'
                )}
            />
            <SubCheckBox
              content={intl.get(`${orderPrompt}.010203`).d('引用物料价格信息记录')}
              getFieldDecorator={getFieldDecorator}
              initialValue={settings['010203']}
              field="010203"
              disabled={this.state.disabled010203}
            />
            <SubMessage
              content={intl
                .get(`${orderPrompt}.010203subMsg`)
                .d(
                  '勾选引用，则手工创建采购订单时，将自动引用物料价格信息记录中该物料当前有效价格。'
                )}
            />
            <SubCheckBox
              content={intl.get(`${orderPrompt}.010204`).d('自动更新物料价格信息记录')}
              getFieldDecorator={getFieldDecorator}
              initialValue={settings['010204']}
              field="010204"
              disabled={this.state.disabled010204}
            />
            <Col span={24} className="sub-message">
              {intl
                .get(`${orderPrompt}.010204subMsg`)
                .d('勾选自动更新，则订单审批通过后，将以当前物料的价格自动更新物料价格信息记录。')}
            </Col>
          </Row>
          <Row className="sub-item">
            <Col span={24}>{intl.get(`${orderPrompt}.promiseTime`).d('承诺交期')}</Col>
            <SubCheckBox
              content={intl.get(`${orderPrompt}.010210`).d('启用交期审核')}
              getFieldDecorator={getFieldDecorator}
              initialValue={settings['010210']}
              field="010210"
              onChange={this.handleChangeDateRequired}
            />
            <SubMessage
              content={intl
                .get(`${orderPrompt}.010210subMsg`)
                .d('勾选启用，则供应商承诺交期与订单需求日期不一致时，需要采购方进行审核。')}
            />
            <Col span={24} className="sub-item-fields">
              {getFieldDecorator('010205', {
                initialValue: settings['010205'],
              })(
                <Checkbox disabled={!!this.state.disabled010205}>
                  {intl.get(`${orderPrompt}.010205`).d('承诺交货日期必输')}
                </Checkbox>
              )}
            </Col>
            <SubMessage
              content={intl
                .get(`${orderPrompt}.010205subMsg`)
                .d('勾选必输，则供应商在订单确认界面必须维护每行承诺交货日期。')}
            />
            <Col span={24} className="sub-item-fields">
              <Form layout="inline" className={styles['form-item']}>
                <Form.Item
                  label={`${intl.get(`${orderPrompt}.010206label`).d('承诺交货日期缺省值')}：`}
                >
                  {getFieldDecorator('010206', {
                    initialValue: settings['010206'],
                  })(
                    <Select
                      showSearch
                      style={{ width: '150px' }}
                      allowClear
                      disabled={this.state.disabled010206}
                    >
                      {delivery.map(item => (
                        <Select.Option key={item.value} value={item.value}>
                          {item.meaning}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Form>
            </Col>
            <SubMessage
              content={intl
                .get(`${orderPrompt}.010206subMsg`)
                .d(
                  '缺省值为空，则供应商需要自行填写承诺交期；缺省值为订单需求日期，则默认承诺交货日期=需求日期，供应商可再手工调整。'
                )}
            />
          </Row>
          <Row className="sub-item" style={{ position: 'relative' }}>
            <Col span={24}>{intl.get(`${orderPrompt}.orderPrint`).d('订单打印')}</Col>
            <Col
              span={24}
              className={classnames(styles['order-print'], 'sub-item-fields')}
              style={{ lineHeight: '40px' }}
            >
              <div className={styles.templateSelect}>
                {getFieldDecorator('010207', {
                  initialValue: settings['010207'],
                })(
                  <Checkbox onChange={e => this.handleChangeOrderPrintRequired(e)}>
                    {intl.get(`${orderPrompt}.010207`).d('启用采购订单打印')}
                  </Checkbox>
                )}
                {getFieldValue('010207') === 1 && (
                  <Form
                    layout="inline"
                    className={classnames(styles['form-item'], styles['margin-form-item'])}
                  >
                    <Form.Item label={intl.get(`${orderPrompt}.010207label`).d('选择模板')}>
                      {getFieldDecorator('010208', {
                        initialValue: settings['010208'],
                        rules: [
                          {
                            required: this.state.dateRequired010208,
                            message: intl.get('hzero.common.validation.notNull', {
                              name: intl.get(`${orderPrompt}.010207label`).d('选择模板'),
                            }),
                          },
                        ],
                      })(
                        <Select showSearch style={{ width: '150px' }} allowClear disabled>
                          {templates.map(item => (
                            <Select.Option key={item.value} value={item.value}>
                              {item.meaning}
                            </Select.Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  </Form>
                )}
              </div>
            </Col>
            <SubMessage
              content={intl
                .get(`${orderPrompt}.010207subMsg`)
                .d(
                  '勾选启用打印，则采购方&供应商可在订单查询界面打印采购订单；集团模板可在报表配置功能中进行配置，未配置集团模板则默认按照标准模板打印。'
                )}
            />
          </Row>
          {/*
          {getFieldDecorator('purchaser#order-publish')(
            <Checkbox.Group style={{ width: '100%' }}>
              <Row>
                <Col span={24}>订单发布</Col>
                <Col span={24}>
                  <Checkbox value="A">采购订单手工发布</Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>
          )}
          {getFieldDecorator('purchaser#order-detail-define')(
            <Checkbox.Group style={{ width: '100%' }}>
              <Row>
                <Col span={24}>
                  <Checkbox value="order-print" onClick={this.handleOrderPrint}>
                    启用采购订单打印
                  </Checkbox>
                </Col>
                {orderPrintFlag &&
                  getFieldDecorator('order-print-radio')(
                    <Row>
                      <RadioGroup>
                        <Row>
                          <Col span={24}>
                            <Radio value="use-group-template">使用本集团模板</Radio>
                          </Col>
                          <Col span={24}>
                            <Radio value="use-default-template">使用默认模板</Radio>
                          </Col>
                        </Row>
                      </RadioGroup>
                    </Row>
                  )}
                <Col span={24}>
                  <Checkbox value="account-statement-create">引用物料价格信息记录</Checkbox>
                </Col>
                <Col span={24}>
                  <Checkbox value="D">自动更新物料价格信息记录</Checkbox>
                </Col>
                <Col span={24}>
                  <Checkbox value="E">承诺交货日期是否必输</Checkbox>
                </Col>
                <Col span={24}>
                  <Checkbox value="E">规格型号置于物料名称后</Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>
          )} */}
        </Col>
        {orderConfigVisible && <OrderConfigModal {...orderConfigProps} />}
      </Row>
    );
  }
}
