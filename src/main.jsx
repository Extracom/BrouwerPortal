import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react.js'
import { persistor, store } from './store/store.js'
import { ConfigProvider } from 'antd'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#E72B37',
              fontFamily: '"Jost", sans-serif',
            },
          }}
        >
          <App />
        </ConfigProvider>
      </PersistGate>
    </Provider >
  </React.StrictMode>,
)
