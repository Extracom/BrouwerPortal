import { Menu, Layout } from 'antd';
import styles from './sidebar.module.scss'
import { BarcodeOutlined, UserOutlined, UnorderedListOutlined, DownloadOutlined, FileTextOutlined, } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTER } from '../../../utils/router/router';

const { Sider } = Layout;


const Sidebar = () => {

    const navigate = useNavigate()
    const { pathname } = useLocation()
    const menu = useRef()

    const [openKeys, setOpenKeys] = useState([])
    const [selectedKey, setSelectedKey] = useState(null)

    const userData = useSelector((state) => state.auth)


    const menuItems = useMemo(() => {
        const tmpMenuItems = []

        if (Object.keys(userData).length > 0) {
            if (userData.userInfo?.isAgent) {
                tmpMenuItems.push({
                    key: 'klanten',
                    label: 'Klanten',
                    path: ROUTER.customer,
                    icon: <UserOutlined style={{ fontSize: '100%' }} />
                })
            }
        }
        tmpMenuItems.push({
            key: 'eanMatch',
            label: 'EAN Match',
            path: ROUTER.eanMatch,
            icon: <BarcodeOutlined style={{ fontSize: '100%' }} />
        })
        tmpMenuItems.push({
            key: 'besteloverzicht',
            label: 'Besteloverzicht',
            path: ROUTER.orderOverview,
            icon: <UnorderedListOutlined style={{ fontSize: '100%' }} />
        })
        // ? temporary pushing static items, will be used in future
        tmpMenuItems.push({
            key: 'mijnFacturen',
            label: 'Mijn Facturen',
            path: ROUTER.myInvoices,
            icon: <FileTextOutlined  style={{ fontSize: '100%' }} />
        })
        tmpMenuItems.push({
            key: 'downloads',
            label: 'Downloads',
            path: ROUTER.downloads,
            icon: <DownloadOutlined style={{ fontSize: '100%' }} />
        })

        return [...tmpMenuItems]
    }, [userData])


    const onOpenChange = (keys) => {
        if (keys.length > 0) {
            setOpenKeys([keys[keys.length - 1]])
        } else {
            setOpenKeys([])
        }
    }

    const onSelect = (data) => {
        const tmpSelectedKey = data.key
        setSelectedKey(tmpSelectedKey)
        const selectedMenu = menuItems.filter((item) => item.key === tmpSelectedKey)[0]
        if (selectedMenu) {
            navigate(selectedMenu.path)
        }
    }


    useEffect(() => {
        let selectedKey = '/'

        menuItems.forEach((item) => {
            let currentPath = pathname
            if (pathname.startsWith(ROUTER.productOrder)) {
                currentPath = ROUTER.product
            }
            if (item.path === currentPath) {
                selectedKey = item.key
            }
        })

        setSelectedKey(selectedKey)
    }, [pathname, menuItems])


    useEffect(() => {
        const contentMain = document.getElementById('contentMain')
        var prevScrollpos = contentMain?.scrollTop;
        const handleScroll = () => {
            let currentScrollPos = contentMain?.scrollTop;
            if (prevScrollpos > currentScrollPos) {
                menu.current.style.bottom = "0";
            } else {
                // menu.current.style.bottom = "calc(0px - 9vh - 60px)";
                menu.current.style.bottom = "0";
            }
            prevScrollpos = currentScrollPos;
        }

        contentMain?.addEventListener('scroll', handleScroll)
        return () => contentMain?.removeEventListener('scroll', handleScroll)
    }, [pathname])


    return (
        <>
            <Sider
                className={styles.sidebar}
                width={225}
                theme="light"
            >
                {/* <h4 className={`${styles.pageTitle} ${userData?.userInfo?.isAgent ? styles.active : ''}`}>{`${userData?.userInfo?.debtor?.name} (${userData?.userInfo?.debtor?.uid})`}</h4> */}
                <Menu
                    mode="inline"
                    defaultSelectedKeys={['klanten']}
                    size="large"
                    className={styles.menu}

                    items={menuItems}
                    openKeys={openKeys}
                    selectedKeys={selectedKey}
                    // onSelect={onSelect}
                    onClick={onSelect}
                    onOpenChange={onOpenChange}
                />
            </Sider>

            <div className={styles.mobileBottomMenubar} ref={menu}>
                {
                    menuItems.map((item) => {
                        return (
                            <div key={item.key} className={styles.menuItem}>
                                <div
                                    className={`${styles.iconWrapper} ${selectedKey === item.key ? styles.active : ''}`}
                                    onClick={() => onSelect(item)}
                                >
                                    <div className={styles.icon}>
                                        {item.icon}
                                    </div>
                                </div>
                                <div className={styles.label}>
                                    <span> {item.label}</span>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </>
    )
}

export default Sidebar
