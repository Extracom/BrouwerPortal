/* eslint-disable no-unused-vars */
import { Alert, Button, Col, ColorPicker, Input, InputNumber, Radio, Row, Select, Space, Spin, Table, message } from "antd";
import { DeleteOutlined, LoadingOutlined, StarFilled, StarOutlined } from "@ant-design/icons";
import styles from "./cart.module.scss";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changePriorityAddressAction, clearCart, placeOrderAction, deleteFromCartAction, getAddressesAction } from "../../store/actions/cartAction";
import { groupByWithParent } from "../../utils/methods/global";
import { useNavigate } from "react-router-dom";
import { ROUTER } from "../../utils/router/router";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const userData = useSelector((state) => state.auth)
  const { addresses, cart, cartQuantity } = useSelector((state) => state.cart)
  const { messageApi } = useSelector((state) => state.messageApi)
  const userInfo = useSelector((state) => state.auth.userInfo)

  const [processedData, setProcessedData] = useState()

  const [isLoading, setIsLoading] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState(null)

  const [orderReferentie, setOrderReferentie] = useState(null)
  const [selectedOrderTime, setSelectedOrderTime] = useState('C')
  const [Opmerking, setOpmerking] = useState(null)

  const customizedCart = [...cart]

  const getTableData = (groupedData) => {
    return Object.values(groupedData).map((group, index) => {
      const { parent, children } = group;
      let data = {
        key: parent.ean + index,
        ean: parent.ean,
        moq: parseInt(parent.moq),
        unit: parseInt(parent.unit),
        description: parent.description,
        uid: parent.uid,
        ...parent
      };
      if (children.length >= 1) {
        data.children = children.map((child) => ({
          key: child.ean + index,
          ean: child.ean,
          moq: parseInt(child.moq),
          unit: parseInt(child.unit),
          description: child.description,
          uid: child.uid,
        }));
      }
      return data;
    });
  }

  const [dataSource, setDataSource] = useState(getTableData(groupByWithParent(customizedCart, 'ean')))
  const handleChange = (value) => {
    setSelectedAddress(value);
  }

  // const updateCartProductValue = (value, record) => {
  //   let tempCart = [...cart]

  //   const findIndex = tempCart.findIndex((product) => product.id === record.id)
  //   tempCart[findIndex].Aantal = value

  //   setDataSource(getTableData(groupByWithParent(customizedCart, 'ean')))
  // }


  const handleChangeFavourite = (e, id) => {
    e.stopPropagation();
    const successCallback = (response) => {
      if (response?.data?.success) {
        messageApi.open({
          type: 'success',
          content: 'Het standaard afleveradres is succesvol gewijzigd',
          className: styles.toast,
          duration: 5,
        })
      }
    }
    dispatch(changePriorityAddressAction(id, successCallback))
  }

  const columns = [
    {
      title: "Product nummer",
      dataIndex: "uid",
      key: "uid",
    },
    {
      title: "Omschrijving",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Eenheid",
      dataIndex: "unit",
      key: "unit",
      align: "center",
      responsive: ["sm"],
    },
    {
      title: "Aantal",
      dataIndex: "totalMoq",
      key: "totalMoq",
      align: "center",
    },
    {
      title: "Actie",
      dataIndex: "Actie",
      key: "Actie",
      align: "center",
      render: (_, record) => (
        <div className={styles.actionLayout}>
          <div className={styles.uid}>
            <span>{record.uid}</span>
          </div>
          <div>
            <Space size="middle">
              <DeleteOutlined
                style={{ color: "red" }}
                onClick={() => dispatch(deleteFromCartAction({ payload: record }))}
              />
            </Space>
          </div>
        </div>
      ),
    },
  ]

  const options = useMemo(() => {
    let tmpOptions = [
      { label: "Vandaag", value: "A" },
      { label: "Morgen", value: "B" },
      { label: "Eerstvolgend levermoment", value: "C" },
    ]
    var currentTime = new Date();
    var triggerTime = new Date();
    triggerTime.setHours(8);
    triggerTime.setMinutes(45);
    triggerTime.setSeconds(0);
    triggerTime.setMilliseconds(0);

    if (currentTime > triggerTime) {
      tmpOptions = tmpOptions.map((item) => {
        if (item.value === "A") {
          return ({
            ...item,
            disabled: true
          })
        } else {
          return { ...item }
        }
      })
    }
    return tmpOptions
  }, [])

  const resetCartForm = () => {
    setOrderReferentie(null)
    const selected = addresses.filter((item) => item.priority === 1)[0]
    selected && setSelectedAddress(selected)
    setOpmerking(null)
    setSelectedOrderTime('C')
    dispatch(clearCart())
  }

  const handleConfirmOrderPlace = (cart) => {
    setIsLoading(true)
    const orderTypeCode = userInfo?.debtor?.defaultOrderType
    const reference = orderReferentie
    const orderText = ''

    const excludeCommentsOrderInstruction = `${selectedOrderTime}. ${userInfo?.firstName} ${userInfo?.lastName}`
    const includeCommentsOrderInsturction = `${excludeCommentsOrderInstruction}: ${Opmerking}`
    const orderInstruction = userData.userInfo.isAgent ? includeCommentsOrderInsturction : excludeCommentsOrderInstruction

    const lines = cart?.map((product) => {
      return {
        productCode: product.uid,
        unitCode: product.unit,
        quantity: Number(product.Aantal),
        addressCode: selectedAddress.uid
      }
    })

    const payload = {
      orderTypeCode,
      reference,
      orderText,
      orderInstruction,
      lines
    }

    const successCallback = (response) => {
      const result = JSON.parse(response?.data?.result);
      setIsLoading(false)
      if (response?.data?.success) {
        const message = `Uw verkooporder is geplaatst: ${result?.id ?? ''}`
        messageApi.open({
          type: 'success',
          content: message,
          className: styles.toast,
          duration: 5,
        });
        resetCartForm()
        navigate(ROUTER.product)
      } else {
        const message = response?.data?.message ?? 'Something went wrong!'
        messageApi.open({
          type: 'error',
          content: message,
          className: styles.toast,
          duration: 5,
          style: {
            maxWidth: '500px',
            marginLeft: 'auto',
            marginRight: 'auto',
          },
        });
      }

    }

    const errorCallback = (error) => {
      setIsLoading(false)
      const message = error.response?.data?.message ?? 'Something went wrong!'
      messageApi.open({
        type: 'error',
        content: message,
        className: styles.toast,
        duration: 5,
        style: {
          maxWidth: '500px',
          marginLeft: 'auto',
          marginRight: 'auto',
        },
      });
    }

    console.log('payload :>> ', payload);
    // dispatch(placeOrderAction({ payload }, successCallback, errorCallback))
  }

  const preprocessData = (data) => {
    return data.map((product) => {
      let totalMoq = product.moq;

      if (product.children && product.children.length > 0) {
        totalMoq += product.children.reduce((acc, child) => acc + child.moq, 0);
      }

      return {
        ean: product.ean,
        uid: product.uid,
        description: product.description,
        unit: product.unit,
        totalMoq: totalMoq,
      };
    });
  };

  useEffect(() => {
    dispatch(getAddressesAction());
  }, [])

  useMemo(() => {
    // const data = getTableData(groupByWithParent(cart, 'uid'))
    const data = getTableData(groupByWithParent(customizedCart, 'ean'))
    setDataSource(data)
  }, [cart])

  useEffect(() => {
    if (addresses && !selectedAddress) {
      const favourite = addresses.filter((item) => item.priority === 1)[0]
      favourite && setSelectedAddress(favourite)
      if (!favourite) {
        setSelectedAddress(addresses[0])
      }
    }
  }, [addresses, selectedAddress])

  useEffect(() => {
    setProcessedData(preprocessData(dataSource))
  }, [dataSource])


  return (
    <>
      <div id='contentMain' className={styles.cartContainer}>
        <div className={styles.contentWrapper}>
          <div className={styles.content}>

            <div className={styles.header}>
              <Row justify="space-between" align="middle">
                <Col lg={8}>
                  <h2 className={styles.pageTitle}>Overzicht bestelling</h2>
                </Col>
                <Col xs={24} md={8} lg={8}>
                  <Input
                    placeholder="Order referentie"
                    maxLength={30}
                    value={orderReferentie}
                    onChange={(e) => { setOrderReferentie(e.target.value) }}
                    size="small"
                  />
                </Col>
              </Row>
            </div>

            <div className={styles.dataPaper}>
              <div className={`${styles.title} ${styles.product}`}>
                <h2 className={styles.pageTitle}>Producten</h2>
                {cartQuantity > 0 && <Button className={styles.clearButton} onClick={() => dispatch(clearCart())}>Alles verwijderen</Button>}
              </div>
              <Table
                dataSource={processedData}
                className={styles.customTable}
                columns={columns}
                pagination={false}

                expandable={{
                  defaultExpandAllRows: true,
                  expandIcon: () => null
                }}
              />
            </div>

            <div className={styles.dataPaper}>
              <div className={styles.LeverHeader}>
                <Row gutter={16}>
                  <Col lg={16}>
                    <h2 className={styles.pageTitle}>Levering</h2>
                  </Col>
                  <Col lg={8}>
                    <div className={styles.LeverSwitch}>
                    </div>
                  </Col>
                </Row>
              </div>
              <div className={styles.LeverBody}>
                <Row gutter={16} xs={24} sm={24}>
                  <Col lg={18}>
                    <div
                      className={styles.addressContainer}
                    >
                      <>
                        {
                          (addresses && addresses.length > 0) ? <>
                            {addresses.map((address, index) => (
                              <div
                                key={index}
                                value={address}
                                className={styles.radioAddress}
                                onClick={() => handleChange(address)}
                              >
                                <Radio
                                  checked={selectedAddress?.id === address.id}
                                />
                                <div
                                  className={styles.addressBox}
                                  style={{ width: "100%" }}
                                >
                                  <div className={styles.text}>{address.name}</div>
                                  <div
                                    className={`${styles.favourite} ${(address.priority == 1) ? styles.active : ""
                                      }`}
                                    onClick={(e) => handleChangeFavourite(e, address.id)}
                                  >
                                    <StarFilled className={styles.filled} />
                                    <StarOutlined className={styles.outlined} />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </> : <>
                            <Alert
                              message="Geen afleveradres beschikbaar"
                              type="error"
                              showIcon
                              className={styles.alert}
                            />
                          </>
                        }
                      </>

                    </div>

                    <div className={styles.bottomField}>
                      <Row gutter={[16, 8]}>
                        {userData.userInfo.isAgent && <Col lg={10} xs={24} sm={12}>
                          <Input placeholder="Opmerking" style={{ width: "100%" }} value={Opmerking} onChange={(e) => setOpmerking(e.target.value)} />
                        </Col>}
                        <Col lg={10} xs={24} sm={12}>
                          <Select
                            style={{ width: "100%" }}
                            placeholder="Select an option"
                            options={options}
                            defaultValue={'C'}
                            value={selectedOrderTime}
                            onChange={(value) => setSelectedOrderTime(value)}
                          />
                        </Col>
                      </Row>
                    </div>

                  </Col>
                  <Col lg={6} xs={24} justify='center' align='center'>
                    <div className={styles.btnBox}>
                      <Button
                        className={styles.orderButton}
                        // teporarily disabling the button by adding 1 in condition,  will add logic in future
                        disabled={(cartQuantity <= 0 || selectedAddress == null || addresses?.length === 0 || !(processedData.length > 0))}
                        onClick={() => handleConfirmOrderPlace(cart)}>
                        {isLoading ? <Spin indicator={<LoadingOutlined spin className={styles.spin} />} /> : 'Bevestigen'}
                      </Button>
                      <Button className={styles.cancelButton} onClick={resetCartForm}>Annuleren</Button>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
