import type React from "react"
import { Outlet } from "react-router-dom"
import Header from "./Header"
import Sidebar from "./Sidebar"

const Layout: React.FC = () => {
  return (
    <div className="d-flex flex-column vh-100">
      <Header />
      <div className="d-flex flex-grow-1">
        <Sidebar />
        <main className="flex-grow-1 overflow-auto p-3 bg-light">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout

