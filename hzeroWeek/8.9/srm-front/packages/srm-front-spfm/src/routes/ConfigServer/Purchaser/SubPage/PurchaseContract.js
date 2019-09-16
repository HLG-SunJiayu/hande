/*
 * 配置中心 - 采购协议
 * @date: 2019-05-13
 * @author: HB <bin.huang02@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import React from 'react';
import { Row, Col, Form, Select } from 'hzero-ui';
import intl from 'utils/intl';
import classnames from 'classnames';
import { Bind } from 'lodash-decorators';

import Checkbox from 'components/Checkbox';

import SubMessage from '../../components/SubMessage';
import SubCheckBox from '../../components/SubCheckBox';
import styles from './index.less';

const purchaseContractPrompt = 'spfm.configServer.view.purchaseContract';

@Form.create({ fieldNameProp: null })
export default class PurchaseContract extends React.Component {
  constructor(props) {
    super(props);
    props.onRef(this);
    this.state = {
      disabled010604: props.settings['010603'] || false,
    };
  }

  handleSingleRule() {
    const { handleModal } = this.props;
    if (handleModal) {
      handleModal('splitOrderRulesVisible', true);
    }
  }

  @Bind()
  handleChange010603(e) {
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({ '010604': 0 });
    this.setState({ disabled010604: e.target.checked === 1 });
  }

  render() {
    const { disabled010604 } = this.state;
    const {
      settings,
      form: { getFieldDecorator, getFieldValue },
      enumMap = {},
    } = this.props;
    const { pcApprovalMethod = [] } = enumMap;
    return (
      <Row className="tab-content" id="purchaseContract">
        <Col span={3}>
          <span className="label-col">
            {intl.get(`${purchaseContractPrompt}.message.title`).d('采购协议')}:
          </span>
        </Col>
        <Col span={21} className="sub-item-right">
          <Row>
            <Col span={24}>
              {intl.get(`${purchaseContractPrompt}.message.010601label`).d('采购协议审批')}
            </Col>
            <Col
              span={24}
              className={classnames('sub-item-fields', styles['flex-form-item'])}
              style={{ marginTop: '-10px', lineHeight: '39px' }}
            >
              {getFieldDecorator('010601', {
                initialValue: settings['010601'],
              })(
                <Checkbox>
                  {intl.get(`${purchaseContractPrompt}.message.010601`).d('启用SRM采购协议审批')}
                </Checkbox>
              )}
              {getFieldValue('010601') === 1 && (
                <Form.Item>
                  {getFieldDecorator('010602', {
                    initialValue: settings['010602'],
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl
                            .get(`${purchaseContractPrompt}.message.010601`)
                            .d('启用SRM采购申请审批'),
                        }),
                      },
                    ],
                  })(
                    <Select showSearch style={{ width: '150px' }} allowClear>
                      {pcApprovalMethod.map(item => (
                        <Select.Option key={item.value} value={item.value}>
                          {item.meaning}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              )}
            </Col>
            <SubMessage
              content={intl
                .get(`${purchaseContractPrompt}.message.010601subMsg`)
                .d('勾选启用，则采购协议需在SRM进行审批，工作流审批需配合工作流定义使用。')}
            />
          </Row>
          <Row className="sub-item">
            <Col span={24}>
              {intl.get(`${purchaseContractPrompt}.message.010603label`).d('在线编辑')}
            </Col>
            <SubCheckBox
              content={intl.get(`${purchaseContractPrompt}.message.010603`).d('启用在线编辑')}
              getFieldDecorator={getFieldDecorator}
              initialValue={settings['010603']}
              onChange={this.handleChange010603}
              field="010603"
            />
            <SubMessage
              content={intl
                .get(`${purchaseContractPrompt}.message.010603subMsg`)
                .d('勾选启用，则采购协议可进行线上编辑。')}
            />
            <SubCheckBox
              content={intl.get(`${purchaseContractPrompt}.message.010604`).d('允许供应商编辑')}
              getFieldDecorator={getFieldDecorator}
              initialValue={settings['010604']}
              disabled={!disabled010604}
              field="010604"
            />
            <SubMessage
              content={intl
                .get(`${purchaseContractPrompt}.message.010604subMsg`)
                .d('勾选启用，则供应商可对协议进行编辑，慎选。')}
            />
          </Row>
        </Col>
      </Row>
    );
  }
}
