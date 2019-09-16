/*
 * Approval - 调查表审批
 * @date: 2018/08/22 19:13:01
 * @author: HB <bin.huang02@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React from 'react';
import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { Row, Col } from 'hzero-ui';
import styles from '../index.less';
import Investigation from '../../Investigation/Component/Investigation';

const promptCode = 'spfm.disposeInvite';
/**
 * 调查表审批
 * @extends {Component} - React.Component
 * @reactProps {String} companyName公司名
 * @reactProps {Boolean} isSupplier true-供应商 false-客户
 * @reactProps {Date} invitingTime邀请时间
 * @reactProps {String} inviteRemark邀请备注
 * @return React.element
 */
export default class Approval extends React.Component {
  render() {
    const { detail = {}, investigateTemplateId, investgHeaderId } = this.props;
    const organizationId = getCurrentOrganizationId();
    return (
      <div className={styles['information-container']}>
        <div className={styles['information-title']}>
          <span className={styles['vertical-line']} />
          <span>{intl.get(`${promptCode}.view.message.investigateTemplate`).d('调查表')}</span>
        </div>
        <Row gutter={24} className={styles['information-item']}>
          <Col span={8}>
            <Row>
              <Col span={9} className={styles['information-item-label']}>
                {intl.get(`${promptCode}.view.message.investgNumber`).d('调查表编号')}:
              </Col>
              <Col span={15}>{detail.investgNumber || ''}</Col>
            </Row>
          </Col>
          <Col span={8}>
            <Row>
              <Col span={9} className={styles['information-item-label']}>
                {intl.get(`${promptCode}.view.message.processStatusMeaning`).d('状态')}:
              </Col>
              <Col span={15}>{detail.processStatusMeaning || detail.processStatus || ''}</Col>
            </Row>
          </Col>
          <Col span={8}>
            <Row>
              <Col span={9} className={styles['information-item-label']}>
                {intl.get(`hzero.common.date.release`).d('发布时间')}:
              </Col>
              <Col span={15}>{detail.releaseDate || ''}</Col>
            </Row>
          </Col>
        </Row>
        <Row gutter={24} className={styles['information-item']}>
          <Col span={8}>
            <Row>
              <Col span={9} className={styles['information-item-label']}>
                {intl.get(`hzero.common.entity.creator`).d('创建人')}:
              </Col>
              <Col span={15}>{detail.createUserName || ''}</Col>
            </Row>
          </Col>
          <Col span={8}>
            <Row>
              <Col span={9} className={styles['information-item-label']}>
                {intl.get('entity.customer.code').d('客户编号')}:
              </Col>
              <Col span={15}>{detail.companyNum || ''}</Col>
            </Row>
          </Col>
          <Col span={8}>
            <Row>
              <Col span={9} className={styles['information-item-label']}>
                {intl.get('entity.customer.name').d('客户名称')}:
              </Col>
              <Col span={15}>{detail.companyName || ''}</Col>
            </Row>
          </Col>
        </Row>
        <Row gutter={24} className={styles['information-item']}>
          <Col span={8}>
            <Row>
              <Col span={9} className={styles['information-item-label']}>
                {intl.get('entity.supplier.code').d('供应商编号')}:
              </Col>
              <Col span={15}>{detail.partnerCompanyNum || ''}</Col>
            </Row>
          </Col>
          <Col span={8}>
            <Row>
              <Col span={9} className={styles['information-item-label']}>
                {intl.get('entity.supplier.name').d('供应商名称')}:
              </Col>
              <Col span={15}>{detail.partnerCompanyName || ''}</Col>
            </Row>
          </Col>
        </Row>
        <Row gutter={24} className={styles['information-item']}>
          <Col span={3} className={styles['information-item-label']}>
            {intl.get(`${promptCode}.view.message.remark`).d('调查说明')}:
          </Col>
          <Col span={21} className={styles['ainformation-item-children']}>
            {detail.remark || ''}
          </Col>
        </Row>
        <Row gutter={24} className={styles['information-item']}>
          <Col span={3} className={styles['information-item-label']}>
            {intl.get(`${promptCode}.view.message.partnerRemark`).d('反馈备注')}:
          </Col>
          <Col span={21} className={styles['ainformation-item-children']}>
            {detail.partnerRemark || ''}
          </Col>
        </Row>
        <Investigation
          organizationId={organizationId}
          investigateTemplateId={investigateTemplateId}
          investgHeaderId={investgHeaderId}
        />
      </div>
    );
  }
}
