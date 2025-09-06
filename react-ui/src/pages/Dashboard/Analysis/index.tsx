import { PageContainer } from '@ant-design/pro-components';
import { Card, Col, Row, Statistic, Tooltip, List, Tag, Badge, Progress } from 'antd';
import { FormattedMessage, useIntl } from '@umijs/max';
import React, { useEffect, useState } from 'react';
import { InfoCircleOutlined, AlertOutlined, ToolOutlined, UserOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { Column } from '@ant-design/plots';
import styles from './style.less';

// 模拟数据
const mockData = {
  equipmentTotal: 256,
  equipmentFault: 15,
  equipmentWarning: 28,
  equipmentNormal: 213,
  personnelTotal: 120,
  personnelOnline: 98,
  operationTime: 1256,
  productionCount: 8560,
};

// 模拟设备故障排行数据
const faultRankData = [
  { name: '注塑机A区', value: 5 },
  { name: '冲压机B区', value: 4 },
  { name: '装配线C区', value: 3 },
  { name: '包装线D区', value: 2 },
  { name: '测试台E区', value: 1 },
];

// 模拟生产数据
const productionData = [
  { month: '1月', count: 1200 },
  { month: '2月', count: 1500 },
  { month: '3月', count: 1000 },
  { month: '4月', count: 1300 },
  { month: '5月', count: 1800 },
  { month: '6月', count: 1600 },
  { month: '7月', count: 1400 },
  { month: '8月', count: 1700 },
  { month: '9月', count: 1900 },
  { month: '10月', count: 2000 },
  { month: '11月', count: 1800 },
  { month: '12月', count: 2200 },
];

// 模拟安全预警记录数据
const warningRecordsData = [
  { id: 1, time: '2023-06-15 08:30:25', device: '注塑机A', type: '系统告警', description: '设备过热异常', status: '未处理' },
  { id: 2, time: '2023-06-15 09:45:12', device: '冲压机B', type: '人工提交', description: '张三发现液压异常', status: '处理中' },
  { id: 3, time: '2023-06-15 10:15:30', device: '装配线C', type: '系统告警', description: '电压波动超出范围', status: '已处理' },
  { id: 4, time: '2023-06-15 11:20:45', device: '包装线D', type: '系统告警', description: '传送带卡住', status: '未处理' },
  { id: 5, time: '2023-06-15 13:05:18', device: '测试台E', type: '人工提交', description: '李四报告设备噪音异常', status: '处理中' },
  { id: 6, time: '2023-06-15 14:30:22', device: '注塑机B', type: '系统告警', description: '温度传感器故障', status: '未处理' },
  { id: 7, time: '2023-06-15 15:40:10', device: '冲压机A', type: '维护记录', description: '王五完成设备定期维护', status: '已完成' },
  { id: 8, time: '2023-06-15 16:25:33', device: '装配线B', type: '维护记录', description: '赵六更换传动部件', status: '已完成' },
  { id: 9, time: '2023-06-15 17:10:05', device: '测试台C', type: '人工提交', description: '孙七发现校准偏差', status: '处理中' },
  { id: 10, time: '2023-06-15 18:00:15', device: '包装线A', type: '维护记录', description: '周八完成设备清洁', status: '已完成' },
];

const Analysis: React.FC = () => {
  const intl = useIntl();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // 模拟数据加载
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // 合并设备状态和人员数据的卡片组件
  const renderCombinedStatsCards = () => {
    // 计算设备转化率
    const equipmentNormalRate = Math.round((mockData.equipmentNormal / mockData.equipmentTotal) * 100);
    // 计算人员在线率
    const personnelOnlineRate = Math.round((mockData.personnelOnline / mockData.personnelTotal) * 100);

    // 创建环形进度条数据
    const storeData = [
      { id: 0, title: intl.formatMessage({ id: 'dashboard.analysis.equipment.total' }), rate: equipmentNormalRate, color: { '0%': '#108ee9', '100%': '#87d068' } },
      { id: 1, title: intl.formatMessage({ id: 'dashboard.analysis.equipment.fault' }), rate: Math.round(((mockData.equipmentTotal - mockData.equipmentFault) / mockData.equipmentTotal) * 100), color: { '0%': '#ff4d4f', '100%': '#ff7a45' } },
      { id: 2, title: intl.formatMessage({ id: 'dashboard.analysis.equipment.warning' }), rate: Math.round(((mockData.equipmentTotal - mockData.equipmentWarning) / mockData.equipmentTotal) * 100), color: { '0%': '#faad14', '100%': '#ffc53d' } },
      { id: 3, title: intl.formatMessage({ id: 'dashboard.analysis.equipment.normal' }), rate: Math.round((mockData.equipmentNormal / mockData.equipmentTotal) * 100), color: { '0%': '#52c41a', '100%': '#95de64' } },
      { id: 4, title: intl.formatMessage({ id: 'dashboard.analysis.personnel.total' }), rate: personnelOnlineRate, color: { '0%': '#1890ff', '100%': '#69c0ff' } },
      { id: 5, title: intl.formatMessage({ id: 'dashboard.analysis.personnel.online' }), rate: Math.round((mockData.personnelOnline / mockData.personnelTotal) * 100), color: { '0%': '#722ed1', '100%': '#b37feb' } },
    ];

    return (
      <div className={styles.storesContainer}>
        <h4 className={styles.storesTitle}>
          <FormattedMessage id="dashboard.analysis.stores.title" defaultMessage="设备转化率" />
        </h4>
        <Row gutter={[16, 16]}>
          {storeData.map((store) => (
            <Col key={store.id} xs={12} sm={8} md={6} lg={3}>
              <div className={styles.storeItem}>
                <div className={styles.storeTitle}>{store.title}</div>
                <div className={styles.storeProgress}>
                  <Progress
                    type="dashboard"
                    percent={store.rate}
                    width={80}
                    strokeColor={store.color}
                  />
                </div>
                <div className={styles.storeLabel}>
                  <FormattedMessage id="dashboard.analysis.stores.rate" defaultMessage="" />
                </div>
              </div>
            </Col>
          ))}
        </Row>


      </div>
    );
  };

  // 生产数据统计图表
  const renderProductionChart = () => {
    const config = {
      data: productionData,
      xField: 'month',
      yField: 'count',
      label: {
        position: 'middle',
        style: {
          fill: '#FFFFFF',
          opacity: 0.6,
        },
      },
      meta: {
        month: {
          alias: '月份',
        },
        count: {
          alias: '生产数量',
        },
      },
    };

    return (
      <Card
        loading={loading}
        title={<FormattedMessage id="dashboard.analysis.production.statistics" defaultMessage="生产数据统计" />}
        style={{ marginTop: 24 }}
      >
        <Column {...config} />
      </Card>
    );
  };

  // 设备故障排行榜
  const renderFaultRank = () => {
    return (
      <Card
        loading={loading}
        title={<FormattedMessage id="dashboard.analysis.fault.rank" defaultMessage="设备故障排行" />}
        style={{ marginTop: 24 }}
      >
        <ul className={styles.rankList}>
          {faultRankData.map((item, i) => (
            <li key={item.name}>
              <span className={`${styles.rankingItemNumber} ${i < 3 ? styles.active : ''}`}>{i + 1}</span>
              <span className={styles.rankingItemTitle}>{item.name}</span>
              <span className={styles.rankingItemValue}>{item.value}次</span>
            </li>
          ))}
        </ul>
      </Card>
    );
  };

  // 安全预警模块
  const renderWarningRecords = () => {
    // 根据状态获取标签颜色
    const getStatusTag = (status: string) => {
      switch (status) {
        case '未处理':
          return <Tag color="error">{status}</Tag>;
        case '处理中':
          return <Tag color="warning">{status}</Tag>;
        case '已处理':
        case '已完成':
          return <Tag color="success">{status}</Tag>;
        default:
          return <Tag>{status}</Tag>;
      }
    };

    // 根据类型获取图标
    const getTypeIcon = (type: string) => {
      switch (type) {
        case '系统告警':
          return <AlertOutlined style={{ color: '#ff4d4f' }} />;
        case '人工提交':
          return <UserOutlined style={{ color: '#faad14' }} />;
        case '维护记录':
          return <ToolOutlined style={{ color: '#52c41a' }} />;
        default:
          return <InfoCircleOutlined />;
      }
    };

    return (
      <Card
        loading={loading}
        title={<FormattedMessage id="dashboard.analysis.warning.records" defaultMessage="安全预警模块" />}
        style={{ marginTop: 24 }}
        className={styles.warningRecordsCard}
      >
        <List
          size="small"
          dataSource={warningRecordsData}
          renderItem={(item) => (
            <List.Item key={item.id}>
              <List.Item.Meta
                avatar={getTypeIcon(item.type)}
                title={
                  <div>
                    <span style={{ marginRight: 8 }}>{item.device}</span>
                    <Tag color="blue">{item.type}</Tag>
                    {getStatusTag(item.status)}
                  </div>
                }
                description={
                  <div>
                    <ClockCircleOutlined style={{ marginRight: 8 }} />
                    <span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>{item.time}</span>
                    <div style={{ marginTop: 4 }}>{item.description}</div>
                  </div>
                }
              />
            </List.Item>
          )}
          pagination={false}
          className={styles.warningRecordsList}
        />
      </Card>
    );
  };

  return (
    <PageContainer>
      <div className={styles.container}>
        {/* 设备状态和人员数据合并模块 */}
        {renderCombinedStatsCards()}

        {/* 生产数据统计图表 */}
        {renderProductionChart()}

        {/* 设备故障排行和安全预警分类 */}
        <Row gutter={24} style={{ marginTop: 24 }}>
          <Col span={12}>
            {renderFaultRank()}
          </Col>
          <Col span={12}>
            {renderWarningRecords()}
          </Col>
        </Row>
      </div>
    </PageContainer>
  );
};

export default Analysis;
