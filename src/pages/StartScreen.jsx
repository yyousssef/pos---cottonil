import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Store, Users, Wallet, ArrowLeft, Lock, Shield } from 'lucide-react'

export default function StartScreen() {
  const navigate = useNavigate()
  const { branches, operators, setCurrentBranch, setCurrentOperator, setCurrentShift } = useApp()

  const [step, setStep] = useState(1)
  const [selectedBranch, setSelectedBranch] = useState(null)
  const [selectedOperators, setSelectedOperators] = useState([])
  const [openingBalance, setOpeningBalance] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleBranchSelect = (branch) => {
    setSelectedBranch(branch)
    setCurrentBranch(branch)
    setStep(2)
  }

  const toggleOperator = (operator) => {
    setSelectedOperators(prev => {
      const exists = prev.find(o => o.id === operator.id)
      if (exists) return prev.filter(o => o.id !== operator.id)
      if (prev.length >= 2) {
        setError('يمكن اختيار عاملين فقط لكل وردية')
        return prev
      }
      setError('')
      return [...prev, operator]
    })
  }

  // Verify operator PIN via server API (or mock in dev mode)
  const verifyOperatorPin = async (operatorId, pin) => {
    // Dev mode: bypass server with VITE_MOCK_AUTH flag
    if (import.meta.env.VITE_MOCK_AUTH === 'true') {
      // For demo only - NEVER use in production
      console.warn('⚠️ MOCK AUTH ENABLED - For development only!')
      return true
    }

    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operatorId, pin })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'رمز التحقق غير صحيح')
      }

      return true
    } catch (error) {
      console.error('Auth error:', error)
      throw new Error('فشل الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت أو الاتصال بالمسؤول.')
    }
  }

  const handleStartShift = async () => {
    setError('')
    setIsLoading(true)

    try {
      // Validate inputs
      if (!openingBalance || selectedOperators.length === 0) {
        setError('يرجى إدخال الرصيد واختيار عامل واحد على الأقل')
        setIsLoading(false)
        return
      }

      if (!password || password.length < 4) {
        setError('يرجى إدخال رمز التحقق (4 أرقام)')
        setIsLoading(false)
        return
      }

      // Verify PIN for the primary operator (server-side in production)
      const primaryOperator = selectedOperators[0]
      const isValid = await verifyOperatorPin(primaryOperator.id, password)

      if (!isValid) {
        setError('رمز التحقق غير صحيح')
        setIsLoading(false)
        return
      }

      // Success - start the shift
      setCurrentOperator(primaryOperator)
      setCurrentShift({
        id: Date.now(),
        branchId: selectedBranch.id,
        operators: selectedOperators.map(o => o.name),
        startTime: new Date().toLocaleTimeString('ar-EG'),
        openingBalance: Number(openingBalance),
      })

      navigate('/dashboard')
    } catch (err) {
      setError('حدث خطأ أثناء التحقق. يرجى المحاولة مرة أخرى.')
      setIsLoading(false)
    }
  }

  const branchOperators = selectedBranch 
    ? operators.filter(o => o.branchId === selectedBranch.id && o.status === 'active')
    : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-primary-500 mx-auto flex items-center justify-center mb-4 shadow-lg shadow-primary-500/30">
            <Store className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Cottonil POS</h1>
          <p className="text-gray-400 text-sm mt-1">نظام إدارة المطاعم والمخازن</p>
        </div>

        {/* Steps */}
        <div className="card p-6">
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {[1, 2, 3].map(s => (
              <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                s === step ? 'bg-primary-500 text-white' : 
                s < step ? 'bg-success-500 text-white' : 'bg-gray-100 text-gray-400'
              }`}>
                {s < step ? '✓' : s}
              </div>
            ))}
          </div>

          {/* Step 1: Select Branch */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-800 text-center mb-4">اختر الفرع</h2>
              {branches.map(branch => (
                <button
                  key={branch.id}
                  onClick={() => handleBranchSelect(branch)}
                  className="w-full p-4 rounded-xl border-2 border-gray-100 hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gray-100 group-hover:bg-primary-100 flex items-center justify-center transition-colors">
                    <Store className="w-6 h-6 text-gray-500 group-hover:text-primary-600" />
                  </div>
                  <div className="text-right flex-1">
                    <h3 className="font-bold text-gray-800">{branch.name}</h3>
                    <p className="text-xs text-gray-400">{branch.location}</p>
                  </div>
                  <ArrowLeft className="w-5 h-5 text-gray-300 group-hover:text-primary-500 transition-colors" />
                </button>
              ))}
            </div>
          )}

          {/* Step 2: Select Operators & Balance */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <button onClick={() => setStep(1)} className="text-sm text-gray-400 hover:text-gray-600">← رجوع</button>
                <h2 className="text-lg font-bold text-gray-800">الوردية الجديدة</h2>
              </div>

              <div className="bg-primary-50 rounded-xl p-3 mb-4">
                <p className="text-sm text-primary-700 font-medium">{selectedBranch?.name}</p>
              </div>

              {/* Opening Balance */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الرصيد الافتتاحي (ج.م)</label>
                <div className="relative">
                  <Wallet className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={openingBalance}
                    onChange={(e) => setOpeningBalance(e.target.value)}
                    placeholder="مثال: 2500"
                    className="input-field w-full pr-10"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">رصيد الدرج من الأمس</p>
              </div>

              {/* Operators */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="w-4 h-4 inline ml-1" />
                  اختر العاملين (حد أقصى 2)
                </label>
                <div className="space-y-2">
                  {branchOperators.map(operator => (
                    <button
                      key={operator.id}
                      onClick={() => toggleOperator(operator)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200 ${
                        selectedOperators.find(o => o.id === operator.id)
                          ? 'border-success-500 bg-success-50'
                          : 'border-gray-100 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${
                        selectedOperators.find(o => o.id === operator.id) ? 'bg-success-500' : 'bg-gray-300'
                      }`}>
                        {operator.name[0]}
                      </div>
                      <div className="text-right flex-1">
                        <span className="text-sm font-medium text-gray-700">{operator.name}</span>
                        <p className="text-xs text-gray-400">{operator.role}</p>
                      </div>
                      {selectedOperators.find(o => o.id === operator.id) && (
                        <span className="text-success-500">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setStep(3)}
                disabled={!openingBalance || selectedOperators.length === 0}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                التالي
              </button>
            </div>
          )}

          {/* Step 3: Password & Start */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <button onClick={() => setStep(2)} className="text-sm text-gray-400 hover:text-gray-600">← رجوع</button>
                <h2 className="text-lg font-bold text-gray-800">تأكيد البداية</h2>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">الفرع:</span>
                  <span className="font-medium">{selectedBranch?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">العاملين:</span>
                  <span className="font-medium">{selectedOperators.map(o => o.name).join('، ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">الرصيد:</span>
                  <span className="font-medium">{Number(openingBalance).toLocaleString()} ج.م</span>
                </div>
              </div>

              {/* Security Notice */}
              <div className="bg-blue-50 rounded-xl p-3 flex items-start gap-2">
                <Shield className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-blue-700">
                  يتم التحقق من الرمز عبر الخادم (Server-Side) باستخدام تشفير آمن. 
                  لا يتم تخزين أو عرض الرمز على الجهاز المحلي.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Lock className="w-4 h-4 inline ml-1" />
                  رمز التحقق (4 أرقام)
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError('') }}
                  placeholder="••••"
                  maxLength={4}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="input-field w-full text-center text-2xl tracking-widest"
                />
                <p className="text-xs text-gray-400 mt-1">
                  أدخل الرمز الشخصي المكون من 4 أرقام
                </p>
              </div>

              {error && (
                <div className="bg-danger-50 text-danger-500 text-sm p-3 rounded-xl">
                  {error}
                </div>
              )}

              <button
                onClick={handleStartShift}
                disabled={isLoading}
                className="w-full btn-success py-3 text-base disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    جاري التحقق...
                  </span>
                ) : (
                  <>🚀 بدء الوردية</>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
