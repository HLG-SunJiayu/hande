/*
 * Partnership - 合作关系查询
 * @date: 2018-8-7
 * @author: dengtingmin <tingmin.deng@hand-china.com>
 * @version: 0.0.1
 * @copyright: Copyright (c) 2018, Hand
 */
import React from 'react';
import { Tabs } from 'hzero-ui';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { isUndefined, isEmpty } from 'lodash';

import { getCurrentOrganizationId } from 'utils/utils';
import { DATETIME_MIN } from 'utils/constants';
import { SRM_PLATFORM } from '_utils/config';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';

import { Content, Header } from 'components/Page';
import ExcelExport from 'components/ExcelExport';

import GroupQuery from './GroupQuery';
import CompanyQuery from './CompanyQuery';
import Partner from './PartnerQuery';

const { TabPane } = Tabs;

@connect(({ partnership, loading }) => ({
  partnerQueryProps: {
    partnership,
    loading: loading.effects['partnership/queryPartnership'],
    loadingDetail: loading.effects['partnership/queryActionDetail'],
    tenantId: getCurrentOrganizationId(),
  },
  groupQueryProps: {
    partnership,
    loading: loading.effects['partnership/queryGroupData'],
    saving: loading.effects['partnership/updateGroupData'],
  },
  companyQueryProps: {
    partnership,
    loading: loading.effects['partnership/queryCompanyData'],
    saving: loading.effects['partnership/updateCompanyData'],
  },
}))
@formatterCollections({ code: 'spfm.partnership' })
export default class Partnership extends React.Component {
  groupFormRef;

  companyFormRef;

  partnerFormRef;

  constructor(props) {
    super(props);
    this.state = {
      tabFlag: 'group',
      tenantId: getCurrentOrganizationId(),
      requestUrl: `${SRM_PLATFORM}/v1/groups/export`,
    };
  }

  componentDidMount() {
    this.handleGroupRef();
  }

  @Bind()
  changTab(key) {
    const state = {
      tabFlag: key,
      requestUrl: '',
    };
    // 判断是哪一个Tab
    switch (key) {
      case 'company':
        state.requestUrl = `${SRM_PLATFORM}/v1/companies/site/export`;
        break;
      case 'group':
        state.requestUrl = `${SRM_PLATFORM}/v1/groups/export`;
        break;
      case 'relation':
        state.requestUrl = `${SRM_PLATFORM}/v1/partners/export`;
        break;
      default:
        state.requestUrl = `${SRM_PLATFORM}/v1/groups/export`;
        break;
    }
    this.setState(state);
  }

  @Bind()
  handleGroupRef(ref = {}) {
    this.groupFormRef = ref;
  }

  @Bind()
  handleCompanyRef(ref = {}) {
    this.companyFormRef = ref;
  }

  @Bind()
  handlePartnerRef(ref = {}) {
    this.partnerFormRef = ref;
  }

  // 装换查询参数,主要考虑导出与导入
  @Bind()
  parseParams(params = {}) {
    const { page = {}, sort = {}, ...otherValues } = params;
    if (sort.order === 'ascend') {
      sort.order = 'asc';
    }
    if (sort.order === 'descend') {
      sort.order = 'desc';
    }
    const sortObj = {};
    if (!isEmpty(sort)) sortObj.sort = `${sort.field},${sort.order}`;
    return {
      ...page,
      ...sortObj,
      ...otherValues,
    };
  }

  @Bind()
  getQueueParams() {
    const { tabFlag = 'group', tenantId } = this.state;
    let queryParams = {};
    let partnerParams = {};
    switch (tabFlag) {
      case 'company':
        queryParams = this.companyFormRef && this.companyFormRef.companyForm;
        break;
      case 'group':
        queryParams = this.groupFormRef && this.groupFormRef.groupForm;
        break;
      case 'relation':
        partnerParams = this.partnerFormRef && this.partnerFormRef.filterForm.props.form;
        break;
      default:
        queryParams = this.groupFormRef && this.groupFormRef.groupForm;
    }

    if (!isUndefined(queryParams) && !isEmpty(queryParams)) {
      const formParams = queryParams.getFieldsValue();
      const { sort = {} } = queryParams;
      const { registerTimeFrom, registerTimeTo, coreFlag } = formParams;
      const params = {
        ...formParams,
        sort,
        registerTimeFrom: registerTimeFrom ? registerTimeFrom.format(DATETIME_MIN) : undefined,
        registerTimeTo: registerTimeTo ? registerTimeTo.format(DATETIME_MIN) : undefined,
        coreFlag: isUndefined(coreFlag) ? '' : coreFlag ? 1 : 0,
      };
      return this.parseParams(params);
    } else if (!isUndefined(partnerParams) && !isEmpty(partnerParams)) {
      const partParams = partnerParams.getFieldsValue();
      const { inviteDateFrom, inviteDateTo } = partParams;
      const partnerQueueParam = {
        ...partParams,
        tenantId,
        inviteDateFrom: inviteDateFrom ? inviteDateFrom.format(DATETIME_MIN) : undefined,
        inviteDateTo: inviteDateTo ? inviteDateTo.format(DATETIME_MIN) : undefined,
      };
      return this.parseParams(partnerQueueParam);
    } else {
      return {
        page: 0,
        size: 10,
      };
    }
  }

  render() {
    const {
      partnerQueryProps,
      groupQueryProps,
      companyQueryProps,
      ...otherCommonProps
    } = this.props;
    const { requestUrl } = this.state;
    const groupParams = {
      onRef: this.handleGroupRef,
    };
    const companyParams = {
      onRef: this.handleCompanyRef,
    };
    const partnerParams = {
      onRef: this.handlePartnerRef,
    };
    return (
      <React.Fragment>
        <Header title={intl.get('spfm.partnership.view.message.title').d('合作关系查询')}>
          <ExcelExport
            requestUrl={requestUrl}
            queryParams={this.getQueueParams()}
            otherButtonProps={{ icon: 'export', type: 'primary' }}
          />
        </Header>
        <Content>
          <div className="table-list-search">
            <Tabs defaultActiveKey="group" animated={false} onChange={this.changTab}>
              <TabPane tab={intl.get('spfm.partnership.view.message.group').d('集团')} key="group">
                <GroupQuery {...groupQueryProps} {...otherCommonProps} {...groupParams} />
              </TabPane>
              <TabPane
                tab={intl.get('spfm.partnership.view.message.company').d('企业')}
                key="company"
              >
                <CompanyQuery {...companyQueryProps} {...otherCommonProps} {...companyParams} />
              </TabPane>
              <TabPane
                tab={intl.get('spfm.partnership.view.message.relation').d('合作关系')}
                key="relation"
              >
                <Partner {...partnerQueryProps} {...otherCommonProps} {...partnerParams} />
              </TabPane>
            </Tabs>
          </div>
        </Content>
      </React.Fragment>
    );
  }
}
