import { useState } from 'react'
import { Armchair, CheckCircle, Clock, User } from 'lucide-react'

export default function Tables() {
  const [tables, setTables] = useState([
    { id: 1, number: 'طاولة 1', status: 'occupied', seats: 4, order: 1001, time: '10:30' },
    { id: 2, number: 'طاولة 2', status: 'available', seats: 2, order: null, time: null },
    { id: 3, number: 'طاولة 3', status: 'occupied', seats: 6, order: 1002, time: '11:15' },
    { id: 4, number: 'طاولة 4', status: 'reserved', seats: 4, order: null, time: '12:00' },
    { id: 5, number: 'طاولة 5', status: 'available', seats: 2, order: null, time: null },
    { id: 6, number: 'طاولة 6', status: 'occupied', seats: 8, order: 1003, time: '12:30' },
    { id: 7, number: 'طاولة 7', status: 'available', seats: 4, order: null, time: null },
    { id: 8, number: 'طاولة 8', status: 'cleaning', seats: 4, order: null, time: null },
  ])

  const getStatusStyle = (status) => {
    switch(status) {
      case 'occupied': return 'bg-red-50 border-red-200 text-red-700'
      case 'available': return 'bg-green-50 border-green-200 text-green-700'
      case 'reserved': return 'bg-amber-50 border-amber-200 text-amber-700'
      case 'cleaning': return 'bg-blue-50 border-blue-200 text-blue-700'
      default: return 'bg-gray-50 border-gray-200 text-gray-700'
    }
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'occupied': return <User className="w-4 h-4" />
      case 'available': return <CheckCircle className="w-4 h-4" />
      case 'reserved': return <Clock className="w-4 h-4" />
      case 'cleaning': return <Armchair className="w-4 h-4" />
      default: return null
    }
  }

  const getStatusLabel = (status) => {
    switch(status) {
      case 'occupied': return 'مشغولة'
      case 'available': return 'متاحة'
      case 'reserved': return 'محجوزة'
      case 'cleaning': return 'تنظيف'
      default: return status
    }
  }

  const toggleTable = (id) => {
    setTables(prev => prev.map(t => {
      if (t.id === id) {
        const statuses = ['available', 'occupied', 'reserved', 'cleaning']
        const currentIndex = statuses.indexOf(t.status)
        const nextStatus = statuses[(currentIndex + 1) % statuses.length]
        return { ...t, status: nextStatus }
      }
      return t
    }))
  }

  return (
    <div className="h-full flex flex-col gap-4 p-4 overflow-auto">
      <div className="card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <Armchair className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="font-bold text-gray-800">الطاولات</h2>
              <p className="text-xs text-gray-400">إدارة حالة الطاولات</p>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="badge-success">متاح: {tables.filter(t => t.status === 'available').length}</span>
            <span className="badge-danger">مشغول: {tables.filter(t => t.status === 'occupied').length}</span>
            <span className="badge-warning">محجوز: {tables.filter(t => t.status === 'reserved').length}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {tables.map(table => (
          <button
            key={table.id}
            onClick={() => toggleTable(table.id)}
            className={`card p-6 text-center transition-all duration-200 hover:shadow-md border-2 ${getStatusStyle(table.status)}`}
          >
            <div className="flex justify-center mb-3">
              {getStatusIcon(table.status)}
            </div>
            <h3 className="font-bold text-lg mb-1">{table.number}</h3>
            <p className="text-xs opacity-70">{table.seats} مقاعد</p>
            <p className="text-xs font-medium mt-2">{getStatusLabel(table.status)}</p>
            {table.order && (
              <p className="text-xs mt-1 opacity-60">طلب #{table.order}</p>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
