/**
 * BusinessInfo - 企业认证预览-业务信息
 * @date: 2018-12-18
 * @author: wangjiacheng <jiacheng.wang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import React from 'react';
import { Row, Col, Divider } from 'hzero-ui';

import ItemWrapper from './ItemWrapper';
import styles from './index.less';

export default class BusinessInfo extends React.PureComponent {
  render() {
    const { business = {}, showBusinessUrlImg } = this.props;
    const {
      saleFlag, // 主要身份，销售
      purchaseFlag, // 主要身份，采购
      manufacturerFlag, // 经营性质，是否制造商
      traderFlag, // 经营性质，是否贸易商
      servicerFlag, // 经营性质，是否服务商
      industryList = [],
      industryCategoryList = [],
      serviceAreaList = [],
      website,
      logoUrl,
      description,
    } = business;
    // 主要身份
    const businessTypeValue = [];
    if (saleFlag === 1) businessTypeValue.push('销售');
    if (purchaseFlag === 1) businessTypeValue.push('采购');
    // 经营性质
    const serviceTypeValue = [];
    if (manufacturerFlag === 1) serviceTypeValue.push('制造商');
    if (traderFlag === 1) serviceTypeValue.push('贸易商');
    if (servicerFlag === 1) serviceTypeValue.push('服务商');
    return (
      <ItemWrapper title="业务信息">
        <Row gutter={4} type="flex" justify="start">
          <Col span={8}>
            <Row>
              <Col span={6} className={styles.fields}>
                <span className={styles.fields}>主要身份：</span>
              </Col>
              <Col span={18} className={styles['fields-content']}>
                <span>
                  {businessTypeValue
                    .map(item => {
                      return item;
                    })
                    .join('、')}
                </span>
              </Col>
            </Row>
          </Col>
          <Col span={8}>
            <Row>
              <Col span={6} className={styles.fields}>
                <span className={styles.fields}>经营性质：</span>
              </Col>
              <Col span={18} className={styles['fields-content']}>
                <span>
                  {serviceTypeValue
                    .map(item => {
                      return item;
                    })
                    .join('、')}
                </span>
              </Col>
            </Row>
          </Col>
        </Row>
        <Divider dashed style={{ margin: '8px 0' }} />
        <Row gutter={4}>
          <Col>
            <Row>
              <Col span={2} className={styles.fields}>
                <span className={styles.fields}>行业类型：</span>
              </Col>
              <Col span={18} className={styles['fields-content']}>
                <span>
                  {industryList
                    .map(item => {
                      return item.industryName;
                    })
                    .join('、')}
                </span>
              </Col>
            </Row>
          </Col>
        </Row>
        <Divider dashed style={{ margin: '8px 0' }} />
        <Row>
          <Col>
            <Row>
              <Col span={2} className={styles.fields}>
                <span className={styles.fields}>主营品类：</span>
              </Col>
              <Col span={18} className={styles['fields-content']}>
                <span>
                  {industryCategoryList
                    .map(item => {
                      return item.categoryName;
                    })
                    .join('、')}
                </span>
              </Col>
            </Row>
          </Col>
        </Row>
        <Divider dashed style={{ margin: '8px 0' }} />
        <Row gutter={4}>
          <Col>
            <Row>
              <Col span={2} className={styles.fields}>
                <span className={styles.fields}>送货/服务范围：</span>
              </Col>
              <Col span={18} className={styles['fields-content']}>
                <span>
                  {serviceAreaList
                    .map(item => {
                      return item.serviceAreaMeaning;
                    })
                    .join('、')}
                </span>
              </Col>
            </Row>
          </Col>
        </Row>
        <Divider dashed style={{ margin: '8px 0' }} />
        <Row gutter={4}>
          <Col span={8}>
            <Row>
              <Col span={6} className={styles.fields}>
                <span className={styles.fields}>公司官网：</span>
              </Col>
              <Col span={18} className={styles['fields-content']}>
                <span>{website}</span>
              </Col>
            </Row>
          </Col>
          <Col span={8}>
            <span className={styles.fields}>公司 logo：</span>
            {logoUrl && (
              <a
                onClick={() => {
                  showBusinessUrlImg(logoUrl);
                }}
              >
                查看图片
              </a>
            )}
          </Col>
        </Row>
        <Divider dashed style={{ margin: '8px 0' }} />
        <Row gutter={4}>
          <Col>
            <Row>
              <Col span={2} className={styles.fields}>
                <span className={styles.fields}>公司简介：</span>
              </Col>
              <Col span={18} className={styles['fields-content']}>
                <span>{description}</span>
              </Col>
            </Row>
          </Col>
        </Row>
        <Divider dashed style={{ margin: '8px 0' }} />
      </ItemWrapper>
    );
  }
}
