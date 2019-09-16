/*
 * 配置中心 - 需求池
 * @date: 2019-01-22
 * @author: HB <bin.huang02@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import React, { PureComponent } from 'react';
import { Row, Col, Form, Select } from 'hzero-ui';
import classnames from 'classnames';
import { Bind } from 'lodash-decorators';
import { isFunction, isString } from 'lodash';

import intl from 'utils/intl';
import Checkbox from 'components/Checkbox';

import SubMessage from '../../components/SubMessage';
import SubCheckBox from '../../components/SubCheckBox';
import styles from './index.less';

const demandPool = 'spfm.configServer.view.demandPool';
/**
 * 配置中心-需求池
 * @extends {Component} - React.Component
 * @reactProps {Object} settings - 数据源
 * @reactProps {Object} loading - 数据加载是否完成
 * @return React.element    onChange={onChange}
 */
@Form.create({ fieldNameProp: null })
export default class DemandPool extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dateRequired010902: props.settings['010901'] || false,
    };
    props.onRef(this);
  }

  @Bind()
  handlePRAVisible() {
    const { handleModal } = this.props;
    if (isFunction(handleModal)) {
      handleModal('purchaseRACVisible', true);
    }
  }

  @Bind()
  handleStateChange() {
    const { handleModal } = this.props;
    if (isFunction(handleModal)) {
      handleModal('billUpdateRuleVisible', true);
    }
  }

  render() {
    const {
      form: { getFieldDecorator, getFieldValue },
      settings,
      enumMap,
    } = this.props;
    const { approvalMethod = [] } = enumMap;
    const { dateRequired010902 } = this.state;

    return (
      <Row className="tab-content" id="demandPoll">
        <Col span={3}>
          <span className="label-col">{intl.get(`${demandPool}.message.0109`).d('需求池')}：</span>
        </Col>
        <Col span={21} className="sub-item-right">
          <Row>
            <Col span={24}>
              {intl.get(`${demandPool}.message.receiveTransactionMatch`).d('采购申请审批')}
            </Col>
            <Col
              span={24}
              className={classnames('sub-item-fields', styles['flex-form-item'])}
              style={{ marginTop: '-10px', lineHeight: '39px' }}
            >
              {getFieldDecorator('010901', {
                initialValue: settings['010901'],
              })(
                <Checkbox>
                  {intl.get(`${demandPool}.message.010901`).d('启用SRM采购申请审批')}
                </Checkbox>
              )}
              {getFieldValue('010901') === 1 && (
                <Form.Item>
                  {getFieldDecorator('010902', {
                    initialValue: settings['010902'],
                    rules: [
                      {
                        required: dateRequired010902,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${demandPool}.message.010901`).d('启用SRM采购申请审批'),
                        }),
                      },
                    ],
                  })(
                    <Select showSearch style={{ width: '150px' }} allowClear>
                      {approvalMethod.map(item => (
                        <Select.Option key={item.value} value={item.value}>
                          {item.meaning}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              )}
              {getFieldValue('010901') === 1 && isString(getFieldValue('010902')) && (
                <a onClick={this.handlePRAVisible}>
                  {intl.get(`${demandPool}.message.enterDefineList`).d('进入定义列表')}
                </a>
              )}
            </Col>
            <SubMessage
              content={intl
                .get(`${demandPool}.message.010901subMsg`)
                .d(
                  '启用SRM采购申请审批，则采购申请需在SRM通过功能或工作流完成审批，工作流审批需配合工作流定义使用。'
                )}
            />
            {/* <SubCheckBox
              content={intl.get(`${demandPool}.message.010903`).d('采购申请回传ERP')}
              getFieldDecorator={getFieldDecorator}
              initialValue={settings['010903']}
              field="010903"
            /> */}
            <Col span={24} className="sub-item-fields">
              {getFieldDecorator('010903', {
                initialValue: settings['010903'],
              })(
                <Checkbox>{intl.get(`${demandPool}.message.010903`).d('采购申请回传ERP')}</Checkbox>
              )}
              {getFieldValue('010903') === 1 && (
                <a
                  onClick={() => this.handleStateChange('billUpdateRuleVisible', true)}
                  className="operate-item-link"
                >
                  {intl.get(`${demandPool}.010501href`).d('进入定义列表')}
                </a>
              )}
            </Col>
            <SubMessage
              content={intl
                .get(`${demandPool}.message.010903subMsg`)
                .d('勾选回传，SRM采购申请及审批状态自动同步至ERP。')}
            />
          </Row>
          <Row className="sub-item">
            <Col span={24}>{intl.get(`${demandPool}.message.needAllocate`).d('需求分配')}</Col>
            <SubCheckBox
              content={intl.get(`${demandPool}.message.010904`).d('自动分配')}
              getFieldDecorator={getFieldDecorator}
              initialValue={settings['010904']}
              field="010904"
            />
            <SubMessage
              content={intl
                .get(`${demandPool}.message.010904subMsg`)
                .d('勾选自动分配，则将需求自动分配给需求申请单据中的采购员。')}
            />
          </Row>
          <Row className="sub-item">
            <Col span={24}>
              {intl.get(`${demandPool}.message.sourcingSelect`).d('寻源策略选择')}
            </Col>
            <SubCheckBox
              content={intl.get(`${demandPool}.message.010905`).d('沿用上次寻源策略')}
              getFieldDecorator={getFieldDecorator}
              initialValue={settings['010905']}
              field="010905"
            />
            <SubMessage
              content={intl
                .get(`${demandPool}.message.010905subMsg`)
                .d('勾选沿用上次寻源策略，则采购申请自动沿用该物料上次寻源所选择的寻源策略。')}
            />
            <SubCheckBox
              content={intl.get(`${demandPool}.message.010906`).d('依据物品分类')}
              getFieldDecorator={getFieldDecorator}
              initialValue={settings['010906']}
              field="010906"
            />
            <SubMessage
              content={intl
                .get(`${demandPool}.message.010906subMsg`)
                .d('勾选并定义物品分类的寻源方式后，采购申请将自动选择对应的寻源方式。')}
            />
          </Row>
        </Col>
      </Row>
    );
  }
}
