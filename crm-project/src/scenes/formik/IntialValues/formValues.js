export const AccountInitialValues = {
  accountName: "",
  accountNumber: "",
  annualRevenue: "",
  rating: "",
  type: "",
  phone: "",
  industry: "",
  billingAddress: "",
  billingCountry: "",
  billingCity: "",
  billingCities: [],
  createdBy: "",
  modifiedBy: "",
  createdDate: "",
  modifiedDate: "",
  InventoryId: "",
  inventoryDetails: "",
};

export const AccountSavedValues = (singleAccount) => {
  return {
    accountName: singleAccount?.accountName ?? "",
    accountNumber: singleAccount?.accountNumber ?? "",
    annualRevenue: singleAccount?.annualRevenue ?? "",
    rating: singleAccount?.rating ?? "",
    type: singleAccount?.type ?? "",
    phone: singleAccount?.phone ?? "",
    industry: singleAccount?.industry ?? "",
    billingAddress: singleAccount?.billingAddress ?? "",
    billingCountry: singleAccount?.billingCountry ?? "",
    billingCity: singleAccount?.billingCity ?? "",
    billingCities: singleAccount?.billingCities ?? "",
    createdBy: singleAccount?.createdBy?.userFullName ?? "",
    modifiedBy: singleAccount?.modifiedBy?.userFullName ?? "",
    createdDate: new Date(singleAccount?.createdDate).toLocaleString(),
    modifiedDate: new Date(singleAccount?.modifiedDate).toLocaleString(),
    _id: singleAccount?._id ?? "",
    inventoryDetails: singleAccount?.inventoryDetails ?? "",
    InventoryId: singleAccount?.InventoryId ?? "",
    InventoryName: singleAccount?.InventoryName ?? "",
  };
};

export const ContactInitialValues = {
  AccountId: "",
  salutation: "",
  firstName: "",
  lastName: "",
  fullName: "",
  dob: "",
  phone: "",
  department: "",
  leadSource: "",
  email: "",
  fullAddress: "",
  description: "",
  createdBy: "",
  modifiedBy: "",
  createdDate: "",
  modifiedDate: "",
};

export const ContactSavedValues = (singleContact) => {
  return {
    AccountId: singleContact?.AccountId ?? "",
    salutation: singleContact?.salutation ?? "",
    firstName: singleContact?.firstName ?? "",
    lastName: singleContact?.lastName ?? "",
    fullName: singleContact?.fullName ?? "",
    phone: singleContact?.phone ?? "",
    dob:
      new Date(singleContact?.dob).getUTCFullYear() +
        "-" +
        ("0" + (new Date(singleContact?.dob).getUTCMonth() + 1)).slice(-2) +
        "-" +
        ("0" + (new Date(singleContact?.dob).getUTCDate() + 1)).slice(-2) || "",

    department: singleContact?.department ?? "",
    leadSource: singleContact?.leadSource ?? "",
    email: singleContact?.email ?? "",
    fullAddress: singleContact?.fullAddress ?? "",
    description: singleContact?.description ?? "",
    createdBy: singleContact?.createdBy.userFullName ?? "",
    modifiedBy: singleContact?.modifiedBy.userFullName ?? "",
    createdDate: new Date(singleContact?.createdDate).toLocaleString(),
    modifiedDate: new Date(singleContact?.modifiedDate).toLocaleString(),
    _id: singleContact?._id ?? "",
    accountDetails: singleContact?.accountDetails ?? "",
  };
};

export const EmailInitialValues = {
  subject: "",
  htmlBody: "",
  recordsData: "",
  attachments: "",
};

export const InventoryInitialValues = {
  projectName: "",
  propertyName: "",
  propertyUnitNumber: "",
  type: "",
  tower: "",
  country: "",
  city: "",
  propertyCities: [],
  floor: "",
  status: "",
  totalArea: "",
  createdBy: "",
  modifiedBy: "",
  createdDate: "",
  modifiedDate: "",
};

export const InventorySavedValues = (singleInventory) => {
  return {
    projectName: singleInventory?.projectName ?? "",
    propertyName: singleInventory?.propertyName ?? "",
    propertyUnitNumber: singleInventory?.propertyUnitNumber ?? "",
    type: singleInventory?.type ?? "",
    tower: singleInventory?.tower ?? "",
    country: singleInventory?.country ?? "",
    city: singleInventory?.city ?? "",
    propertyCities: singleInventory?.propertyCities ?? "",
    floor: singleInventory?.floor ?? "",
    status: singleInventory?.status ?? "",
    totalArea: singleInventory?.totalArea ?? "",
    createdBy: singleInventory?.createdBy.userFullName ?? "",
    modifiedBy: singleInventory?.modifiedBy.userFullName ?? "",
    createdDate: new Date(singleInventory?.createdDate).toLocaleString(),
    modifiedDate: new Date(singleInventory?.modifiedDate).toLocaleString(),
    _id: singleInventory?._id ?? "",
  };
};

export const LeadInitialValues = {
  fullName: "",
  companyName: "",
  designation: "",
  phone: "",
  leadSource: "",
  industry: "",
  leadStatus: "",
  email: "",
  linkedinProfile: "",
  location: "",
  appointmentDate: "",
  demo: "",
  month: "",
  remarks: "",
  primaryPhone: "",
  secondaryPhone: "",
  createdbyId: "",
  createdDate: "",
  modifiedDate: "",
};

export const LeadSavedValues = (singleLead) => {
  return {
    fullName: singleLead?.fullName ?? "",
    companyName: singleLead?.companyName ?? "",
    designation: singleLead?.designation ?? "",
    phone: singleLead?.phone ?? "",
    leadSource: singleLead?.leadSource ?? "",
    industry: singleLead?.industry ?? "",
    leadStatus: singleLead?.leadStatus ?? "",
    email: singleLead?.email ?? "",
    linkedinProfile: singleLead?.linkedinProfile ?? "",
    location: singleLead?.location ?? "",
    primaryPhone: singleLead?.primaryPhone ?? "",
    secondaryPhone: singleLead?.secondaryPhone ?? "",
    appointmentDate:
      new Date(singleLead?.appointmentDate).getUTCFullYear() +
        "-" +
        ("0" + (new Date(singleLead?.appointmentDate).getUTCMonth() + 1)).slice(
          -2
        ) +
        "-" +
        ("0" + new Date(singleLead?.appointmentDate).getUTCDate()).slice(-2) ||
      "",
    demo: singleLead?.demo ?? "",
    month: singleLead?.month ?? "",
    remarks: singleLead?.remarks ?? "",
    createdbyId: singleLead?.createdbyId ?? "",
    createdDate: new Date(singleLead?.createdDate).toLocaleString(),
    modifiedDate: new Date(singleLead?.modifiedDate).toLocaleString(),
    _id: singleLead?._id ?? "",
  };
};

export const OpportunityInitialValues = {
  LeadId: "",
  InventoryId: "",
  opportunityName: "",
  type: "",
  leadSource: "",
  amount: "",
  closeDate: "",
  stage: "",
  description: "",
  createdBy: "",
  modifiedBy: "",
  createdDate: "",
  modifiedDate: "",
  inventoryDetails: "",
  leadDetails: "",
};

export const OpportunitySavedValues = (singleOpportunity) => {
  return {
    LeadId: singleOpportunity?.LeadId ?? "",
    InventoryId: singleOpportunity?.InventoryId ?? "",
    opportunityName: singleOpportunity?.opportunityName ?? "",
    type: singleOpportunity?.type ?? "",
    leadSource: singleOpportunity?.leadSource ?? "",
    amount: singleOpportunity?.amount ?? "",
    closeDate:
      new Date(singleOpportunity?.closeDate).getUTCFullYear() +
        "-" +
        (
          "0" +
          (new Date(singleOpportunity?.closeDate).getUTCMonth() + 1)
        ).slice(-2) +
        "-" +
        ("0" + (new Date(singleOpportunity?.closeDate).getUTCDate() + 1)).slice(
          -2
        ) || "",
    stage: singleOpportunity?.stage ?? "",
    description: singleOpportunity?.description ?? "",
    createdBy: singleOpportunity?.createdBy.userFullName ?? "",
    modifiedBy: singleOpportunity?.modifiedBy.userFullName ?? "",
    createdDate: new Date(singleOpportunity?.createdDate).toLocaleString(),
    modifiedDate: new Date(singleOpportunity?.modifiedDate).toLocaleString(),
    _id: singleOpportunity?._id ?? "",
    inventoryDetails: singleOpportunity?.inventoryDetails ?? "",
    leadDetails: singleOpportunity?.leadDetails ?? "",
  };
};

export const TaskInitialValues = {
  subject: "",
  relatedTo: "",
  assignedTo: "",
  StartDate: "",
  EndDate: "",
  description: "",
  attachments: null,
  object: "",
  status:"",
  createdBy: "",
  modifiedBy: "",
  createdDate: "",
  modifiedDate: "",
};

export const TaskSavedValues = (singleTask) => {
  return {
    subject: singleTask?.subject ?? "",
    relatedTo: singleTask?.relatedTo ?? "",
    assignedTo: singleTask?.assignedTo ?? "",
    description: singleTask?.description ?? "",
    attachments: singleTask?.attachments ?? "",
    object: singleTask?.object ?? "",
    status: singleTask?.status ?? "",
    createdBy: singleTask?.createdBy.userFullName ?? "",
    modifiedBy: singleTask?.modifiedBy.userFullName ?? "",
    createdDate: new Date(singleTask?.createdDate).toLocaleString(),
    modifiedDate: new Date(singleTask?.modifiedDate).toLocaleString(),
    _id: singleTask?._id ?? "",
    StartDate: new Date(singleTask?.StartDate),
    EndDate: new Date(singleTask?.EndDate),
  };
};

export const UserInitialValues = {
  firstName: "",
  lastName: "",
  fullName: "",
  userName: "",
  email: "",
  phone: "",
  departmentName: "",
  roleDetails: "",
  createdBy: "",
  modifiedBy: "",
  createdDate: "",
  modifiedDate: "",
};

export const UserSavedValues = (singleUser) => {
  return {
    firstName: singleUser?.firstName ?? "",
    lastName: singleUser?.lastName ?? "",
    fullName: singleUser?.fullName ?? "",
    userName: singleUser?.userName ?? "",
    email: singleUser?.email ?? "",
    phone: singleUser?.phone ?? "",
    departmentName: singleUser?.departmentName ?? "",
    createdDate: new Date(singleUser?.createdDate).toLocaleString(),
    modifiedDate: new Date(singleUser?.modifiedDate).toLocaleString(),
    _id: singleUser?._id ?? "",
    roleDetails: singleUser?.roleDetails ?? "",
    createdBy: singleUser?.createdBy.userFullName ?? "",
    modifiedBy: singleUser?.modifiedBy.userFullName ?? "",
  };
};

export const RoleInitialValues = {
  roleName: "",
  departmentName: "",
  createdBy: "",
  modifiedBy: "",
  createdDate: "",
  modifiedDate: "",
};

export const RoleSavedValues = (singleRole) => {
  return {
    roleName: singleRole?.roleName ?? "",
    departmentName: singleRole?.departmentName ?? "",
    createdDate: new Date(singleRole?.createdDate).toLocaleString(),
    modifiedDate: new Date(singleRole?.modifiedDate).toLocaleString(),
    _id: singleRole?._id ?? "",
    createdBy: (() => {
      try {
        return JSON.parse(singleRole?.createdBy);
      } catch {
        return "";
      }
    })(),
    modifiedBy: (() => {
      try {
        return JSON.parse(singleRole?.modifiedBy);
      } catch {
        return "";
      }
    })(),
  };
};

export const PermissionSetInitialValues = {
  permissionName: "",
  department:"",
  roleDetails:[{}],
  // userDetails: "",
  createdDate: "",
  modifiedDate: "",
  createdBy: "",
  modifiedBy: "",
};

export const PermissionSetSavedValues = (singlePermission) => {
  return {
    permissionName: singlePermission?.permissionName ?? "",
    department: singlePermission?.department ?? "",
    createdDate: new Date(singlePermission?.createdDate).toLocaleString(),
    modifiedDate: new Date(singlePermission?.modifiedDate).toLocaleString(),
    _id: singlePermission?._id ?? "",
    roleDetails:singlePermission?.roleDetails,
    RoleId:singlePermission?.RoleId,
    createdBy: singlePermission?.createdBy ?? "",
    modifiedBy: singlePermission?.modifiedBy ?? "",
    // roleDetails: (() => {
    //   try {
    //     return JSON.parse(singlePermission?.roleDetails);
    //   } catch {
    //     return "";
    //   }
    // })(),
    // userDetails: (() => {
    //   try {
    //     return JSON.parse(singlePermission?.userDetails);
    //   } catch {
    //     return "";
    //   }
    // })(),
    // createdBy: (() => {
    //   try {
    //     return JSON.parse(singlePermission?.createdBy);
    //   } catch {
    //     return "";
    //   }
    // })(),
    // modifiedBy: (() => {
    //   try {
    //     return JSON.parse(singlePermission?.modifiedBy);
    //   } catch {
    //     return "";
    //   }
    // })(),
    permissionSets: (() => {
      try {
        return JSON.parse(singlePermission?.permissionSets);
      } catch {
        return "";
      }
    })(),
  };
};

export const WhatsappInitialValues = {
  subject: "",
  recordsData: "",
  attachments: "",
}

export const SignUpInitialValue = {
  userName: "",
  email: "",
  password: "",
  confirmPassword: "",
  fullName: "",
  phone: "",
};

export const LoginInitialValue = {
  userName: "",
  password: "",
};

export const DashboardInitialValues = {
  dashboardName: "",
  chartType:"",
  objectName:"",
  fields:[],  
  createdDate: "",
  modifiedDate: "",
  createdBy: "",
  modifiedBy: "",
};

export const DashboardSavedValues = (singleDashboard) => {
  return {
    dashboardName: singleDashboard?.dashboardName ?? "",
    chartType: singleDashboard?.chartType ?? "",
    objectName: singleDashboard?.objectName ?? "",
    fields: singleDashboard?.fields ?? "",
    createdDate: singleDashboard?.createdDate ?? "",
    modifiedDate: singleDashboard?.modifiedDate ?? "",
    createdBy: singleDashboard?.createdBy.userFullName ?? "",
    modifiedBy: singleDashboard?.modifiedBy.userFullName ?? "",
  }
}