import { Row, Col, Card } from "antd"
import { Fragment } from "react";
import { Link } from "umi";
import Icon from '@ant-design/icons';
import importSvg from '../assets/icon/menu/import.svg';
import searchSvg from '../assets/icon/menu/search.svg';
import auditSvg from '../assets/icon/menu/audit.svg';

export default () => {
  const menus = [
    { title: "档案导入", path: "/import", icon: importSvg },
    { title: "档案查询", path: "/search", icon: searchSvg },
    { title: "操作记录查询", path: "/audit", icon: auditSvg },
  ]

  return (
    <Row gutter={16} justify="center" align="middle">
      {menus.map(({ title, path, icon }, index) => (
        <Col span={4} key={index}>
        <Link to={path}>
          <Card hoverable bodyStyle={{display: "flex", justifyContent: "center", alignItems: "center"}}>
            <h2>{title}</h2>
            {/* <Icon component={icon}/> */}
          </Card>
        </Link>
      </Col>
      ))}
    </Row>
  );
}
