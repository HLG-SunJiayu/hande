/**
 * 调查表头部
 * @date: 2018-9-20
 * @author: YB <bo.yang02@hand-china.com>
 * @version: 0.0.2
 * @copyright Copyright (c) 2018, Hand
 */
import React, { PureComponent } from 'react';
import { Row, Col, Input } from 'hzero-ui';
import intl from 'utils/intl';
import styles from '../index.less';

const promptCode = 'spfm.disposeInvite';

const { TextArea } = Input;

/**
 * 调查表头部
 * @extends {Component} - PureComponent
 * @return React.element
 */
export default class CompanyInformation extends PureComponent {
  constructor(props) {
    super(props);
    const { headerInfo = {} } = props;
    this.state = {
      partnerRemark: headerInfo.partnerRemark,
    };
  }

  /**
   * 邀请备注
   */
  changeTextArea = e => {
    this.setState(
      {
        partnerRemark: e.target.value,
      },
      () => {
        const { onGetHeaderInfo } = this.props;
        const { partnerRemark } = this.state;
        onGetHeaderInfo(partnerRemark);
      }
    );
  };

  render() {
    const { headerInfo, isEdit } = this.props;
    const { partnerRemark } = this.state;
    return (
      <div style={{ width: '90%' }} className={styles['information-container']}>
        <Row
          className={styles['information-item']}
          type="flex"
          justify="space-between"
          align="bottom"
        >
          <Col md={6}>
            <Row>
              <Col md={9} className={styles['information-item-label']}>
                {intl.get(`${promptCode}.view.message.investgNumber`).d('调查表编号')}:
              </Col>
              <Col md={15}>{headerInfo.investgNumber}</Col>
            </Row>
          </Col>
          <Col md={6}>
            <Row>
              <Col md={9} className={styles['information-item-label']}>
                {intl.get(`hzero.common.status`).d('状态')}:
              </Col>
              <Col md={15}>{headerInfo.processStatusMeaning}</Col>
            </Row>
          </Col>
          <Col md={6}>
            <Row>
              <Col md={9} className={styles['information-item-label']}>
                {intl.get(`hzero.common.date.release`).d('发布时间')}:
              </Col>
              <Col md={15}>{headerInfo.releaseDate}</Col>
            </Row>
          </Col>
          <Col md={6}>
            <Row>
              <Col md={9} className={styles['information-item-label']}>
                {intl.get(`hzero.common.entity.creator`).d('创建人')}:
              </Col>
              <Col md={15}>{headerInfo.createUserRealName}</Col>
            </Row>
          </Col>
        </Row>
        <Row
          className={styles['information-item']}
          type="flex"
          justify="space-between"
          align="bottom"
        >
          <Col md={6}>
            <Row>
              <Col md={9} className={styles['information-item-label']}>
                {intl.get('entity.customer.code').d('客户编号')}:
              </Col>
              <Col md={15}>{headerInfo.companyNum}</Col>
            </Row>
          </Col>
          <Col md={18}>
            <Row>
              <Col md={3} className={styles['information-item-label']}>
                {intl.get('entity.customer.name').d('客户名称')}:
              </Col>
              <Col md={21}>{headerInfo.companyName}</Col>
            </Row>
          </Col>
        </Row>
        <Row
          className={styles['information-item']}
          type="flex"
          justify="space-between"
          align="bottom"
        >
          <Col md={6}>
            <Row>
              <Col md={9} className={styles['information-item-label']}>
                {intl.get('entity.supplier.code').d('供应商编号')}:
              </Col>
              <Col md={15}>{headerInfo.partnerCompanyNum}</Col>
            </Row>
          </Col>
          <Col md={18}>
            <Row>
              <Col md={3} className={styles['information-item-label']}>
                {intl.get('entity.supplier.name').d('供应商名称')}:
              </Col>
              <Col md={21}>{headerInfo.partnerCompanyName}</Col>
            </Row>
          </Col>
        </Row>
        <Row
          className={styles['information-item']}
          type="flex"
          justify="space-between"
          align="middle"
        >
          <Col md={24}>
            <Row type="flex" justify="space-between" align="bottom">
              <Col style={{ width: '9.375%' }} className={styles['information-item-label']}>
                {intl.get(`${promptCode}.view.message.remark`).d('调查说明')}:
              </Col>
              <Col style={{ width: '90.625%' }}>{headerInfo.remark}</Col>
            </Row>
          </Col>
        </Row>
        <Row
          className={styles['information-item']}
          type="flex"
          justify="space-between"
          align="middle"
        >
          <Col md={24}>
            <Row type="flex" justify="space-between" align="bottom">
              <Col style={{ width: '9.375%' }} className={styles['information-item-label']}>
                {intl.get(`${promptCode}.view.message.partnerRemark`).d('反馈备注')}:
              </Col>
              <Col style={{ width: '90.625%' }}>
                {isEdit ? (
                  <TextArea value={partnerRemark} autosize onChange={this.changeTextArea} />
                ) : (
                  partnerRemark
                )}
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}
