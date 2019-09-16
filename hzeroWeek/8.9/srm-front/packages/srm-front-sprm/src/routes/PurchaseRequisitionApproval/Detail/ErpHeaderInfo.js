/*
 * ErpHeaderInfo - Erp采购申请头信息
 * @date: 2019-01-24
 * @author: HB <bin.huang02@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { PureComponent, Fragment } from 'react';
import { Row, Col, Input, Collapse, Icon, Form } from 'hzero-ui';
import { isFunction } from 'lodash';
import { Bind } from 'lodash-decorators';

import intl from 'utils/intl';
import { dateRender } from 'utils/renderer';

import styles from './Header.less';

const modelPrompt = 'sprm.purchaseRequisitionApproval.model.purchaseRequisitionApproval';
const { TextArea } = Input;
const FormItem = Form.Item;

const { Panel } = Collapse;
/**
 * ErpHeaderInfo - Erp采购申请头信息
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@Form.create({ fieldNameProp: null })
export default class HeaderInfo extends PureComponent {
  constructor(props) {
    super(props);
    if (isFunction(props.onRef)) props.onRef(this);
    this.state = {
      collapseKeys: ['headerInfo'],
    };
  }

  /**
   * 送货单明细折叠
   */
  @Bind()
  onCollapseChange(collapseKeys) {
    this.setState({
      collapseKeys,
    });
  }

  render() {
    const { headerInfo = {}, form = {}, approvedRemarkRequired } = this.props;
    const { getFieldDecorator = e => e } = form;
    const { collapseKeys = [] } = this.state;
    const { remark, prNum, prRequestedName, creationDate, prSourcePlatform } = headerInfo;
    return (
      <Form className={styles['header-wrapper']}>
        <Row className="approve-header">
          <Col>{intl.get(`${modelPrompt}.approvedRemark`).d('审批意见')}</Col>
        </Row>
        <Row className="approve-option">
          <Col>
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
                      name: intl.get(`${modelPrompt}.approvedRemark`).d('审批意见'),
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
          onChange={this.onCollapseChange}
        >
          <Panel
            showArrow={false}
            header={
              <Fragment>
                <h3>{intl.get(`${modelPrompt}.deliveryDetail`).d('采购申请头信息')}</h3>
                <a>
                  {collapseKeys.some(item => item === 'headerInfo')
                    ? intl.get(`hzero.common.button.up`).d('收起')
                    : intl.get(`hzero.common.button.expand`).d('展开')}
                </a>
                <Icon type={collapseKeys.some(item => item === 'headerInfo') ? 'up' : 'down'} />
              </Fragment>
            }
            key="headerInfo"
          >
            <Row className="items-row">
              <Col md={8}>
                <Row>
                  <Col md={9} className="item-label">
                    {intl.get(`${modelPrompt}.prNum`).d('采购申请编号')}:
                  </Col>
                  <Col md={15}>{prNum}</Col>
                </Row>
              </Col>
              <Col md={8}>
                <Row>
                  <Col md={9} className="item-label">
                    {intl.get(`${modelPrompt}.prRequestedName`).d('申请人')}:
                  </Col>
                  <Col md={15}>{prRequestedName}</Col>
                </Row>
              </Col>
              <Col md={8}>
                <Row>
                  <Col md={9} className="item-label">
                    {intl.get(`entity.supplier.creationDate`).d('创建时间')}:
                  </Col>
                  <Col md={15}>{dateRender(creationDate)}</Col>
                </Row>
              </Col>
            </Row>
            <Row className="items-row">
              <Col md={8}>
                <Row>
                  <Col md={9} className="item-label">
                    {intl.get(`entity.company.prSourcePlatform`).d('数据来源')}:
                  </Col>
                  <Col md={15}>{prSourcePlatform}</Col>
                </Row>
              </Col>
            </Row>
            <Row className="items-row">
              <Col span={24}>
                <Row>
                  <Col span={2} className="item-label">
                    {intl.get(`${modelPrompt}.remark`).d('申请说明')}:
                  </Col>
                  <Col span={15}>{remark}</Col>
                </Row>
              </Col>
            </Row>
          </Panel>
        </Collapse>
      </Form>
    );
  }
}
