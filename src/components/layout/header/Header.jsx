import styles from './header.module.scss'
import LOGO_IMG from '../../../assets/images/logo.png'
import { LogoutOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons'
import { Badge, Menu } from 'antd'
import { useLogoutUser } from '../../../hooks/auth'
import { AvatarIcon } from '../../../assets/SVGs/Global'
import { useSelector } from 'react-redux'
import { useMemo } from 'react'


const Header = () => {

    const logout = useLogoutUser()
    const { userInfo } = useSelector((state) => state.auth)


    const profileMenuItems = useMemo(() => {
        return (
            [{
                label: <div className={styles.profileInfo}>
                    <span>{`${userInfo?.firstName ?? ''} ${userInfo?.lastName ?? ''}`}</span>
                    <AvatarIcon />
                </div>,
                key: 'main',
                children: [{
                    label: 'Profile',
                    key: 'profile',
                    icon: <UserOutlined />,
                },
                {
                    label: 'Logout',
                    key: 'logout',
                    icon: <LogoutOutlined />,
                }]
            }]
        )
    }, [userInfo])


    const handleProfileMenuChange = ({ key }) => {
        switch (key) {
            case 'logout':
                logout()
                break;
        }
    }


    return (
        <div className={styles.headerContainer}>
            <div className={styles.logo}>
                <img src={LOGO_IMG} alt=" " />
            </div>
            <div className={styles.navigation}>
                {userInfo?.isAgent && <Badge count={1} overflowCount={9} className={styles.cartIcon} size='large'>
                    <ShoppingCartOutlined />
                </Badge>}
                <Menu
                    mode='horizontal'
                    items={profileMenuItems}
                    className={styles.profileMenu}
                    onClick={handleProfileMenuChange}
                    rootClassName={styles.profileMenuPopover}
                />
            </div>
        </div>
    )
}

export default Header
