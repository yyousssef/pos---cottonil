import { useApp } from '../context/AppContext'
import { Store, Clock, Bell, User } from 'lucide-react'

export default function Header() {
  const { currentBranch } = useApp()

  const now = new Date()
  const timeStr = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
  const dateStr = now.toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })

  return (
    <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
          <Store className="w-5 h-5 text-primary-600" />
        </div>
        <div>
          <h1 className="font-bold text-gray-800 text-lg leading-tight">Cottonil POS</h1>
          {currentBranch && (
            <p className="text-xs text-gray-400">{currentBranch.name}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
          <Clock className="w-4 h-4" />
          <span>{timeStr}</span>
          <span className="text-gray-300">|</span>
          <span>{dateStr}</span>
        </div>

        <button className="relative w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors">
          <Bell className="w-5 h-5 text-gray-500" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger-500 text-white text-xs rounded-full flex items-center justify-center font-bold">3</span>
        </button>

        <button className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </button>
      </div>
    </header>
  )
}
