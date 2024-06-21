import styles from './myInvoices.module.scss'

const MyInvoices = () => {
    return (
        <>
            <div className={styles.invoicesContainer}>
                <div className={styles.contentWrapper}>
                    <div className={styles.content}>
                        myInvoices
                    </div>
                </div>
            </div>
        </>
    )
}

export default MyInvoices