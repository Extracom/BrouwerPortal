import styles from './customer.module.scss'

const Customer = () => {
    return (
        <>
            <div className={styles.customerContainer}>
                <div className={styles.contentWrapper}>
                    <div className={styles.content}>
                        Customer
                    </div>
                </div>
            </div>
        </>
    )
}

export default Customer