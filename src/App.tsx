import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
// Import other pages as we create them
// import Dashboard from './pages/Dashboard'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pastel-blue to-pastel-green text-dark">
      <BrowserRouter>
        <header className="bg-pastel-pink/20 p-4 text-center">
          <h1 className="text-2xl font-bold">PowerPoint Gamified App</h1>
          <p className="text-sm">เรียนรู้ทักษะ PowerPoint แบบสนุกสนาน</p>
        </header>
        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">ยินดีต้อนรับ!</h2>
                <p className="text-muted">
                  กำลังพัฒนาระบบเกมมิฟิเคชันสำหรับการเรียนรู้ทักษะ PowerPoint
                  โปรดรอติดตามการอัปเดตเร็วๆ นี้
                </p>
              </div>
            } />
            {/* Add more routes as we create pages */}
          </Routes>
        </main>
        <footer className="bg-pastel-lavender/20 p-4 text-center text-sm">
          &copy; 2026 PowerPoint Gamified App
        </footer>
      </BrowserRouter>
    </div>
  )
}

export default App