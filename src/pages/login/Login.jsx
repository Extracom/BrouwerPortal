import styles from './login.module.scss'
import { Button, Input, Spin } from 'antd';
import { Form } from 'antd'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ROUTER } from '../../utils/router/router';
import { LoadingOutlined } from '@ant-design/icons';
import LOGO_IMG from '../../assets/images/logo.png'
import { signInAction } from '../../store/actions/authActions';



const Login = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)

    const { token } = useSelector((state) => state.auth)
    const { messageApi } = useSelector((state) => state.messageApi)


    //==> Yup-formik validation <==
    const formSchema = Yup.object().shape({
        username: Yup
            .string()
            .required('Username required')
            .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, 'Invalid email'),
        password: Yup.string().trim().required('Password required')
    })

    const initialValues = {
        username: '',
        password: ''
    }

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: formSchema,
        onSubmit: (values) => {

            let payload = {
                email: values.username.toLowerCase(),
                password: values.password
            }
            setIsLoading(true)

            const successCallback = () => {
                setIsLoading(false)
                navigate(ROUTER.eanMatch)
            }

            const errorCallback = (error) => {
                setIsLoading(false)
                const message = error.response?.data?.detail ?? 'Something went wrong!'
                messageApi.open({
                    type: 'error',
                    content: message,
                    duration: 5,
                });
            }

            dispatch(signInAction(payload, successCallback, errorCallback))
        }
    })

    const { values, touched, errors, handleChange, handleBlur, submitForm } = formik


    useEffect(() => {
        if (token) {
            navigate(ROUTER.eanMatch)
        }
    }, [token])


    return (
        <div className={styles.loginContainer}>
            <div className={styles.imgContainer}>
            </div>
            <div className={styles.formContainer}>
                <div className={styles.logoContainer}>
                    <img src={LOGO_IMG} alt=" " />
                </div>
                <div className={styles.title}>
                    <h1>Portal</h1>
                    <p>Please login with your webshop credentials to access our PIM system</p>
                </div>
                <Form layout='vertical' className={styles.loginBox}>
                    <Form.Item
                        className={styles.formItem}
                        label="User Name"
                    >
                        <Input
                            placeholder="Please enter your email"
                            name='username'
                            value={values.username}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                        {touched.username && errors.username && <span className={styles.error}>{errors.username}</span>}

                    </Form.Item>

                    <Form.Item
                        className={styles.formItem}
                        label="Password"
                    >
                        <Input.Password
                            placeholder="Please enter password"
                            name='password'
                            value={values.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                        {touched.password && errors.password && <span className={styles.error}>{errors.password}</span>}
                    </Form.Item>

                    <Button
                        size="large"
                        type='primary'
                        className={styles.loginBtn}
                        disabled={isLoading}
                        onClick={submitForm}
                    >
                        {isLoading ? <Spin indicator={<LoadingOutlined spin className={styles.spin} />} /> : 'Login'}
                    </Button>

                    <div className={styles.link}>
                        <a href="https://onlineshop.gbrouwer.nl/" target='_blank'>Back to webshop</a>
                    </div>

                </Form>
            </div>
        </div>
    )
}

export default Login
