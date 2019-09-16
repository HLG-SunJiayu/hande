/**
 * 头部样式 布局
 * @date 2019-07-26
 * @author XJG jianguo.xiong@hand-china.com
 * @copyright ® HAND 2019
 */

// import React, { Fragment } from 'react';
import React from 'react';
import DocumentTitle from 'react-document-title';
import { Icon, Layout } from 'hzero-ui';
import { connect } from 'dva';
import dynamic from 'dva/dynamic';
import { Bind } from 'lodash-decorators';

import LoadingBar from 'hzero-front/lib/components/NProgress/LoadingBar';
import { tabListen } from 'hzero-front/lib/utils/menuTab';

import DefaultHeaderLogo from 'hzero-front/lib/layouts/components/DefaultHeaderLogo';
import DefaultHeaderSearch from 'hzero-front/lib/layouts/components/DefaultHeaderSearch';
import DefaultMenuTabs from 'hzero-front/lib/layouts/components/DefaultMenuTabs';
import DefaultMenu from 'hzero-front/lib/layouts/components/DefaultMenu';
// import DefaultHeaderRight from 'hzero-front/lib/layouts/components/DefaultHeaderRight';
import DefaultCheckUserSafe from 'hzero-front/lib/layouts/components/DefaultCheckUserSafe';
import DefaultListenAccessToken from 'hzero-front/lib/layouts/components/DefaultListenAccessToken';
import DefaultListenWebSocket from 'hzero-front/lib/layouts/components/DefaultListenWebSocket';
// import DefaultLanguageSelect from 'hzero-front/lib/layouts/components/DefaultLanguageSelect';
// import DefaultNoticeIcon from 'hzero-front/lib/layouts/components/DefaultNoticeIcon';
// import DefaultCommonSelect from 'hzero-front/lib/layouts/components/DefaultCommonSelect';

import styles from 'hzero-front/lib/layouts/DefaultLayout/styles.less';
import DefaultListenFavicon from 'hzero-front/lib/layouts/components/DefaultListenFavicon';
import defaultStyles from './styles.less';
import DefaultHeaderRight from '../DefaultHeaderRight';

const { Header, Sider, Content } = Layout;

class DefaultLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
    };
  }

  componentDidMount() {
    // 清除首屏loading
    const loader = document.querySelector('#loader-wrapper');
    if (loader) {
      document.body.removeChild(loader);
      // 设置默认页面加载动画
      dynamic.setDefaultLoadingComponent(() => {
        return <LoadingBar />;
      });
    }
    this.init();
  }

  init() {
    const { dispatch, currentUser = {} } = this.props;
    const { language } = currentUser;
    dispatch({
      type: 'global/baseLazyInit',
      payload: {
        language,
      },
    }).then(() => {
      // 初始化菜单成功后 调用 tabListen 来触发手动输入的网址
      tabListen();
    });
  }

  @Bind()
  toggleCollapse() {
    const { collapsed = false } = this.state;
    this.setState({
      collapsed: !collapsed,
    });
  }

  render() {
    const { currentUser = {} } = this.props;
    return <DocumentTitle title={currentUser.title || ''}>{this.renderLayout()}</DocumentTitle>;
  }

  renderLayout() {
    const { currentUser = {}, extraHeaderRight } = this.props;
    const { collapsed = false } = this.state;
    return (
      <Layout className={styles['default-layout']}>
        <Header className={defaultStyles.header}>
          <DefaultHeaderLogo
            key="logo"
            logo={currentUser.logo}
            collapsed={collapsed}
            title={currentUser.title}
          />
          <DefaultHeaderRight defaultStyles={defaultStyles} extraHeaderRight={extraHeaderRight} />
        </Header>
        <Layout>
          <Sider
            className={styles.menu}
            trigger={null}
            collapsible
            collapsed={collapsed}
            width={collapsed ? 80 : 220}
          >
            <DefaultHeaderSearch
              key="search"
              collapsed={collapsed}
              className={`${defaultStyles.search} ${styles.search}`}
            />
            <DefaultMenu key="menu" collapsed={collapsed} />
          </Sider>
          <Layout className={`${styles.content} ${defaultStyles.content}`}>
            <Header className={`${defaultStyles.menuHeader} ${styles.header}`}>
              <Icon
                className={styles['menu-trigger']}
                type={collapsed ? 'menu-unfold' : 'menu-fold'}
                onClick={this.toggleCollapse}
              />
            </Header>
            <Content className={`${styles.page} ${defaultStyles.page}`}>
              <DefaultMenuTabs />
            </Content>
          </Layout>
          <DefaultCheckUserSafe />
          <DefaultListenAccessToken />
          <DefaultListenWebSocket />
          <DefaultListenFavicon />
        </Layout>
      </Layout>
    );
  }
}

export default connect(
  ({ user = {}, global = {} }) => ({
    menu: global.menu, // 菜单
    routerData: global.routerData, // 路由配置
    currentUser: user.currentUser, // 当前用户
    activeTabKey: global.activeTabKey, // 当前路由
    tabs: global.tabs, // 所有 tab 页
    language: global.language, // 当前语言
    count: global.count, // 当前消息计数
  }),
  null,
  null,
  { pure: false }
)(DefaultLayout);
