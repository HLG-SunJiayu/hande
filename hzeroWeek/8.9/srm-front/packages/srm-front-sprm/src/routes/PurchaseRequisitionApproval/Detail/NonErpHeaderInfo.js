/*
 * NonErpHeaderInfo - 非Erp采购申请头信息
 * @date: 2019-01-24
 * @author: guochaochao <chaochao.guo@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import React, { PureComponent, Fragment } from 'react';
import { Row, Col, Input, Form, Collapse, Icon, Spin } from 'hzero-ui';
import { isFunction } from 'lodash';
import { Bind } from 'lodash-decorators';

import intl from 'utils/intl';
import { numberRender } from 'utils/renderer';

import styles from './Header.less';

const commonPrompt = 'sprm.purchaseRequisitionApproval.model.purchaseRequisitionApproval';
const viewMessagePrompt = 'sprm.purchaseRequisitionApproval.view.message';

const { TextArea } = Input;
const FormItem = Form.Item;
const { Panel } = Collapse;

const oneThirdOfInputSpan = 15;

@Form.create({ fieldNameProp: null })
export default class NonErpHeaderInfo extends PureComponent {
  constructor(props) {
    super(props);
    if (isFunction(props.onRef)) props.onRef(this);
    this.state = {
      collapseKeys: {},
    };
  }

  /**
   * 送货单明细折叠
   */
  @Bind()
  onCollapseChange(arr, key) {
    const { collapseKeys } = this.state;
    this.setState({
      collapseKeys: {
        ...collapseKeys,
        [key]: arr,
      },
    });
  }

  render() {
    const {
      form: { getFieldDecorator },
      headerInfo = {},
      approvedRemarkRequired,
      loading,
    } = this.props;
    const { collapseKeys = [] } = this.state;
    const {
      paymentMethodName,
      ouName,
      amount,
      remark,
      lotNum,
      freight,
      purchaseOrgName,
      contactTelNum,
      companyName,
      displayPrNum,
      creationDate,
      purchaseAgentName,
      title,
      prRequestedName,
      prSourcePlatform,
      prSourcePlatformMeaning,
    } = headerInfo;
    return (
      <Spin spinning={loading}>
        <Form className={styles['header-wrapper']}>
          <Row className="approve-header" gutter={48}>
            <Col>{intl.get(`${commonPrompt}.approvedRemark`).d('审批意见')}</Col>
          </Row>
          <Row className="approve-option">
            <Col span={12}>
              <FormItem>
                {getFieldDecorator('approvedRemark', {
                  rules: [
                    {
                      max: 160,
                      message: intl
                        .get(`hzero.common.validation.max`, {
                          max: 160,
                        })
                        .d(`长度不能超过${160}个字符`),
                    },
                    {
                      required: approvedRemarkRequired,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${viewMessagePrompt}.approvedRemark`).d('审批意见'),
                      }),
                    },
                  ],
                })(<TextArea rows={4} />)}
              </FormItem>
            </Col>
          </Row>
          <Collapse
            className="form-collapse"
            defaultActiveKey={['headerInfo']}
            onChange={arr => this.onCollapseChange(arr, 'headerInfo')}
          >
            <Panel
              showArrow={false}
              header={
                <Fragment>
                  <h3>
                    {intl.get(`${viewMessagePrompt}.deliveryDetailHeader`).d('采购申请头信息')}
                  </h3>
                  <a>
                    {collapseKeys.headerInfo
                      ? collapseKeys.headerInfo.some(o => o === 'headerInfo')
                        ? intl.get(`hzero.common.button.up`).d('收起')
                        : intl.get(`hzero.common.button.expand`).d('展开')
                      : intl.get(`hzero.common.button.up`).d('收起')}
                  </a>
                  <Icon
                    type={
                      collapseKeys.headerInfo
                        ? collapseKeys.headerInfo.some(o => o === 'headerInfo')
                          ? 'up'
                          : 'down'
                        : 'up'
                    }
                  />
                </Fragment>
              }
              key="headerInfo"
            >
              <div className={styles['detail-purchase-header']}>
                <Row className="items-row" gutter={48}>
                  <Col span={24}>
                    <Row className="two-col">
                      <Col span={9} className="item-label">
                        {intl.get(`${commonPrompt}.title`).d('标题')}:
                      </Col>
                      <Col span={oneThirdOfInputSpan}>{title}</Col>
                    </Row>
                  </Col>
                </Row>
                <Row className="items-row" gutter={48}>
                  <Col span={8}>
                    <Row>
                      <Col span={9} className="item-label">
                        {intl.get(`${commonPrompt}.displayPrNum`).d('采购申请编号')}:
                      </Col>
                      <Col span={oneThirdOfInputSpan}>{displayPrNum}</Col>
                    </Row>
                  </Col>
                  <Col span={8}>
                    <Row>
                      <Col span={9} className="item-label">
                        {intl.get(`${commonPrompt}.creationDate`).d('创建时间')}:
                      </Col>
                      <Col span={oneThirdOfInputSpan}>{creationDate}</Col>
                    </Row>
                  </Col>
                  <Col span={8}>
                    <Row>
                      <Col span={9} className="item-label">
                        {intl.get(`${commonPrompt}.amount`).d('申请总额')}:
                      </Col>
                      <Col span={oneThirdOfInputSpan}>{numberRender(amount, 2)}</Col>
                    </Row>
                  </Col>
                </Row>
                <Row className="items-row" gutter={48}>
                  <Col span={8}>
                    <Row>
                      <Col span={9} className="item-label">
                        {intl.get(`${commonPrompt}.prRequestedName`).d('申请人')}:
                      </Col>
                      <Col span={oneThirdOfInputSpan}>{prRequestedName}</Col>
                    </Row>
                  </Col>
                  <Col span={8}>
                    <Row>
                      <Col span={9} className="item-label">
                        {intl.get(`${commonPrompt}.contactTelNum`).d('联系电话')}:
                      </Col>
                      <Col span={oneThirdOfInputSpan}>{contactTelNum}</Col>
                    </Row>
                  </Col>
                  <Col span={8}>
                    <Row>
                      <Col span={9} className="item-label">
                        {intl.get(`${commonPrompt}.companyName`).d('公司')}:
                      </Col>
                      <Col span={oneThirdOfInputSpan}>{companyName}</Col>
                    </Row>
                  </Col>
                </Row>
                <Row className="items-row" gutter={48}>
                  <Col span={8}>
                    <Row>
                      <Col span={9} className="item-label">
                        {intl.get(`${commonPrompt}.ouName`).d('业务实体')}:
                      </Col>
                      <Col span={oneThirdOfInputSpan}>{ouName}</Col>
                    </Row>
                  </Col>
                  <Col span={8}>
                    <Row>
                      <Col span={9} className="item-label">
                        {intl.get(`${commonPrompt}.purchaseOrgName`).d('采购组织')}:
                      </Col>
                      <Col span={oneThirdOfInputSpan}>{purchaseOrgName}</Col>
                    </Row>
                  </Col>
                  <Col span={8}>
                    <Row>
                      <Col span={9} className="item-label">
                        {intl.get(`${commonPrompt}.purchaseAgentName`).d('采购员')}:
                      </Col>
                      <Col span={oneThirdOfInputSpan}>{purchaseAgentName}</Col>
                    </Row>
                  </Col>
                </Row>
                <Row className="items-row" gutter={48}>
                  <Col span={8}>
                    <Row>
                      <Col span={9} className="item-label">
                        {intl.get(`${commonPrompt}.prSourcePlatformMeaning`).d('数据来源')}:
                      </Col>
                      <Col span={oneThirdOfInputSpan}>{prSourcePlatformMeaning}</Col>
                    </Row>
                  </Col>
                  {['E-COMMERCE', 'CATALOGUE'].includes(prSourcePlatform) && (
                    <Col span={8}>
                      <Row>
                        <Col span={9} className="item-label">
                          {intl.get(`${commonPrompt}.lotNum`).d('批次号')}:
                        </Col>
                        <Col span={oneThirdOfInputSpan}>{lotNum}</Col>
                      </Row>
                    </Col>
                  )}
                  {prSourcePlatform === 'E-COMMERCE' && (
                    <Col span={8}>
                      <Row>
                        <Col span={9} className="item-label">
                          {intl.get(`${commonPrompt}.paymentMethodName`).d('支付方式')}:
                        </Col>
                        <Col span={oneThirdOfInputSpan}>{paymentMethodName}</Col>
                      </Row>
                    </Col>
                  )}
                </Row>
                {prSourcePlatform === 'E-COMMERCE' && (
                  <Row className="items-row" gutter={48}>
                    <Col span={8}>
                      <Row>
                        <Col span={9} className="item-label">
                          {intl.get(`${commonPrompt}.freight`).d('运费')}:
                        </Col>
                        <Col span={oneThirdOfInputSpan}>{numberRender(freight, 2)}</Col>
                      </Row>
                    </Col>
                  </Row>
                )}
                <Row className="items-row" gutter={48}>
                  <Col span={24}>
                    <Row className="two-col">
                      <Col className="item-label">
                        {intl.get(`${commonPrompt}.applyRemark`).d('申请说明')}:
                      </Col>
                      <Col>
                        <pre className="remark-context">{remark}</pre>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
            </Panel>
          </Collapse>
        </Form>
      </Spin>
    );
  }
}
