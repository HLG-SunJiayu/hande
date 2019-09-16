/**
 * 企业信息
 * @date: 2018-8-13
 * @author: YB <bo.yang02@hand-china.com>
 * @version: 0.0.2
 * @copyright Copyright (c) 2018, Hand
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Icon, Row, Col, Spin } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { isEmpty, isNumber, isUndefined } from 'lodash';
import intl from 'utils/intl';
import styles from '../index.less';

const promptCode = 'spfm.disposeInvite';

// const CheckboxGroup = Checkbox.Group;

/**
 * 企业信息
 * @extends {Component} - PureComponent
 * @return React.element
 */

@connect(({ disposeInvite, loading }) => ({
  disposeInvite,
  loading: loading.effects['disposeInvite/queryCompany'],
}))
export default class CompanyInformation extends PureComponent {
  constructor(props) {
    super(props);
    const { inviteId } = props;
    this.state = {
      inviteId,
    };
  }

  componentDidMount() {
    const { companyId } = this.props;
    if (isNumber(companyId)) {
      this.queryCompany(companyId);
    }
  }

  @Bind()
  queryCompany(companyId) {
    const { dispatch } = this.props;
    dispatch({
      type: 'disposeInvite/queryCompany',
      payload: { companyId },
    });
  }

  setCheckboxGroupValues = (data = []) => data.map(n => (n.enabledFlag === 1 ? n.key : undefined));

  render() {
    const { inviteId } = this.state;
    const {
      loading,
      isLoading = true,
      disposeInvite: { [inviteId]: { companyInfo = {} } = {} },
    } = this.props;
    const {
      companyName,
      companyTypeMeaning,
      registeredCountryName,
      registeredRegionName,
      addressDetail,
      legalRepName,
      registeredCapital,
      licenceEndDate,
      buildDate,
      longTermFlag,
      businessScope,
      domesticForeignRelation,
      shortName,
      dunsCode,
      taxpayerTypeMeaning,
      licenceUrl,
      industryList = [],
      industryCategoryList = [],
      saleFlag,
      purchaseFlag,
      manufacturerFlag,
      traderFlag,
      servicerFlag,
      website,
      description,
      logoUrl,
    } = companyInfo;
    const mainIdentityList = [
      saleFlag === 1 ? intl.get(`${promptCode}.view.message.sale`).d('我要销售') : false,
      purchaseFlag === 1 ? intl.get(`${promptCode}.view.message.purchase`).d('我要采购') : false,
    ];
    const businessNatureList = [
      manufacturerFlag === 1
        ? intl.get(`${promptCode}.view.message.manufacturer`).d('制造商')
        : false,
      traderFlag === 1 ? intl.get(`${promptCode}.view.message.trader`).d('贸易商') : false,
      servicerFlag === 1 ? intl.get(`${promptCode}.view.message.servicer`).d('服务商') : false,
    ];
    return (
      <Spin spinning={isLoading === false ? isLoading : loading}>
        <div className={styles['information-container']}>
          <div className={styles['information-title']}>
            <span className={styles['vertical-line']} />
            <span>{intl.get(`${promptCode}.view.message.registerInfo`).d('登记信息')}</span>
          </div>
          <Row gutter={24} className={styles['information-item']}>
            <Col span={8}>
              <Row>
                <Col span={9} className={styles['information-item-label']}>
                  {intl.get(`${promptCode}.view.message.companyName`).d('公司名称')}:
                </Col>
                <Col span={15}>{companyName}</Col>
              </Row>
            </Col>
            <Col span={8}>
              <Row>
                <Col span={9} className={styles['information-item-label']}>
                  {intl.get(`${promptCode}.view.message.companyTypeMeaning`).d('公司类型')}:
                </Col>
                <Col span={15}>{companyTypeMeaning}</Col>
              </Row>
            </Col>
            <Col span={8}>
              <Row>
                <Col span={9} className={styles['information-item-label']}>
                  {intl.get(`${promptCode}.view.message.registeredCountryName`).d('注册国家')}:
                </Col>
                <Col span={15}>{registeredCountryName}</Col>
              </Row>
            </Col>
          </Row>
          <Row gutter={24} className={styles['information-item']}>
            <Col span={8}>
              <Row>
                <Col span={9} className={styles['information-item-label']}>
                  {intl.get(`${promptCode}.view.message.registeredRegionName`).d('注册地址')}:
                </Col>
                <Col span={15}>
                  {registeredRegionName}
                  {addressDetail}
                </Col>
              </Row>
            </Col>
            <Col span={8}>
              <Row>
                <Col span={9} className={styles['information-item-label']}>
                  {intl.get(`${promptCode}.view.message.legalRepName`).d('法定代表人')}:
                </Col>
                <Col span={15}>{legalRepName}</Col>
              </Row>
            </Col>
            <Col span={8}>
              <Row>
                <Col span={9} className={styles['information-item-label']}>
                  {intl.get(`${promptCode}.view.message.registeredCapital`).d('注册资本')}:
                </Col>
                <Col span={15}>{registeredCapital}</Col>
              </Row>
            </Col>
          </Row>
          <Row gutter={24} className={styles['information-item']}>
            <Col span={8}>
              <Row>
                <Col span={9} className={styles['information-item-label']}>
                  {intl.get(`${promptCode}.view.message.buildDate`).d('成立日期')}:
                </Col>
                <Col span={15}>{buildDate}</Col>
              </Row>
            </Col>
            <Col span={8}>
              <Row>
                <Col span={9} className={styles['information-item-label']}>
                  {intl.get(`${promptCode}.view.message.licenceEndDate`).d('营业期限')}:
                </Col>
                <Col span={15}>
                  {longTermFlag === 1
                    ? intl.get(`${promptCode}.view.message.longTerm`).d('长期')
                    : licenceEndDate}
                </Col>
              </Row>
            </Col>
          </Row>
          <Row gutter={24} className={styles['information-item']}>
            <Col span={3} className={styles['information-item-label']}>
              {intl.get(`${promptCode}.view.message.businessScope`).d('经营范围')}:
            </Col>
            <Col span={21} className={styles['ainformation-item-children']}>
              {businessScope}
            </Col>
          </Row>
          <Row gutter={24} className={styles['information-item']}>
            <Col span={8}>
              <Row>
                <Col span={9} className={styles['information-item-label']}>
                  {intl.get(`${promptCode}.view.message.shortName`).d('简称')}:
                </Col>
                <Col span={15}>{shortName}</Col>
              </Row>
            </Col>
            <Col span={8}>
              <Row>
                <Col span={9} className={styles['information-item-label']}>
                  {intl.get(`${promptCode}.view.message.domesticForeignRelation`).d('境内外关系')}:
                </Col>
                <Col span={15}>
                  {isUndefined(domesticForeignRelation)
                    ? ''
                    : domesticForeignRelation === 1
                    ? intl.get(`${promptCode}.view.message.domestic`).d('境内')
                    : intl.get(`${promptCode}.view.message.overseas`).d('境外')}
                </Col>
              </Row>
            </Col>
            <Col span={8}>
              <Row>
                <Col span={9} className={styles['information-item-label']}>
                  D-U-N-S:
                </Col>
                <Col span={15}>{dunsCode}</Col>
              </Row>
            </Col>
          </Row>
          <Row gutter={24} className={styles['information-item']}>
            <Col span={3} className={styles['information-item-label']}>
              {intl.get(`${promptCode}.view.message.taxpayerTypeMeaning`).d('纳税人标识')}:
            </Col>
            <Col span={21} className={styles['ainformation-item-children']}>
              {taxpayerTypeMeaning}
              <a
                style={{ paddingLeft: 15 }}
                target="_blank"
                rel="noopener noreferrer"
                disabled={isEmpty(licenceUrl)}
                href={licenceUrl}
              >
                <Icon type="download" />
                {intl.get(`${promptCode}.view.message.licenceUrl`).d('营业执照扫描件')}
              </a>
            </Col>
          </Row>
          <div className={styles['information-title']}>
            <span className={styles['vertical-line']} />
            <span>{intl.get(`${promptCode}.view.message.business`).d('业务信息')}</span>
          </div>
          <Row gutter={24} className={styles['information-item']}>
            <Col span={12}>
              <Row>
                <Col span={6} className={styles['information-item-label']}>
                  {intl.get(`${promptCode}.view.message.mainIdentity`).d('主要身份')}:
                </Col>
                <Col span={18}>{mainIdentityList.filter(n => n).join('/')}</Col>
              </Row>
            </Col>
            <Col span={12}>
              <Row>
                <Col span={6} className={styles['information-item-label']}>
                  {intl.get(`${promptCode}.view.message.businessNature`).d('经营性质')}:
                </Col>
                <Col span={18}>{businessNatureList.filter(n => n).join('/')}</Col>
              </Row>
            </Col>
          </Row>
          <Row gutter={24} className={styles['information-item']}>
            <Col span={3} className={styles['information-item-label']}>
              {intl.get(`${promptCode}.view.message.industryType`).d('行业类型')}:
            </Col>
            <Col span={21} className={styles['ainformation-item-children']}>
              {industryList.map((n, index) => {
                if (index === 0) {
                  return <span key={n.industryId}>{n.industryName}</span>;
                } else {
                  return <span key={n.industryId}>/{n.industryName}</span>;
                }
              })}
            </Col>
          </Row>
          <Row gutter={24} className={styles['information-item']}>
            <Col span={3} className={styles['information-item-label']}>
              {intl.get(`${promptCode}.view.message.mainCategory`).d('主营品类')}:
            </Col>
            <Col span={21} className={styles['ainformation-item-children']}>
              {industryCategoryList.map((n, index) => {
                if (index === 0) {
                  return <span key={n.categoryId}>{n.categoryName}</span>;
                } else {
                  return <span key={n.categoryId}>/{n.categoryName}</span>;
                }
              })}
            </Col>
          </Row>
          <Row gutter={24} className={styles['information-item']}>
            <Col span={3} className={styles['information-item-label']}>
              {intl.get(`${promptCode}.view.message.website`).d('公司官网')}:
            </Col>
            <Col span={21} className={styles['ainformation-item-children']}>
              {website}
              <a
                target="_blank"
                rel="noopener noreferrer"
                disabled={isEmpty(logoUrl)}
                href={logoUrl}
              >
                <Icon type="download" />
                {intl.get(`${promptCode}.view.message.logoUrl`).d('下载公司logo')}
              </a>
            </Col>
          </Row>
          <Row gutter={24} className={styles['information-item']}>
            <Col span={3} className={styles['information-item-label']}>
              {intl.get(`${promptCode}.view.message.description`).d('公司简介')}:
            </Col>
            <Col span={21} className={styles['ainformation-item-children']}>
              {description}
            </Col>
          </Row>
        </div>
      </Spin>
    );
  }
}
