import { Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Header from './components/Header'
import BottomNav from './components/BottomNav'
import StartScreen from './pages/StartScreen'
import CashierDashboard from './pages/CashierDashboard'
import InventoryDashboard from './pages/InventoryDashboard'
import OwnerDashboard from './pages/OwnerDashboard'
import Orders from './pages/Orders'
import Tables from './pages/Tables'
import More from './pages/More'

function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<StartScreen />} />
        <Route path="/dashboard" element={
          <div className="h-screen flex flex-col bg-gray-50">
            <Header />
            <main className="flex-1 overflow-hidden">
              <CashierDashboard />
            </main>
            <BottomNav />
          </div>
        } />
        <Route path="/inventory" element={
          <div className="h-screen flex flex-col bg-gray-50">
            <Header />
            <main className="flex-1 overflow-hidden">
              <InventoryDashboard />
            </main>
          </div>
        } />
        <Route path="/owner" element={
          <div className="h-screen flex flex-col bg-gray-50">
            <Header />
            <main className="flex-1 overflow-hidden">
              <OwnerDashboard />
            </main>
          </div>
        } />
        <Route path="/orders" element={
          <div className="h-screen flex flex-col bg-gray-50">
            <Header />
            <main className="flex-1 overflow-hidden">
              <Orders />
            </main>
            <BottomNav />
          </div>
        } />
        <Route path="/tables" element={
          <div className="h-screen flex flex-col bg-gray-50">
            <Header />
            <main className="flex-1 overflow-hidden">
              <Tables />
            </main>
            <BottomNav />
          </div>
        } />
        <Route path="/more" element={
          <div className="h-screen flex flex-col bg-gray-50">
            <Header />
            <main className="flex-1 overflow-hidden">
              <More />
            </main>
            <BottomNav />
          </div>
        } />
        <Route path="/new-order" element={
          <div className="h-screen flex flex-col bg-gray-50">
            <Header />
            <main className="flex-1 overflow-hidden">
              <CashierDashboard />
            </main>
            <BottomNav />
          </div>
        } />
      </Routes>
    </AppProvider>
  )
}

export default App
