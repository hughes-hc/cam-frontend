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
  { title: '首页', path: '/', component: 'Home', noShowInMenu: true },
  { title: '登录', path: '/login', component: 'Login', noShowInMenu: true, layout: false },
  { title: '档案导入', path: '/upload', component: 'Archive/Upload', icon: 'upload' },
  { title: '档案查询', path: '/search', component: 'Archive/Search', icon: 'search' },
  { title: '档案详情', path: '/detail/:id', component: 'Archive/Detail', noShowInMenu: true },
  { title: '用户管理', path: '/user', component: 'User/List', icon: 'user' },
  { title: '审计日志', path: '/audit', component: 'Audit/Logs', icon: 'audit' }
]

export default routes
