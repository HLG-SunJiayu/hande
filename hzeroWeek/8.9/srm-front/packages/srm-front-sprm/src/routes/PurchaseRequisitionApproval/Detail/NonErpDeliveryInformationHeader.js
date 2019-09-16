/*
 * NonDeliveryInformationHeader - 非ERP采购申请
 * @date: 2019-01-24
 * @author: guochaochao <chaochao.guo@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import React, { PureComponent } from 'react';
import { Form, Row, Col, Spin } from 'hzero-ui';

import intl from 'utils/intl';

import styles from './Header.less';

const commonPrompt = 'sprm.purchaseRequisitionApproval.model.purchaseRequisitionApproval';

export default class NonDeliveryInformationHeader extends PureComponent {
  render() {
    const { headerInfo = {}, loading } = this.props;
    const {
      receiverAddressName,
      receiverContactName,
      receiverTelNum,
      invoiceAddressName,
      invoiceContactName,
      invoiceTelNum,
      receiverEmailAddress,
    } = headerInfo;
    return (
      <Spin spinning={loading}>
        <Form className={styles['header-wrapper']}>
          <Row className="items-row">
            <Col span={24}>
              <Row>
                <Col span={3} className="item-label">
                  {intl.get(`${commonPrompt}.receiverAddressName`).d('收货方地址')}:
                </Col>
                <Col span={21}>{receiverAddressName}</Col>
              </Row>
            </Col>
          </Row>
          <Row className="items-row">
            <Col span={8}>
              <Row>
                <Col span={9} className="item-label">
                  {intl.get(`${commonPrompt}.receiverContactName`).d('收货联系人')}:
                </Col>
                <Col span={15}>{receiverContactName}</Col>
              </Row>
            </Col>
            <Col span={8}>
              <Row>
                <Col span={9} className="item-label">
                  {intl.get(`${commonPrompt}.receiverTelNum`).d('收货联系电话')}:
                </Col>
                <Col span={15}>{receiverTelNum}</Col>
              </Row>
            </Col>
          </Row>
          <Row className="items-row">
            <Col span={24}>
              <Row>
                <Col span={3} className="item-label">
                  {intl.get(`${commonPrompt}.invoiceAddressName`).d('收单方地址')}:
                </Col>
                <Col span={21}>{invoiceAddressName}</Col>
              </Row>
            </Col>
          </Row>
          <Row className="items-row">
            <Col span={8}>
              <Row>
                <Col span={9} className="item-label">
                  {intl.get(`${commonPrompt}.invoiceContactName`).d('收单联系人')}:
                </Col>
                <Col span={15}>{invoiceContactName}</Col>
              </Row>
            </Col>
            <Col span={8}>
              <Row>
                <Col span={9} className="item-label">
                  {intl.get(`${commonPrompt}.invoiceTelNum`).d('收单联系电话')}:
                </Col>
                <Col span={15}>{invoiceTelNum}</Col>
              </Row>
            </Col>
            <Col span={8}>
              <Row>
                <Col span={9} className="item-label">
                  {intl.get(`${commonPrompt}.receiverEmailAddress`).d('收单邮箱')}:
                </Col>
                <Col span={15}>{receiverEmailAddress}</Col>
              </Row>
            </Col>
          </Row>
        </Form>
      </Spin>
    );
  }
}
