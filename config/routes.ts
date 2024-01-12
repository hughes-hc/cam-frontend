export interface IRoute {
  title?: string
  path: string
  component: string
  icon?: string
  noShowInMenu?: boolean
  routes?: IRoute[]
}

const routes: IRoute[] = [
  { title: '首页', path: '/', component: 'home', noShowInMenu: true },
  { title: '登录', path: '/login', component: 'login', noShowInMenu: true },
  { title: '档案导入', path: '/import', component: 'import', icon: 'import' },
  { title: '档案查询', path: '/search', component: 'search', icon: 'search' },
  { title: '用户管理', path: '/user', component: 'user', icon: 'user' },
  { title: '审计日志', path: '/audit', component: 'audit', icon: 'audit' }
]

export default routes
