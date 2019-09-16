import React from 'react';
import { isFunction, parseInt, isNaN, map } from 'lodash';
import { Form, Select, Input, Row, Col } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import Checkbox from 'components/Checkbox';
import { EMAIL, PHONE } from 'utils/regExp';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';

const FormItem = Form.Item;
const { Option } = Select;

@formatterCollections({ code: ['spfm.contactPerson'] })
@Form.create({ fieldNameProp: null })
export default class ContactPersonForm extends React.PureComponent {
  componentDidMount() {
    const { getDataHook } = this.props;
    if (isFunction(getDataHook)) {
      getDataHook(this.getData);
    }
  }

  @Bind()
  getData() {
    const { form, initialValue = {} } = this.props;
    return new Promise((resolve, reject) => {
      form.validateFields((err, values) => {
        if (err) {
          reject();
        } else {
          const gender = parseInt(values.gender);
          resolve(Object.assign({}, initialValue, values, { gender: isNaN(gender) ? 1 : gender }));
        }
      });
    });
  }

  /**
   * 默认值改变
   * @memberof ContactPersonForm
   */
  @Bind()
  handleDefaultChange(e) {
    if (e.target.checked === 1) {
      const { form } = this.props;
      form.setFieldsValue({ enabledFlag: 1 });
    }
  }

  @Bind()
  renderCreateForm() {
    const { form, $ID_OPTIONS = [], idd = [], gender = [] } = this.props;
    const { getFieldDecorator } = form;
    const labelCol = { md: 6 };
    const wrapperCol = { md: 18 };
    return (
      <Row>
        <Col md={12}>
          <FormItem
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            label={intl.get('spfm.contactPerson.model.contactPerson.name').d('姓名')}
          >
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: intl
                    .get('hzero.common.validation.notNull', {
                      name: intl.get('spfm.contactPerson.model.contactPerson.name').d('姓名'),
                    })
                    .d('姓名不能为空'),
                },
              ],
            })(<Input />)}
          </FormItem>
        </Col>
        <Col md={12}>
          <FormItem
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            label={intl.get('spfm.contactPerson.model.contactPerson.gender').d('性别')}
          >
            {getFieldDecorator('gender', {
              rules: [
                {
                  required: true,
                  message: intl
                    .get('hzero.common.validation.notNull', {
                      name: intl.get('spfm.contactPerson.model.contactPerson.gender').d('性别'),
                    })
                    .d('性别不能为空'),
                },
              ],
            })(
              <Select style={{ width: '100%' }}>
                {map(gender, r => {
                  return (
                    <Option key={r.value} value={r.value}>
                      {r.meaning}
                    </Option>
                  );
                })}
              </Select>
            )}
          </FormItem>
        </Col>
        <Col md={12}>
          <FormItem
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            label={intl.get('spfm.contactPerson.model.contactPerson.mail').d('邮箱')}
          >
            {getFieldDecorator('mail', {
              validateTrigger: 'onBlur',
              rules: [
                {
                  required: true,
                  message: intl
                    .get('hzero.common.validation.notNull', {
                      name: intl.get('spfm.contactPerson.model.contactPerson.mail').d('邮箱'),
                    })
                    .d('邮箱不能为空'),
                },
                {
                  pattern: EMAIL,
                  message: intl.get('hzero.common.validation.email').d('邮箱格式不正确'),
                },
              ],
            })(<Input />)}
          </FormItem>
        </Col>
        <Col md={12}>
          <FormItem
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            label={intl.get('spfm.contactPerson.model.contactPerson.mobilephone').d('手机号码')}
          >
            {getFieldDecorator('mobilephone', {
              validateTrigger: 'onBlur',
              rules: [
                {
                  required: true,
                  message: intl
                    .get('hzero.common.validation.notNull', {
                      name: intl
                        .get('spfm.contactPerson.model.contactPerson.mobilephone')
                        .d('手机号码'),
                    })
                    .d('手机号码不能为空'),
                },
                {
                  pattern: PHONE,
                  message: intl.get('hzero.common.validation.phone').d('手机格式不正确'),
                },
              ],
            })(
              <Input
                addonBefore={getFieldDecorator('internationalTelCode', {
                  initialValue: (idd[0] && idd[0].value) || '+86',
                })(
                  <Select>
                    {map(idd, r => {
                      return (
                        <Option key={r.value} value={r.value}>
                          {r.meaning}
                        </Option>
                      );
                    })}
                  </Select>
                )}
              />
            )}
          </FormItem>
        </Col>
        <Col md={12}>
          <FormItem
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            label={intl.get('spfm.contactPerson.model.contactPerson.idType').d('证件类型')}
          >
            {getFieldDecorator('idType')(<Select style={{ width: '100%' }}>{$ID_OPTIONS}</Select>)}
          </FormItem>
        </Col>
        <Col md={12}>
          <FormItem
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            label={intl.get('spfm.contactPerson.model.contactPerson.idNum').d('证件号码')}
          >
            {getFieldDecorator('idNum')(<Input />)}
          </FormItem>
        </Col>
        <Col md={12}>
          <FormItem
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            label={intl.get('spfm.contactPerson.model.contactPerson.department').d('部门')}
          >
            {getFieldDecorator('department')(<Input />)}
          </FormItem>
        </Col>
        <Col md={12}>
          <FormItem
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            label={intl.get('spfm.contactPerson.model.contactPerson.position').d('职位')}
          >
            {getFieldDecorator('position')(<Input />)}
          </FormItem>
        </Col>
        <Col md={12}>
          <FormItem
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            label={intl.get('spfm.contactPerson.model.contactPerson.telephone').d('固定电话')}
          >
            {getFieldDecorator('telephone')(<Input />)}
          </FormItem>
        </Col>
        <Col md={12}>
          <FormItem
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            label={intl.get('hzero.common.remark').d('备注')}
          >
            {getFieldDecorator('description')(<Input />)}
          </FormItem>
        </Col>
        <Col md={12}>
          <FormItem
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            label={intl.get('spfm.contactPerson.model.contactPerson.default').d('默认')}
          >
            {getFieldDecorator('defaultFlag', {
              initialValue: 1,
            })(<Checkbox onChange={this.handleDefaultChange} />)}
          </FormItem>
        </Col>
        <Col md={12}>
          <FormItem
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            label={intl.get('spfm.contactPerson.model.contactPerson.enabled').d('启用')}
          >
            {getFieldDecorator('enabledFlag', {
              initialValue: 1,
            })(<Checkbox disabled={form.getFieldValue('defaultFlag') === 1} />)}
          </FormItem>
        </Col>
      </Row>
    );
  }

  @Bind()
  renderEditForm() {
    const { form, initialValue = {}, $ID_OPTIONS = [], idd = [], gender = [] } = this.props;
    const { getFieldDecorator } = form;
    const labelCol = { md: 6 };
    const wrapperCol = { md: 18 };
    return (
      <Row>
        <Col md={12}>
          <FormItem
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            label={intl.get('spfm.contactPerson.model.contactPerson.name').d('姓名')}
          >
            {getFieldDecorator('name', {
              initialValue: initialValue.name,
              rules: [
                {
                  required: true,
                  message: intl
                    .get('hzero.common.validation.notNull', {
                      name: intl.get('spfm.contactPerson.model.contactPerson.name').d('姓名'),
                    })
                    .d('姓名不能为空'),
                },
              ],
            })(<Input />)}
          </FormItem>
        </Col>
        <Col md={12}>
          <FormItem
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            label={intl.get('spfm.contactPerson.model.contactPerson.gender').d('性别')}
          >
            {getFieldDecorator('gender', {
              initialValue: isNaN(initialValue.gender) ? undefined : `${initialValue.gender}`,
              rules: [
                {
                  required: true,
                  message: intl
                    .get('hzero.common.validation.notNull', {
                      name: intl.get('spfm.contactPerson.model.contactPerson.gender').d('性别'),
                    })
                    .d('性别不能为空'),
                },
              ],
            })(
              <Select style={{ width: '100%' }}>
                {map(gender, r => {
                  return (
                    <Option key={r.value} value={r.value}>
                      {r.meaning}
                    </Option>
                  );
                })}
              </Select>
            )}
          </FormItem>
        </Col>
        <Col md={12}>
          <FormItem
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            label={intl.get('spfm.contactPerson.model.contactPerson.mail').d('邮箱')}
          >
            {getFieldDecorator('mail', {
              initialValue: initialValue.mail,
              rules: [
                {
                  required: true,
                  message: intl
                    .get('hzero.common.validation.notNull', {
                      name: intl.get('spfm.contactPerson.model.contactPerson.mail').d('邮箱'),
                    })
                    .d('邮箱不能为空'),
                },
                {
                  pattern: EMAIL,
                  message: intl.get('hzero.common.validation.email').d('邮箱格式不正确'),
                },
              ],
            })(<Input />)}
          </FormItem>
        </Col>
        <Col md={12}>
          <FormItem
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            label={intl.get('spfm.contactPerson.model.contactPerson.mobilephone').d('手机号码')}
          >
            {getFieldDecorator('mobilephone', {
              initialValue: initialValue.mobilephone,
              rules: [
                {
                  required: true,
                  message: intl
                    .get('hzero.common.validation.notNull', {
                      name: intl
                        .get('spfm.contactPerson.model.contactPerson.mobilephone')
                        .d('手机号码'),
                    })
                    .d('手机号码不能为空'),
                },
                {
                  pattern: PHONE,
                  message: intl.get('hzero.common.validation.phone').d('手机格式不正确'),
                },
              ],
            })(
              <Input
                addonBefore={getFieldDecorator('internationalTelCode', {
                  initialValue: (idd[0] && idd[0].value) || '+86',
                })(
                  <Select>
                    {map(idd, r => {
                      return (
                        <Option key={r.value} value={r.value}>
                          {r.meaning}
                        </Option>
                      );
                    })}
                  </Select>
                )}
              />
            )}
          </FormItem>
        </Col>
        <Col md={12}>
          <FormItem
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            label={intl.get('spfm.contactPerson.model.contactPerson.idType').d('证件类型')}
          >
            {getFieldDecorator('idType', {
              initialValue: initialValue.idType,
            })(<Select style={{ width: '100%' }}>{$ID_OPTIONS}</Select>)}
          </FormItem>
        </Col>
        <Col md={12}>
          <FormItem
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            label={intl.get('spfm.contactPerson.model.contactPerson.idNum').d('证件号码')}
          >
            {getFieldDecorator('idNum', {
              initialValue: initialValue.idNum,
            })(<Input />)}
          </FormItem>
        </Col>
        <Col md={12}>
          <FormItem
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            label={intl.get('spfm.contactPerson.model.contactPerson.department').d('部门')}
          >
            {getFieldDecorator('department', {
              initialValue: initialValue.department,
            })(<Input />)}
          </FormItem>
        </Col>
        <Col md={12}>
          <FormItem
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            label={intl.get('spfm.contactPerson.model.contactPerson.position').d('职位')}
          >
            {getFieldDecorator('position', {
              initialValue: initialValue.position,
            })(<Input />)}
          </FormItem>
        </Col>
        <Col md={12}>
          <FormItem
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            label={intl.get('spfm.contactPerson.model.contactPerson.telephone').d('固定电话')}
          >
            {getFieldDecorator('telephone', {
              initialValue: initialValue.telephone,
            })(<Input />)}
          </FormItem>
        </Col>
        <Col md={12}>
          <FormItem
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            label={intl.get('hzero.common.remark').d('备注')}
          >
            {getFieldDecorator('description', {
              initialValue: initialValue.description,
            })(<Input />)}
          </FormItem>
        </Col>
        <Col md={12}>
          <FormItem
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            label={intl.get('spfm.contactPerson.model.contactPerson.default').d('默认')}
          >
            {getFieldDecorator('defaultFlag', {
              initialValue: initialValue.defaultFlag,
            })(<Checkbox onChange={this.handleDefaultChange} />)}
          </FormItem>
        </Col>
        <Col md={12}>
          <FormItem
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            label={intl.get('spfm.contactPerson.model.contactPerson.enabled').d('启用')}
          >
            {getFieldDecorator('enabledFlag', {
              initialValue: initialValue.enabledFlag,
            })(<Checkbox disabled={form.getFieldValue('defaultFlag') === 1} />)}
          </FormItem>
        </Col>
      </Row>
    );
  }

  @Bind()
  renderForm() {
    const { isCreate } = this.props;
    if (isCreate) {
      return this.renderCreateForm();
    } else {
      return this.renderEditForm();
    }
  }

  render() {
    return <Form>{this.renderForm()}</Form>;
  }
}
