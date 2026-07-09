import { useNavigate, useLocation } from 'react-router-dom'
import { Home, ClipboardList, Armchair, MoreHorizontal, PlusCircle } from 'lucide-react'

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  const navItems = [
    { path: '/', icon: Home, label: 'الرئيسية' },
    { path: '/orders', icon: ClipboardList, label: 'الطلبات' },
    { path: '/tables', icon: Armchair, label: 'الطاولات' },
    { path: '/more', icon: MoreHorizontal, label: 'المزيد' },
  ]

  return (
    <nav className="bg-white border-t border-gray-100 px-4 py-2 flex items-center justify-around sticky bottom-0 z-50">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path
        const Icon = item.icon
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 ${
              isActive ? 'text-primary-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        )
      })}

      <button
        onClick={() => navigate('/new-order')}
        className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl bg-success-500 text-white -mt-4 shadow-lg shadow-success-500/30 hover:shadow-xl hover:-mt-5 transition-all duration-200"
      >
        <PlusCircle className="w-6 h-6" />
        <span className="text-xs font-medium">إنشاء طلب</span>
      </button>
    </nav>
  )
}
