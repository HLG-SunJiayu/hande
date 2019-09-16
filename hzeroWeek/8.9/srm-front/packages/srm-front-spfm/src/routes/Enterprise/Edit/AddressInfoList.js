/*
 * AddressInfoList - 企业注册-地址信息编辑
 * @date: 2018/08/07 15:11:13
 * @author: HB <bin.huang02@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { PureComponent } from 'react';
import { Form, Button, Cascader, Input, Icon } from 'hzero-ui';
import { connect } from 'dva';
import classnames from 'classnames';
import { withRouter } from 'react-router-dom';
import { unionWith, isArray, isEmpty, isUndefined, isNull } from 'lodash';
import uuid from 'uuid/v4';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import { getEditTableData } from 'utils/utils';
import EditTable from 'components/EditTable';
import Checkbox from 'components/Checkbox';
import Lov from 'components/Lov';
import { enableRender } from 'utils/renderer';
import notification from 'utils/notification';
import styles from './index.less';

const promptCode = 'spfm.address';
const NAME_SPACE = 'enterpriseAddress';
const FormItem = Form.Item;
const listRowKey = 'companyAddressId';
/**
 * 企业注册-地址信息编辑
 * @extends {Component} - React.Component
 * @reactProps {Object} [location={}] - 当前路由信息
 * @reactProps {Object} [match={}] - react-router match路由信息
 * @reactProps {Object} [history={}]
 * @reactProps {Object} address - 数据源
 * @reactProps {Object} loading - 数据加载是否完成
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} [dispatch=function(e) {return e;}] - redux dispatch方法
 * @return React.element
 */
@connect(modal => ({
  address: modal[NAME_SPACE],
  loading: modal.loading.effects[`${NAME_SPACE}/queryAddressList`],
  saving: modal.loading.effects[`${NAME_SPACE}/saveAddressList`],
}))
@withRouter
// @formatterCollections({ code: 'spfm.address' })
export default class AddressInfoList extends PureComponent {
  constructor(props) {
    super(props);
    const { onRef } = this.props;
    if (onRef) onRef(this);
    this.state = {
      regionValue: {},
      cityData: [],
      record: {},
    };
  }

  componentDidMount() {
    const { companyId, dispatch } = this.props;
    dispatch({
      type: 'enterpriseAddress/queryAddressList',
      payload: { companyId },
    }).then(res => {
      if (res) {
        res.map(item => this.ArrAdd(item.companyAddressId, item.regionIds));
        const countryIdList = res.map(item => item.countryId);
        countryIdList.forEach(countryId => {
          dispatch({
            type: 'enterpriseAddress/queryCity',
            payload: { countryId },
          }).then(cityResponse => {
            dispatch({
              type: 'enterpriseAddress/updateCityMap',
              payload: { countryId, cityResponse },
            });
          });
        });
      }
    });
  }

  @Bind()
  afterOpenUploadModal(attachmentUUID) {
    const { dispatch, questionRowsList = [] } = this.props;
    const { issueLineId } = this.state;

    const index = questionRowsList.findIndex(item => item[this.rowKey] === issueLineId);
    const newDataSourceList = [
      ...questionRowsList.slice(0, index),
      {
        ...questionRowsList[index],
        attachmentUuid: attachmentUUID,
      },
      ...questionRowsList.slice(index + 1),
    ];

    dispatch({
      type: 'supplierBid/updateState',
      payload: {
        questionRowsList: newDataSourceList,
      },
    });
  }

  @Bind()
  fetchProvinceCountry(value = {}, record) {
    const {
      dispatch,
      address: { addressList },
    } = this.props;
    const index = addressList.findIndex(item => item.companyAddressId === record.companyAddressId);
    const newAddressList = [
      ...addressList.slice(0, index),
      {
        ...addressList[index],
        countryId: value,
      },
      ...addressList.slice(index + 1),
    ];
    dispatch({
      type: 'enterpriseAddress/updateState',
      payload: {
        addressList: newAddressList,
      },
    });
  }

  /**
   *  查询地址列表
   */
  @Bind()
  fetchProvinceCity(value) {
    this.setState(
      {
        cityData: [],
      },
      () => {
        const { dispatch } = this.props;
        dispatch({
          type: `${NAME_SPACE}/queryDefaultCity`,
          payload: { countryId: value },
        }).then(res => {
          this.setState({
            cityData: res,
          });
        });
      }
    );
  }

  /**
   *  查询地址列表
   */
  @Bind()
  refresh() {
    const { companyId, dispatch } = this.props;
    dispatch({
      type: 'enterpriseAddress/queryAddressList',
      payload: { companyId },
    });
  }

  @Bind()
  ArrAdd(name, value) {
    const { regionValue } = this.state;
    regionValue[name] = value;
    this.setState({
      regionValue,
    });
  }

  /**
   * 返回城市列表map
   * @param {Number} countryId
   * @param {Object} cityResponse
   */
  @Bind()
  getNewDataMap(countryId, cityResponse) {
    const { dispatch } = this.props;
    dispatch({
      type: 'enterpriseAddress/updateCityMap',
      payload: { countryId, cityResponse },
    });
  }

  /**
   * Lov结果发生改变后去重新查询对应的国家下面的省市区
   * 把新查询到的国家和地区数据存到Map
   * @param {*} value
   * @param {*} record
   * @memberof AddressInfo
   */
  // @Bind()
  // handleOnLovChange(value, record) {
  //   const { dispatch } = this.props;
  //   if (value) {
  //     dispatch({
  //       type: 'enterpriseAddress/queryCity',
  //       payload: { countryId: value },
  //     }).then(cityResponse => {
  //       this.getNewDataMap(value, cityResponse);
  //     });
  //   }
  //   record.$form.setFieldsValue({ [`regionId`]: null });
  // }

  /**
   * 修改行，对查询的结果进行修改
   * @param {Obj} record
   * @memberof AddressInfo
   */
  @Bind()
  editRow(record, flag) {
    const {
      address: { addressList },
      dispatch,
    } = this.props;

    const newAddressList = addressList.map(item => {
      const { ...newItem } = item;
      if (!isArray(item.regionId)) {
        newItem.regionId = [newItem.regionId];
      }
      if (item[listRowKey] === record[listRowKey]) {
        return { ...newItem, _status: flag ? 'update' : '' };
      } else {
        return newItem;
      }
    });
    dispatch({
      type: 'enterpriseAddress/updateState',
      payload: { addressList: newAddressList },
    });
  }

  /**
   * 删除新增的行，已存在的行只能取消编辑
   * @param {Obj} record
   * @memberof AddressInfo
   */
  @Bind()
  deleteRow(record) {
    const {
      dispatch,
      address: { addressList },
    } = this.props;
    const newAddressList = addressList.filter(
      item => item.companyAddressId !== record.companyAddressId
    );
    dispatch({
      type: 'enterpriseAddress/updateState',
      payload: { addressList: newAddressList },
    });
  }
  // @Bind()
  // handleChangeEnabled(value, record) {
  //   const { dispatch, address: { addressList } } = this.props;
  //   const newAddressList = addressList.map(item => {
  //     if (item.companyAddressId === record.companyAddressId) {
  //       return { ...item, enabledFlag: value };
  //     }
  //     return item;
  //   });
  //   dispatch({
  //     type: 'enterpriseAddress/updateState',
  //     payload: { addressList: newAddressList },
  //   });
  // }

  /**
   * @memberof AddressInfo
   * 添加地址信息
   */
  @Bind()
  onHandleAdd() {
    const {
      dispatch,
      address: { addressList },
    } = this.props;
    dispatch({
      type: 'enterpriseAddress/updateState',
      payload: {
        addressList: [
          { _status: 'create', companyAddressId: uuid(), enabledFlag: 1 },
          ...addressList,
        ],
      },
    });
  }

  @Bind()
  isChinaCountry(countryId) {
    return countryId === 4;
  }

  /**
   * 获取行内数据和状态树的合并
   * 然后判断合并数据的长度和是否修改数据
   * @memberof AddressInfo
   */
  @Bind()
  saveAndNext() {
    const {
      dispatch,
      address: { addressList },
      callback,
      companyId,
    } = this.props;
    const { regionValue } = this.state;
    let arrListData = getEditTableData(addressList);
    const companyAddressList = unionWith(arrListData, addressList, (value1, value2) => {
      return value1[listRowKey] === value2[listRowKey];
    });
    arrListData = arrListData.map(item => {
      const { ...newItem } = item;
      if (newItem._status === 'create') {
        delete newItem.companyAddressId;
      }
      if (!(newItem.regionId === '')) {
        if (!isEmpty(regionValue[item.companyAddressId])) {
          return { ...newItem, regionId: regionValue[item.companyAddressId].pop() };
        } else {
          return { ...newItem };
        }
      } else {
        return { ...newItem };
      }
      // if (newItem.regionId) {
      //   return { ...newItem, regionId: newItem.regionId[newItem.regionId.length - 1] };
      // } else {
      //   return newItem;
      // }
    });
    if (companyAddressList.length > 0) {
      if (companyAddressList.find(item => item.enabledFlag)) {
        if (
          !(
            arrListData.length === 0 &&
            companyAddressList.find(item => item._status === ('create' || 'update'))
          )
        ) {
          dispatch({
            type: 'enterpriseAddress/saveAddressList',
            payload: { companyId, companyAddressList: arrListData },
          }).then(data => {
            if (data) {
              this.refresh();
              if (callback) {
                callback(data);
              }
            }
          });
        }
      } else {
        notification.warning({
          message: intl
            .get(`${promptCode}.view.message.warn.mustEnabledAddressInfo`)
            .d('至少启用一条地址信息'),
        });
      }
    } else {
      notification.error({
        message: intl
          .get(`${promptCode}.view.message.error.requireAddressMessage`)
          .d('至少输入一条地址信息'),
      });
    }
  }

  @Bind()
  handlePrevious() {
    const { previousCallback } = this.props;
    if (previousCallback) {
      previousCallback();
    }
  }

  @Bind()
  handleCascader(record) {
    const { cityData = [] } = this.state;
    return (
      <Cascader
        onClick={() => this.fetchProvinceCity(record.countryId)}
        changeOnSelect
        showSearch={false}
        style={{ width: '100%' }}
        placeholder={intl.get('hzero.common.validation.requireSelect', {
          name: intl.get('spfm.enterprise.model.legal.regionIds'),
        })}
        fieldNames={{ label: 'regionName', value: 'regionId' }}
        options={cityData || []}
        onChange={(value, selectedOptions) =>
          this.handleSelectRegion(value, selectedOptions, record)
        }
        loadData={selectedOptions => this.handleQueryCity(selectedOptions)}
      >
        <Icon type="down" />
      </Cascader>
    );
  }

  /**
   * 选择地区拼接
   */
  @Bind()
  handleSelectRegion(value = {}, selectedOptions = [], record) {
    const { regionValue } = this.state;
    const regionList = selectedOptions.map(region => {
      const { regionName } = region;
      return regionName;
    });
    const region = regionList.join('/');
    record.$form.setFieldsValue({
      regionId: region,
    });
    this.setState({
      regionValue: {
        ...regionValue,
        [record.companyAddressId]: value,
      },
    });
  }

  /**
   * 地区级联下拉框动态加载数据
   */
  @Bind()
  handleQueryCity(selectedOptions) {
    const { dispatch } = this.props;
    const lastOption = selectedOptions[selectedOptions.length - 1] || [];
    const { countryId, regionId } = lastOption;
    lastOption.loading = true;
    dispatch({
      type: `${NAME_SPACE}/queryCitys`,
      payload: { countryId, regionId },
    }).then(res => {
      if (res) {
        const { cityData } = this.state;
        lastOption.loading = false;
        // 是否是最后一级地区
        if (!isEmpty(res)) {
          lastOption.children = res;
        }
        this.setState({
          cityData: [...cityData],
        });
      }
    });
  }

  render() {
    const {
      showButton = true,
      buttonText = intl.get('hzero.common.button.save').d('保存'),
      loading,
      saving,
      address: { addressList },
      previousCallback,
      backBtnText = intl.get('hzero.common.button.previous').d('上一步'),
    } = this.props;
    const columns = [
      {
        title: intl.get(`${promptCode}.model.address.countryId`).d('国家'),
        dataIndex: 'countryId',
        width: 160,
        render: (val, record) => {
          if (['update', 'create'].includes(record._status)) {
            // 供应商改变，给相应的来源外部系统赋值
            const handleOnLovChange = (_, value) => {
              const { dispatch } = this.props;
              if (value.countryId) {
                dispatch({
                  type: 'enterpriseAddress/queryCity',
                  payload: { countryId: value.countryId },
                }).then(cityResponse => {
                  this.getNewDataMap(value.countryId, cityResponse);
                });
              }
              record.$form.setFieldsValue({ [`regionId`]: null });
              this.fetchProvinceCountry(value.countryId, record);
            };
            return (
              <React.Fragment>
                <Form.Item>
                  {record.$form.getFieldDecorator('countryId', {
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${promptCode}.model.address.countryId`).d('国家'),
                        }),
                      },
                    ],
                    initialValue: record.countryId,
                  })(
                    <Lov
                      code="HPFM.COUNTRY"
                      onChange={handleOnLovChange}
                      textValue={record.countryName}
                      queryParams={{ enabledFlag: 1 }}
                    />
                  )}
                </Form.Item>
              </React.Fragment>
            );
          } else {
            return record.countryName;
          }
        },
        // render: (val, record) =>
        //   ['create', 'update'].includes(record._status) ? (
        //     <FormItem>
        //       {record.$form.getFieldDecorator(`countryId`, {
        //         rules: [
        //           {
        //             required: true,
        //             message: intl.get('hzero.common.validation.notNull', {
        //               name: intl.get(`${promptCode}.model.address.countryId`).d('国家'),
        //             }),
        //           },
        //         ],
        //         initialValue: record.countryId,
        //       })(
        //         <Lov
        //           code="HPFM.COUNTRY"
        //           textValue={record.countryName}
        //           onChange={(_, value) => this.handleOnLovChange(value, record)}
        //           queryParams={{ enabledFlag: 1 }}
        //         />
        //       )}
        //     </FormItem>
        //   ) : (
        //     record.countryName
        //   ),
      },
      {
        title: intl.get(`${promptCode}.model.address.regionId`).d('省/市/区'),
        dataIndex: 'regionId',
        width: 180,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <FormItem>
              {record.$form.getFieldDecorator(`regionId`, {
                // rules: [
                //   {
                //     required: !!this.isChinaCountry(
                //       getFieldValue(`countryId`)
                //     ),
                //     message: intl.get('hzero.common.validation.notNull', {
                //       name: intl.get(`${promptCode}.model.address.regionId`).d('省/市/区'),
                //     }),
                //   },
                // ],
                initialValue: record.regionPathName,
              })(
                <Input
                  style={{
                    verticalAlign: 'middle',
                    position: 'relative',
                    top: '-1px',
                  }}
                  disabled={!record.$form.getFieldValue(`countryId`)}
                  addonAfter={this.handleCascader(record)}
                />
              )}
            </FormItem>
          ) : (
            record.regionPathName
          ),
      },
      {
        title: intl.get(`${promptCode}.model.address.addressDetail`).d('详细地址'),
        dataIndex: 'addressDetail',
        width: 300,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <FormItem>
              {record.$form.getFieldDecorator(`addressDetail`, {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${promptCode}.model.address.addressDetail`).d('详细地址'),
                    }),
                  },
                ],
                initialValue: record.addressDetail,
              })(<Input />)}
            </FormItem>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${promptCode}.model.address.postCode`).d('邮政编码'),
        dataIndex: 'postCode',
        width: 120,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <FormItem>
              {record.$form.getFieldDecorator(`postCode`, {
                initialValue: record.postCode,
                rules: [
                  {
                    message: intl.get(`${promptCode}.view.validation.format`).d('请输入正确的邮编'),
                    pattern: /^\d{2,8}$|^[A-Z][A-Z0-9]{0,8}[- ]{0,1}[A-Z0-9]{1,8}$/,
                  },
                ],
              })(<Input />)}
            </FormItem>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${promptCode}.model.address.description`).d('地址备注'),
        dataIndex: 'description',
        width: 250,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <FormItem>
              {record.$form.getFieldDecorator(`description`, {
                initialValue: record.description,
              })(<Input />)}
            </FormItem>
          ) : (
            val
          ),
      },
      {
        title: intl.get('hzero.common.status').d('状态'),
        dataIndex: 'enabledFlag',
        align: 'center',
        width: 80,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <FormItem>
              {record.$form.getFieldDecorator(`enabledFlag`, {
                initialValue: record.enabledFlag === 0 ? record.enabledFlag : 1,
              })(<Checkbox />)}
            </FormItem>
          ) : (
            enableRender(val)
          ),
      },
      {
        title: intl.get(`hzero.common.table.column.option`).d('操作'),
        align: 'center',
        width: 80,
        render: (val, record) => (
          <span className="action-link">
            {record._status === 'update' && (
              <a onClick={() => this.editRow(record, false)}>
                {intl.get('hzero.common.button.cancel').d('取消')}
              </a>
            )}
            {!(record._status === 'create') && !(record._status === 'update') && (
              <a onClick={() => this.editRow(record, true)}>
                {intl.get('hzero.common.button.edit').d('编辑')}
              </a>
            )}
            {record._status === 'create' && (
              <a onClick={() => this.deleteRow(record)}>
                {intl.get('hzero.common.button.clean').d('清除')}
              </a>
            )}
          </span>
        ),
      },
    ];
    const editTableProps = {
      columns,
      loading,
      className: classnames(styles.table),
      rowKey: listRowKey,
      dataSource: addressList,
      pagination: false,
      bordered: true,
      scroll: { x: 1300 },
    };
    return (
      <Form>
        <div style={{ marginBottom: '24px' }}>
          <Button icon="plus" onClick={this.onHandleAdd}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
        </div>
        <EditTable {...editTableProps} />
        <div style={{ clear: 'both', marginTop: 40 }}>
          {previousCallback && (
            <Button type="primary" onClick={this.handlePrevious} style={{ marginRight: 16 }}>
              {backBtnText}
            </Button>
          )}
          {showButton && (
            <Button type="primary" onClick={this.saveAndNext} loading={saving}>
              {buttonText}
            </Button>
          )}
        </div>
      </Form>
    );
  }
}
