import styles from './header.module.scss'
import LOGO_IMG from '../../assets/images/logo.png'
import { LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { Menu } from 'antd'
import { useLogoutUser } from '../../hooks/auth'
import { AvatarIcon } from '../../assets/SVGs/Global'

const profileMenuItems = [{
    label: <div className={styles.profileInfo}>
        <span>John doe</span>
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

const Header = () => {

    const logout = useLogoutUser()

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
