import React, { PureComponent } from 'react';
import { Form, Input, Row, Col, Checkbox, Icon, Select, Spin } from 'hzero-ui';
import { isEmpty } from 'lodash';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import { HZERO_FILE } from 'utils/config';
import { isTenantRoleLevel, getAccessToken, getUserOrganizationId } from 'utils/utils';
import failedImg from '@/assets/authentication-failed.svg';
import successImg from '@/assets/authentication-success.svg';

const FormItem = Form.Item;
const { TextArea } = Input;
const CheckboxGroup = Checkbox.Group;
const formLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

export default class EnterpriseInfoForm extends PureComponent {
  @Bind()
  validator(rule, value, callback) {
    const { isReject } = this.props;
    if (isEmpty(value) && isReject) {
      callback(intl.get('spfm.certificationApproval.view.validate.approve').d('请填写审批意见'));
    }
    callback();
  }

  setCheckboxGroupValues = (data = []) => data.map(n => (n.enabledFlag === 1 ? n.key : undefined));

  domesticForeignRelationMeaning = {
    0: intl.get('spfm.certificationApproval.view.select.overseas').d('境外'),
    1: intl.get('spfm.certificationApproval.view.select.domestic').d('境内'),
  };

  render() {
    const {
      certificationStatus,
      form: { getFieldDecorator },
      suppressionWarning,
      dataSource = {},
      loading,
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
      manufuctuerFlag,
      traderFlag,
      servicerFlag,
      website,
      description,
      logoUrl,
    } = dataSource;

    // 重定向url
    const bucketName = 'spfm-comp';
    // 营业执照
    const licenceNewUrl = `${HZERO_FILE}/v1${
      isTenantRoleLevel() ? `/${getUserOrganizationId()}/` : '/'
    }files/redirect-url?bucketName=${bucketName}&url=${licenceUrl}&organizationId=${getUserOrganizationId()}&access_token=${getAccessToken()}`;
    // logoUrl
    const logoNewUrl = `${HZERO_FILE}/v1${
      isTenantRoleLevel() ? `/${getUserOrganizationId()}/` : '/'
    }files/redirect-url?bucketName=${bucketName}&url=${logoUrl}&organizationId=${getUserOrganizationId()}&access_token=${getAccessToken()}`;

    return (
      <Spin spinning={loading}>
        <Form>
          <Row>
            <Col span={18}>
              <FormItem
                label={intl
                  .get('spfm.certificationApproval.model.detailForm.processMsg')
                  .d('审批意见')}
              >
                {getFieldDecorator('processMsg', {
                  rules: [{ validator: this.validator }],
                })(
                  <TextArea
                    style={{ width: 700 }}
                    autosize
                    rows={4}
                    onChange={suppressionWarning}
                  />
                )}
              </FormItem>
            </Col>
            {certificationStatus === 'FAIL' && (
              <Col span={6}>
                <img
                  alt=""
                  src={failedImg}
                  style={{ display: 'block', width: '140px', height: '120px' }}
                />
              </Col>
            )}
            {certificationStatus === 'PASS' && (
              <Col span={6}>
                <img
                  alt=""
                  src={successImg}
                  style={{ display: 'block', width: '140px', height: '120px' }}
                />
              </Col>
            )}
          </Row>
          <br />
          <h2>{intl.get('spfm.certificationApproval.view.title.companyInfo').d('企业信息')}</h2>
          <h3>{intl.get('spfm.certificationApproval.view.title.registerInfo').d('登记信息')}</h3>
          <Row gutter={8}>
            <Col span={6}>
              <FormItem
                label={intl
                  .get('spfm.certificationApproval.model.detailForm.companyName')
                  .d('名称')}
                {...formLayout}
              >
                {getFieldDecorator('companyName', { initialValue: companyName })(
                  <Input disabled />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                label={intl
                  .get('spfm.certificationApproval.model.detailForm.companyTypeMeaning')
                  .d('类型')}
                {...formLayout}
              >
                {getFieldDecorator('companyTypeMeaning', { initialValue: companyTypeMeaning })(
                  <Input disabled />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                label={intl
                  .get('spfm.certificationApproval.model.detailForm.registeredCountryName')
                  .d('注册国家')}
                {...formLayout}
              >
                {getFieldDecorator('registeredCountryName', {
                  initialValue: registeredCountryName,
                })(<Input disabled />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col span={6}>
              <FormItem
                label={intl
                  .get('spfm.certificationApproval.model.detailForm.registeredRegionName')
                  .d('注册地址')}
                {...formLayout}
              >
                {getFieldDecorator('registeredRegionName', { initialValue: registeredRegionName })(
                  <Input disabled />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem>
                {getFieldDecorator('addressDetail', { initialValue: addressDetail })(
                  <Input disabled />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                label={intl
                  .get('spfm.certificationApproval.model.detailForm.legalRepName')
                  .d('法定代表人')}
                {...formLayout}
              >
                {getFieldDecorator('legalRepName', { initialValue: legalRepName })(
                  <Input disabled />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col span={6}>
              <FormItem
                label={intl
                  .get('spfm.certificationApproval.model.detailForm.registeredCapital')
                  .d('注册资本')}
                {...formLayout}
              >
                {getFieldDecorator('registeredCapital', { initialValue: registeredCapital })(
                  <Input disabled />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                label={intl
                  .get('spfm.certificationApproval.model.detailForm.buildDate')
                  .d('成立日期')}
                {...formLayout}
              >
                {getFieldDecorator('buildDate', { initialValue: buildDate })(<Input disabled />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                label={intl
                  .get('spfm.certificationApproval.model.detailForm.licenceEndDate')
                  .d('营业期限')}
                {...formLayout}
              >
                {getFieldDecorator('licenceEndDate', { initialValue: licenceEndDate })(
                  <Input disabled />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                label={intl
                  .get('spfm.certificationApproval.model.detailForm.longTermFlag')
                  .d('长期')}
                {...formLayout}
              >
                {getFieldDecorator('longTermFlag', {
                  valuePropName: 'checked',
                  initialValue: longTermFlag === 1,
                })(<Checkbox disabled />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <FormItem
              label={intl
                .get('spfm.certificationApproval.model.detailForm.businessScope')
                .d('经营范围')}
              wrapperCol={{ span: 18 }}
              labelCol={{ span: 2 }}
            >
              {getFieldDecorator('businessScope', { initialValue: businessScope })(
                <TextArea disabled rows={4} autosize />
              )}
            </FormItem>
          </Row>
          <Row gutter={8}>
            <Col span={6}>
              <FormItem
                label={intl.get('spfm.certificationApproval.model.detailForm.shortName').d('简称')}
                {...formLayout}
              >
                {getFieldDecorator('shortName', { initialValue: shortName })(<Input disabled />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                label={intl
                  .get('spfm.certificationApproval.model.detailForm.domesticForeignRelation')
                  .d('境内外关系')}
                {...formLayout}
              >
                <Input
                  disabled
                  value={this.domesticForeignRelationMeaning[domesticForeignRelation]}
                />
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="D-U-N-S" {...formLayout}>
                {getFieldDecorator('dunsCode', { initialValue: dunsCode })(<Input disabled />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col span={6}>
              <FormItem
                label={intl
                  .get('spfm.certificationApproval.model.detailForm.taxpayerType')
                  .d('纳税人标识')}
                {...formLayout}
              >
                {getFieldDecorator('taxpayerType', { initialValue: taxpayerTypeMeaning })(
                  <Input disabled />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem wrapperCol={{ span: 18, offset: 1 }}>
                <a
                  rel="noopener noreferrer"
                  target="_blank"
                  disabled={isEmpty(licenceUrl)}
                  href={licenceNewUrl}
                >
                  <Icon type="download" />
                  {intl
                    .get('spfm.certificationApproval.model.detailForm.licenceUrl')
                    .d('营业执照扫描件')}
                </a>
              </FormItem>
            </Col>
          </Row>
          <br />
          <h3>{intl.get('spfm.certificationApproval.view.title.businessInfo').d('业务信息')}</h3>
          <Row gutter={8}>
            <Col span={6}>
              <FormItem
                label={intl
                  .get('spfm.certificationApproval.model.detailForm.primaryIdentity')
                  .d('主要身份')}
                {...formLayout}
              >
                {getFieldDecorator('primaryIdentity', {
                  initialValue: this.setCheckboxGroupValues([
                    { key: 'saleFlag', enabledFlag: saleFlag },
                    { key: 'purchaseFlag', enabledFlag: purchaseFlag },
                  ]),
                })(
                  <CheckboxGroup
                    disabled
                    options={[
                      {
                        label: intl
                          .get('spfm.certificationApproval.model.detailForm.saleFlag')
                          .d('我要销售'),
                        value: 'saleFlag',
                      },
                      {
                        label: intl
                          .get('spfm.certificationApproval.model.detailForm.purchaseFlag')
                          .d('我要采购'),
                        value: 'purchaseFlag',
                      },
                    ]}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                label={intl
                  .get('spfm.certificationApproval.model.detailForm.businessNature')
                  .d('经营性质')}
                {...formLayout}
                labelCol={{ span: 6 }}
              >
                {getFieldDecorator('businessNature', {
                  initialValue: this.setCheckboxGroupValues([
                    { key: 'manufuctuerFlag', enabledFlag: manufuctuerFlag },
                    { key: 'traderFlag', enabledFlag: traderFlag },
                    { key: 'servicerFlag', enabledFlag: servicerFlag },
                  ]),
                })(
                  <CheckboxGroup
                    disabled
                    options={[
                      {
                        label: intl
                          .get('spfm.certificationApproval.model.detailForm.manufuctuerFlag')
                          .d('制造商'),
                        value: 'manufuctuerFlag',
                      },
                      {
                        label: intl
                          .get('spfm.certificationApproval.model.detailForm.traderFlag')
                          .d('贸易商'),
                        value: 'traderFlag',
                      },
                      {
                        label: intl
                          .get('spfm.certificationApproval.model.detailForm.servicerFlag')
                          .d('服务商'),
                        value: 'servicerFlag',
                      },
                    ]}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <FormItem
              label={intl
                .get('spfm.certificationApproval.model.detailForm.industryList')
                .d('行业类型')}
              wrapperCol={{ span: 18 }}
              labelCol={{ span: 2 }}
            >
              {getFieldDecorator('industryList', {
                initialValue: industryList.map(n => n.industryName),
              })(<Select mode="multiple" disabled style={{ width: 550 }} />)}
            </FormItem>
          </Row>
          <Row gutter={8}>
            <FormItem
              label={intl
                .get('spfm.certificationApproval.model.detailForm.industryCategoryList')
                .d('主营品类')}
              wrapperCol={{ span: 18 }}
              labelCol={{ span: 2 }}
            >
              {getFieldDecorator('industryCategoryList', {
                initialValue: industryCategoryList.map(n => n.categoryName),
              })(<Select mode="multiple" disabled style={{ width: 550 }} />)}
            </FormItem>
          </Row>
          <Row gutter={8}>
            <Col span={6}>
              <FormItem
                label={intl
                  .get('spfm.certificationApproval.model.detailForm.website')
                  .d('公司官网')}
                {...formLayout}
              >
                {getFieldDecorator('website', { initialValue: website })(<Input disabled />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem wrapperCol={{ span: 18, offset: 1 }}>
                <a
                  rel="noopener noreferrer"
                  target="_blank"
                  disabled={isEmpty(logoUrl)}
                  href={logoNewUrl}
                >
                  <Icon type="download" />
                  {intl
                    .get('spfm.certificationApproval.model.detailForm.logoUrl')
                    .d('下载公司 Logo')}
                </a>
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <FormItem
              label={intl
                .get('spfm.certificationApproval.model.detailForm.description')
                .d('公司简介')}
              wrapperCol={{ span: 18 }}
              labelCol={{ span: 2 }}
            >
              {getFieldDecorator('description', { initialValue: description })(
                <TextArea disabled rows={4} autosize />
              )}
            </FormItem>
          </Row>
        </Form>
      </Spin>
    );
  }
}
