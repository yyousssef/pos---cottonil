import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { 
  Search, ShoppingCart, Minus, Plus, Trash2, CreditCard, 
  Receipt, ArrowRight, Package, RotateCcw, Wallet, 
  CircleDollarSign, CirclePlus, X
} from 'lucide-react'

export default function CashierDashboard() {
  const navigate = useNavigate()
  const { 
    currentBranch, currentOperator, products, cart, 
    addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount,
    activeTab, setActiveTab, checkout, isCheckingOut 
  } = useApp()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showCheckout, setShowCheckout] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('cash')

  const categories = ['all', 'ملابس', 'أحذية', 'إكسسوارات']

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const sidebarActions = [
    { id: 'sale', label: 'بيع', icon: ShoppingCart, color: 'bg-primary-500' },
    { id: 'return', label: 'إرجاع', icon: RotateCcw, color: 'bg-warning-500' },
    { id: 'expenses', label: 'مصروفات', icon: Wallet, color: 'bg-danger-500' },
    { id: 'advance', label: 'سلفة', icon: CircleDollarSign, color: 'bg-purple-500' },
    { id: 'add-product', label: 'إضافة منتج', icon: CirclePlus, color: 'bg-success-500' },
  ]

  const handleCheckout = () => {
    alert(`تم إتمام البيع بنجاح!
المبلغ: ${cartTotal.toLocaleString()} ج.م`)
    clearCart()
    setShowCheckout(false)
  }

  if (!currentBranch) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">لم يتم اختيار فرع</p>
          <button onClick={() => navigate('/')} className="btn-primary">العودة للبداية</button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex gap-4 p-4">
      {/* Main Content Area */}
      <div className="flex-[3] flex flex-col gap-4">
        {/* Top Bar: Branch Info + Search */}
        <div className="card p-4 flex items-center gap-4">
          <div className="bg-primary-50 px-4 py-2 rounded-xl">
            <span className="text-sm font-bold text-primary-700">{currentBranch.name}</span>
          </div>
          <div className="bg-gray-50 px-4 py-2 rounded-xl flex items-center gap-2">
            <span className="text-sm text-gray-500">⏰</span>
            <span className="text-sm text-gray-700">{new Date().toLocaleTimeString('ar-EG', {hour:'2-digit', minute:'2-digit'})}</span>
          </div>

          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن منتج..."
              className="input-field w-full pr-10"
            />
          </div>
        </div>

        {/* Employee Icons */}
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">العاملين اليوم:</span>
            <div className="flex -space-x-2 space-x-reverse">
              {[1,2,3].map(i => (
                <div key={i} className="w-9 h-9 rounded-full bg-primary-500 border-2 border-white flex items-center justify-center text-xs font-bold text-white">
                  {i === 1 ? 'أ' : i === 2 ? 'س' : 'م'}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedCategory === cat 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {cat === 'all' ? 'الكل' : cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-3 gap-4">
            {filteredProducts.map(product => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                disabled={product.stock === 0}
                className={`card p-4 text-center transition-all duration-200 hover:shadow-md hover:-translate-y-1 ${
                  product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <div className="text-4xl mb-3">{product.image}</div>
                <h4 className="font-bold text-gray-800 text-sm mb-1">{product.name}</h4>
                <p className="text-primary-600 font-bold">{product.price.toLocaleString()} ج.م</p>
                <p className={`text-xs mt-1 ${
                  product.stock === 0 ? 'text-danger-500' : 
                  product.stock < 10 ? 'text-warning-500' : 'text-gray-400'
                }`}>
                  {product.stock === 0 ? 'نفذت الكمية' : `متوفر: ${product.stock}`}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-72 flex flex-col gap-4">
        {/* Actions List */}
        <div className="card p-4">
          <h3 className="font-bold text-gray-700 mb-3 text-sm">العمليات</h3>
          <div className="space-y-2">
            {sidebarActions.map(action => {
              const Icon = action.icon
              return (
                <button
                  key={action.id}
                  onClick={() => setActiveTab(action.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                    activeTab === action.id 
                      ? 'bg-gray-800 text-white' 
                      : 'hover:bg-gray-50 text-gray-600'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg ${action.color} flex items-center justify-center`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium">{action.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Cart / Checkout Area */}
        <div className="card flex-1 flex flex-col">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-700 text-sm">🛒 السلة</h3>
              {cartCount > 0 && (
                <span className="badge-info">{cartCount} منتج</span>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-auto p-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <ShoppingCart className="w-12 h-12 mb-2 opacity-30" />
                <p className="text-sm">السلة فارغة</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map(item => (
                  <div key={item.id} className="bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{item.name}</span>
                      <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-danger-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-primary-600">
                        {(item.price * item.quantity).toLocaleString()} ج.م
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="p-4 border-t border-gray-100 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">المجموع:</span>
                <span className="font-bold text-xl text-gray-800">{cartTotal.toLocaleString()} ج.م</span>
              </div>
              <button 
                onClick={() => setShowCheckout(true)}
                className="w-full btn-success py-3 flex items-center justify-center gap-2"
              >
                <CreditCard className="w-5 h-5" />
                إتمام البيع
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">💳 إتمام الدفع</h3>
              <button onClick={() => setShowCheckout(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">عدد المنتجات:</span>
                <span className="font-medium">{cartCount}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>الإجمالي:</span>
                <span className="text-primary-600">{cartTotal.toLocaleString()} ج.م</span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <p className="text-sm font-medium text-gray-700">طريقة الدفع:</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'cash', label: '💵 نقدي' },
                  { id: 'card', label: '💳 فيزا' },
                  { id: 'wallet', label: '📱 محفظة' },
                  { id: 'installment', label: '📋 تقسيط' },
                ].map(method => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                      paymentMethod === method.id
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    {method.label}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handleCheckout} className="w-full btn-success py-3 text-base">
              ✅ تأكيد البيع وطباعة الفاتورة
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
