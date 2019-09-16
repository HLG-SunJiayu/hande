/**
 * BusinessInfo - 企业认证预览-业务信息
 * @date: 2018-12-18
 * @author: wangjiacheng <jiacheng.wang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import React, { PureComponent } from 'react';
import { Row, Col, Divider } from 'hzero-ui';
import intl from 'utils/intl';
import ItemWrapper from './ItemWrapper';
import styles from './index.less';

export default class InvoiceInfo extends PureComponent {
  render() {
    const { invoice = {} } = this.props;
    const {
      invoiceHeader, // 发票头
      taxRegistrationNumber, // 税务登记号
      depositBank, // 开户行
      bankAccountNum, // 开户行账号
      taxRegistrationAddress, // 税务登记地址
      taxRegistrationPhone, // 税务登记电话
      receiveMail, // 收票人邮箱
      receivePhone, // 收票人手机号
    } = invoice;

    return (
      <ItemWrapper title={intl.get('spfm.invoice.view.message.title').d('开票信息')}>
        <Row gutter={4}>
          <Col>
            <Row>
              <Col span={3} className={styles.fields}>
                <span className={styles.fields}>
                  {intl.get('spfm.invoice.view.message.invoiceHeader').d('发票头：')}
                </span>
              </Col>
              <Col span={18} className={styles['fields-content']}>
                <span>{invoiceHeader}</span>
              </Col>
            </Row>
          </Col>
        </Row>
        <Divider dashed style={{ margin: '8px 0' }} />
        <Row gutter={4}>
          <Col>
            <Row>
              <Col span={3} className={styles.fields}>
                <span className={styles.fields}>
                  {intl.get('spfm.invoice.view.message.taxRegistrationNumber').d('税务登记号：')}
                </span>
              </Col>
              <Col span={18} className={styles['fields-content']}>
                <span>{taxRegistrationNumber}</span>
              </Col>
            </Row>
          </Col>
        </Row>
        <Divider dashed style={{ margin: '8px 0' }} />
        <Row>
          <Col>
            <Row>
              <Col span={3} className={styles.fields}>
                <span className={styles.fields}>
                  {intl.get('spfm.invoice.view.message.depositBank').d('开户行：')}
                </span>
              </Col>
              <Col span={18} className={styles['fields-content']}>
                <span>{depositBank}</span>
              </Col>
            </Row>
          </Col>
        </Row>
        <Divider dashed style={{ margin: '8px 0' }} />
        <Row gutter={4}>
          <Col>
            <Row>
              <Col span={3} className={styles.fields}>
                <span className={styles.fields}>
                  {intl.get('spfm.invoice.view.message.bankAccountNum').d('开户行账号：')}
                </span>
              </Col>
              <Col span={18} className={styles['fields-content']}>
                <span>{bankAccountNum}</span>
              </Col>
            </Row>
          </Col>
        </Row>
        <Divider dashed style={{ margin: '8px 0' }} />
        <Row gutter={4}>
          <Col>
            <Row>
              <Col span={3} className={styles.fields}>
                <span className={styles.fields}>
                  {intl.get('spfm.invoice.view.message.taxRegistrationAddress').d('税务登记地址：')}
                </span>
              </Col>
              <Col span={18} className={styles['fields-content']}>
                <span>{taxRegistrationAddress}</span>
              </Col>
            </Row>
          </Col>
        </Row>
        <Divider dashed style={{ margin: '8px 0' }} />
        <Row gutter={4}>
          <Col>
            <Row>
              <Col span={3} className={styles.fields}>
                <span className={styles.fields}>
                  {intl.get('spfm.invoice.view.message.taxRegistrationPhone').d('税务登记电话：')}
                </span>
              </Col>
              <Col span={18} className={styles['fields-content']}>
                <span>{taxRegistrationPhone}</span>
              </Col>
            </Row>
          </Col>
        </Row>
        <Divider dashed style={{ margin: '8px 0' }} />
        <Row gutter={4}>
          <Col>
            <Row>
              <Col span={3} className={styles.fields}>
                <span className={styles.fields}>
                  {intl.get('spfm.invoice.view.message.receiveMail').d('收票人邮箱：')}
                </span>
              </Col>
              <Col span={18} className={styles['fields-content']}>
                <span>{receiveMail}</span>
              </Col>
            </Row>
          </Col>
        </Row>
        <Divider dashed style={{ margin: '8px 0' }} />
        <Row gutter={4}>
          <Col>
            <Row>
              <Col span={3} className={styles.fields}>
                <span className={styles.fields}>
                  {intl.get('spfm.invoice.view.message.receivePhone').d('收票人手机号：')}
                </span>
              </Col>
              <Col span={18} className={styles['fields-content']}>
                <span>{receivePhone}</span>
              </Col>
            </Row>
          </Col>
        </Row>
      </ItemWrapper>
    );
  }
}
