/**
 * preview - 企业认证预览-登记信息
 * @date: 2018-12-18
 * @author: wangjiacheng <jiacheng.wang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import React from 'react';
import { Row, Col, Divider } from 'hzero-ui';

import ItemWrapper from './ItemWrapper';
import styles from './index.less';

export default class LegalInfo extends React.PureComponent {
  render() {
    const { basic = {}, showLegaInfoUrlImg } = this.props;
    const {
      companyName,
      companyTypeMeaning,
      registeredCountryName,
      registeredRegionName,
      legalRepName,
      registeredCapital,
      buildDate,
      longTermFlag,
      licenceEndDate,
      businessScope,
      shortName,
      domesticForeignRelation,
      dunsCode,
      organizingInstitutionCode,
      taxpayerTypeMeaning,
      licenceUrl,
    } = basic;
    return (
      <ItemWrapper title="登记信息">
        <Row gutter={4}>
          <Col span={8}>
            <Row type="flex" justify="start">
              <Col span={6} className={styles.fields}>
                <span>名称：</span>
              </Col>
              <Col span={18} className={styles['fields-content']}>
                <span>{companyName}</span>
              </Col>
            </Row>
          </Col>
          <Col span={8}>
            <Row type="flex" justify="start">
              <Col span={6} className={styles.fields}>
                <span className={styles.fields}>类型：</span>
              </Col>
              <Col span={18} className={styles['fields-content']}>
                <span>{companyTypeMeaning}</span>
              </Col>
            </Row>
          </Col>
          <Col span={8}>
            <Row type="flex" justify="start">
              <Col span={6} className={styles.fields}>
                <span className={styles.fields}>注册国家：</span>
              </Col>
              <Col span={18} className={styles['fields-content']}>
                <span>{registeredCountryName}</span>
              </Col>
            </Row>
          </Col>
        </Row>
        <Divider dashed style={{ margin: '8px 0' }} />
        <Row gutter={4}>
          <Col span={16}>
            <Row type="flex" justify="start">
              <Col span={3} className={styles.fields}>
                <span className={styles.fields}>注册地址：</span>
              </Col>
              <Col span={18} className={styles['fields-content']}>
                <span>{registeredRegionName}</span>
              </Col>
            </Row>
          </Col>
          <Col span={8}>
            <Row type="flex" justify="start">
              <Col span={6} className={styles.fields}>
                <span className={styles.fields}>法定代表人：</span>
              </Col>
              <Col span={18} className={styles['fields-content']}>
                <span>{legalRepName}</span>
              </Col>
            </Row>
          </Col>
        </Row>
        <Divider dashed style={{ margin: '8px 0' }} />
        <Row gutter={4}>
          <Col span={8}>
            <Row type="flex" justify="start">
              <Col span={6} className={styles.fields}>
                <span className={styles.fields}>注册资本：</span>
              </Col>
              <Col span={18} className={styles['fields-content']}>
                <span>{registeredCapital}</span>
              </Col>
            </Row>
          </Col>
          <Col span={8}>
            <Row type="flex" justify="start">
              <Col span={6} className={styles.fields}>
                <span className={styles.fields}>成立日期：</span>
              </Col>
              <Col span={18} className={styles['fields-content']}>
                <span>{buildDate}</span>
              </Col>
            </Row>
          </Col>
          <Col span={8}>
            <Row type="flex" justify="start">
              <Col span={6} className={styles.fields}>
                <span className={styles.fields}>营业期限：</span>
              </Col>
              <Col span={18} className={styles['fields-content']}>
                {longTermFlag ? <span>长期</span> : <span>{licenceEndDate}</span>}
              </Col>
            </Row>
          </Col>
        </Row>
        <Divider dashed style={{ margin: '8px 0' }} />
        <Row gutter={4}>
          <Col>
            <Row>
              <Col span={2} className={styles.fields}>
                <span className={styles.fields}>经营范围：</span>
              </Col>
              <Col span={18} className={styles['fields-content']}>
                <span>{businessScope}</span>
              </Col>
            </Row>
          </Col>
        </Row>
        <Divider dashed style={{ margin: '8px 0' }} />
        <Row gutter={4}>
          <Col span={8}>
            <Row type="flex" justify="start">
              <Col span={6} className={styles.fields}>
                <span className={styles.fields}>简称：</span>
              </Col>
              <Col span={18} className={styles['fields-content']}>
                <span>{shortName}</span>
              </Col>
            </Row>
          </Col>
          <Col span={8}>
            <Row type="flex" justify="start">
              <Col span={6} className={styles.fields}>
                <span className={styles.fields}>境内外关系：</span>
              </Col>
              <Col span={18} className={styles['fields-content']}>
                <span>{domesticForeignRelation ? '境内机构' : '境外机构'}</span>
              </Col>
            </Row>
          </Col>
          <Col span={8}>
            <Row type="flex" justify="start">
              <Col span={6} className={styles.fields}>
                <span className={styles.fields}>D-U-N-S：</span>
              </Col>
              <Col span={18} className={styles['fields-content']}>
                <span>{dunsCode}</span>
              </Col>
            </Row>
          </Col>
        </Row>
        <Divider dashed style={{ margin: '8px 0' }} />
        <Row gutter={4}>
          <Col span={8}>
            <Row type="flex" justify="start">
              <Col span={6} className={styles.fields}>
                <span className={styles.fields}>组织机构代码：</span>
              </Col>
              <Col span={18} className={styles['fields-content']}>
                <span>{organizingInstitutionCode}</span>
              </Col>
            </Row>
          </Col>
          <Col span={8}>
            <Row type="flex" justify="start">
              <Col span={6} className={styles.fields}>
                <span className={styles.fields}>纳税人标识：</span>
              </Col>
              <Col span={18} className={styles['fields-content']}>
                <span>{taxpayerTypeMeaning}</span>
              </Col>
            </Row>
          </Col>
          <Col span={8}>
            <Row>
              <Col span={6} className={styles.fields}>
                <span className={styles.fields}>营业执照：</span>
              </Col>
              <Col span={18} className={styles['fields-content']}>
                <a
                  onClick={() => {
                    showLegaInfoUrlImg(licenceUrl);
                  }}
                >
                  查看营业执照
                </a>
              </Col>
            </Row>
          </Col>
        </Row>
        <Divider dashed style={{ margin: '8px 0' }} />
      </ItemWrapper>
    );
  }
}
