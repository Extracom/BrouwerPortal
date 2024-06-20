import { Button, Col, DatePicker, Row, Table } from 'antd';
import styles from './orderOverview.module.scss'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderDataAction } from '../../store/actions/orderAction';
import dayjs from 'dayjs';
import { ReloadOutlined } from '@ant-design/icons';

const initialFilters = {
    current: 1,
    offset: 0,
    limit: 50,
    onlyOpen: true,
    deliveryDateAfter: dayjs(`${new Date().getFullYear()}-01-01`)
}

const OrderOverview = () => {

    const dispatch = useDispatch()
    const [dataSource, setDataSource] = useState([])
    const [tableFilters, setTableFilters] = useState(initialFilters)
    const { isLoading, orderData } = useSelector((state) => state.order)
    const { lines } = orderData?.result || []

    const columns = [
        {
            title: 'Omschrijving',
            dataIndex: 'description',
            key: 'description',
            render: (_, row) => (<div className={styles.descriptionLayout}>
                <div className={styles.descriptionLayoutLeft}>
                    <div className={styles.details}>
                        <div>{(!row.orderCode || row.orderCode === '') ? '-' : `${(!row.deliveryDateCustomer || row.deliveryDateCustomer === '') ? '' : `${dayjs(row.deliveryDateCustomer).format('DD-MM-YYYY')} - `}${row.orderCode} `}</div>
                    </div>
                    <div className={styles.desc}> {(!row.description || row.description === '') ? '-' : row.description}</div>
                </div>
            </div>
            )
        },
        {
            title: 'Product code',
            dataIndex: 'productCode',
            key: 'productCode',
            responsive: ['sm'],
            render: (_, row) => (
                <div className={styles.pcode}>
                    {(!row.productCode || row.productCode === '') ? '-' : row.productCode}
                </div>
            )
        },
        {
            title: 'Eenheid',
            dataIndex: 'unitCode',
            key: 'unitCode',
            responsive: ['sm'],
            render: (_, row) => (<>{(!row.unitCode || row.unitCode === '') ? '-' : row.unitCode}</>)
        },
        {
            title: 'Besteld',
            dataIndex: 'qtyOrdered',
            key: 'qtyOrdered',
            responsive: ['sm'],
            align: 'center',
            render: (_, row) => (<>{(!row.qtyOrdered || row.qtyOrdered === '') ? '-' : row.qtyOrdered}</>)
        },
        {
            title: 'Geleverd',
            dataIndex: 'qtyDelivered',
            key: 'qtyDelivered',
            responsive: ['sm'],
            render: (_, row) => (<>{(!row.qtyDelivered || row.qtyDelivered === '') ? '-' : row.qtyDelivered}</>)
        },
        {
            title: 'Te leveren',
            dataIndex: 'qtyToDeliver',
            key: 'qtyToDeliver',
            render: (_, row) => (
                <div className={styles.qtyToDeliverLayout}>
                    <div>{(!row.qtyToDeliver || row.qtyToDeliver === '') ? '-' : row.qtyToDeliver}</div>
                    <div className={styles.unitCode}>{(!row.unitCode || row.unitCode === '') ? '-' : row.unitCode}</div>
                </div>)
        },
        {
            title: 'Status',
            dataIndex: 'lineStatusDescription',
            key: 'lineStatusDescription',
            responsive: ['sm'],
            render: (_, row) => (
                <div className={styles.status}>
                    {(!row.lineStatusDescription || row.lineStatusDescription === '') ? '-' : row.lineStatusDescription}
                </div>
            )
        }
    ]

    const getCustomerData = () => {
        let payload = {
            deliveryDateAfter: tableFilters?.deliveryDateAfter?.format('YYYY-MM-DD'),
            offset: tableFilters.offset,
            onlyOpen: tableFilters.onlyOpen,
            limit: tableFilters.limit,
        }
        dispatch(getOrderDataAction({ payload }))
    }

    const handleTableChange = (data, val, res, event) => {

        if (event.action !== "sort") {
            let tmpFilters = {
                ...tableFilters
            }

            tmpFilters = {
                ...tmpFilters,
                offset: ((data.current - 1) * data.pageSize),
                limit: data.pageSize,
                current: data.current,
            }

            setTableFilters(tmpFilters)
        }
    }

    const onChange = (date) => {
        let tmpFilters = {
            ...tableFilters,
            deliveryDateAfter: date,
        }
        setTableFilters(tmpFilters)
    }

    const handlePageReload = () => {
        setTableFilters((prev) => ({ ...prev, current: 1, offset: 0, }))
    }

    useEffect(() => {
        getCustomerData()
    }, [tableFilters])

    useEffect(() => {
        if (lines) {
            setDataSource(lines ?? [])
            lines.sort((a, b) => {
                const result = dayjs(a.deliveryDateCustomer).isAfter(b.deliveryDateCustomer)
                return result ? -1 : 1
            })
        }
    }, [lines])

    return (
        <>
            <div id='contentMain' className={styles.customerContainer}>
                <div className={styles.content}>

                    <div className={styles.pageHeader}>
                        <Row justify="space-between" align="middle">
                            <Col lg={8}>
                                <h2 className={styles.pageTitle}>Besteloverzicht</h2>
                            </Col>
                            <Col lg={9}>
                                <div className={styles.actionsContainer}>
                                    <div className={styles.datePickerSection}>
                                        <p>Bestellingen vanaf:</p>
                                        <DatePicker
                                            onChange={onChange}
                                            className={styles.searchBar}
                                            popupClassName={styles.datePickerPopup}
                                            value={tableFilters.deliveryDateAfter}
                                            allowClear={false}
                                        />
                                        {tableFilters.current !== 1 && <Button
                                            icon={<ReloadOutlined />}
                                            className={styles.reloadIcon}
                                            title='Reload'
                                            onClick={handlePageReload}
                                        />
                                        }
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>

                    <div className={styles.pageContent}>
                        <Table
                            key={dataSource.length}
                            className={styles.customTable}
                            columns={columns}
                            dataSource={dataSource}
                            loading={isLoading}
                            onChange={handleTableChange}
                            pagination={{
                                showSizeChanger: false,
                                pageSize: tableFilters.limit,
                                current: tableFilters.current,
                                showLessItems: true,
                                showTitle: false,
                                total: lines?.length < tableFilters.limit ? (tableFilters.current) * tableFilters.limit : (tableFilters.current + 1) * tableFilters.limit,
                            }}
                            expandable={{
                                defaultExpandAllRows: true,
                            }}
                            rowKey={(row, index) => `${row.orderCode}_${index}`}
                            size='small'
                        />
                    </div>

                </div>
            </div >
        </>
    )
}

export default OrderOverview