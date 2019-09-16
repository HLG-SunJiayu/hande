/*
 * 配置中心 - 目录化采购
 * @date: 2019-2-23
 * @author: lokya <kan.li01@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import React from 'react';
import { Row, Col, Form, Select } from 'hzero-ui';
import classnames from 'classnames';
import intl from 'utils/intl';

import styles from './index.less';
import SubMessage from '../../components/SubMessage';
import SubCheckBox from '../../components/SubCheckBox';

const catalogPurchasePrompt = 'spfm.configServer.view.catalogPurchase';

@Form.create({ fieldNameProp: null })
export default class CatalogPurchase extends React.Component {
  constructor(props) {
    super(props);
    props.onRef(this);
  }

  handleSingleRule() {
    const { handleModal } = this.props;
    if (handleModal) {
      handleModal('splitOrderRulesVisible', true);
    }
  }

  render() {
    const {
      settings,
      enumMap,
      form: { getFieldDecorator, getFieldValue },
    } = this.props;
    const { mergeRules = [] } = enumMap;
    return (
      <Row className="tab-content" id="catalogPurchase">
        <Col span={3}>
          <span className="label-col">
            {intl.get(`${catalogPurchasePrompt}.message.title`).d('目录化采购：')}
          </span>
        </Col>
        <Col span={21} className="sub-item-right">
          <Row>
            <Col span={24}>
              {intl.get(`${catalogPurchasePrompt}.message.dismantlingRules`).d('拆单规则')}
            </Col>
            <Col span={24} className={styles['version-rule']}>
              <Form layout="inline" className={classnames(styles['form-item'], 'sub-item-fields')}>
                <Form.Item
                  label={intl
                    .get(`${catalogPurchasePrompt}.message.011000`)
                    .d('采购申请创建&拆单规则定义')}
                >
                  {getFieldDecorator('011000', {
                    initialValue: settings['011000'] || 'DEFAULT',
                  })(
                    <Select showSearch style={{ width: '150px' }}>
                      {mergeRules.map(item => (
                        <Select.Option key={item.value} value={item.value}>
                          {item.meaning}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Form>
              {getFieldValue('011000') === 'CUSTOMIZE' && (
                <a onClick={() => this.handleSingleRule()}>
                  {intl
                    .get(`spfm.configServer.view.common.message.enterDefinitionList`)
                    .d('进入定义列表')}
                </a>
              )}
            </Col>
            <SubMessage
              content={intl
                .get(`${catalogPurchasePrompt}.message.011000subMsg`)
                .d(
                  '采购方商城选买时，系统会根据所配置的规则判断将所购买的商品拆分成不同的采购申请。'
                )}
            />
          </Row>
          <Row className="sub-item">
            <Col span={24}>
              {intl.get(`${catalogPurchasePrompt}.message.011001label`).d('电商订单配置')}
            </Col>
            {/* <Col span={24} className={styles['version-rule']}>
              <Form layout="inline" className={classnames(styles['form-item'], 'sub-item-fields')}>
                <Form.Item
                  label={intl
                    .get(`${catalogPurchasePrompt}.message.011001`)
                    .d('电商采购订单自动创建生成')}
                >
                  {getFieldDecorator('011001', {
                    initialValue: `${settings['011001']}`,
                  })(
                    <Select showSearch style={{ width: '150px' }}>
                      {flag.map(item => (
                        <Select.Option key={item.value} value={item.value}>
                          {item.meaning}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Form>
              {getFieldValue('011001') === 'CUSTOMIZE' && (
                <a onClick={() => this.handleSingleRule()}>
                  {intl
                    .get(`spfm.configServer.view.common.message.enterDefinitionList`)
                    .d('进入定义列表')}
                </a>
              )}
            </Col> */}
            <SubCheckBox
              content={intl
                .get(`${catalogPurchasePrompt}.message.011001`)
                .d('电商采购订单自动创建生成')}
              getFieldDecorator={getFieldDecorator}
              initialValue={settings['011001']}
              field="011001"
            />
            <SubMessage
              content={intl
                .get(`${catalogPurchasePrompt}.message.011001subMsg`)
                .d(
                  '采购方商城选买时，系统会根据所配置的规则判断将电商的采购申请自动生成对应的采购订单。'
                )}
            />
          </Row>
        </Col>
      </Row>
    );
  }
}
