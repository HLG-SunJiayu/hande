/**
 * 企业信息 - 工商注册登记
 * @date: 2018-6-30
 * @author: niujiaqing <njq.niu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';

import { Content } from 'components/Page';

import formatterCollections from 'utils/intl/formatterCollections';
import { SRM_PLATFORM } from '_utils/config';
import intl from 'utils/intl';

import LegalForm from '../Edit/LegalForm';
import styles from './ProcessInfo.less';

const NAME_SPACE = 'enterpriseLegal';

@connect(modal => ({
  legal: modal.enterpriseLegal,
}))
@formatterCollections({ code: ['spfm.enterprise'] })
export default class LegalInfo extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: `${NAME_SPACE}/queryCompanyBasic`,
    });
  }

  legalForm;

  @Bind()
  onRef(form) {
    this.legalForm = form;
  }

  @Bind()
  callback(res) {
    const { history } = this.props;
    if (res) {
      history.push(`${SRM_PLATFORM}/enterprise/register/business?companyId=${res.companyId}`);
    }
  }

  render() {
    const {
      legal: { legalInfo = {} },
    } = this.props;
    return (
      <Content>
        <div className={styles['item-wrapper']}>
          <h3 className={styles['item-wrapper-title']}>企业信息</h3>
          <div>
            适用于企业、个体工商户、事业单位等，通过营业执照，组织机构代码等相关资质进行认证。
          </div>
        </div>
        <LegalForm
          onRef={this.onRef}
          data={legalInfo}
          callback={this.callback}
          buttonText={intl.get('hzero.common.button.next').d('下一步')}
        />
      </Content>
    );
  }
}
