import styles from './header.module.scss'
import LOGO_IMG from '../../../assets/images/logo.png'
import { LogoutOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons'
import { Badge, Menu } from 'antd'
import { useLogoutUser } from '../../../hooks/auth'
import { AvatarIcon } from '../../../assets/SVGs/Global'
import { useSelector } from 'react-redux'
import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ROUTER } from '../../../utils/router/router'


const Header = () => {

    const navigate = useNavigate()
    const logout = useLogoutUser()
    const { pathname } = useLocation()
    const { userInfo } = useSelector((state) => state.auth)
    const { cartQuantity } = useSelector((state) => state.cart)


    const profileMenuItems = useMemo(() => {
        return ([{
            label: <div className={styles.profileInfo}>
                <div className={styles.profileInfoData}>
                    <div className={styles.userName}>
                        <span>{`${userInfo?.firstName ?? ''} ${userInfo?.lastName ?? ''}`}</span>
                    </div>
                    <div className={styles.userEmail}>
                        <span>{`${userInfo?.email ?? ''}`}</span>
                    </div>
                </div>
                <div className={styles.profileInfoIcon}>
                    <AvatarIcon />
                </div>
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
                {userInfo?.isAgent && <Badge
                    count={cartQuantity}
                    overflowCount={99}
                    className={`${styles.cartIcon} ${pathname === ROUTER.cart ? styles.active : ''}`}
                    size='small'
                    onClick={() => navigate(ROUTER.cart)}
                >
                    <ShoppingCartOutlined />
                </Badge>}
                <Menu
                    mode='horizontal'
                    items={profileMenuItems}
                    className={styles.profileMenu}
                    onClick={handleProfileMenuChange}
                    rootClassName={styles.profileMenuPopover}
                    disabledOverflow={true}
                />
            </div>
        </div >
    )
}

export default Header
