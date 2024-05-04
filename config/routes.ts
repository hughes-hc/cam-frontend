import { IAccessKey } from '@/hooks/useAccess'

export interface IRoute {
  title?: string
  path: string
  redirect?: string
  component?: string
  noAccess?: boolean
  wrappers?: string[]
  accessKey?: IAccessKey[]
  icon?: string
  noShowInMenu?: boolean
  layout?: boolean
  routes?: IRoute[]
}

const routes: IRoute[] = [
  { title: '首页', path: '/', redirect: '/company', noShowInMenu: true, noAccess: true },
  {
    title: '登录',
    path: '/login',
    component: 'Login',
    noShowInMenu: true,
    layout: false,
    noAccess: true
  },
  {
    title: '企业管理',
    path: '/company',
    icon: 'company',
    accessKey: ['canViewCompanyList', 'canViewCompanyDetail'],
    routes: [
      { path: '/company', redirect: '/company/list', noShowInMenu: true },
      {
        title: '企业列表',
        path: '/company/list',
        component: 'Company',
        noShowInMenu: true,
        accessKey: ['canViewCompanyList']
      },
      {
        title: '企业详情',
        path: '/company/detail/:id',
        component: 'Company/Detail',
        noShowInMenu: true,
        accessKey: ['canViewCompanyDetail']
      }
    ]
  },

  {
    title: '档案管理',
    path: '/archive',
    icon: 'archive',
    accessKey: ['canAddArchive', 'canViewArchiveSearch'],
    routes: [
      { path: '/archive', redirect: '/archive/upload', noShowInMenu: true },
      {
        title: '档案导入',
        path: '/archive/upload',
        component: 'Archive/Upload',
        accessKey: ['canAddArchive']
      },
      {
        title: '档案查询',
        path: '/archive/search',
        component: 'Archive/Search',
        accessKey: ['canViewArchiveSearch']
      }
    ]
  },
  {
    title: '用户管理',
    path: '/account',
    component: 'Account',
    icon: 'account',
    accessKey: ['canViewAccountList']
  },
  {
    title: '审计日志',
    path: '/audit',
    component: 'Audit',
    icon: 'audit',
    accessKey: ['canViewAuditList']
  },
  { path: '/403', component: 'Exception/403', noAccess: true },
  { path: '/*', component: 'Exception/404', noAccess: true }
]

export default routes
