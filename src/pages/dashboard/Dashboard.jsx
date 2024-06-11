import Dragger from "antd/es/upload/Dragger"
import Header from "../../components/header/Header"
import styles from './dashboard.module.scss'
import { InboxOutlined } from "@ant-design/icons"
import TextArea from "antd/es/input/TextArea"
import { Button } from "antd"
import { useEffect } from "react"

const Dashboard = () => {

    const uploadProps = {
        name: 'file',
        // multiple: true,
        // action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
        onChange(info) {
            console.log('info :>> ', info);

            // const { status } = info.file;
            // if (status !== 'uploading') {
            //     console.log(info.file, info.fileList);
            // }
            // if (status === 'done') {
            //     message.success(`${info.file.name} file uploaded successfully.`);
            // } else if (status === 'error') {
            //     message.error(`${info.file.name} file upload failed.`);
            // }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    const parseXmlToJson = () => {
        fetch('/products/ExportPIM.xml')
            .then((response) => response.text())
            .then((xml) => {
                console.log('xml :>> ', xml);

                // const parser = new xml2js.Parser({ explicitArray: false });
                // parser.parseString(xml, (err, result) => {
                //     if (err) {
                //         console.error(err);
                //         // setJsonOutput('Error parsing XML');
                //     } else {
                //         console.log('result :>> ', result);
                //         // setJsonOutput(JSON.stringify(result, null, 2));
                //     }
                // });
            })
            .catch((error) => {
                console.error('Error fetching XML:', error);
                // setJsonOutput('Error fetching XML');
            });
    };

    useEffect(() => {
        parseXmlToJson()
    }, [])


    return (
        <>
            <Header />
            <div className={styles.dashboardContainer}>
                <div className={styles.inputContainer}>
                    <div className={styles.uploader}>
                        <Dragger {...uploadProps}>
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                            <p className="ant-upload-hint">
                                Support file types: CSV, TXT
                            </p>
                        </Dragger>
                    </div>
                    <div className={styles.middleZone}>
                        <span>OR</span>
                    </div>
                    <div className={styles.textArea}>
                        <TextArea
                            placeholder="Enter barcodes here..."
                            rows={8}
                        />
                    </div>
                </div>
                <div className={styles.controls}>
                    <Button type="primary">
                        Match
                    </Button>
                </div>
            </div>
        </>
    )
}

export default Dashboard
