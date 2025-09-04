import { CloudOutlined, SunOutlined, EnvironmentOutlined, SettingOutlined, AlertOutlined } from '@ant-design/icons';
import { Tooltip, Dropdown, Input, Modal, List } from 'antd';
import React, { useState, useEffect } from 'react';
import { createStyles } from 'antd-style';
import type { MenuProps } from 'antd';

const useStyles = createStyles(({ token }) => {
    return {
        weatherCity: {
            display: 'flex',
            alignItems: 'center',
            padding: '0 8px',
            cursor: 'pointer',
            height: 26,
            borderRadius: token.borderRadius,
            transition: 'background-color 0.3s',
            '&:hover': {
                backgroundColor: token.colorBgSecondary,
            },
        },
        icon: {
            marginRight: 4,
            fontSize: 16,
        },
        cityName: {
            marginRight: 4,
            fontSize: 14,
            color: token.colorText,
        },
        temp: {
            fontSize: 14,
            color: token.colorText,
        },
        modalBody: {
            padding: '16px 24px',
        },
        searchContainer: {
            marginBottom: 16,
        },
    };
});

// 模拟的城市列表
const mockCities = [
    { id: '1', name: '温州', temp: 26, weather: 'sunny' },
    { id: '2', name: '北京', temp: 25, weather: 'sunny' },
    { id: '3', name: '上海', temp: 28, weather: 'cloudy' },
    { id: '4', name: '广州', temp: 32, weather: 'rainy' },
    { id: '5', name: '深圳', temp: 30, weather: 'sunny' },
    { id: '6', name: '杭州', temp: 27, weather: 'cloudy' },
];

// 根据天气类型返回对应的图标
const getWeatherIcon = (weather: string) => {
    switch (weather) {
        case 'sunny':
            return <SunOutlined className="icon" style={{ color: '#ff9900' }} />;
        case 'cloudy':
            return <CloudOutlined className="icon" style={{ color: '#666666' }} />;
        case 'rainy':
            return <AlertOutlined className="icon" style={{ color: '#1890ff' }} />;
        default:
            return <CloudOutlined className="icon" style={{ color: '#666666' }} />;
    }
};

export const WeatherCity: React.FC = () => {
    const { styles } = useStyles();
    const [currentCity, setCurrentCity] = useState(mockCities[0]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [filteredCities, setFilteredCities] = useState(mockCities);

    // 模拟获取当前位置和天气信息
    useEffect(() => {
        // 在实际应用中，这里可以调用地理位置API获取真实位置
        // 并调用天气API获取真实天气信息
        // 这里仅使用模拟数据
    }, []);

    // 过滤城市列表
    useEffect(() => {
        if (searchText.trim() === '') {
            setFilteredCities(mockCities);
        } else {
            setFilteredCities(
                mockCities.filter(city =>
                    city.name.includes(searchText)
                )
            );
        }
    }, [searchText]);

    // 处理城市选择
    const handleCitySelect = (city: typeof mockCities[0]) => {
        setCurrentCity(city);
        setIsModalVisible(false);
    };

    // 菜单项配置
    const menuItems: MenuProps['items'] = [
        {
            key: '1',
            icon: <EnvironmentOutlined />,
            label: '选择城市',
            onClick: () => setIsModalVisible(true),
        },
        {
            key: '2',
            icon: <SettingOutlined />,
            label: '天气设置',
            onClick: () => alert('天气设置功能待实现'),
        },
    ];

    return (
        <>
            <Dropdown menu={{ items: menuItems }}>
                <div className={styles.weatherCity}>
                    <Tooltip title={`${currentCity.name} - ${currentCity.temp}°C - ${currentCity.weather === 'sunny' ? '晴朗' : currentCity.weather === 'cloudy' ? '多云' : '下雨'}`}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            {getWeatherIcon(currentCity.weather)}
                            <span className={styles.cityName}>{currentCity.name}</span>
                            <span className={styles.temp}>{currentCity.temp}°</span>
                        </div>
                    </Tooltip>
                </div>
            </Dropdown>

            <Modal
                title="选择城市"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={400}
            >
                <div className={styles.modalBody}>
                    <div className={styles.searchContainer}>
                        <Input
                            placeholder="搜索城市"
                            value={searchText}
                            onChange={e => setSearchText(e.target.value)}
                        />
                    </div>
                    <List
                        dataSource={filteredCities}
                        renderItem={city => (
                            <List.Item
                                key={city.id}
                                onClick={() => handleCitySelect(city)}
                                style={{
                                    cursor: 'pointer',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                <span>{city.name}</span>
                                <span style={{ display: 'flex', alignItems: 'center' }}>
                                    {getWeatherIcon(city.weather)}
                                    <span style={{ marginLeft: 4 }}>{city.temp}°</span>
                                </span>
                            </List.Item>
                        )}
                    />
                </div>
            </Modal>
        </>
    );
};