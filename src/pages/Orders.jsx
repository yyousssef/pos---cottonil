import { useApp } from '../context/AppContext'
import { ShoppingCart, ArrowRight, CheckCircle, XCircle, Clock } from 'lucide-react'

export default function Orders() {
  const { orders, branches } = useApp()

  const getStatusBadge = (status) => {
    switch(status) {
      case 'completed': return <span className="badge-success flex items-center gap-1"><CheckCircle className="w-3 h-3"/> مكتمل</span>
      case 'pending': return <span className="badge-warning flex items-center gap-1"><Clock className="w-3 h-3"/> قيد التنفيذ</span>
      case 'cancelled': return <span className="badge-danger flex items-center gap-1"><XCircle className="w-3 h-3"/> ملغي</span>
      default: return <span className="badge-info">{status}</span>
    }
  }

  const getTypeBadge = (type) => {
    switch(type) {
      case 'sale': return <span className="px-2 py-0.5 rounded-lg text-xs bg-blue-100 text-blue-700">بيع</span>
      case 'return': return <span className="px-2 py-0.5 rounded-lg text-xs bg-amber-100 text-amber-700">إرجاع</span>
      default: return <span className="px-2 py-0.5 rounded-lg text-xs bg-gray-100 text-gray-600">{type}</span>
    }
  }

  return (
    <div className="h-full flex flex-col gap-4 p-4 overflow-auto">
      <div className="card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="font-bold text-gray-800">الطلبات</h2>
              <p className="text-xs text-gray-400">سجل جميع العمليات</p>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="badge-success">مكتمل: {orders.filter(o => o.status === 'completed').length}</span>
            <span className="badge-warning">قيد التنفيذ: {orders.filter(o => o.status === 'pending').length}</span>
          </div>
        </div>
      </div>

      <div className="card flex-1 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-700 text-sm">📋 قائمة الطلبات</h3>
        </div>
        <div className="overflow-auto p-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 text-xs border-b border-gray-100">
                <th className="text-right pb-3 pr-2">رقم الطلب</th>
                <th className="text-right pb-3">الفرع</th>
                <th className="text-right pb-3">العامل</th>
                <th className="text-right pb-3">النوع</th>
                <th className="text-right pb-3">المنتجات</th>
                <th className="text-right pb-3">المبلغ</th>
                <th className="text-right pb-3">الوقت</th>
                <th className="text-right pb-3 pl-2">الحالة</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              {orders.map(order => (
                <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="py-3 pr-2 font-bold text-gray-800">#{order.id}</td>
                  <td className="py-3">{branches.find(b => b.id === order.branchId)?.name}</td>
                  <td className="py-3">{order.operator}</td>
                  <td className="py-3">{getTypeBadge(order.type)}</td>
                  <td className="py-3">{order.items}</td>
                  <td className={`py-3 font-bold ${order.type === 'return' ? 'text-amber-600' : 'text-gray-800'}`}>
                    {order.total.toLocaleString()} ج.م
                  </td>
                  <td className="py-3 text-gray-400">{order.time}</td>
                  <td className="py-3 pl-2">{getStatusBadge(order.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
