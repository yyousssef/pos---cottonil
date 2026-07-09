import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { 
  TrendingUp, TrendingDown, Store, Users, Package, 
  DollarSign, ArrowUpRight, ArrowDownRight, Clock,
  BarChart3, PieChart, Activity
} from 'lucide-react'

export default function OwnerDashboard() {
  const { branches, operators, products, shifts, orders, expenses, salesChartData } = useApp()

  const [selectedPeriod, setSelectedPeriod] = useState('today')

  // Calculations
  const todaySales = orders.filter(o => o.type === 'sale').reduce((sum, o) => sum + o.total, 0)
  const todayReturns = Math.abs(orders.filter(o => o.type === 'return').reduce((sum, o) => sum + o.total, 0))
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)
  const netProfit = todaySales - todayReturns - totalExpenses

  const activeShifts = shifts.filter(s => s.status === 'active')
  const activeOperators = operators.filter(o => o.status === 'active').length

  const branchComparison = branches.map(branch => {
    const branchOrders = orders.filter(o => o.branchId === branch.id && o.type === 'sale')
    const total = branchOrders.reduce((sum, o) => sum + o.total, 0)
    return { ...branch, total }
  })

  const topOperators = [...operators]
    .filter(o => o.sales > 0)
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5)

  const stats = [
    { 
      label: 'مبيعات اليوم', 
      value: todaySales.toLocaleString(), 
      suffix: 'ج.م',
      change: '+12.5%', 
      trend: 'up',
      icon: DollarSign,
      color: 'bg-blue-500'
    },
    { 
      label: 'صافي الربح', 
      value: netProfit.toLocaleString(), 
      suffix: 'ج.م',
      change: '+8.3%', 
      trend: 'up',
      icon: TrendingUp,
      color: 'bg-green-500'
    },
    { 
      label: 'الفروع النشطة', 
      value: branches.length, 
      suffix: '',
      change: '0%', 
      trend: 'neutral',
      icon: Store,
      color: 'bg-purple-500'
    },
    { 
      label: 'الموظفين النشطين', 
      value: activeOperators, 
      suffix: '',
      change: '+2', 
      trend: 'up',
      icon: Users,
      color: 'bg-amber-500'
    },
    { 
      label: 'إجمالي المنتجات', 
      value: products.length, 
      suffix: '',
      change: '+15', 
      trend: 'up',
      icon: Package,
      color: 'bg-pink-500'
    },
  ]

  const maxSales = Math.max(...salesChartData.map(d => d.amount))

  return (
    <div className="h-full flex flex-col gap-4 p-4 overflow-auto">
      {/* Header */}
      <div className="card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="font-bold text-gray-800">لوحة تحكم الـ Owner</h2>
              <p className="text-xs text-gray-400">Cottonil - جميع الفروع</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {['today', 'week', 'month'].map(period => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedPeriod === period
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {period === 'today' ? 'اليوم' : period === 'week' ? 'الأسبوع' : 'الشهر'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-5 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <div key={i} className="card p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${stat.color} bg-opacity-10 flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" style={{ color: stat.color.replace('bg-', '') }} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium ${
                  stat.trend === 'up' ? 'text-green-500' : 
                  stat.trend === 'down' ? 'text-red-500' : 'text-gray-400'
                }`}>
                  {stat.trend === 'up' && <ArrowUpRight className="w-3 h-3" />}
                  {stat.trend === 'down' && <ArrowDownRight className="w-3 h-3" />}
                  {stat.change}
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-800">
                {stat.value}
                {stat.suffix && <span className="text-sm font-normal text-gray-400 mr-1">{stat.suffix}</span>}
              </div>
              <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
            </div>
          )
        })}
      </div>

      {/* Middle Row: 3 Columns */}
      <div className="grid grid-cols-3 gap-4">
        {/* Branch Comparison */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-700 text-sm">🏪 مقارنة الفروع</h3>
            <PieChart className="w-4 h-4 text-gray-400" />
          </div>
          <div className="space-y-4">
            {branchComparison.map((branch, i) => {
              const maxBranch = Math.max(...branchComparison.map(b => b.total))
              const percentage = maxBranch > 0 ? (branch.total / maxBranch) * 100 : 0
              const colors = ['bg-blue-500', 'bg-green-500']
              return (
                <div key={branch.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{branch.name}</span>
                    <span className="font-bold text-gray-800">{branch.total.toLocaleString()} ج.م</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${colors[i]}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">الأفضل اليوم</span>
              <span className="font-bold text-blue-600">
                {branchComparison.sort((a, b) => b.total - a.total)[0]?.name} 🏆
              </span>
            </div>
          </div>
        </div>

        {/* Employee Performance */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-700 text-sm">👥 أداء الموظفين</h3>
            <Activity className="w-4 h-4 text-gray-400" />
          </div>
          <div className="space-y-3">
            {topOperators.map((operator, i) => {
              const colors = ['bg-blue-500', 'bg-green-500', 'bg-amber-500', 'bg-purple-500', 'bg-pink-500']
              const maxSalesOp = Math.max(...topOperators.map(o => o.sales))
              const percentage = maxSalesOp > 0 ? (operator.sales / maxSalesOp) * 100 : 0
              return (
                <div key={operator.id} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full ${colors[i]} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}>
                    {operator.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-700 font-medium truncate">{operator.name}</span>
                      <span className="font-bold text-gray-800">{operator.sales.toLocaleString()} ج.م</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${colors[i]} transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {operator.shifts} Shifts | {branches.find(b => b.id === operator.branchId)?.name}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Active Shifts */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-700 text-sm">⏰ Shifts النشطة</h3>
            <Clock className="w-4 h-4 text-gray-400" />
          </div>
          <div className="space-y-3">
            {activeShifts.map(shift => (
              <div key={shift.id} className="p-3 rounded-xl bg-green-50 border border-green-100">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <div className="text-xs font-bold text-gray-700">
                      {branches.find(b => b.id === shift.branchId)?.name}
                    </div>
                    <div className="text-xs text-gray-400">
                      {shift.operators.join('، ')}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700 font-medium">
                    نشط
                  </span>
                </div>
                <div className="flex justify-between text-xs mt-2">
                  <span className="text-gray-400">بدأت: {shift.startTime}</span>
                  <span className="text-gray-600 font-medium">رصيد: {shift.openingBalance.toLocaleString()} ج.م</span>
                </div>
              </div>
            ))}
            {shifts.filter(s => s.status === 'scheduled').map(shift => (
              <div key={shift.id} className="p-3 rounded-xl bg-amber-50 border border-amber-100">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-xs font-bold text-gray-700">
                      {branches.find(b => b.id === shift.branchId)?.name} - وردية مسائية
                    </div>
                    <div className="text-xs text-gray-400">منتظرة | تبدأ 14:00</div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-700 font-medium">
                    قريباً
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Chart & Expenses */}
      <div className="grid grid-cols-2 gap-4">
        {/* Sales Chart */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-700 text-sm">📊 مبيعات آخر 7 أيام</h3>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
          <div className="flex items-end justify-between h-40 gap-3 px-2">
            {salesChartData.map((day, i) => {
              const height = maxSales > 0 ? (day.amount / maxSales) * 100 : 0
              const isToday = i === salesChartData.length - 1
              return (
                <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                  <div className="text-xs font-bold text-gray-700">{(day.amount / 1000).toFixed(0)}k</div>
                  <div className="w-full flex gap-1" style={{ height: `${height}%` }}>
                    <div 
                      className={`flex-1 rounded-t-lg transition-all duration-500 ${
                        isToday ? 'bg-purple-500' : 'bg-blue-400'
                      }`}
                    />
                  </div>
                  <span className={`text-xs ${isToday ? 'font-bold text-purple-600' : 'text-gray-400'}`}>
                    {day.day}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Expenses & Returns */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-700 text-sm">💸 المصروفات والإرجاعات</h3>
            <TrendingDown className="w-4 h-4 text-red-500" />
          </div>
          <div className="space-y-2">
            {expenses.map(expense => (
              <div key={expense.id} className="flex items-center justify-between p-3 rounded-xl bg-red-50">
                <div className="flex items-center gap-2">
                  <span className="text-lg">
                    {expense.type === 'rent' ? '🏢' : expense.type === 'utilities' ? '⚡' : '💰'}
                  </span>
                  <span className="text-sm text-gray-700">{expense.name}</span>
                </div>
                <span className="text-sm font-bold text-red-600">-{expense.amount.toLocaleString()} ج.م</span>
              </div>
            ))}
            {orders.filter(o => o.type === 'return').map(order => (
              <div key={order.id} className="flex items-center justify-between p-3 rounded-xl bg-amber-50">
                <div className="flex items-center gap-2">
                  <span className="text-lg">↩️</span>
                  <span className="text-sm text-gray-700">إرجاع طلب #{order.id}</span>
                </div>
                <span className="text-sm font-bold text-amber-600">{order.total.toLocaleString()} ج.م</span>
              </div>
            ))}
            <div className="pt-3 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">صافي الربح اليومي</span>
                <span className="text-lg font-bold text-green-600">+{netProfit.toLocaleString()} ج.م</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
