/**
 * FormManage - ERP供应商信息详情页抽屉
 * @date: 2018-10-8
 * @author: CJ <yunqiang.wu@hand-china.com>
 * @version: 1.0.0
 * @copyright Copyright (c) 2018, Hand
 */

import React from 'react';
import intl from 'utils/intl';
import { Form, Row, Col, Input, Tabs, Table } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import SideBar from 'components/Modal/SideBar';
import { getCurrentOrganizationId } from 'utils/utils';
import { enableRender } from 'utils/renderer';
import { queryErpSupplierDetail } from '@/services/supplierService';
import styles from '../index.less';

const { TabPane } = Tabs;
const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    sm: { span: 8 },
  },
  wrapperCol: {
    sm: { span: 14 },
  },
};

@Form.create({ fieldNameProp: null })
export default class ErpSupplierDetailDrawer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data || {},
      tabKey: 'contacts',
      loading: {},
      dataSource: {},
    };

    this.contactsColumns = [
      {
        title: intl.get('spfm.supplier.model.erpSupplierDetail.name').d('姓名'),
        width: 100,
        align: 'left',
        dataIndex: 'name',
      },
      {
        title: intl.get('spfm.supplier.model.erpSupplierDetail.genderMeaning').d('性别'),
        width: 100,
        dataIndex: 'genderMeaning',
      },
      {
        title: intl.get('spfm.supplier.model.erpSupplierDetail.idType').d('证件类型'),
        width: 100,
        dataIndex: 'idType',
      },
      {
        title: intl.get('spfm.supplier.model.erpSupplierDetail.idNumber').d('证件号码'),
        width: 100,
        dataIndex: 'idNumber',
      },
      {
        title: intl.get('spfm.supplier.model.erpSupplierDetail.position').d('职位'),
        width: 100,
        dataIndex: 'position',
      },
      {
        title: intl.get('spfm.supplier.model.erpSupplierDetail.mobilephone').d('电话'),
        width: 100,
        dataIndex: 'mobilephone',
      },
      {
        title: intl.get('spfm.supplier.model.erpSupplierDetail.mail').d('邮箱'),
        dataIndex: 'mail',
      },
    ];

    this.addressColumns = [
      {
        title: intl.get('spfm.supplier.model.erpSupplierDetail.countryName').d('国家'),
        width: 100,
        align: 'left',
        dataIndex: 'countryName',
      },
      {
        title: intl.get('spfm.supplier.model.erpSupplierDetail.regionName').d('地区'),
        width: 200,
        dataIndex: 'regionName',
      },
      {
        title: intl.get('spfm.supplier.model.erpSupplierDetail.cityName').d('城市'),
        width: 100,
        dataIndex: 'cityName',
      },
      {
        title: intl.get('spfm.supplier.model.erpSupplierDetail.address').d('详细地址'),
        dataIndex: 'address',
      },
      {
        title: intl.get('spfm.supplier.model.erpSupplierDetail.zipCode').d('邮政编码'),
        width: 100,
        dataIndex: 'zipCode',
      },
    ];

    this.bankColumns = [
      {
        title: intl.get('spfm.supplier.model.erpSupplierDetail.bankCountryCode').d('银行国家代码'),
        width: 120,
        dataIndex: 'bankCountryCode',
      },
      {
        title: intl.get('spfm.supplier.model.erpSupplierDetail.bankCode').d('银行代码'),
        width: 100,
        dataIndex: 'bankCode',
      },
      {
        title: intl.get('spfm.supplier.model.erpSupplierDetail.bankName').d('银行名称'),
        width: 100,
        dataIndex: 'bankName',
      },
      {
        title: intl.get('spfm.supplier.model.erpSupplierDetail.depositBank').d('开户行名称'),
        width: 100,
        dataIndex: 'depositBank',
      },
      {
        title: intl.get('spfm.supplier.model.erpSupplierDetail.bankAccountName').d('账户名称'),
        width: 100,
        dataIndex: 'bankAccountName',
      },
      {
        title: intl.get('spfm.supplier.model.erpSupplierDetail.bankAccountNum').d('银行账户'),
        width: 100,
        dataIndex: 'bankAccountNum',
      },
      {
        title: intl.get('spfm.supplier.model.erpSupplierDetail.mainAccountFlagMeaning').d('主账户'),
        width: 100,
        dataIndex: 'mainAccountFlagMeaning',
      },
      {
        title: intl.get('hzero.common.status').d('状态'),
        width: 75,
        dataIndex: 'enabledFlag',
        render: enableRender,
      },
    ];

    this.sitesColumns = [
      {
        title: intl.get('spfm.supplier.model.erpSupplierDetail.supplierSiteCode').d('地点代码'),
        width: 100,
        align: 'left',
        dataIndex: 'supplierSiteCode',
      },
      {
        title: intl.get('spfm.supplier.model.erpSupplierDetail.supplierSiteName').d('地点名称'),
        dataIndex: 'supplierSiteName',
      },
      {
        title: intl.get('hzero.common.status').d('状态'),
        width: 100,
        dataIndex: 'enabledFlag',
        render: enableRender,
      },
      {
        title: intl.get('spfm.supplier.model.erpSupplierDetail.ouId').d('业务实体'),
        width: 100,
        dataIndex: 'ouId',
      },
    ];
    this.rowKey = (record, index) => `${index + 1}`;
  }

  componentDidMount() {
    this.fetchDetailData();
  }

  @Bind()
  handleTabChange(newTabKey) {
    this.setState(
      {
        tabKey: newTabKey,
      },
      () => {
        if (this.state.dataSource[this.state.tabKey]) {
          return;
        }
        this.fetchDetailData();
      }
    );
  }

  @Bind()
  fetchDetailData() {
    const type = this.state.tabKey;
    const tenantId = getCurrentOrganizationId();
    if (this.state.loading[type] && !this.state.data.supplierId) {
      return;
    }
    this.setState({
      loading: {
        ...this.state.loading,
        [type]: true,
      },
    });
    queryErpSupplierDetail(
      {
        tenantId,
        supplierId: this.state.data.supplierId,
      },
      type
    )
      .then(data => {
        if (data && data.content) {
          this.setState({
            dataSource: {
              ...this.state.dataSource,
              [type]: data.content,
            },
            loading: {
              ...this.state.loading,
              [type]: false,
            },
          });
        } else {
          return Promise.reject(data);
        }
      })
      .catch(err => {
        console.error(err);
        this.setState({
          dataSource: {
            ...this.state.dataSource,
          },
          loading: {
            ...this.state.loading,
            [type]: false,
          },
        });
      });
  }

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { data, tabKey, loading, dataSource } = this.state;
    return (
      <SideBar
        title={intl.get('spfm.supplier.view.title.erpSupplierDetail').d('ERP 供应商信息')}
        width={800}
        footer={null}
        {...this.props}
      >
        <Row gutter={24}>
          <Col span={12}>
            <FormItem
              {...formItemLayout}
              label={intl.get('spfm.supplier.model.supplier.erp.supplierNum').d('供应商编码')}
            >
              {getFieldDecorator('supplierNum', { initialValue: data.supplierNum })(
                <Input disabled inputChinese={false} />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              {...formItemLayout}
              label={intl.get('spfm.supplier.model.supplier.erp.supplierName').d('供应商名称')}
            >
              {getFieldDecorator('supplierName', { initialValue: data.supplierName })(
                <Input disabled />
              )}
            </FormItem>
          </Col>
        </Row>
        <Tabs
          activeKey={tabKey}
          onChange={this.handleTabChange}
          animated={false}
          className={styles['erp-drawer']}
        >
          <TabPane
            tab={intl.get('spfm.supplier.view.title.tab.contacts').d('联系人')}
            key="contacts"
          >
            <Table
              bordered
              loading={loading.contacts}
              rowKey={this.rowKey}
              columns={this.contactsColumns}
              dataSource={dataSource.contacts}
              pagination={false}
            />
          </TabPane>
          <TabPane tab={intl.get('spfm.supplier.view.title.tab.address').d('地址')} key="address">
            <Table
              bordered
              loading={loading.address}
              rowKey={this.rowKey}
              columns={this.addressColumns}
              dataSource={dataSource.address}
              pagination={false}
            />
          </TabPane>
          <TabPane tab={intl.get('spfm.supplier.view.title.tab.bank').d('银行账户')} key="bank">
            <Table
              bordered
              loading={loading.bank}
              rowKey={this.rowKey}
              columns={this.bankColumns}
              dataSource={dataSource.bank}
              pagination={false}
            />
          </TabPane>
          <TabPane tab={intl.get('spfm.supplier.view.title.tab.sites').d('地点')} key="sites">
            <Table
              bordered
              loading={loading.sites}
              rowKey={this.rowKey}
              columns={this.sitesColumns}
              dataSource={dataSource.sites}
              pagination={false}
            />
          </TabPane>
        </Tabs>
      </SideBar>
    );
  }
}
