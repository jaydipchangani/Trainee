import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import './App.css'
import AddProducts from './components/AddProducts'
import Products from './components/products'


function App() {

  const route=createBrowserRouter(
    [
      {
        path:'/',
        element: <h1>Home</h1>
      },
      {
        path:'/products',
        element: <Products/>
      },
      {
        path:'/add',
        element: <AddProducts/>
      }
    ]

  )

  return (
    <>
    <h1>Product Management</h1>
    <RouterProvider router={route} />
    </>
  )
}

export default App
