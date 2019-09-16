/**
 * 企业信息 - 工商注册登记
 * @date: 2018-7-15
 * @author: niujiaqing <njq.niu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import React, { PureComponent } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Button,
  Select,
  Cascader,
  Row,
  Col,
  DatePicker,
  Radio,
  Icon,
} from 'hzero-ui';
import moment from 'moment';
import { isUndefined, isEmpty } from 'lodash';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';

import Lov from 'components/Lov';
import Checkbox from 'components/Checkbox';
import Upload from 'components/Upload/UploadButton';

import intl from 'utils/intl';
import {
  getAccessToken,
  getCurrentOrganizationId,
  isTenantRoleLevel,
  getAttachmentUrl,
} from 'utils/utils';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import styles from './index.less';

const { Item: FormItem } = Form;
const { Option } = Select;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

const submitFormLayout = {
  wrapperCol: { span: 14, offset: 6 },
};

const NAME_SPACE = 'enterpriseLegal';

@connect(modal => ({
  legal: modal[NAME_SPACE],
  saveLegalLoading: modal.loading.effects[`${NAME_SPACE}/saveLegalInfo`],
  saveOrgLegalLoading: modal.loading.effects[`${NAME_SPACE}/saveOrgLegalInfo`],
  organizationId: getCurrentOrganizationId(),
}))
@Form.create({ fieldNameProp: null })
export default class LegalForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentCountry: null,
      regionValue: '',
      cityData: [],
      currentTermFlag: undefined,
    };
  }

  componentDidMount() {
    const { dispatch, onRef, isTenant, organizationId } = this.props;
    if (onRef) onRef(this);
    const payload = {};
    if (isTenant) {
      payload.organizationId = organizationId;
    }
    dispatch({
      type: `${NAME_SPACE}/init`,
      payload,
    })
      // dispatch({
      //   type: `${NAME_SPACE}/queryCompanyName`,
      // });
      // this.fetchProvinceCity();
      .then(() => {
        const { data = {} } = this.props;
        this.fetchProvinceCity(data.registeredCountryId);
      });
  }

  @Bind()
  saveAndNext() {
    const { data = {}, form, dispatch, callback, isTenant } = this.props;
    const { regionValue } = this.state;

    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) return;

      let payload = {
        ...data,
        ...fieldsValue,
      };

      if (payload.domesticForeignRelation === 0) {
        const {
          unifiedSocialCode,
          companyType,
          taxpayerType,
          licenceEndDate,
          longTermFlag,
          ...otherFieldValues
        } = payload;
        payload = otherFieldValues;
      }
      if (!isUndefined(payload.registeredRegionId)) {
        if (regionValue.length > 0) {
          payload.registeredRegionId = regionValue[regionValue.length - 1];
        } else {
          payload.registeredRegionId = data.registeredRegionId;
        }
      }

      payload.buildDate = moment(payload.buildDate).format(DEFAULT_DATE_FORMAT);

      if (payload.licenceEndDate) {
        payload.licenceEndDate = moment(payload.licenceEndDate).format(DEFAULT_DATE_FORMAT);
      }

      if (isTenant) {
        payload.organizationId = getCurrentOrganizationId();
      }
      dispatch({
        type: `${NAME_SPACE}/${isTenant ? 'saveOrgLegalInfo' : 'saveLegalInfo'}`,
        payload,
      }).then(res => {
        if (res) {
          form.setFieldsValue({
            objectVersionNumber: res.objectVersionNumber,
          });
          if (callback) {
            callback(res);
          }
        }
      });
    });
  }

  // func是用户传入需要防抖的函数
  @Bind()
  debounce(func, wait = 500) {
    // 缓存一个定时器id
    let timer = 0;
    return function time(...args) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, wait);
    };
  }

  @Bind()
  unifiedSocialCodeValidator(rule, value, callback) {
    const { data = {}, dispatch } = this.props;
    if (rule.pattern.test(value)) {
      if (value) {
        dispatch({
          type: `${NAME_SPACE}/validateUnifiedSocialCode`,
          payload: {
            companyId: data.companyId,
            unifiedSocialCode: value,
          },
        }).then(res => {
          if (res && res.failed === true) {
            callback(res.message);
          } else {
            callback();
          }
        });
      } else {
        callback();
      }
    } else {
      callback(
        intl
          .get('spfm.enterprise.model.legal.unifiedSocialCodeRule')
          .d('由18位大写字母和数字混合组成')
      );
    }
  }

  @Bind()
  companyNameValidator(rule, value, callback) {
    const { data = {}, dispatch } = this.props;
    if (value) {
      dispatch({
        type: `${NAME_SPACE}/validateCompanyName`,
        payload: {
          companyId: data.companyId,
          companyName: value,
        },
      }).then(res => {
        if (res && res.failed === true) {
          callback(res.message);
        } else {
          callback();
        }
      });
    } else {
      callback();
    }
  }

  @Bind()
  handleCountryChange(value, record) {
    this.setState({
      currentCountry: record,
    });
    this.fetchProvinceCity(value);
  }

  @Bind()
  handleLongTermFlagChange(event) {
    const { form } = this.props;
    if (event.target.checked === 1) {
      form.setFieldsValue({
        licenceEndDate: null,
      });
    }
    this.setState({
      currentTermFlag: event.target.checked,
    });
  }

  fetchProvinceCity(value) {
    const { dispatch } = this.props;
    dispatch({
      type: `${NAME_SPACE}/queryDefaultCity`,
      payload: { countryId: value },
    }).then(res => {
      this.setState({
        cityData: res,
      });
    });
  }

  /**
   * 地区级联下拉框动态加载数据
   */
  @Bind()
  handleQueryCity(selectedOptions) {
    const { dispatch } = this.props;
    const lastOption = selectedOptions[selectedOptions.length - 1] || [];
    const { countryId, regionId } = lastOption;
    lastOption.loading = true;
    dispatch({
      type: `${NAME_SPACE}/queryCity`,
      payload: { countryId, regionId },
    }).then(res => {
      if (res) {
        const { cityData } = this.state;
        lastOption.loading = false;
        // 是否是最后一级地区
        if (!isEmpty(res)) {
          lastOption.children = res;
        }
        this.setState({
          cityData: [...cityData],
        });
      }
    });
  }

  // fetchRegionIds(id, cityList = []) {
  //   if (!id) return;
  //   const stack = [];
  //   const deepSearch = children => {
  //     let found = false;
  //     children.forEach(item => {
  //       if (!found) {
  //         if (item.regionId === id) {
  //           found = true;
  //         } else if (!found && item.children && item.children.length > 0) {
  //           found = deepSearch(item.children);
  //         }
  //         if (found) stack.push(item);
  //       }
  //     });
  //     return found;
  //   };
  //   deepSearch(cityList);
  //   return stack.reverse().map(item => item.regionId);
  // }

  @Bind()
  onUploadSuccess(file) {
    const { form, dispatch } = this.props;
    const TenantRoleLevel = isTenantRoleLevel();
    if (file) {
      form.setFieldsValue({
        licenceUrl: file.response,
      });
      if (TenantRoleLevel) {
        // -经过沟通租户级暂时不做ocr处理
        return false;
      } else {
        dispatch({
          type: `${NAME_SPACE}/fetchCompanyInfoFromOcr`,
          payload: {
            url: file.response,
          },
        });
      }
    }
  }

  @Bind()
  onRemoveSuccess() {
    const { form } = this.props;
    form.setFieldsValue({
      licenceUrl: null,
    });
  }

  uploadButton;

  @Bind()
  uploadRef(upload) {
    this.uploadButton = upload;
  }

  @Bind()
  isChinaCountry(countryCode) {
    const { currentCountry } = this.state;
    if (currentCountry === null) {
      return countryCode === 'CN';
    } else {
      return currentCountry.countryCode === 'CN';
    }
  }

  // @Bind()
  // validatorLicenceEndDate(rule, value, callback) {
  //   const { form } = this.props;
  //   const { buildDate, longTermFlag } = form.getFieldsValue(['buildDate', 'longTermFlag']);
  //   if (value && buildDate && !longTermFlag) {
  //     if (moment(value).unix() < moment(buildDate).unix()) {
  //       callback(
  //         intl.get('hzero.common.validation.date.before', {
  //           startDate: intl.get('spfm.enterprise.view.message.licenceEndDate').d('营业期限'),
  //           endDate: intl.get('spfm.enterprise.view.message.buildDate').d('成立日期'),
  //         })
  //       );
  //     }
  //     callback();
  //   } else {
  //     callback();
  //   }
  // }

  /**
   * 选择地区拼接
   */
  @Bind()
  handleSelectRegion(value, selectedOptions = []) {
    const { form } = this.props;
    const regionList = selectedOptions.map(region => {
      const { regionName } = region;
      return regionName;
    });
    const region = regionList.join('/');
    form.setFieldsValue({
      registeredRegionId: region,
    });
    this.setState({
      regionValue: value,
    });
  }

  @Bind()
  handleCascader() {
    const { cityData = [] } = this.state;
    return (
      <Cascader
        changeOnSelect
        showSearch={false}
        style={{ width: '100%' }}
        placeholder={intl.get('hzero.common.validation.requireSelect', {
          name: intl.get('spfm.enterprise.model.legal.registeredRegionId'),
        })}
        fieldNames={{ label: 'regionName', value: 'regionId' }}
        options={cityData || []}
        onChange={this.handleSelectRegion}
        loadData={selectedOptions => this.handleQueryCity(selectedOptions)}
      >
        <Icon type="down" />
      </Cascader>
    );
  }

  render() {
    const {
      form,
      data = {},
      legal = {},
      legal: { legalInfoOcr = {} },
      // saving = false,
      saveLegalLoading = false,
      saveOrgLegalLoading = false,
      buttonText = intl.get('hzero.common.button.save').d('保存'),
    } = this.props;
    const { currentTermFlag } = this.state;
    const { companyType = [], taxpayerType = [] } = legal;
    const { domesticForeignRelation = 1, longTermFlag = 0, licenceFilename, licenceUrl } = data;
    const statusControl = data.processStatus === 'SUBMIT';
    const fileList = [];
    if (licenceUrl && this.uploadButton) {
      const url = getAttachmentUrl(licenceUrl, 'spfm-comp', getCurrentOrganizationId());
      fileList.push({
        uid: licenceFilename,
        name: licenceFilename,
        thumbUrl: url,
        url: licenceUrl,
      });
    }
    // const companyName = data.companyName || comName;

    const { getFieldDecorator } = form;

    // const regionIds = this.fetchRegionIds(data.registeredRegionId, cityList);

    const accessToken = getAccessToken();
    const headers = {};
    if (accessToken) {
      headers.Authorization = `bearer ${accessToken}`;
    }

    return (
      <Form style={{ marginTop: 8, width: '720px' }}>
        {/* <img
          src={logo}
          height={160}
          style={{ marginLeft: '100px', marginBottom: '30px' }}
          alt="logo"
        /> */}

        <FormItem {...formItemLayout} label="认证地区">
          {getFieldDecorator('domesticForeignRelation', {
            initialValue: domesticForeignRelation,
          })(
            <Radio.Group disabled={statusControl}>
              <Radio.Button value={1}>境内机构</Radio.Button>
              <Radio.Button value={0}>境外机构</Radio.Button>
            </Radio.Group>
            // <Checkbox disabled={statusControl}>
            //   {intl.get('spfm.enterprise.view.message.domesticForeignRelation').d('我是境内机构')}
            // </Checkbox>
          )}
        </FormItem>
        {form.getFieldValue('domesticForeignRelation') === 1 && (
          <FormItem
            {...formItemLayout}
            label={intl
              .get('spfm.enterprise.model.legal.unifiedSocialCode')
              .d('统一社会信用代码号')}
            hasFeedback
          >
            {getFieldDecorator('unifiedSocialCode', {
              initialValue: legalInfoOcr.unifiedSocialCode
                ? legalInfoOcr.unifiedSocialCode
                : data.unifiedSocialCode,
              validateTrigger: 'onChange',
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.requireInput', {
                    name: intl.get('spfm.enterprise.model.legal.unifiedSocialCode'),
                  }),
                },
                {
                  pattern: /^[A-Z0-9]{18}$/,
                  validator: this.unifiedSocialCodeValidator,
                },
              ],
            })(<Input typeCase="upper" style={{ width: '200px' }} disabled={statusControl} />)}
          </FormItem>
        )}
        <FormItem
          {...formItemLayout}
          label={intl.get('spfm.enterprise.model.legal.companyName').d('企业名称')}
          hasFeedback
        >
          {getFieldDecorator('companyName', {
            initialValue: legalInfoOcr.companyName ? legalInfoOcr.companyName : data.companyName,
            validateTrigger: 'onBlur',
            rules: [
              {
                required: true,
                message: intl.get('hzero.common.validation.requireInput', {
                  name: intl.get('spfm.enterprise.model.legal.companyName'),
                }),
              },
              { max: 50, message: intl.get('hzero.common.validation.max', { max: 50 }) },
              {
                validator: this.companyNameValidator,
              },
            ],
          })(<Input disabled={statusControl} />)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={intl.get('spfm.enterprise.model.legal.shortName').d('企业简称')}
        >
          {getFieldDecorator('shortName', {
            initialValue: data.shortName,
            rules: [{ max: 15, message: intl.get('hzero.common.validation.max', { max: 15 }) }],
          })(<Input disabled={statusControl} />)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={intl
            .get('spfm.enterprise.model.legal.organizingInstitutionCode')
            .d('组织机构代码')}
        >
          {getFieldDecorator('organizingInstitutionCode', {
            initialValue: data.organizingInstitutionCode,
            rules: [
              { max: 30, message: intl.get('hzero.common.validation.max', { max: 30 }) },
              {
                pattern: /^[A-Z0-9]+$/,
                message: intl
                  .get(`spfm.enterprise.view.message.organizingInstitutionCode`)
                  .d('由大写字母及数字组成'),
              },
            ],
          })(<Input trimAll typeCase="upper" inputChinese={false} disabled={statusControl} />)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={intl.get('spfm.enterprise.model.legal.dunsCode').d('邓白氏编码')}
        >
          {getFieldDecorator('dunsCode', {
            initialValue: data.dunsCode,
            rules: [
              {
                required: form.getFieldValue('domesticForeignRelation') === 0,
                message: intl.get('hzero.common.validation.requireInput', {
                  name: intl.get('spfm.enterprise.model.legal.dunsCode'),
                }),
              },
              {
                pattern: /^[0-9]{9}$/,
                message: intl.get('spfm.enterprise.model.legal.dunsCodeRule').d('由9位数字组成'),
              },
            ],
          })(<Input style={{ width: '200px' }} disabled={statusControl} />)}
        </FormItem>
        {form.getFieldValue('domesticForeignRelation') === 1 && (
          <FormItem
            {...formItemLayout}
            label={intl.get('spfm.enterprise.model.legal.companyType').d('企业类型')}
          >
            {getFieldDecorator('companyType', {
              initialValue: legalInfoOcr.companyType ? legalInfoOcr.companyType : data.companyType,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.requireSelect', {
                    name: intl.get('spfm.enterprise.model.legal.companyType'),
                  }),
                },
              ],
            })(
              <Select style={{ width: '200px' }} disabled={statusControl}>
                {companyType.map(item => {
                  return (
                    <Option key={item.value} value={item.value}>
                      {item.meaning}
                    </Option>
                  );
                })}
              </Select>
            )}
          </FormItem>
        )}
        {form.getFieldValue('domesticForeignRelation') === 1 && (
          <FormItem
            {...formItemLayout}
            label={intl.get('spfm.enterprise.model.legal.taxpayerType').d('纳税人标识')}
          >
            {getFieldDecorator('taxpayerType', {
              initialValue: data.taxpayerType,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.requireSelect', {
                    name: intl.get('spfm.enterprise.model.legal.taxpayerType'),
                  }),
                },
              ],
            })(
              <Select style={{ width: '200px' }} disabled={statusControl}>
                {taxpayerType.map(item => {
                  return (
                    <Option key={item.value} value={item.value}>
                      {item.meaning}
                    </Option>
                  );
                })}
              </Select>
            )}
          </FormItem>
        )}
        <FormItem
          {...formItemLayout}
          label={intl.get('spfm.enterprise.view.message.registeredAddress').d('注册地址')}
          required
        >
          <Col span={8}>
            <FormItem>
              {getFieldDecorator('registeredCountryId', {
                initialValue: data.registeredCountryId,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.requireSelect', {
                      name: intl.get('spfm.enterprise.model.legal.registeredCountryId'),
                    }),
                  },
                ],
              })(
                <Lov
                  allowClear={false}
                  code="HPFM.COUNTRY"
                  queryParams={{ enabledFlag: 1 }}
                  disabled={statusControl}
                  textValue={data.registeredCountryName}
                  onChange={this.handleCountryChange}
                />
              )}
            </FormItem>
          </Col>
          {this.isChinaCountry(data.registeredCountryCode) && (
            <Col span={15} offset={1}>
              <FormItem className={styles['legal-input']}>
                {getFieldDecorator('registeredRegionId', {
                  initialValue: data.regionPathName,
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.requireSelect', {
                        name: intl.get('spfm.enterprise.model.legal.registeredRegionId'),
                      }),
                    },
                  ],
                })(
                  <Input
                    style={{
                      verticalAlign: 'middle',
                      position: 'relative',
                      top: '-1px',
                    }}
                    disabled={statusControl}
                    addonAfter={this.handleCascader()}
                  />
                )}
              </FormItem>
            </Col>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={intl.get('spfm.enterprise.model.legal.addressDetail').d('详细地址')}
          required
        >
          {getFieldDecorator('addressDetail', {
            initialValue: legalInfoOcr.addressDetail
              ? legalInfoOcr.addressDetail
              : data.addressDetail,
            rules: [
              {
                required: true,
                message: intl.get('hzero.common.validation.requireInput', {
                  name: intl.get('spfm.enterprise.model.legal.addressDetail'),
                }),
              },
            ],
          })(
            <Input
              placeholder={intl.get('hzero.common.validation.requireInput', {
                name: intl.get('spfm.enterprise.model.legal.addressDetail'),
              })}
              disabled={statusControl}
            />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={intl.get('spfm.enterprise.view.message.legalRepName').d('法定代表人')}
        >
          {getFieldDecorator('legalRepName', {
            initialValue: legalInfoOcr.legalRepName ? legalInfoOcr.legalRepName : data.legalRepName,
            rules: [
              {
                required: true,
                message: intl.get('hzero.common.validation.requireInput', {
                  name: intl.get('spfm.enterprise.model.legal.legalRepName'),
                }),
              },
            ],
          })(<Input style={{ width: '200px' }} disabled={statusControl} />)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={intl.get('spfm.enterprise.view.message.registeredCapital').d('注册资本')}
        >
          {getFieldDecorator('registeredCapital', {
            initialValue: data.registeredCapital,
          })(
            <InputNumber
              style={{ width: '100px' }}
              precision={0}
              min={0}
              disabled={statusControl}
            />
          )}
          <span style={{ paddingLeft: '12px' }}>
            {intl.get('hzero.common.currency.ten.thousand').d('万元')}
          </span>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={intl.get('spfm.enterprise.view.message.buildDate').d('成立日期')}
        >
          {getFieldDecorator('buildDate', {
            initialValue: legalInfoOcr.buildDate
              ? moment(legalInfoOcr.buildDate)
              : data.buildDate
              ? moment(data.buildDate)
              : null,
            rules: [
              {
                required: true,
                message: intl.get('hzero.common.validation.requireSelect', {
                  name: intl.get('spfm.enterprise.model.legal.buildDate'),
                }),
              },
            ],
          })(
            <DatePicker
              style={{ width: '200px' }}
              disabled={statusControl}
              disabledDate={currentDate =>
                form.getFieldValue('licenceEndDate') &&
                moment(form.getFieldValue('licenceEndDate')).isBefore(currentDate, 'day')
              }
            />
          )}
        </FormItem>
        {form.getFieldValue('domesticForeignRelation') === 1 && (
          <FormItem
            {...formItemLayout}
            label={intl.get('spfm.enterprise.view.message.licenceEndDate').d('营业期限')}
          >
            <Row>
              <Col span={12}>
                {getFieldDecorator('licenceEndDate', {
                  initialValue: legalInfoOcr.licenceEndDate
                    ? moment(legalInfoOcr.licenceEndDate)
                    : data.licenceEndDate
                    ? moment(data.licenceEndDate)
                    : null,
                  rules: [
                    {
                      required: isUndefined(currentTermFlag) ? !longTermFlag : !currentTermFlag,
                      message: intl.get('hzero.common.validation.requireSelect', {
                        name: intl.get('spfm.enterprise.view.message.licenceEndDate').d('营业期限'),
                      }),
                    },
                    // {
                    //   validator: this.validatorLicenceEndDate,
                    // },
                  ],
                })(
                  <DatePicker
                    disabled={isUndefined(currentTermFlag) ? longTermFlag : currentTermFlag}
                    disabledDate={currentDate =>
                      form.getFieldValue('buildDate') &&
                      moment(form.getFieldValue('buildDate')).isAfter(currentDate, 'day')
                    }
                    style={{ width: '200px' }}
                  />
                )}
              </Col>
              <Col span={10} offset={2}>
                {getFieldDecorator('longTermFlag', {
                  initialValue: legalInfoOcr.longTermFlag
                    ? legalInfoOcr.longTermFlag
                    : longTermFlag,
                })(
                  <Checkbox onChange={this.handleLongTermFlagChange} disabled={statusControl}>
                    {intl.get('spfm.enterprise.view.message.longTerm').d('长期')}
                  </Checkbox>
                )}
              </Col>
            </Row>
          </FormItem>
        )}
        <FormItem
          {...formItemLayout}
          label={intl.get('spfm.enterprise.view.message.businessScope').d('经营范围')}
        >
          {getFieldDecorator('businessScope', {
            initialValue: data.businessScope,
          })(<Input.TextArea rows={6} disabled={statusControl} />)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={
            form.getFieldValue('domesticForeignRelation') === 1
              ? intl.get('spfm.enterprise.view.message.businessLicense').d('营业执照')
              : intl.get('spfm.enterprise.view.message.registrationCertificate').d('企业登记证件')
          }
          extra={intl
            .get('hzero.common.upload.support', { type: '*.jpg;*.png;*.jpeg;' })
            .d('上传格式：*.jpg;*.png;*.jpeg;')}
        >
          {getFieldDecorator('licenceUrl', {
            initialValue: data.licenceUrl,
            rules: [
              {
                required: true,
                message: '请上传营业执照',
              },
            ],
          })(<div />)}
          <Upload
            disabled={statusControl}
            onRef={this.uploadRef}
            fileType="image/jpeg;image/png"
            viewOnly={statusControl}
            showRemoveIcon={false}
            single
            bucketName="spfm-comp"
            fileList={fileList}
            onUploadSuccess={this.onUploadSuccess}
            onRemoveSuccess={this.onRemoveSuccess}
            text={
              form.getFieldValue('domesticForeignRelation') === 1
                ? intl.get('spfm.enterprise.view.message.businessLicense')
                : intl.get('spfm.enterprise.view.message.registrationCertificate')
            }
          />
        </FormItem>

        {getFieldDecorator('objectVersionNumber', {
          initialValue: data.objectVersionNumber,
        })(<div />)}
        {/* {getFieldDecorator('registeredCountryName', {
          initialValue: data.registeredCountryName,
        })(<div />)} */}
        <FormItem {...submitFormLayout} style={{ marginTop: 40 }}>
          {!statusControl ? (
            <Button
              type="primary"
              onClick={this.debounce(this.saveAndNext, 500)}
              loading={saveLegalLoading || saveOrgLegalLoading}
            >
              {buttonText}
            </Button>
          ) : (
            ''
          )}
        </FormItem>
      </Form>
    );
  }
}
