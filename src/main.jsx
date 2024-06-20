import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import store from './store/store.js'
import { AuthLayout } from './components/index.js'
import { createBrowserRouter } from 'react-router-dom'
import Home from './pages/home.jsx'
import Login from './components/Login.jsx'
import SignUp from './components/SignUp.jsx'
import allPosts from './pages/AllPosts.jsx'
import addPost from './pages/addPost.jsx'

const router = createBrowserRouter([
  {
    path:'/',
    element: <App/>,
    children: [
      {
        path: '/',
        element: <Home/>,
      },
      {
        path:'/login',
        element:(
          <AuthLayout authentication={false}>
            <Login/>
          </AuthLayout>
        ),
      },
      {
        path: '/signup',
        element:(
          <AuthLayout>
            <SignUp/>
          </AuthLayout>
        ),
      },
      {
        path: 'all-posts',
        element:(
          <AuthLayout authentication={true}>
           {''}
           <allPosts />
          </AuthLayout>
        ),
      },
      {
        path: 'add-post',
        element:(
          <AuthLayout authentication={true}>
           {''}
           <addPost/>
          </AuthLayout>
        )
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store = {store}>
    <App />
    </Provider>
  </React.StrictMode>,
)
