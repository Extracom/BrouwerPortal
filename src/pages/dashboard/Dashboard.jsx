import Dragger from "antd/es/upload/Dragger"
import Header from "../../components/header/Header"
import styles from './dashboard.module.scss'
import { DeleteOutlined, InboxOutlined } from "@ant-design/icons"
import TextArea from "antd/es/input/TextArea"
import { Button, Skeleton, Table } from "antd"
import { useState } from "react"

const readTextFromFile = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            resolve(reader.result);
        };

        reader.onerror = () => {
            reject(reader.error);
        };

        reader.readAsText(file);
    });
}

const Dashboard = () => {

    const [resultData, setResultData] = useState([])
    const [inputString, setInputString] = useState('')
    const [uploadedFile, setUploadedFile] = useState(null)

    const columns = [
        {
            title: 'EAN',
            dataIndex: 'ean',
            key: 'ean',
            render: (data) => {
                return (<div>{data}</div>)
            }
        },
        {
            title: 'Productnummer',
            dataIndex: 'productnummer',
            key: 'productnummer',
            render: (data) => {
                return (<>
                    {
                        data ?? <Skeleton active paragraph={false} />
                    }
                </>)
            }
        },
        {
            title: 'Omschrijving',
            dataIndex: 'omschrijving',
            key: 'omschrijving',
            align: 'center',
            render: (data) => {
                return (<>
                    {
                        data ?? <Skeleton active paragraph={false} />
                    }
                </>)
            }
        },
        {
            title: 'Eenheid',
            dataIndex: 'eenheid',
            key: 'eenheid',
            align: 'center',
            render: (data) => {
                return (<>
                    {
                        data ?? <Skeleton active paragraph={false} />
                    }
                </>)
            }
        },
        {
            title: 'Afname per',
            dataIndex: 'afnamePer',
            key: 'afnamePer',
            align: 'center',
            render: (data) => {
                return (<>
                    {
                        data ?? <Skeleton active paragraph={false} />
                    }
                </>)
            }
        },
        {
            title: 'SKU',
            dataIndex: 'sku',
            key: 'sku',
            align: 'center',
            render: (data) => {
                return (<>
                    {
                        data ?? <Skeleton active paragraph={false} />
                    }
                </>)
            }
        },
    ]


    const uploadProps = {
        name: 'file',
        multiple: false,
        fileList: [],
        beforeUpload: () => false,
        onChange(info) {
            const file = info.fileList?.[0]
            if (file) {
                setInputString('')
                setUploadedFile(file.originFileObj)
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    }

    const handleMatch = async () => {
        let result = ''
        if (uploadedFile) {
            result = await readTextFromFile(uploadedFile)
        } else if (inputString) {
            result = inputString
        }

        result = result.replace(/\r\n/g, '\n')
        result = result.split('\n')
        const tmpTableData = []
        result.forEach((ean) => {

            if (ean) {
                tmpTableData.push({
                    ean: ean,
                    productnummer: null,
                    omschrijving: null,
                    eenheid: null,
                    afnamePer: null,
                    sku: null,
                })
            }
        })
        setResultData(tmpTableData)
        handleLoadEANData(tmpTableData)
    }

    const handleLoadEANData = async (tableData) => {
        console.log('tableData', tableData)


        // const response = await API({
        //     method: 'POST',
        //     url: `/product/simplelist`,
        //     data: payload,
        // })


        // let tmpEanDetails = tableData.map((eanData) => {
        //     console.log('eanData', eanData)

        // })

        // Promise.allSettled(tmpEanDetails).then((result) => {
        //     console.log('result', result)


        // }).catch((error) => {
        //     console.log('error', error)
        // })
    }

    const handleChangeInput = (e) => {
        setUploadedFile(null)
        setInputString(e.target.value)
    }

    console.log('uploadedFile', uploadedFile)

    return (
        <>
            <Header />
            <div className={styles.dashboardContainer}>
                <div className={styles.inputContainer}>
                    <div className={styles.uploader}>
                        <Dragger
                            className={styles.upload}
                            {...uploadProps}
                        >
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                            <p className="ant-upload-hint">
                                Supported file types: CSV, TXT
                            </p>
                        </Dragger>
                    </div>
                    <div className={styles.middleZone}>
                        <span>OR</span>
                    </div>
                    <div className={styles.textArea}>
                        <TextArea
                            placeholder="Enter barcodes here..."
                            value={inputString}
                            onChange={handleChangeInput}
                        />
                    </div>
                </div>
                {uploadedFile && <div className={styles.fileContainer}>
                    <div className={styles.file}>
                        <Button >
                            <DeleteOutlined onClick={() => setUploadedFile(null)} />
                        </Button>
                        <div>{uploadedFile.name}</div>
                    </div>
                </div>}
                <div className={styles.controls}>
                    <Button
                        type="primary"
                        onClick={handleMatch}
                    >
                        Match
                    </Button>
                </div>

                {resultData.length > 0 && <div className={styles.resultContainer}>
                    <div className={styles.resultHeader}>
                        <h3>Result</h3>
                    </div>
                    <Table
                        columns={columns}
                        size="small"
                        dataSource={resultData}
                        pagination={false}
                        className={styles.customTable}
                    />
                </div>}
            </div>
        </>
    )
}

export default Dashboard
