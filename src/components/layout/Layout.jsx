import PropTypes from 'prop-types';
import styles from './layout.module.scss';
import Sidebar from './sidebar/Sidebar';
import { Layout } from 'antd';
import Header from './header/Header';


const PageLayout = ({ children }) => {
    return (
        <>
            <Layout>
                <Header />
                <Layout className={styles.contentMain}>
                    <Sidebar />
                    <div className={styles.pageContainer}>
                        {children}
                    </div>
                </Layout>
            </Layout>
        </>
    )
}
PageLayout.propTypes = {
    children: PropTypes.node
}

export default PageLayout
