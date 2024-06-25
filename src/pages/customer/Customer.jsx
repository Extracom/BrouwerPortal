import { useDispatch, useSelector } from 'react-redux';
import styles from './customer.module.scss'
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Col, Input, Row, Table, message } from 'antd';
import { changeCurrentDebtorAction, getCustomerDataAction } from '../../store/actions/customerAction';
import { SearchOutlined } from '@ant-design/icons';
import { clearCart } from '../../store/actions/cartAction';
import { ROUTER } from "../../utils/router/router";

const initialFilters = {
    current: 1,
    start: 0,
    length: 10,
    searchString: '',
}

const Customer = () => {

    const dispatch = useDispatch()
    const [messageApi, contextHolder] = message.useMessage();

    const navigate = useNavigate();

    const [tableFilters, setTableFilters] = useState(initialFilters)
    const [searchStr, setSearchStr] = useState('')
    const userData = useSelector((state) => state.auth)
    const { isLoading, customerData } = useSelector((state) => state.customer)

    const columns = [
        {
            title: 'Nummer',
            dataIndex: 'uid',
            key: 'uid',
            render: (_, row) => (<>{(!row.uid || row.uid === '') ? '-' : row.uid}</>),
            responsive: ['sm']
        },
        {
            title: 'Naam',
            dataIndex: 'name',
            key: 'name',
            render: (_, row) => (<>{(!row.name || row.name === '') ? '-' : row.name}</>)
        },
        {
            title: 'Plaats',
            dataIndex: 'city',
            key: 'city',
            render: (_, row) => (<>{(!row.city || row.city === '') ? '-' : row.city}</>)
        },
        {
            title: 'GBM licentie',
            dataIndex: 'extra1',
            key: 'extra1',
            render: (_, row) => (<>{(!row.extra1 || row.extra1 === '') ? '-' : row.extra1}</>),
            responsive: ['sm']
        },
        {
            title: 'Precusoren licentie',
            dataIndex: 'extra2',
            key: 'extra2',
            render: (_, row) => (<>{(!row.extra2 || row.extra2 === '') ? '-' : row.extra2}</>),
            responsive: ['sm']
        }
    ]

    const getCustomerData = () => {
        let payload = {
            skipPaging: false,
            length: tableFilters.length,
            start: tableFilters.start,
            search: tableFilters.searchString
        }
        dispatch(getCustomerDataAction({ payload }))
    }

    const handleTableChange = (data) => {
        let tmpFilters = {
            ...tableFilters
        }

        tmpFilters = {
            ...tmpFilters,
            start: ((data.current - 1) * data.pageSize),
            length: data.pageSize,
            current: data.current,
        }

        setTableFilters(tmpFilters)
    }

    const handleFilterSearch = (e) => {
        const searchString = e.target.value
        setSearchStr(searchString)
        if (searchString.length >= 3 || searchString === '') {
            setTableFilters((prev) => ({
                ...prev,
                searchString: searchString,
                current: 1,
                start: 0
            }))
        }
    }


    const tableData = useMemo(() => {
        if (customerData?.data) {
            const tmpCustomerTableData = []
            customerData.data.forEach((elem) => {
                const index = tmpCustomerTableData.findIndex((item) => item.uid === elem.uid)
                if (index === -1) {
                    tmpCustomerTableData.push(elem)
                }
            })
            return tmpCustomerTableData
        }
        return []
    }, [customerData])

    const changeDebtorSuccess = () => {
        navigate(ROUTER.eanMatch)
        dispatch(clearCart())
    }

    const changeDebtorError = (error) => {
        const message = error.response?.data?.detail ?? 'Something went wrong!'
        messageApi.open({
            type: 'error',
            content: message,
            style: {
                maxWidth: '500px',
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: '70px'
            },
            duration: 5,
        });
    }


    useEffect(() => {
        getCustomerData()
    }, [tableFilters])

    return (
        <>
            <div id='contentMain' className={styles.customerContainer}>
                <div className={styles.content}>
                    <div>
                        <Row justify="space-between" align="middle">
                            <Col lg={8}>
                                <h2 className={styles.pageTitle}>Klanten</h2>
                            </Col>
                            <Col xs={24} lg={8}>
                                <Input
                                    placeholder="Zoek hier ... "
                                    prefix={<SearchOutlined className={styles.searchIcon} />}
                                    allowClear
                                    className={styles.searchBar}
                                    value={searchStr}
                                    onChange={(e) => handleFilterSearch(e)}
                                    size='small'
                                />
                            </Col>
                        </Row>
                    </div>

                    <div>
                        <Table
                            className={styles.customTable}
                            columns={columns}
                            dataSource={tableData}
                            key={tableFilters.current}
                            loading={isLoading}
                            onChange={handleTableChange}
                            size='small'

                            pagination={{
                                showSizeChanger: true,
                                pageSizeOptions: ['10', '20', '30', '40'],
                                pageSize: tableFilters.length,
                                current: tableFilters.current,
                                total: customerData?.filteredTotal ?? 0
                            }}

                            onRow={(record) => {
                                return {
                                    onClick: () => {
                                        (userData.userInfo.debtor.uid !== record.uid) &&
                                            dispatch(changeCurrentDebtorAction(record?.uid, changeDebtorSuccess, changeDebtorError))

                                    }
                                };
                            }}
                            rowKey={(data, index) => `${data.is}_${index}`}
                        />
                    </div>


                </div>
            </div>

            {contextHolder}

        </>
    )
}

export default Customer