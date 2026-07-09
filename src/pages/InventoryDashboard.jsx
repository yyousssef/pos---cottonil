import { useState } from 'react'
import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { 
  Search, Plus, Package, AlertTriangle, TrendingUp, 
  Edit2, Trash2, Filter, Download, X, Save
} from 'lucide-react'

export default function InventoryDashboard() {
  const { products, categories, addProduct, editProduct, deleteProduct } = useApp()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  // Form state for add/edit
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    category: 'ملابس',
    image: '👕'
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSaveProduct = () => {
    if (!formData.name || !formData.price || !formData.stock) {
      return
    }

    const productData = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock)
    }

    if (editingProduct) {
      editProduct(editingProduct.id, productData)
    } else {
      addProduct(productData)
    }

    // Reset form
    setFormData({ name: '', price: '', stock: '', category: 'ملابس', image: '👕' })
    setEditingProduct(null)
    setShowAddModal(false)
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      price: String(product.price),
      stock: String(product.stock),
      category: product.category,
      image: product.image
    })
    setShowAddModal(true)
  }

  const handleDeleteProduct = (productId) => {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      deleteProduct(productId)
    }
  }

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const lowStockProducts = products.filter(p => p.stock > 0 && p.stock < 10)
  const outOfStockProducts = products.filter(p => p.stock === 0)
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0)

  const stats = [
    { label: 'إجمالي المنتجات', value: products.length, icon: Package, color: 'bg-blue-100 text-blue-600' },
    { label: 'قارب على الانتهاء', value: lowStockProducts.length, icon: AlertTriangle, color: 'bg-amber-100 text-amber-600' },
    { label: 'نفذت الكمية', value: outOfStockProducts.length, icon: X, color: 'bg-red-100 text-red-600' },
    { label: 'قيمة المخزون', value: `${totalValue.toLocaleString()} ج.م`, icon: TrendingUp, color: 'bg-green-100 text-green-600' },
  ]

  return (
    <div className="h-full flex flex-col gap-4 p-4 overflow-auto">
      {/* Header */}
      <div className="card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <Package className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="font-bold text-gray-800">لوحة تحكم المخزن</h2>
              <p className="text-xs text-gray-400">إدارة المنتجات والمخزون</p>
            </div>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn-success flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            إضافة منتج
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <div key={i} className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
              <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
            </div>
          )
        })}
      </div>

      {/* Main Content */}
      <div className="flex gap-4 flex-1 min-h-0">
        {/* Products Table */}
        <div className="flex-[2] card flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-4">
            <h3 className="font-bold text-gray-700">📋 قائمة المنتجات</h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="بحث..."
                  className="input-field pr-9 w-48"
                />
              </div>
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-field w-36"
              >
                <option value="all">كل التصنيفات</option>
                {categories.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
              <button className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-500">
                <Filter className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-500">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 text-xs border-b border-gray-100">
                  <th className="text-right pb-3 pr-2">المنتج</th>
                  <th className="text-right pb-3">التصنيف</th>
                  <th className="text-right pb-3">السعر</th>
                  <th className="text-right pb-3">المخزون</th>
                  <th className="text-right pb-3">الحالة</th>
                  <th className="text-right pb-3 pl-2">إجراءات</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                {filteredProducts.map(product => (
                  <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="py-3 pr-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-xl">
                          {product.image}
                        </div>
                        <span className="font-medium text-gray-700">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-1 rounded-lg text-xs bg-gray-100 text-gray-600">
                        {product.category}
                      </span>
                    </td>
                    <td className="py-3 font-medium">{product.price.toLocaleString()} ج.م</td>
                    <td className="py-3">
                      <span className={`font-bold ${
                        product.stock === 0 ? 'text-red-500' : 
                        product.stock < 10 ? 'text-amber-500' : 'text-gray-700'
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="py-3">
                      {product.stock === 0 ? (
                        <span className="badge-danger">نفذ</span>
                      ) : product.stock < 10 ? (
                        <span className="badge-warning">قارب</span>
                      ) : (
                        <span className="badge-success">متوفر</span>
                      )}
                    </td>
                    <td className="py-3 pl-2">
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => handleEditProduct(product)}
                          className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-500 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 flex flex-col gap-4">
          {/* Low Stock Alerts */}
          <div className="card p-4">
            <h4 className="font-bold text-gray-700 mb-3 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              تنبيهات المخزون
            </h4>
            <div className="space-y-2">
              {lowStockProducts.map(product => (
                <div key={product.id} className="flex items-center justify-between p-2 rounded-xl bg-amber-50">
                  <span className="text-xs text-gray-700">{product.name}</span>
                  <span className="text-xs font-bold text-amber-600">{product.stock} باقي</span>
                </div>
              ))}
              {outOfStockProducts.map(product => (
                <div key={product.id} className="flex items-center justify-between p-2 rounded-xl bg-red-50">
                  <span className="text-xs text-gray-700">{product.name}</span>
                  <span className="text-xs font-bold text-red-600">نفذ!</span>
                </div>
              ))}
              {lowStockProducts.length === 0 && outOfStockProducts.length === 0 && (
                <p className="text-xs text-gray-400 text-center py-4">لا توجد تنبيهات</p>
              )}
            </div>
          </div>

          {/* Categories */}
          <div className="card p-4">
            <h4 className="font-bold text-gray-700 mb-3 text-sm">🏷️ التصنيفات</h4>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <span key={cat.id} className={`px-3 py-1.5 rounded-full text-xs font-medium ${cat.color}`}>
                  {cat.name} ({cat.count})
                </span>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card p-4">
            <h4 className="font-bold text-gray-700 mb-3 text-sm">⚡ إجراءات سريعة</h4>
            <div className="space-y-2">
              <button className="w-full py-2.5 rounded-xl text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 transition-colors">
                📥 استلام شحنة
              </button>
              <button className="w-full py-2.5 rounded-xl text-sm font-medium text-white bg-purple-500 hover:bg-purple-600 transition-colors">
                📤 تحويل بين الفروع
              </button>
              <button className="w-full py-2.5 rounded-xl text-sm font-medium text-white bg-amber-500 hover:bg-amber-600 transition-colors">
                📊 تصدير تقرير
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">{editingProduct ? '✏️ تعديل منتج' : '➕ إضافة منتج جديد'}</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">اسم المنتج</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input-field w-full" 
                  placeholder="مثال: تيشيرت قطن" 
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">السعر</label>
                  <input 
                    type="number" 
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="input-field w-full" 
                    placeholder="350" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">المخزون</label>
                  <input 
                    type="number" 
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    className="input-field w-full" 
                    placeholder="50" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">التصنيف</label>
                <select 
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="input-field w-full"
                >
                  <option>ملابس</option>
                  <option>أحذية</option>
                  <option>إكسسوارات</option>
                </select>
              </div>
              <button 
                onClick={handleSaveProduct}
                disabled={!formData.name || !formData.price || !formData.stock}
                className="w-full btn-success py-3 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {editingProduct ? 'تحديث المنتج' : 'حفظ المنتج'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
