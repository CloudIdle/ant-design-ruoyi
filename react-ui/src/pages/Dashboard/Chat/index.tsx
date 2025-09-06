import { PageContainer } from '@ant-design/pro-components';
import { Card, List, Input, Button, Avatar, Tooltip, Badge, Typography, Row, Col } from 'antd';
import { FormattedMessage, useIntl } from '@umijs/max';
import React, { useState, useEffect, useRef } from 'react';
import { SendOutlined, UserOutlined, MessageOutlined, EnvironmentOutlined, ClockCircleOutlined, CheckCircleOutlined, ExclamationCircleOutlined, SmileOutlined } from '@ant-design/icons';
import styles from './style.less';

const { TextArea } = Input;
const { Text } = Typography;

// 定义聊天消息类型
interface ChatMessage {
  id: number;
  userId: string;
  userName: string;
  userTitle: string;
  workshop: string;
  content: string;
  time: string;
  isSelf: boolean;
  avatar: string;
}

// 模拟用户列表
const mockUsers = [
  { userId: '1', userName: '张三', userTitle: '车间主任', workshop: '注塑车间', avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png' },
  { userId: '2', userName: '李四', userTitle: '技术员', workshop: '装配车间', avatar: 'https://gw.alipayobjects.com/zos/rmsportal/cnrhVkzwxjPwAaCfPbdc.png' },
  { userId: '3', userName: '王五', userTitle: '质检员', workshop: '质检车间', avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png' },
  { userId: '4', userName: '赵六', userTitle: '安全员', workshop: '安全部', avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png' },
  { userId: '5', userName: '孙七', userTitle: '设备操作员', workshop: '冲压车间', avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png' },
  { userId: '6', userName: '周八', userTitle: '设备操作员', workshop: '冲压车间', avatar: 'https://gw.alipayobjects.com/zos/rmsportal/cnrhVkzwxjPwAaCfPbdc.png' },
  { userId: '7', userName: '吴九', userTitle: '设备操作员', workshop: '冲压车间', avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png' },
];

// 模拟聊天内容池
const contentPool = [
  '今天设备运行状况良好，没有出现异常。',
  '安全生产，人人有责，请大家注意操作规范。',
  '最近生产效率有所提升，大家继续保持！',
  '明天将进行设备例行维护，请各车间做好准备。',
  '刚才检查了A区的消防设施，一切正常。',
  '新员工培训已完成，请各部门安排实际操作指导。',
  '原材料库存充足，可以满足未来一周的生产需求。',
  '今天的质量抽检合格率达到98%，非常好！',
  '提醒大家注意用电安全，下班前请关闭所有设备电源。',
  '天气预报显示明天有雨，请大家做好防滑措施。',
  '昨天的安全例会内容已上传至系统，请大家查阅。',
  '设备B-23需要更换零件，请维修组安排时间处理。',
  '食堂今天有红烧肉，大家可以去尝尝。',
  '下周一将进行消防演习，请各部门组织员工参加。',
  '新的生产计划已经发布，请各车间查收。',
  '最近气温变化较大，请大家注意增减衣物，预防感冒。',
  '仓库的货架整理工作已完成，现在存取货物更加方便。',
  '今天下午三点在会议室召开生产协调会，请相关人员准时参加。',
  '安全检查发现个别员工未按规定佩戴防护装备，已提醒整改。',
  '设备运行参数已优化，能耗降低了5%。',
  '最近生产计划发生变化，需要及时调整。',
  '最近设备维护工作比较多，大家需要注意保养。',
];

const ChatRoom: React.FC = () => {
  const intl = useIntl();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [isSending, setIsSending] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUser = {
    userId: 'current',
    userName: '我',
    userTitle: '管理员',
    workshop: '管理部门',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png',
  };

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 获取当前时间
  const getCurrentTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  // 初始化模拟聊天数据
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      // 初始化一些历史消息
      const initialMessages: ChatMessage[] = [];
      for (let i = 0; i < 10; i++) {
        const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
        const randomContent = contentPool[Math.floor(Math.random() * contentPool.length)];
        // 生成随机时间，模拟历史消息
        const randomTime = new Date();
        randomTime.setMinutes(randomTime.getMinutes() - Math.floor(Math.random() * 60 * 24));
        const timeStr = `${randomTime.getFullYear()}-${String(randomTime.getMonth() + 1).padStart(2, '0')}-${String(randomTime.getDate()).padStart(2, '0')} ${String(randomTime.getHours()).padStart(2, '0')}:${String(randomTime.getMinutes()).padStart(2, '0')}:${String(randomTime.getSeconds()).padStart(2, '0')}`;
        
        initialMessages.push({
          id: i,
          userId: randomUser.userId,
          userName: randomUser.userName,
          userTitle: randomUser.userTitle,
          workshop: randomUser.workshop,
          content: randomContent,
          time: timeStr,
          isSelf: false,
          avatar: randomUser.avatar,
        });
      }
      // 按时间排序
      initialMessages.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
      setMessages(initialMessages);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // 监听消息变化，自动滚动到底部
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 模拟其他用户发送消息
  useEffect(() => {
    const interval = setInterval(() => {
      // 有一定概率发送消息
      if (Math.random() > 0.7 && !loading) {
        const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
        const randomContent = contentPool[Math.floor(Math.random() * contentPool.length)];
        
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length,
            userId: randomUser.userId,
            userName: randomUser.userName,
            userTitle: randomUser.userTitle,
            workshop: randomUser.workshop,
            content: randomContent,
            time: getCurrentTime(),
            isSelf: false,
            avatar: randomUser.avatar,
          },
        ]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [loading]);

  // 发送消息
  const handleSendMessage = () => {
    if (inputValue.trim() && !isSending) {
      setIsSending(true);
      
      // 模拟发送延迟
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length,
            userId: currentUser.userId,
            userName: currentUser.userName,
            userTitle: currentUser.userTitle,
            workshop: currentUser.workshop,
            content: inputValue.trim(),
            time: getCurrentTime(),
            isSelf: true,
            avatar: currentUser.avatar,
          },
        ]);
        setInputValue('');
        setIsSending(false);
      }, 300);
    }
  };

  // 处理回车发送
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 渲染消息项
  const renderMessageItem = (item: ChatMessage) => {
    if (item.isSelf) {
      return (
        <div key={item.id} className={styles.selfMessageItem}>
          <div className={styles.selfMessageContent}>
            <div className={styles.selfMessageHeader}>
              <Text className={styles.selfUserName}>{item.userName}</Text>
              <Tooltip title={`${item.workshop} - ${item.userTitle}`}>
                <Badge  showZero className={styles.userTitleBadge}>
                  <Text className={styles.userTitle}>{item.userTitle}</Text>
                </Badge>
              </Tooltip>
              <Text className={styles.messageTime}>{item.time}</Text>
            </div>
            <div className={styles.selfMessageBody}>
              <Text>{item.content}</Text>
            </div>
          </div>
          <Avatar src={item.avatar} className={styles.messageAvatar} />
        </div>
      );
    } else {
      return (
        <div key={item.id} className={styles.messageItem}>
          <Avatar src={item.avatar} className={styles.messageAvatar} />
          <div className={styles.messageContent}>
            <div className={styles.messageHeader}>
              <Text className={styles.userName}>{item.userName}</Text>
              <Tooltip title={`${item.workshop} - ${item.userTitle}`}>
                <Badge  showZero className={styles.userTitleBadge}>
                  <Text className={styles.userTitle}>{item.userTitle}</Text>
                </Badge>
              </Tooltip>
              <Text className={styles.messageTime}>{item.time}</Text>
            </div>
            <div className={styles.messageBody}>
              <Text>{item.content}</Text>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <PageContainer>
      <Card
        loading={loading}
        // title={
        //   <div className={styles.header}>
        //     <MessageOutlined className={styles.headerIcon} />
        //     <FormattedMessage id="dashboard.chat.title" defaultMessage="安全畅聊" />
        //   </div>
        // }
        className={styles.container}
      >
        <Row gutter={[16, 16]}>
          {/* 在线用户列表 */}
          <Col xs={24} md={6} className={styles.userListContainer}>
            <Card title={<FormattedMessage id="dashboard.chat.onlineUsers" defaultMessage="在线用户" />}>
              <List
                dataSource={[currentUser, ...mockUsers]}
                renderItem={(user) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar src={user.avatar} />}
                      title={
                        <div>
                          <Text>{user.userName}</Text>
                          {user.userId === currentUser.userId && (
                            <Badge showZero className={styles.selfUserBadge}>
                              <span>(我)</span>
                            </Badge>
                          )}
                        </div>
                      }
                      description={
                        <div>
                          <EnvironmentOutlined className={styles.workshopIcon} />
                          <Text>{user.workshop} - {user.userTitle}</Text>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          
          {/* 聊天区域 */}
          <Col xs={24} md={18}>
            <div className={styles.chatContainer}>
              {/* 聊天消息区域 */}
              <div className={styles.messagesContainer}>
                {messages.map((item) => renderMessageItem(item))}
                <div ref={messagesEndRef} />
              </div>
              
              {/* 输入区域 */}
              <div className={styles.inputContainer}>
                <TextArea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={intl.formatMessage({ id: 'dashboard.chat.inputPlaceholder', defaultMessage: '输入消息，按Enter发送，Shift+Enter换行...' })}
                  autoSize={{ minRows: 2, maxRows: 6 }}
                  className={styles.textArea}
                />
                <div className={styles.actionButtons}>
                  <Button
                    icon={<SendOutlined />}
                    type="primary"
                    onClick={handleSendMessage}
                    loading={isSending}
                    disabled={!inputValue.trim() || isSending}
                  >
                    {intl.formatMessage({ id: 'dashboard.chat.send' })}
                  </Button>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </PageContainer>
  );
};

export default ChatRoom;