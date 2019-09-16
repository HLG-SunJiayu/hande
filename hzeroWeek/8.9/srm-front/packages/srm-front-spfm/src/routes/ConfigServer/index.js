/**
 * ConfigIndex 平台服务-配置中心
 * @date: 2018-8-27
 * @author dengtingmin <tingmin.deng@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import React, { Component, Fragment } from 'react';
import { Button, Tabs } from 'hzero-ui';
import { connect } from 'dva';
import { omit, merge } from 'lodash';
import { Bind } from 'lodash-decorators';

import intl from 'utils/intl';
import notification from 'utils/notification';
import { getCurrentOrganizationId } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import { Content, Header } from 'components/Page';

import PurchaserIndex from './Purchaser/index';
import SupplierIndex from './Supplier/index';
import CommonIndex from './Common/index';
import styles from './index.less';

const { TabPane } = Tabs;
const buttonPrompt = 'spfm.configServer.view.button';
const titlePrompt = 'spfm.configServer.view.title';
@connect(({ loading, configServer }) => ({
  loading: loading.effects['configServer/fetchSettings'],
  saving: loading.effects['configServer/saveSettings'],
  configServer,
}))
@formatterCollections({
  code: [
    'spfm.configServer',
    'entity.company',
    'entity.supplier',
    'entity.organization',
    'entity.order',
  ],
})
export default class ConfigIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tenantId: getCurrentOrganizationId(),
    };
  }

  commonRef;

  purchaseRef;

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'configServer/init',
    });
    dispatch({
      type: 'configServer/fetchSettings',
    });
  }

  /**
   * 校验表单是否通过
   */
  @Bind()
  validateFormData(ref, field) {
    return new Promise((resolve, reject) => {
      if (!ref || (ref && (!ref[field] || !ref[field].props.form))) {
        resolve({});
      }
      const { validateFieldsAndScroll } = ref[field].props.form;
      validateFieldsAndScroll((errors, values) => {
        if (!errors) {
          resolve(values);
        } else {
          reject(errors);
        }
      });
    });
  }

  /**
   * 保存配置
   */
  @Bind()
  handleSave() {
    const {
      dispatch,
      configServer: { settings },
    } = this.props;
    const commonRefs = ['commonRef', 'enterpriseRef'];
    const purchaseRefs = [
      'catalogRef',
      'purchaseContractRef',
      'demandPollRef',
      'orderRef',
      'deliveryRef',
      'receiveRef',
      'financeRef',
      'supplierManageRef',
    ];
    const commonValidateArr = commonRefs.map(item => this.validateFormData(this.commonRef, item));
    const purchaseValidateArr = purchaseRefs.map(item =>
      this.validateFormData(this.purchaseRef, item)
    );
    Promise.all([...commonValidateArr, ...purchaseValidateArr]).then(
      res => {
        let values = {};
        res.forEach(item => {
          values = { ...values, ...item };
        });
        let targetItem = merge(settings, values);
        for (const key in targetItem) {
          if (targetItem[key] === undefined) {
            targetItem[key] = null;
          } else if (key === 'receiveSystem') {
            targetItem = {
              ...omit(targetItem, ['receiveSystem']),
              '010403': targetItem.receiveSystem === '010403' ? 1 : 0,
              '010404': targetItem.receiveSystem === '010404' ? 1 : 0,
            };
          }
        }
        dispatch({
          type: 'configServer/saveSettings',
          payload: {
            customizeSetting: targetItem,
          },
        }).then(result => {
          if (result) {
            dispatch({
              type: 'configServer/fetchSettings',
            }).then(response => {
              if (response) {
                notification.success();
              }
            });
          }
        });
      },
      errs => console.log(errs)
    );
  }

  /**
   * 重置设置
   */
  // @Bind()
  // handleReset() {
  //   const {
  //     dispatch,
  //     form: { resetFields },
  //   } = this.props;
  //   dispatch({
  //     type: 'configServer/resetSettings',
  //   }).then(res => {
  //     resetFields();
  //     if (res) {
  //       dispatch({
  //         type: 'configServer/fetchSettings',
  //       });
  //       notification.success();
  //     }
  //   });
  // }

  render() {
    const { tenantId } = this.state;
    const { saving = false, loading = false } = this.props;
    return (
      <Fragment>
        <Header title={intl.get(`${titlePrompt}.configServer`).d('配置中心')}>
          <Button type="primary" onClick={this.handleSave} icon="save" loading={saving || loading}>
            {intl.get('hzero.common.button.save').d('保存')}
          </Button>
          {tenantId === 1 && (
            <Button onClick={this.handleReset}>
              {intl.get(`${buttonPrompt}.reset`).d('恢复默认值')}
            </Button>
          )}
        </Header>
        <Content wrapperClassName={styles['config-server-content']}>
          <Tabs animated={false}>
            <TabPane tab={intl.get(`${titlePrompt}.common`).d('通用')} key="common">
              <CommonIndex
                onRef={node => {
                  this.commonRef = node;
                }}
                loading={saving || loading}
              />
            </TabPane>
            <TabPane tab={intl.get(`${titlePrompt}.purchaser`).d('采购方')} key="purchaser">
              <PurchaserIndex
                onRef={node => {
                  this.purchaseRef = node;
                }}
              />
            </TabPane>
            <TabPane tab={intl.get(`${titlePrompt}.supplier`).d('供应商')} key="supplier">
              <SupplierIndex />
            </TabPane>
          </Tabs>
        </Content>
      </Fragment>
    );
  }
}
