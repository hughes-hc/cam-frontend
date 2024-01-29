export interface IRoute {
  title?: string
  path: string
  component: string
  icon?: string
  noShowInMenu?: boolean
  layout?: boolean
  routes?: IRoute[]
}

const routes: IRoute[] = [
  // { title: '首页', path: '/', component: 'Home', noShowInMenu: true },
  { title: '登录', path: '/login', component: 'Login', noShowInMenu: true, layout: false },
  { title: '企业信息', path: '/company', component: 'Company', icon: 'search' },
  {
    title: '企业详情',
    path: '/company/detail/:id',
    component: 'Company/Detail',
    noShowInMenu: true
  },
  { title: '档案导入', path: '/upload', component: 'Archive/Upload', icon: 'upload' },
  { title: '档案查询', path: '/search', component: 'Archive/Search', icon: 'search' },
  { title: '用户管理', path: '/user', component: 'User', icon: 'user' },
  { title: '审计日志', path: '/audit', component: 'Audit', icon: 'audit' }
]

export default routes
