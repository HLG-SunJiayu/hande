module.exports = [
  {
    path: "/sprm/purchase-requisition-inquiry",
    models: [],
    components: [
      {
        path: "/sprm/purchase-requisition-inquiry/list",
        models: [
          "purchaseRequisitionInquiry"
        ],
        component: "PurchaseRequisitionInquiry"
      },
      {
        path: "/sprm/purchase-requisition-inquiry/erp-detail/:id",
        models: [
          "purchaseRequisitionInquiry"
        ],
        component: "PurchaseRequisitionInquiry/ErpDetail"
      },
      {
        path: "/sprm/purchase-requisition-inquiry/not-erp-detail/:id",
        models: [
          "purchaseRequisitionInquiry"
        ],
        component: "PurchaseRequisitionInquiry/NotErpDetail"
      },
    ]
  },
  {
    path: "/sprm/purchase-requisition-creation",
    models: [],
    components: [
      {
        path: "/sprm/purchase-requisition-creation/list",
        models: [
          "purchaseRequisitionCreation"
        ],
        component: "PurchaseRequisitionCreation"
      },
      {
        path: "/sprm/purchase-requisition-creation/detail",
        models: [
          "purchaseRequisitionCreation"
        ],
        component: "PurchaseRequisitionCreation/Detail"
      },
    ]
  },
  {
    path: "/sprm/purchase-requisition-cancel",
    models: [],
    components: [
      {
        path: "/sprm/purchase-requisition-cancel/list",
        models: [
          "purchaseRequisitionCancel"
        ],
        component: "PurchaseRequisitionCancel"
      },
      {
        path: "/sprm/purchase-requisition-cancel/detail-erp/:id",
        models: [
          "purchaseRequisitionCancel"
        ],
        component: "PurchaseRequisitionCancel/ERP"
      },
      {
        path: "/sprm/purchase-requisition-cancel/detail-non-erp/:id",
        models: [
          "purchaseRequisitionCancel"
        ],
        component: "PurchaseRequisitionCancel/Detail/NonErpPurchaseRequisition.js"
      },
    ]
  },
  {
    path: "/sprm/purchase-requisition-approval",
    models: [],
    components: [
      {
        path: "/sprm/purchase-requisition-approval/list",
        models: [
          "purchaseRequisitionApproval"
        ],
        component: "PurchaseRequisitionApproval"
      },
      {
        path: "/sprm/purchase-requisition-approval/detail-erp/:id",
        models: [
          "purchaseRequisitionApproval"
        ],
        component: "PurchaseRequisitionApproval/Detail/ErpPurchaseRequisition.js"
      },
      {
        path: "/sprm/purchase-requisition-approval/detail-non-erp/:id",
        models: [
          "purchaseRequisitionApproval"
        ],
        component: "PurchaseRequisitionApproval/Detail/NonErpPurchaseRequisition.js"
      },
    ]
  }
];
