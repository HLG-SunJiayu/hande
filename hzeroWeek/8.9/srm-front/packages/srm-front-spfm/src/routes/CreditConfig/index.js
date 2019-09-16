/**
 * CreditConfig - 平台征信配置
 * @date: 2019-07-22
 * @author LXM <xiaomei.lv@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */

import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Button, Form } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { Header, Content } from 'components/Page';

import SubCheckBox from '../ConfigServer/components/SubCheckBox';
import SubMessage from '../ConfigServer/components/SubMessage';

import styles from './index.less';

const viewPrompt = 'spfm.CreditConfig.view';
@connect(({ creditConfig, loading }) => ({
  creditConfig,
  saveLoading: loading.effects['creditConfig/saveSettings'],
}))
@Form.create({ fieldNameProp: null })
export default class CreditConfig extends PureComponent {
  componentDidMount() {
    this.handleFetchConfig();
  }

  /**
   * 查询配置
   */
  @Bind()
  handleFetchConfig() {
    const { dispatch } = this.props;
    dispatch({
      type: 'creditConfig/fetchSettings',
    });
  }

  /**
   * 保存配置
   */
  @Bind()
  handleSaveConfig() {
    const {
      dispatch,
      form: { validateFields },
    } = this.props;
    validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'creditConfig/saveSettings',
          payload: values,
        }).then(res => {
          if (res) {
            notification.success();
          }
        });
      }
    });
  }

  @Bind()
  handleChange() {
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({ '000102': 0 });
  }

  render() {
    const {
      saveLoading,
      form: { getFieldDecorator, getFieldValue },
      creditConfig: { settings = {} },
    } = this.props;
    return (
      <Fragment>
        <Header title={intl.get('spfm.PlatformCreditsConfig.view.message.title').d('平台征信配置')}>
          <Button icon="save" type="primary" loading={saveLoading} onClick={this.handleSaveConfig}>
            {intl.get('hzero.common.button.save').d('保存')}
          </Button>
        </Header>
        <Content>
          <div className={styles['credits-config']}>
            <SubCheckBox
              content={intl
                .get(`${viewPrompt}.message.000101`)
                .d('配置1：企业认证信息提交时调用征信接口')}
              getFieldDecorator={getFieldDecorator}
              initialValue={settings['000101']}
              field="000101"
              onChange={this.handleChange}
            />
            <SubMessage
              content={intl
                .get(`${viewPrompt}.message.000101subMsg`)
                .d('若勾选，则在提交企业认证信息时，自动调用征信接口校验企业三证信息真实性')}
            />
            <SubCheckBox
              content={intl
                .get(`${viewPrompt}.message.000102`)
                .d('配置2：三证验证后根据认证结果自动审批')}
              getFieldDecorator={getFieldDecorator}
              initialValue={settings['000102']}
              field="000102"
              disabled={!getFieldValue('000101')}
            />
            <SubMessage
              content={intl
                .get(`${viewPrompt}.message.000102subMsg`)
                .d(
                  '若勾选，则当三证验证结果为真实时，自动进行企业认证审批（需勾选配置1，方可勾选配置2）'
                )}
            />
          </div>
        </Content>
      </Fragment>
    );
  }
}
