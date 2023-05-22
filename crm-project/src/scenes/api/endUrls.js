export const OBJECT_API_ACCOUNT='Account'
export const GET_ACCOUNT='/accounts'
export const POST_ACCOUNT='/account'
export const DELETE_ACCOUNT='/account/'

export const OBJECT_API_CONTACT='Contact'
export const GET_CONTACT ='/contacts'
export const POST_CONTACT ='/contact'
export const DELETE_CONTACT ='/contact/'

export const OBJECT_API_INVENTORY='Inventory Management'
export const GET_INVENTORY ='/inventories'
export const POST_INVENTORY ='/inventory'
export const DELETE_INVENTORY ='/inventory/'

export const OBJECT_API_ENQUIRY='Lead'
export const GET_ENQUIRY ='/enquiries'
export const POST_ENQUIRY ='/enquiry'
export const DELETE_ENQUIRY ='/enquiry/'
export const GET_ENQUIRY_BY_MONTH='/enquiries?'


export const OBJECT_API_DEAL='Opportunity'
export const GET_DEAL ='/deals'
export const POST_DEAL ='/deal'
export const DELETE_DEAL ='/deal/'

export const OBJECT_API_PERMISSIONS='Permissions'
export const GET_PERMISSIONS ='/permissions'
export const POST_PERMISSIONS ='/permission'
export const DELETE_PERMISSIONS ='/permission/'

export const OBJECT_API_ROLE='Role'
export const GET_ROLE ='/roles'
export const POST_ROLE='/role'
export const DELETE_ROLE='role/'

export const OBJECT_API_EVENT='Task'
export const GET_EVENT='/events'
export const POST_EVENT='/event'
export const DELETE_EVENT='/event/'

export const OBJECT_API_USER='User'
export const GET_USER='/users'
export const POST_USER='/user'
export const DELETE_USER='/user/'

const OBJECT_API = 'User'
const urlDelete = `/delete?code=`;
const urlUsers = `/Users`;
const url = `/UpsertUser`;

const fetchUsersbyName = `/usersbyName`
const urlSendEmailbulk = `/bulkemail`
const urlgetRolesByDept='/roles'