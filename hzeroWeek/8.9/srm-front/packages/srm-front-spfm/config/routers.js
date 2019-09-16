module.exports = [
  {
    path: "/spfm/org-info",
    models: ['hpfm/group'],
    component: "hpfm/OrgInfo"
  },
  {
    path: "/spfm/org-info/group",
    models: ['hpfm/group'],
    component: "hpfm/OrgInfo/Group"
  },
  {
    path: "/spfm/org-info/company",
    models: [
      'company',
      'enterprise/enterpriseEdit',
      'enterprise/legal',
      'enterprise/business',
      'enterprise/contactPerson',
      'enterprise/address',
      'enterprise/bank',
      'enterprise/financeInfo',
      'enterprise/attachment',
    ],
    component: "Company"
  },
  {
    path: "/spfm/org-info/purchase-org",
    models: ['hpfm/purchaseOrg'],
    component: "hpfm/OrgInfo/PurchaseOrg"
  },
  {
    path: "/spfm/org-info/store-room",
    models: ['hpfm/storeRoom'],
    component: "hpfm/OrgInfo/StoreRoom"
  },
  {
    path: "/spfm/org-info/operation-unit",
    models: ['hpfm/operationUnit'],
    component: "hpfm/OrgInfo/OperationUnit"
  },
  {
    path: "/spfm/org-info/inventory-org",
    models: ['hpfm/inventoryOrg'],
    component: "hpfm/OrgInfo/InventoryOrg"
  },
  {
    path: "/spfm/org-info/purchase-agent",
    models: ['hpfm/purchaseAgent'],
    component: "hpfm/OrgInfo/PurchaseAgent"
  },
  {
    path: "/spfm/org-info/library-position",
    models: ['hpfm/libraryPosition'],
    component: "hpfm/OrgInfo/LibraryPosition"
  },
  {
    path: "/spfm/purchase-order",
    models: ['purchaseOrder'],
    component: "PurchaseOrder"
  },
  {
    path: "/spfm/event",
    models: [],
    components: [
      {
        path: "/spfm/event/list",
        models: ['event'],
        component: "Event"
      },
      {
        path: "/spfm/event/handle",
        models: ['eventHandle'],
        component: "Event/EventHandle"
      }
    ]
  },
  {
    path: "/spfm/event-org",
    models: [],
    components: [
      {
        path: "/spfm/event-org/list",
        models: ['event'],
        component: "Event"
      },
      {
        path: "/spfm/event-org/handle",
        models: ['eventHandle'],
        component: "Event/EventHandle"
      }
    ]
  },
  {
    path: "/spfm/event-message",
    models: ['eventMessage'],
    component: "EventMessage"
  },
  {
    path: "/spfm/event-message-org",
    models: ['eventMessage'],
    component: "EventMessage"
  },
  {
    path: "/spfm/event-category",
    models: ['eventCategory'],
    component: "EventCategory"
  },
  {
    path: "/spfm/event-category-org",
    models: ['eventCategory'],
    component: "EventCategory"
  },
  {
    path: "/spfm/event-data-type",
    models: ['eventDataType'],
    component: "EventDataType"
  },
  {
    path: "/spfm/event-data-type-org",
    models: ['eventDataType'],
    component: "EventDataType"
  },
  {
    path: "/spfm/purchase-transaction",
    models: ['purchaseTransaction'],
    component: "PurchaseTransaction"
  },
  {
    path: "/spfm/enterprise/edit",
    models: [
      'enterprise/enterpriseEdit',
      'enterprise/legal',
      'enterprise/business',
      'enterprise/contactPerson',
      'enterprise/address',
      'enterprise/bank',
      'enterprise/financeInfo',
      'enterprise/attachment'
    ],
    component: "Enterprise/EnterpriseEdit"
  },
  {
    path: "/spfm/enterprise/register",
    models: [],
    // component: "Enterprise/Register"
    components: [
      {
        path: "/spfm/enterprise/register",
        models: [],
        component: "Enterprise/Register"
      },
      {
        path: "/spfm/enterprise/register/legal",
        models: ['enterprise/legal'],
        component: "Enterprise/Register/LegalInfo"
      },
      {
        path: "/spfm/enterprise/register/business",
        models: ['enterprise/business'],
        component: "Enterprise/Register/BusinessInfo"
      },
      {
        path: "/spfm/enterprise/register/contact",
        models: ['enterprise/contactPerson'],
        component: "Enterprise/Register/ContactPerson"
      },
      {
        path: "/spfm/enterprise/register/address",
        models: ['enterprise/address'],
        component: "Enterprise/Register/AddressInfo"
      },
      {
        path: "/spfm/enterprise/register/bank",
        models: ['enterprise/bank'],
        component: "Enterprise/Register/BankInfo"
      },
      {
        path: "/spfm/enterprise/register/invoice",
        models: ['enterprise/invoiceInfo'],
        component: "Enterprise/Register/InvoiceInfo"
      },
      {
        path: "/spfm/enterprise/register/finance",
        models: ['enterprise/financeInfo'],
        component: "Enterprise/Register/FinanceInfo"
      },
      {
        path: "/spfm/enterprise/register/attachment",
        models: ['enterprise/attachment'],
        component: "Enterprise/Register/AttachmentInfo"
      },
      {
        path: "/spfm/enterprise/register/preview",
        models: ['enterprise/preview'],
        component: "Enterprise/Register/PreviewInfo"
      },
      {
        path: "/spfm/enterprise/register/result",
        models: [],
        component: "Enterprise/Register/ProcessInfo"
      },
    ]
  },
  // {
  //   path: "/spfm/enterprise/register/legal",
  //   models: ['enterprise/legal'],
  //   component: "Enterprise/Register/LegalInfo"
  // },
  // {
  //   path: "/spfm/enterprise/register/business",
  //   models: ['enterprise/business'],
  //   component: "Enterprise/Register/BusinessInfo"
  // },
  // {
  //   path: "/spfm/enterprise/register/contact",
  //   models: ['enterprise/contactPerson'],
  //   component: "Enterprise/Register/ContactPerson"
  // },
  // {
  //   path: "/spfm/enterprise/register/address",
  //   models: ['enterprise/address'],
  //   component: "Enterprise/Register/AddressInfo"
  // },
  // {
  //   path: "/spfm/enterprise/register/bank",
  //   models: ['enterprise/bank'],
  //   component: "Enterprise/Register/BankInfo"
  // },
  // {
  //   path: "/spfm/enterprise/register/invoice",
  //   models: ['enterprise/invoiceInfo'],
  //   component: "Enterprise/Register/InvoiceInfo"
  // },
  // {
  //   path: "/spfm/enterprise/register/finance",
  //   models: ['enterprise/financeInfo'],
  //   component: "Enterprise/Register/FinanceInfo"
  // },
  // {
  //   path: "/spfm/enterprise/register/attachment",
  //   models: ['enterprise/attachment'],
  //   component: "Enterprise/Register/AttachmentInfo"
  // },
  // {
  //   path: "/spfm/enterprise/register/preview",
  //   models: ['enterprise/preview'],
  //   component: "Enterprise/Register/PreviewInfo"
  // },
  // {
  //   path: "/spfm/enterprise/register/result",
  //   models: [],
  //   component: "Enterprise/Register/ProcessInfo"
  // },
  {
    path: "/spfm/certification-approval",
    models: [],
    components: [
      {
        path: "/spfm/certification-approval/list",
        models: ['enterprise/approval'],
        component: "Enterprise/Approval/List"
      },
      {
        path: "/spfm/certification-approval/detail/:id",
        models: ['enterprise/approval'],
        component: "Enterprise/Approval/Detail"
      }
    ]
  },
  {
    path: "/spfm/partner-list",
    models: [],
    component:'PartnerList'
  },
  {
    path: "/spfm/partner-list/supplier",
    models: ['supplier'],
    component: "PartnerList/Supplier"
  },
  {
    path: "/spfm/partner-list/customer",
    models: ['customer'],
    component: "PartnerList/Customer"
  },
  {
    path: "/spfm/import-erp",
    models: ['importErp'],
    component: "PartnerList/ImportErp"
  },
  {
    path: "/spfm/company-search",
    models: [],
    components: [
      {
        path: "/spfm/company-search/purchaser",
        models: ['companySearchPurchaser'],
        component: "CompanySearch/CompanySearchPurchaser"
      },
      {
        path: "/spfm/company-search/supplier",
        models: ['companySearchSupplier'],
        component: "CompanySearch/CompanySearchSupplier"
      },
      {
        path: "/spfm/company-search/embedPage",
        models: [],
        component: "CompanySearch/riskEmbedPage"
      }
    ]
  },
  {
    path: "/spfm/invitation-list",
    models: ['invitationList'],
    component: "InvitationList"
  },
  {
    path: "/spfm/dispose-invite/:inviteId",
    models: ['disposeInvite', 'hmsg/userMessage'],
    component: "Invitation"
  },
  {
    path: "/spfm/business-apv-method",
    models: ['businessApvMethod'],
    component: "BusinessApvMethod"
  },
  {
    path: "/spfm/partnership",
    models: ['partnership'],
    component: "Partnership"
  },
  {
    path: "/spfm/investigation-template-define",
    models: [],
    components: [
      {
        path: "/spfm/investigation-template-define/list",
        models: ['investigationTemDefineSite'],
        component: "Investigation/Template/List"
      },
      {
        path: "/spfm/investigation-template-define/detail/:investigateTemplateId",
        models: ['investigationDefinitionSite'],
        component: "Investigation/Template/Detail"
      }
    ]
  },
  {
    path: "/spfm/config-server",
    models: [],
    components: [
      {
        path: "/spfm/config-server/main",
        models: [
          'configServer',
          'sodr/invoiceUpdateRule',
          'sodr/toleranceRule',
          'sodr/onlyInvoiceRule',
          'sodr/billUpdateRule',
        ],
        component: "ConfigServer"
      },
      {
        path: "/spfm/config-server/life-cycle-dim-config",
        models: ['sslm/dimConfig'],
        component: "sslm/DimConfig"
      },
      {
        path: "/spfm/config-server/supplier-life-config",
        models: ['sslm/supplierLifeConfig'],
        component: "sslm/SupplierLife/Config"
      }
    ]
  },
  {
    path: "/spfm/message-receiver-setting",
    models: ['messageSendConfig'],
    component: "MessageSendConfig"
  },
  {
    path: "/spfm/supplier-kpi-indicator",
    models: ['supplierKpiIndicator'],
    component: "SupplierKpiIndicator"
  },
  // hptl迁移过来的门户管理
  {
    path: "/spfm/notices",
    models: [],
    authorized: true,
    components: [
      {
        path: "/spfm/notices/list",
        component: "Notice",
        models: [
          "notice"
        ]
      },
      {
        path: "/spfm/notices/detail/:noticeId",
        component: "Notice/NoticeDetail",
        models: [
          "notice"
        ]
      },
    ]
  },
  {
    path: "/spfm/portal-assign",
    models: [],
    authorized: true,
    components: [
      {
        path: "/spfm/portal-assign/list",
        component: "PortalAssign",
        title: "门户分配",
        models: [
          "portalAssign", "templates"
        ]
      },
      {
        path: "/spfm/portal-assign/template/edit/:configId",
        component: "PortalAssign/TemplateEdit",
        models: [
          "portalAssign",
          "templatesConfig"
        ]
      }
    ]
  },
  {
    path: "/spfm/templates-config",
    authorized: true,
    title: "模板配置",
    models: [],
    components: [
      {
        path: "/spfm/templates-config/list",
        component: "TemplatesConfig",
        models: [
          "templatesConfig",
          "hpfm/group"
        ]
      },
      {
        path: "/spfm/templates-config/edit/:configId/:assignId",
        component: "TemplatesConfig/TemplateEdit",
        models: [
          "portalAssign",
          "templatesConfig"
        ]
      },
    ],
  },
  {
    path: '/workplace',
    component: 'Dashboard/WorkPlace',
    models: [
      'hpfm/workplace',
    ],
  },
  {
    path: '/spfm/amkt-appstore',
    title: '应用商城',
    models: [],
    authorized: true,
    components: [
      {
        path: '/spfm/amkt-appstore/home',
        component: 'Amkt/AppStore',
        models: ["amkt/appStore", "amkt/shoppingCart"],
      },
      {
        path: "/spfm/amkt-appstore/shopping-cart",
        models: [
          "amkt/shoppingCart"
        ],
        component: 'Amkt/ShoppingCart',
      },
      {
        path: "/spfm/amkt-appstore/application",
        models: [
          "amkt/shoppingCart"
        ],
        component: "Amkt/ShoppingCart/Application",
      },
    ],
  },
  // 移入到应用商城子页面
  // {
  //   path: "/spfm/shopping-cart",
  //   key: '/spfm/shopping-cart',
  //   components: [
  //     {
  //       path: "/spfm/shopping-cart/list",
  //       models: [
  //         "amkt/shoppingCart"
  //       ],
  //       component: 'Amkt/ShoppingCart',
  //     },
  //     {
  //       path: "/spfm/shopping-cart/application",
  //       models: [
  //         "amkt/shoppingCart"
  //       ],
  //       component: "Amkt/ShoppingCart/Application",
  //     },
  //   ],
  //   authorized: true,
  // },
  {
    path: "/spfm/amkt-servelog",
    authorized: true,
    title: "服务开通记录",
    models: [],
    components: [
      {
        path: "/spfm/amkt-servelog/list",
        component: "Amkt/ServeLog",
        models: ["amkt/serveLog"]
      },
      {
        path: "/spfm/amkt-servelog/detail/:requestHeaderId",
        component: "Amkt/ServeLog/Detail",
        models: ["amkt/serveLog"]
      },
    ],
  },
  {
    path: '/spfm/amkt-module-manage',
    component: 'Amkt/ModuleManage',
    models: [
      "amkt/moduleManage",
    ],
    title: '租户模块管理',
    authorized: true,
  },
  {
    path: "/spfm/account-configuration",
    models: [
      "amkt/accountConfiguration"
    ],
    component: "Amkt/AccountConfiguration",
    key: '/spfm/account-configuration',
    title: '服务账号配置',
    authorized: true,
  },
  {
    path: "/spfm/platform-credit-config",
    models: ['creditConfig'],
    component: "CreditConfig",
    authorized: true,
  },
];
