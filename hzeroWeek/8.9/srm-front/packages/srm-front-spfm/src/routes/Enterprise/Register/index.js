import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'dva/router';
import { connect } from 'dva';
import { isEmpty } from 'lodash';
import { Steps } from 'hzero-ui';
import { Bind } from 'lodash-decorators';

import { getRoutes, getResponse } from 'utils/utils';
import { SRM_PLATFORM } from '_utils/config';
import { Content, Header } from 'components/Page';
import notification from 'utils/notification';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';

import { queryCompanyBasic } from '@/services/legalService';
import styles from './ProcessInfo.less';

const { Step } = Steps;

const routerPaths = [
  'legal',
  'business',
  'contact',
  'address',
  'bank',
  'invoice',
  'finance',
  'attachment',
  'preview',
];

@formatterCollections({ code: 'spfm.enterprise' })
@connect(({ global }) => ({
  routerData: global.routerData,
}))
export default class RouteIndex extends Component {
  state = {
    inited: false,
  };

  componentDidMount() {
    // 加载公司的基本信息, 调用 legalInfoService 的方法
    queryCompanyBasic().then(res => {
      if (!isEmpty(res) && res.failed) {
        // 出错
      } else {
        this.setState({
          company: res,
        });
      }
      this.setState({
        inited: true,
      });
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.inited === nextState.inited) {
      if (nextProps.location.pathname !== this.props.location.pathname) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  @Bind()
  updateCompanyInfo() {
    this.setState({
      inited: false,
    });
    // 加载公司的基本信息, 调用 legalInfoService 的方法
    queryCompanyBasic().then(res => {
      const r = getResponse(res);
      // 查询成功更新 公司信息
      if (r) {
        this.setState({
          company: res,
        });
      }
      if (r.processStatus === 'REJECT') {
        notification.warning({
          message: intl.get(' hpfm.enterprise.register.fail').d('审核失败，请重新填写信息'),
        });
      }
      this.setState({
        inited: true,
      });
    });
  }

  getCurrentStep() {
    const { location } = this.props;
    const { pathname } = location;
    const pathList = pathname.split('/');
    switch (pathList[pathList.length - 1]) {
      case routerPaths[0]:
        return 0;
      case routerPaths[1]:
        return 1;
      case routerPaths[2]:
        return 2;
      case routerPaths[3]:
        return 3;
      case routerPaths[4]:
        return 4;
      case routerPaths[5]:
        return 5;
      case routerPaths[6]:
        return 6;
      case routerPaths[7]:
        return 7;
      case routerPaths[8]:
        return 8;
      default:
        return 0;
    }
  }

  render() {
    const { match, routerData } = this.props;
    const routes = getRoutes(match.path, routerData);
    const { inited, company = {} } = this.state;
    let content;
    const { processStatus = 'NEW' } = company;

    if (inited === false) return null;
    const resultRoute = [];
    routes.forEach(item => {
      if (
        item.path === `${SRM_PLATFORM}/enterprise/register/result` ||
        item.path === `${SRM_PLATFORM}/enterprise/register/preview`
      ) {
        resultRoute.push(item);
      }
    });

    // 注册过程中的 route,
    const regRoutes = routes.filter(r => r.path !== `${SRM_PLATFORM}/enterprise/register/result`);
    // 注册过程中 可能出现的非法的地址
    const redirectRoutes = [
      <Redirect
        exact
        key="index"
        from={`${SRM_PLATFORM}/enterprise/register`}
        to={`${SRM_PLATFORM}/enterprise/register/legal`}
      />,
      <Redirect
        exact
        key="result"
        from={`${SRM_PLATFORM}/enterprise/register/result`}
        to={`${SRM_PLATFORM}/enterprise/register/legal`}
      />,
    ];

    switch (processStatus) {
      case 'SUBMIT':
      case 'COMPLETE':
        return (
          <Switch>
            {resultRoute.map(item => {
              return (
                <Route
                  key={item.path}
                  path={item.path}
                  render={props => <item.component {...props} />}
                  exact={item.exact}
                />
              );
            })}
            <Redirect
              form={`${SRM_PLATFORM}/enterprise/register`}
              to={`${SRM_PLATFORM}/enterprise/register/result`}
            />
          </Switch>
        );
      default:
        content = (
          <React.Fragment>
            <div
              style={{
                display: 'flex',
                height: '100%',
              }}
            >
              <div
                className="wizard-menu"
                style={{
                  flex: '0 0 auto',
                  width: '228px',
                  borderRight: '1px solid #ebedf2',
                  background: '#f8f8f8',
                }}
              >
                <Steps
                  className={styles['approval-step']}
                  size="small"
                  direction="vertical"
                  current={this.getCurrentStep()}
                  style={{ width: '200px', margin: '20px 24px' }}
                >
                  <Step
                    title={intl.get('spfm.enterprise.view.message.page.regInfo').d('登记信息')}
                  />
                  <Step
                    title={intl.get('spfm.enterprise.view.message.page.businessInfo').d('业务信息')}
                  />
                  <Step
                    title={intl
                      .get('spfm.enterprise.view.message.page.contactInfo')
                      .d('联系人信息')}
                  />
                  <Step
                    title={intl.get('spfm.enterprise.view.message.page.addressInfo').d('地址信息')}
                  />
                  <Step
                    title={intl.get('spfm.enterprise.view.message.page.bankInfo').d('银行信息')}
                  />
                  <Step
                    title={intl.get('spfm.enterprise.view.message.page.invoiceInfo').d('开票信息')}
                  />
                  <Step
                    title={intl.get('spfm.enterprise.view.message.page.financeIngo').d('财务信息')}
                  />
                  <Step
                    title={intl
                      .get('spfm.enterprise.view.message.page.attachmentInfo')
                      .d('公司附件')}
                  />
                  <Step title="查看预览" />
                </Steps>
              </div>
              <div
                className="wizard-content"
                style={{
                  flex: 'auto',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Switch>
                  {regRoutes.map(item => {
                    return (
                      <Route
                        key={item.key}
                        path={item.path}
                        component={props =>
                          React.createElement(item.component, {
                            ...props,
                            updateCompanyInfo: this.updateCompanyInfo,
                          })
                        }
                        exact={item.exact}
                      />
                    );
                  })}
                  {redirectRoutes}
                </Switch>
              </div>
            </div>
          </React.Fragment>
        );
    }

    return (
      <React.Fragment>
        <Header
          title={
            <div
              className="wizard-menu-title"
              style={{
                height: '48px',
                flex: '0 0 auto',
                backgroundColor: '#fff',
                borderBottom: '1px solid #eee',
              }}
            >
              <div style={{ fontSize: '16px', lineHeight: '48px' }}>
                {intl.get('spfm.enterprise.view.message.companyInfo').d('企业信息')}
              </div>
            </div>
          }
        />
        <Content style={{ height: '100%', padding: 0, backgroundColor: '#fff' }}>{content}</Content>
      </React.Fragment>
    );
  }
}
