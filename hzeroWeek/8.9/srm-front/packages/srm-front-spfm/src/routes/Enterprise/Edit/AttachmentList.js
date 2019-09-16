/**
 * FinanceInfo - 企业注册-附件信息
 * @date: 2018-7-9
 * @author: lokya <kan.li01@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Form, Modal, Input, Cascader, DatePicker, Icon } from 'hzero-ui';
import { connect } from 'dva';
import Debounce from 'lodash-decorators/debounce';
import { Bind } from 'lodash-decorators';
import { isUndefined } from 'lodash';
import uuidv4 from 'uuid/v4';
import moment from 'moment';
import intl from 'utils/intl';
import { getEditTableData, getDateFormat } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import { DEFAULT_DATE_FORMAT, DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import UploadModal from 'components/Upload/index';
import EditTable from 'components/EditTable';
import notification from 'utils/notification';

/**
 * 使用 Form.Item 组件
 */
const FormItem = Form.Item;

/**
 * 企业注册附件信息列表
 * @extends {Component} - React.Component
 * @reactProps {Object} attachment - 数据源
 * @reactProps {Object} loading - 数据加载是否完成
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} [dispatch=function(e) {return e;}] - redux dispatch方法
 * @return React.element
 */
@formatterCollections({
  code: ['spfm.attachment', 'entity.attachment'],
})
@Form.create({ fieldNameProp: null })
@connect(({ attachment, loading }) => ({
  attachment,
  fetchLoading: loading.effects['attachment/fetchAttachment'],
}))
@withRouter
export default class AttachmentList extends PureComponent {
  /**
   * @param {object} props 属性
   */
  constructor(props) {
    super(props);
    this.state = {
      addRows: [],
      selectedRows: [],
      editRow: [],
      saving: false,
      saveable: true,
    };
  }

  /**
   * 组件挂载后执行方法
   */
  componentDidMount() {
    const { dispatch, companyId, onRef } = this.props;
    if (onRef) onRef(this);
    const data = {
      companyId,
    };
    dispatch({
      type: 'attachment/fetchAttachment',
      payload: data,
    });
    dispatch({
      type: 'attachment/fetchAttachmentType',
      payload: {
        'SPFM.COMPANY.ATTACHMENT_TYPE': 1,
        'SPFM.COMPANY.SUB_ATTACHMENT': 2,
      },
    });
  }

  /**
   * 点击取消按钮
   * @param {object} record 当前行记录
   */
  @Bind()
  cancel(record) {
    const {
      dispatch,
      attachment: { data = [] },
    } = this.props;
    if (record._status === 'create') {
      const listData = data.filter(item => item.companyAttachmentId !== record.companyAttachmentId);
      dispatch({
        type: 'attachment/removeNewAdd',
        payload: listData,
      });
    } else {
      dispatch({
        type: 'attachment/fetchFileNumber',
        payload: {
          bucketName: 'spfm-comp',
          attachmentUUID: record.attachmentUuid,
        },
      }).then(res => {
        if (!isUndefined(res)) {
          this.handleEditAttachment(
            {
              ...record,
              attachmentCount: res,
            },
            false
          );
        }
      });
    }
  }

  /**
   * 渲染行
   * @returns
   */
  @Bind()
  handlecolumns() {
    const {
      attachment: { code = {} },
    } = this.props;
    return [
      {
        title: intl.get('entity.attachment.type').d('附件类型'),
        dataIndex: 'attachmentFileType',
        width: 200,
        render: (text, record) => {
          if (record._status === 'update' || record._status === 'create') {
            return (
              <FormItem>
                {record.$form.getFieldDecorator(`attachmentFileType`, {
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get('entity.attachment.type').d('附件类型'),
                      }),
                    },
                  ],
                  initialValue:
                    record.attachmentType === undefined && record.subAttachment === undefined
                      ? null
                      : [record.attachmentType, record.subAttachment],
                })(
                  <Cascader
                    fieldNames={{ label: 'meaning', value: 'value', children: 'children' }}
                    options={code.AttachmentType}
                    expandTrigger="hover"
                    placeholder=""
                  />
                )}
              </FormItem>
            );
          } else {
            return <div>{`${record.attachmentTypeMeaning}/${record.subAttachmentMeaning}`}</div>;
          }
        },
      },
      {
        title: intl.get('entity.attachment.description').d('附件描述'),
        dataIndex: 'description',
        width: 150,
        render: (text, record) => {
          if (record._status === 'update' || record._status === 'create') {
            return (
              <FormItem>
                {record.$form.getFieldDecorator(`description`, {
                  initialValue: record.description,
                  rules: [
                    {
                      max: 50,
                      message: intl.get('hzero.common.validation.max', {
                        max: 50,
                      }),
                    },
                  ],
                })(<Input />)}
              </FormItem>
            );
          } else {
            return text;
          }
        },
      },
      {
        title: intl.get('spfm.attachment.model.attachment.endDate').d('文件到期日'),
        dataIndex: 'endDate',
        width: 150,
        align: 'center',
        render: (text, record) => {
          if (record._status === 'update' || record._status === 'create') {
            return (
              <FormItem>
                {record.$form.getFieldDecorator(`endDate`, {
                  initialValue: record.endDate ? moment(record.endDate, DEFAULT_DATE_FORMAT) : null,
                })(<DatePicker format={getDateFormat()} placeholder="" />)}
              </FormItem>
            );
          } else {
            return text;
          }
        },
      },
      {
        title: intl.get('spfm.attachment.model.attachment.uploadDate').d('最后更新时间'),
        dataIndex: 'uploadDate',
        width: 150,
        align: 'center',
        render: (text, record) => {
          if (record._status === 'update' || record._status === 'create') {
            return (
              <FormItem>
                {record.$form.getFieldDecorator(`uploadDate`, {
                  initialValue: record.uploadDate,
                })(<Input disabled />)}
              </FormItem>
            );
          } else {
            return text;
          }
        },
      },
      {
        title: intl.get('entity.attachment.upload').d('附件上传'),
        width: 120,
        align: 'center',
        render: (_, record) => {
          return (
            <div>
              <UploadModal
                uploadSuccess={() => this.setLastUploadTime(record)}
                attachmentUUID={record.attachmentUuid}
                afterOpenUploadModal={uuid => this.handleUuid(record, uuid)}
                removeCallback={() => this.setLastUploadTime(record)}
                // filesNumber={record.attachmentCount}
              />
            </div>
          );
        },
      },
      {
        title: '操作',
        width: 80,
        align: 'center',
        render: (_, record) => {
          return (
            <div>
              {record._status === 'create' || record._status === 'update' ? (
                <a onClick={() => this.cancel(record)}>
                  {record._status === 'create'
                    ? intl.get('hzero.common.button.clean').d('清除')
                    : intl.get('hzero.common.button.cancel').d('取消')}
                </a>
              ) : (
                <a onClick={() => this.handleEditAttachment(record, true)}>
                  {intl.get('hzero.common.button.edit').d('编辑')}
                </a>
              )}
            </div>
          );
        },
      },
    ];
  }

  /**
   * 刷新数据
   */
  @Bind()
  refresh() {
    const { dispatch, companyId } = this.props;
    const data = {
      companyId,
    };
    this.setState({
      selectedRows: [],
    });
    dispatch({
      type: 'attachment/fetchAttachment',
      payload: data,
    });
  }

  /**
   * 勾选
   * @param {null} _ 占位
   * @param {Object} selectedRows 选中行
   */
  @Bind()
  onSelectChange(_, selectedRows) {
    this.setState({ selectedRows });
  }

  /**
   * 删除
   * @memberof FinanceInfo
   */
  @Bind()
  handleDeleteAttachment() {
    const {
      dispatch,
      companyId,
      attachment: { data = [] },
    } = this.props;
    const { selectedRows } = this.state;
    const deleteRows = selectedRows.filter(row => row._status !== 'create');
    const createFlag = data.find(d => d._status === 'create');
    const onOk = () => {
      dispatch({
        type: 'attachment/deleteAttachment',
        payload: {
          deleteRows,
          companyId,
        },
      }).then(response => {
        if (response) {
          this.refresh();
          notification.success();
        }
      });
    };
    Modal.confirm({
      title: createFlag
        ? intl
            .get('spfm.attachment.view.message.error.remove')
            .d('有新建数据未保存，确定删除选中数据?')
        : intl.get('hzero.common.message.confirm.remove').d('确定删除选中数据?'),
      onOk,
    });
  }

  @Bind()
  handlePrevious() {
    const { previousCallback } = this.props;
    if (previousCallback) {
      previousCallback();
    }
  }

  /**
   * 批量保存数据
   */
  @Debounce(500)
  handleAddAttachment() {
    const {
      dispatch,
      attachment: { data },
      companyId,
      callback,
    } = this.props;
    const { editRow = [], saveable } = this.state;
    const params = getEditTableData(data);
    const isEditing = !!data.find(d => d._status === 'create' || d._status === 'update');
    let uuidExisted = true;
    // 判断每一行记录是否都有上传
    const hasNoFileRecord = data && data.find(d => d.attachmentCount === 0);
    if (Array.isArray(params) && params.length !== 0 && isEditing) {
      const arr = params.map(param => {
        const editData = editRow.find(row => row.companyAttachmentId === param.companyAttachmentId);
        uuidExisted = !!editData;
        const { description, uploadDate } = param;
        if (param._status === 'create') {
          return {
            description,
            uploadDate,
            attachmentType: param.attachmentFileType[0],
            subAttachment: param.attachmentFileType[1],
            attachmentUuid: editData ? editData.attachmentUuid : editData,
            endDate: param.endDate ? param.endDate.format(DEFAULT_DATE_FORMAT) : param.endDate,
          };
        } else {
          return {
            description,
            uploadDate,
            companyAttachmentId: param.companyAttachmentId,
            attachmentType: param.attachmentFileType[0],
            subAttachment: param.attachmentFileType[1],
            attachmentUuid: editData ? editData.attachmentUuid : editData,
            objectVersionNumber: param.objectVersionNumber,
            endDate: param.endDate ? param.endDate.format(DEFAULT_DATE_FORMAT) : param.endDate,
          };
        }
      });
      if (uuidExisted) {
        dispatch({
          type: 'attachment/addAttachment',
          payload: {
            arr,
            companyId,
          },
        }).then(response => {
          if (response) {
            this.refresh();
            if (response.length > 0 && callback) {
              callback();
            }
          }
        });
      } else {
        notification.error({
          message: intl.get('spfm.attachment.view.message.error').d('附件未上传!'),
        });
      }
    } else if (params.length === 0 && !isEditing && saveable && !hasNoFileRecord) {
      if (callback) {
        callback();
      }
    } else {
      notification.error({
        message: intl.get('spfm.attachment.view.message.error').d('附件未上传!'),
      });
    }
  }

  /**
   * 新增一条数据
   */
  @Bind()
  addData() {
    const { dispatch } = this.props;
    const companyAttachmentId = uuidv4();
    this.setState({
      addRows: [...this.state.addRows, companyAttachmentId],
    });
    const data = {
      companyAttachmentId,
      totalAssets: 0,
      totalLiabilities: 0,
      currentAssets: 0,
      currentLiabilities: 0,
      revenue: 0,
      netProfit: 0,
      _status: 'create',
    };
    dispatch({
      type: 'attachment/addNewData',
      payload: data,
    });
  }

  /**
   * 规范上传列表类型数据
   * @param {object} response 返回数据
   * @returns
   */
  @Bind()
  changeFileList(response) {
    return response.map((res, index) => {
      return {
        uid: index + 1,
        name: res.fileName,
        status: 'done',
        url: res.fileUrl,
      };
    });
  }

  /**
   * 控制uuid
   * @param {object} record 行数据
   * @param {string} uuid 唯一编码
   */
  @Bind()
  handleUuid(record, uuid) {
    this.setUuid(record.companyAttachmentId, uuid);
  }

  /**
   * 设置uuuid
   * @param {string} id 行id
   * @param {string} uuid 唯一编码
   */
  @Bind()
  setUuid(id, uuid) {
    const data = this.state.editRow;
    this.setState({
      editRow: [
        ...data,
        {
          companyAttachmentId: id,
          attachmentUuid: uuid,
        },
      ],
    });
  }

  /**
   * 设置最新更新时间
   * @param {object} record 行数据
   */
  @Bind()
  setLastUploadTime(record) {
    const { companyId, dispatch } = this.props;
    const time = moment();
    if (record._status === 'create' || record._status === 'update') {
      record.$form.setFieldsValue({ [`uploadDate`]: time.format(DEFAULT_DATETIME_FORMAT) });
    } else {
      const arr = [
        {
          ...record,
          uploadDate: time.format(DEFAULT_DATETIME_FORMAT),
        },
      ];
      dispatch({
        type: 'attachment/addAttachment',
        payload: {
          arr,
          companyId,
        },
      }).then(response => {
        if (response) {
          this.setState(
            {
              saveable: true,
            },
            () => {
              this.refresh();
            }
          );
        } else {
          this.setState({
            saveable: false,
          });
        }
      });
    }
  }

  /**
   * 使当前行变成可编辑状态
   * @param {object} record 当前行记录
   * @param {boolean} flag 编辑状态
   */
  @Bind()
  handleEditAttachment(record, flag) {
    const {
      dispatch,
      attachment: { data },
    } = this.props;
    this.setState({
      editRow: [
        ...this.state.editRow,
        {
          companyAttachmentId: record.companyAttachmentId,
          attachmentUuid: record.attachmentUuid,
        },
      ],
    });
    const index = data.findIndex(item => item.companyAttachmentId === record.companyAttachmentId);
    dispatch({
      type: 'attachment/editRow',
      payload: {
        data: [
          ...data.slice(0, index),
          {
            ...record,
            _status: flag ? 'update' : null,
          },
          ...data.slice(index + 1),
        ],
      },
    });
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const {
      fetchLoading,
      attachment: { data },
      buttonText = intl.get('hzero.common.button.save').d('保存'),
      showButton = true,
      previousCallback,
      backBtnText = intl.get('hzero.common.button.previous').d('上一步'),
    } = this.props;
    const { selectedRows, saving } = this.state;
    const columns = this.handlecolumns();
    const rowSelection = {
      selectedRowKeys: selectedRows.map(n => n.companyAttachmentId),
      onChange: this.onSelectChange,
      getCheckboxProps: record => ({
        disabled: record._status === 'create',
      }),
    };
    return (
      <div>
        <div>
          <Button icon="plus" style={{ margin: '0 10px 10px 0' }} onClick={() => this.addData()}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          {selectedRows.length > 0 && (
            <Button icon="minus" onClick={() => this.handleDeleteAttachment()}>
              {intl.get('hzero.common.button.delete').d('删除')}
            </Button>
          )}
        </div>
        <EditTable
          loading={fetchLoading}
          rowKey="companyAttachmentId"
          dataSource={data}
          columns={columns}
          rowSelection={rowSelection}
          pagination={false}
          bordered
        />
        <div style={{ marginTop: 40 }}>
          {previousCallback && (
            <Button type="primary" onClick={this.handlePrevious} style={{ marginRight: 16 }}>
              {backBtnText}
            </Button>
          )}
          {showButton && (
            <Button type="primary" onClick={this.handleAddAttachment.bind(this)}>
              {saving && <Icon type="loading" />}
              {buttonText}
            </Button>
          )}
        </div>
      </div>
    );
  }
}
