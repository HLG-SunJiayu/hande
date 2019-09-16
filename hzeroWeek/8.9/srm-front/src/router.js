import React from 'react';
import { routerRedux, Switch } from 'dva/router';
import Icons from 'components/Icons';
// import dynamic from 'dva/dynamic';

import ModalContainer, { registerContainer } from 'components/Modal/ModalContainer';
import Authorized from 'components/Authorized/WrapAuthorized';
import PermissionProvider from 'components/Permission/PermissionProvider';

import LocalProviderAsync from 'utils/intl/LocaleProviderAsync';

import { dynamicWrapper } from 'utils/router';
import { getAccessToken } from 'utils/utils';
import { SRM_MALL_HOST } from '_utils/config';

// import LoadingBar from 'components/LoadingBar';
import './index.less';

const { ConnectedRouter } = routerRedux;
const { DefaultAuthorizedRoute, PubAuthorizedRoute } = Authorized;
// TODO 将默认进度条放在BasicLayout中设置
// dynamic.setDefaultLoadingComponent(() => {
//   return <LoadingBar />;
// });

// 打开商城界面
function openMall() {
  // 获取access_token
  // eslint-disable-next-line
  const access_token = getAccessToken();
  // eslint-disable-next-line
  window.open(`${SRM_MALL_HOST}#access_token=${access_token}`, '_black');
}
function RouterConfig({ history, app }) {
  const DefaultLayout = dynamicWrapper(app, ['user', 'login'], () =>
   // import('hzero-front/lib/layouts/DefaultLayout')
     import('_components/DefaultLayout')
  );
  const PubLayout = dynamicWrapper(app, ['user', 'login'], () =>
    import('hzero-front/lib/layouts/PubLayout')
  );

  return (
    <LocalProviderAsync>
      <PermissionProvider>
        <ConnectedRouter history={history}>
          <React.Fragment>
            <ModalContainer ref={registerContainer} />
            <Switch>
              <PubAuthorizedRoute path="/pub" render={props => <PubLayout {...props} />} />
              {/* <AuthorizedRoute path="/" render={props => <BasicLayout {...props} />} /> */}
              <DefaultAuthorizedRoute
                path="/"
                render={props => (
                  <DefaultLayout
                    /* extraHeaderRight={[
                      <a className="cart-button" key="1" target="_black" onClick={openMall}>
                        <Icons size="16" type="shoppingCar" />
                      </a>,
                    ]} */
                    {...props}
                  />
                )}
              />
            </Switch>
          </React.Fragment>
        </ConnectedRouter>
      </PermissionProvider>
    </LocalProviderAsync>
  );
}

export default RouterConfig;
