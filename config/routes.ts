export interface IRoute {
  title?: string
  path: string
  redirect?: string
  component?: string
  icon?: string
  noShowInMenu?: boolean
  layout?: boolean
  routes?: IRoute[]
}

const routes: IRoute[] = [
  { title: '首页', path: '/', redirect: '/company', noShowInMenu: true },
  { title: '登录', path: '/login', component: 'Login', noShowInMenu: true, layout: false },
  {
    title: '企业管理',
    path: '/company',
    icon: 'company',
    routes: [
      { path: '/company', redirect: '/company/list', noShowInMenu: true },
      {
        title: '企业列表',
        path: '/company/list',
        component: 'Company',
        noShowInMenu: true
      },
      {
        title: '企业详情',
        path: '/company/detail/:id',
        component: 'Company/Detail',
        noShowInMenu: true
      }
    ]
  },

  {
    title: '档案管理',
    path: '/archive',
    icon: 'archive',
    routes: [
      { path: '/archive', redirect: '/archive/upload', noShowInMenu: true },
      { title: '档案导入', path: '/archive/upload', component: 'Archive/Upload' },
      { title: '档案查询', path: '/archive/search', component: 'Archive/Search' }
    ]
  },
  { title: '用户管理', path: '/account', component: 'Account', icon: 'account' },
  { title: '审计日志', path: '/audit', component: 'Audit', icon: 'audit' }
]

export default routes
