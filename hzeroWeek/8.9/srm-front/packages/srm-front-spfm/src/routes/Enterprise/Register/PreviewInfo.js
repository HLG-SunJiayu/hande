import React from 'react';
import { connect } from 'dva';
import { Button } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import qs from 'querystring';

import { Content } from 'components/Page';

import Preview from '../Preview/index';

@connect(({ loading }) => ({
  approvalLoading: loading.effects['attachment/submitApproval'],
}))
export default class PreviewInfo extends React.PureComponent {
  constructor(props) {
    super(props);
    const routerParam = qs.parse(props.history.location.search.substr(1));
    this.state = {
      companyId: routerParam.companyId || '',
    };
  }

  @Bind()
  handleBack() {
    const { history } = this.props;
    const { companyId } = this.state;
    if (companyId) {
      history.push(`/spfm/enterprise/register/attachment?companyId=${companyId}`);
    } else {
      history.push('/spfm/enterprise/register/result');
    }
  }

  @Bind()
  handleApproval() {
    const { dispatch } = this.props;
    const { companyId } = this.state;
    dispatch({
      type: 'attachment/submitApproval',
      payload: {
        companyId,
      },
    }).then(res => {
      if (res) {
        const { history } = this.props;
        // 需要触发 register 页面的 company 信息 更新
        this.props.updateCompanyInfo();
        history.push('/spfm/enterprise/register/result'); // 跳转到 result 页面
      }
    });
  }

  render() {
    const { approvalLoading = false } = this.props;
    const { companyId } = this.state;
    return (
      <Content>
        <Preview companyId={companyId} />
        <div style={{ marginTop: 40 }}>
          <Button type="primary" onClick={this.handleBack}>
            {companyId ? '上一步' : '返回'}
          </Button>
          {companyId && (
            <Button
              style={{ marginLeft: 16 }}
              type="primary"
              loading={approvalLoading}
              onClick={this.handleApproval}
            >
              确认提交
            </Button>
          )}
        </div>
      </Content>
    );
  }
}
