import React from 'react';

import HzeroWorkplace from 'hzero-front/lib/routes/Dashboard/Workplace';
import { dynamicWrapper } from '@/utils/router';

const cardsConfig = [
  // FIXME: 直接使用了 window.dvaApp 需要注意
  {
    code: 'SRM_CommonlyUsed',
    component: async () => {
      return dynamicWrapper(window.dvaApp, ['srmCards'], () =>
        import('../Dashboard/SRM_CommonlyUsed')
      );
    },
  },
  {
    code: 'SRM_CustomerManagement',
    component: async () => {
      return dynamicWrapper(window.dvaApp, ['srmCards'], () =>
        import('../Dashboard/SRM_CustomerManagement')
      );
    },
  },
  {
    code: 'SRM_Delivery',
    component: async () => {
      return dynamicWrapper(window.dvaApp, ['srmCards'], () => import('../Dashboard/SRM_Delivery'));
    },
  },
  {
    code: 'SRM_Financial',
    component: async () => {
      return dynamicWrapper(window.dvaApp, ['srmCards'], () =>
        import('../Dashboard/SRM_Financial')
      );
    },
  },
  {
    code: 'SRM_Goods',
    component: async () => {
      return dynamicWrapper(window.dvaApp, ['srmCards'], () => import('../Dashboard/SRM_Goods'));
    },
  },
  {
    code: 'SRM_LeadershipReport',
    component: async () => {
      return dynamicWrapper(window.dvaApp, ['srmCards'], () =>
        import('../Dashboard/SRM_LeadershipReport')
      );
    },
  },
  {
    code: 'SRM_PurchaseOrder',
    component: async () => {
      return dynamicWrapper(window.dvaApp, ['srmCards'], () =>
        import('../Dashboard/SRM_PurchaseOrder')
      );
    },
  },
  {
    code: 'SRM_PurchaserQualityBusiness',
    component: async () => {
      return dynamicWrapper(window.dvaApp, ['srmCards'], () =>
        import('../Dashboard/SRM_PurchaserQualityBusiness')
      );
    },
  },
  {
    code: 'SRM_PurchasingReport',
    component: async () => {
      return dynamicWrapper(window.dvaApp, ['srmCards'], () =>
        import('../Dashboard/SRM_PurchasingReport')
      );
    },
  },
  {
    code: 'SRM_SalesOrder',
    component: async () => {
      return dynamicWrapper(window.dvaApp, ['srmCards'], () =>
        import('../Dashboard/SRM_SalesOrder')
      );
    },
  },
  {
    code: 'SRM_SupplierFinancial',
    component: async () => {
      return dynamicWrapper(window.dvaApp, ['srmCards'], () =>
        import('../Dashboard/SRM_SupplierFinancial')
      );
    },
  },
  {
    code: 'SRM_SupplierManagement',
    component: async () => {
      return dynamicWrapper(window.dvaApp, ['srmCards'], () =>
        import('../Dashboard/SRM_SupplierManagement')
      );
    },
  },
  {
    code: 'SRM_SupplierQualityBusiness',
    component: async () => {
      return dynamicWrapper(window.dvaApp, ['srmCards'], () =>
        import('../Dashboard/SRM_SupplierQualityBusiness')
      );
    },
  },
  {
    code: 'SRM_SupplierTodoWorkflow',
    component: async () => {
      return dynamicWrapper(window.dvaApp, ['srmCards'], () =>
        import('../Dashboard/SRM_SupplierTodoWorkflow')
      );
    },
  },
  {
    code: 'SRM_SupplyReport',
    component: async () => {
      return dynamicWrapper(window.dvaApp, ['srmCards'], () =>
        import('../Dashboard/SRM_SupplyReport')
      );
    },
  },
  {
    code: 'SRM_TodoWorkflow',
    component: async () => {
      return dynamicWrapper(window.dvaApp, ['srmCards'], () =>
        import('../Dashboard/SRM_TodoWorkflow')
      );
    },
  },
  {
    code: 'SRM_Message',
    component: async () => {
      return dynamicWrapper(window.dvaApp, ['srmCards'], () => import('../Dashboard/SRM_Message'));
    },
  },
  {
    code: 'SRM_RiskMonitoring',
    component: async () => {
      return dynamicWrapper(window.dvaApp, ['srmCards'], () =>
        import('../Dashboard/SRM_RiskMonitoring')
      );
    },
  },
];

export default class WorkPlace extends React.Component {
  render() {
    return <HzeroWorkplace cardsConfig={cardsConfig} />;
  }
}
