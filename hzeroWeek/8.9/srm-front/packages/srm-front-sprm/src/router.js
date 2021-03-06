import React from 'react';
import { routerRedux, Switch } from 'dva/router';
// import dynamic from 'dva/dynamic';

import ModalContainer, { registerContainer } from 'components/Modal/ModalContainer';
import Authorized from 'components/Authorized/WrapAuthorized';
import PermissionProvider from 'components/Permission/PermissionProvider';

import LocalProviderAsync from 'utils/intl/LocaleProviderAsync';

import { dynamicWrapper } from 'utils/router';
// import LoadingBar from 'components/LoadingBar';
import './index.less';

const { ConnectedRouter } = routerRedux;
const { AuthorizedRoute } = Authorized;
// TODO 将默认进度条放在BasicLayout中设置
// dynamic.setDefaultLoadingComponent(() => {
//   return <LoadingBar />;
// });

function RouterConfig({ history, app }) {
  const DefaultLayout = dynamicWrapper(app, ['user', 'login'], () =>
    // import('hzero-front/lib/layouts/DefaultLayout')
    import('_components/DefaultLayout')
  );

  return (
    <LocalProviderAsync>
      <PermissionProvider>
        <ConnectedRouter history={history}>
          <React.Fragment>
            <ModalContainer ref={registerContainer} />
            <Switch>
              <AuthorizedRoute path="/" render={props => <DefaultLayout {...props} />} />
            </Switch>
          </React.Fragment>
        </ConnectedRouter>
      </PermissionProvider>
    </LocalProviderAsync>
  );
}

export default RouterConfig;
