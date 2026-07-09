import { useNavigate } from 'react-router-dom'
import { 
  Package, BarChart3, Settings, Users, LogOut,
  ChevronLeft, Shield, Warehouse, Receipt
} from 'lucide-react'

export default function More() {
  const navigate = useNavigate()

  const menuItems = [
    { 
      label: 'لوحة المخزن', 
      icon: Warehouse, 
      path: '/inventory',
      color: 'bg-green-100 text-green-600',
      desc: 'إدارة المنتجات والمخزون'
    },
    { 
      label: 'لوحة الـ Owner', 
      icon: BarChart3, 
      path: '/owner',
      color: 'bg-purple-100 text-purple-600',
      desc: 'التقارير والإحصائيات'
    },
    { 
      label: 'إدارة الموظفين', 
      icon: Users, 
      path: '#',
      color: 'bg-blue-100 text-blue-600',
      desc: 'العاملين والصلاحيات'
    },
    { 
      label: 'التقارير المالية', 
      icon: Receipt, 
      path: '#',
      color: 'bg-amber-100 text-amber-600',
      desc: 'المبيعات والمصروفات'
    },
    { 
      label: 'الإعدادات', 
      icon: Settings, 
      path: '#',
      color: 'bg-gray-100 text-gray-600',
      desc: 'إعدادات النظام'
    },
    { 
      label: 'تسجيل الخروج', 
      icon: LogOut, 
      path: '/',
      color: 'bg-red-100 text-red-600',
      desc: 'إنهاء الوردية'
    },
  ]

  return (
    <div className="h-full flex flex-col gap-4 p-4 overflow-auto">
      <div className="card p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
            <Shield className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <h2 className="font-bold text-gray-800">المزيد</h2>
            <p className="text-xs text-gray-400">الإعدادات والأدوات الإضافية</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {menuItems.map((item, i) => {
          const Icon = item.icon
          return (
            <button
              key={i}
              onClick={() => item.path !== '#' && navigate(item.path)}
              className="w-full card p-4 flex items-center gap-4 hover:shadow-md transition-all duration-200 text-right"
            >
              <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800">{item.label}</h3>
                <p className="text-xs text-gray-400">{item.desc}</p>
              </div>
              <ChevronLeft className="w-5 h-5 text-gray-300" />
            </button>
          )
        })}
      </div>
    </div>
  )
}
