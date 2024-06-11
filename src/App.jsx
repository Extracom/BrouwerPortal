import { useDispatch } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/login/Login'
import Dashboard from './pages/dashboard/Dashboard'
import './App.css'
import { useEffect } from 'react'
import { message } from 'antd'
import { ADD_MESSAGE_API } from './store/constants/messageApi'
import { ROUTER } from './utils/router/router'
import AuthWrapper from './components/auth-wrapper/AuthWrapper'


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
            <Route path={ROUTER.dashboard} element={<Dashboard />} />
          </Route>

          <Route path="*" element={<div>Not found</div>} />
        </Routes>
      </BrowserRouter>
      {contextHolder}
    </>
  )
}

export default App
