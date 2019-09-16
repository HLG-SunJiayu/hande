/*
 * SupplierManage - 配置中心-采购方-供应商管理
 * @date: 2018/09/11 14:51:47
 * @author: HB <bin.huang02@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { PureComponent } from 'react';
import { Row, Col, Form } from 'hzero-ui';
import { withRouter } from 'dva/router';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import classnames from 'classnames';
import Checkbox from 'components/Checkbox';
import styles from './index.less';

import SubMessage from '../../components/SubMessage';

const titlePrompt = 'spfm.configServer.view.title.purchaser';
const viewPrompt = 'spfm.configServer.view';

/**
 * 配置中心-采购方-供应商管理
 * @extends {Component} - React.Component
 * @reactProps {Object} companyInfo - 数据源
 * @reactProps {Object} loading - 数据加载是否完成
 * @return React.element    onChange={onChange}
 */
@withRouter
@Form.create({ fieldNameProp: null })
export default class SupplierManage extends PureComponent {
  constructor(props) {
    super(props);
    props.onRef(this);
  }

  @Bind()
  openTabTo(path) {
    this.props.history.push(path);
  }

  /**
   * 模态框的显示/隐藏
   */
  @Bind()
  handleModalVisible(visibleKey) {
    const { handleModal } = this.props;
    if (handleModal) {
      handleModal(visibleKey, true);
    }
  }

  render() {
    const {
      form: { getFieldDecorator, getFieldValue },
      settings,
    } = this.props;
    return (
      <Row className="first-tab-content" id="sslm">
        <Col span={3}>
          <span className="label-col">{intl.get(`${titlePrompt}.sslm`).d('供应商管理')}:</span>
        </Col>
        <Col span={21} className="sub-item-right">
          <Row>
            <Col span={24}>
              {intl.get(`${viewPrompt}.button.supplierLifeConfig`).d('生命周期阶段配置')}
              <a
                onClick={() => this.openTabTo('/spfm/config-server/supplier-life-config')}
                className="operate-item-link"
              >
                {intl.get('hzero.common.button.view').d('查看')}
              </a>
            </Col>
            <Col span={24}>
              {intl.get(`${viewPrompt}.button.lifeCycleDimConfig`).d('生命周期管控维度配置')}
              <a
                onClick={() => this.openTabTo('/spfm/config-server/life-cycle-dim-config')}
                className="operate-item-link"
              >
                {intl.get('hzero.common.button.view').d('查看')}
              </a>
            </Col>
            <Col span={24}>
              {intl.get(`${viewPrompt}.button.supplierRiskControlConfig `).d('供应商风险管控配置')}
            </Col>

            <Col
              span={24}
              className={classnames('sub-item-fields', styles['flex-form-item'])}
              style={{ marginTop: '-10px', lineHeight: '39px' }}
            >
              {getFieldDecorator('010001', {
                initialValue: settings['010001'],
              })(
                <Checkbox>
                  {intl.get(`${viewPrompt}.message.010001label`).d('启用供应商加入监控功能')}
                </Checkbox>
              )}
              {getFieldValue('010001') === 1 && (
                <a onClick={() => this.handleModalVisible('supplierAddMonitorVisible')}>
                  {intl.get(`${viewPrompt}.common.message.enterDefinitionList`).d('进入定义列表')}
                </a>
              )}
            </Col>
            <SubMessage
              content={intl
                .get(`${viewPrompt}.message.010001subMsg`)
                .d('启用该功能，可在各功能下将供应商加入监控')}
            />
            <Col
              span={24}
              className={classnames('sub-item-fields', styles['flex-form-item'])}
              style={{ marginTop: '-10px', lineHeight: '39px' }}
            >
              {getFieldDecorator('010002', {
                initialValue: settings['010002'],
              })(
                <Checkbox>
                  {intl
                    .get(`${viewPrompt}.message.010002label`)
                    .d('启用未加入监控企业的风险扫描功能')}
                </Checkbox>
              )}
              {getFieldValue('010002') === 1 && (
                <a onClick={() => this.handleModalVisible('riskScanVisible')}>
                  {intl.get(`${viewPrompt}.common.message.enterDefinitionList`).d('进入定义列表')}
                </a>
              )}
            </Col>
            <SubMessage
              content={intl
                .get(`${viewPrompt}.message.010002subMsg`)
                .d('启用该功能，未加入监控供应商进行风险扫描时扣除风险扫描额度')}
            />
            {
              // <Col span={24} className={styles['version-rule']}>
              //   <Form layout="inline" className={classnames(styles['form-item'], 'sub-item-fields')}>
              //     <Form.Item
              //       label={intl
              //         .get(`test`)
              //         .d('风险事件消息默认视图：')}
              //     >
              //       {getFieldDecorator('test', {
              //         initialValue: '日报视图',
              //       })(
              //         <Select showSearch style={{ width: '150px' }}>
              //           <Select.Option key={1} value='日报视图'>
              //              日报视图
              //           </Select.Option>
              //           <Select.Option key={2} value='详情视图'>
              //              详情视图
              //           </Select.Option>
              //         </Select>
              //       )}
              //     </Form.Item>
              //   </Form>
              // </Col>
              // <SubMessage
              //   content={intl.get(`test`).d('选择风险事件消息的默认展示视图')}
              // />
            }
          </Row>
        </Col>
      </Row>
    );
  }
}
