/**
 * 企业信息 - 业务信息
 * @date: 2018-6-30
 * @author: niujiaqing <njq.niu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { withRouter } from 'react-router-dom';
import qs from 'querystring';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { SRM_PLATFORM } from '_utils/config';
import { Content } from 'components/Page';
import BusinessForm from '../Edit/BussinessForm';
import styles from './ProcessInfo.less';

const NAME_SPACE = 'enterpriseBusiness';

@connect(modal => ({
  business: modal[NAME_SPACE],
}))
@withRouter
@formatterCollections({ code: 'spfm.enterprise' })
export default class BusinessInfoBase extends PureComponent {
  constructor(props) {
    super(props);
    const routerParam = qs.parse(props.history.location.search.substr(1));
    this.state = {
      companyId: routerParam.companyId,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { companyId } = this.state;
    if (companyId) {
      dispatch({
        type: `${NAME_SPACE}/queryCompanyBusiness`,
        payload: companyId,
      }).then(() => {
        const {
          business: { businessInfo },
        } = this.props;
        if (businessInfo.industryList) {
          this.businessForm.fetchIndustryCategories(
            businessInfo.industryList.map(item => item.industryId)
          );
        }
      });
    }
  }

  businessForm;

  @Bind()
  onRef(form) {
    this.businessForm = form;
  }

  @Bind()
  callback(res) {
    const { history } = this.props;
    if (res) history.push(`${SRM_PLATFORM}/enterprise/register/contact?companyId=${res.companyId}`);
  }

  /**
   * 返回上一步回调方法
   */
  @Bind()
  previousCallback() {
    const { history } = this.props;
    history.push(`${SRM_PLATFORM}/enterprise/register/legal`);
  }

  render() {
    const {
      business: { businessInfo = {} },
    } = this.props;
    const { companyId } = this.state;

    return (
      <React.Fragment>
        <Content>
          <div className={styles['item-wrapper']}>
            <h3 className={styles['item-wrapper-title']}>
              {intl.get('spfm.business.view.message.title').d('业务信息')}
            </h3>
            <div>
              {intl
                .get('spfm.business.view.message.description')
                .d(
                  '提示: 业务信息将会出现在您的主页上，丰富的内容有助于提高您的资质，便于更多企业快速阅览，促进交易'
                )}
            </div>
          </div>
          <BusinessForm
            onRef={this.onRef}
            data={businessInfo}
            previousCallback={this.previousCallback}
            backBtnText={intl.get('hzero.common.button.previous').d('上一步')}
            callback={this.callback}
            buttonText={intl.get('hzero.common.button.next').d('下一步')}
            companyId={companyId}
          />
        </Content>
      </React.Fragment>
    );
  }
}
