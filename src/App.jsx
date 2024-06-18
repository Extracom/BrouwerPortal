import { useDispatch } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/login/Login'
import './App.css'
import { useEffect } from 'react'
import { message } from 'antd'
import { ADD_MESSAGE_API } from './store/constants/messageApi'
import { ROUTER } from './utils/router/router'
import AuthWrapper from './components/auth-wrapper/AuthWrapper'
import EanMatch from './pages/ean-match/EanMatch'
import Product from './pages/product/Product'


function App() {

  const dispatch = useDispatch()
  const [messageApi, contextHolder] = message.useMessage()

  useEffect(() => {
    dispatch({ type: ADD_MESSAGE_API, payload: messageApi })
  }, [messageApi])


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path={ROUTER.login} element={<Login />} />

          <Route element={<AuthWrapper />} >
            <Route path={ROUTER.product} element={<Product />} />
            <Route path={ROUTER.eanMatch} element={<EanMatch />} />
          </Route>

          <Route path="*" element={<div>Not found</div>} />
        </Routes>
      </BrowserRouter>
      {contextHolder}
    </>
  )
}

export default App
