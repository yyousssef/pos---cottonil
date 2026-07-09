import React, { createContext, useContext, useState, useCallback } from 'react'
import { branches, operators, products as initialProducts, shifts, orders as initialOrders, expenses, categories, salesChartData } from '../data/mockData'

const AppContext = createContext()

export function AppProvider({ children }) {
  const [currentBranch, setCurrentBranch] = useState(null)
  const [currentShift, setCurrentShift] = useState(null)
  const [currentOperator, setCurrentOperator] = useState(null)
  const [cart, setCart] = useState([])
  const [activeTab, setActiveTab] = useState('sale')

  // State for products and orders (mutable for checkout)
  const [products, setProducts] = useState(initialProducts)
  const [orders, setOrders] = useState(initialOrders)
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCart(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => setCart([])

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  // Checkout function: updates stock, creates order, clears cart
  const checkout = useCallback(async (paymentMethod = 'cash') => {
    if (cart.length === 0) {
      throw new Error('السلة فارغة')
    }

    if (!currentBranch || !currentOperator) {
      throw new Error('لم يتم تسجيل الدخول')
    }

    setIsCheckingOut(true)

    try {
      // 1. Update product stock (decrement)
      setProducts(prevProducts => {
        return prevProducts.map(product => {
          const cartItem = cart.find(item => item.id === product.id)
          if (cartItem) {
            const newStock = product.stock - cartItem.quantity
            return {
              ...product,
              stock: Math.max(0, newStock),
              status: newStock <= 0 ? 'out' : newStock < 10 ? 'low' : 'available'
            }
          }
          return product
        })
      })

      // 2. Create new order
      const newOrder = {
        id: Date.now(),
        branchId: currentBranch.id,
        operator: currentOperator.name,
        items: cartCount,
        total: cartTotal,
        status: 'completed',
        time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        type: 'sale',
        paymentMethod,
        products: cart.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        }))
      }

      // 3. Add order to list
      setOrders(prevOrders => [newOrder, ...prevOrders])

      // 4. TODO: Post to backend API
      // await fetch('/api/orders', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newOrder)
      // })

      // 5. Clear cart
      clearCart()

      // 6. TODO: Generate receipt/print
      console.log('Order completed:', newOrder)

      return newOrder

    } catch (error) {
      console.error('Checkout error:', error)
      throw error
    } finally {
      setIsCheckingOut(false)
    }
  }, [cart, cartCount, cartTotal, currentBranch, currentOperator])

  // Add product to inventory
  const addProduct = useCallback((productData) => {
    const newProduct = {
      id: Date.now(),
      ...productData,
      status: productData.stock > 10 ? 'available' : productData.stock > 0 ? 'low' : 'out'
    }
    setProducts(prev => [...prev, newProduct])
    return newProduct
  }, [])

  // Edit product
  const editProduct = useCallback((productId, updates) => {
    setProducts(prev =>
      prev.map(product =>
        product.id === productId
          ? { ...product, ...updates, status: updates.stock !== undefined ? (updates.stock > 10 ? 'available' : updates.stock > 0 ? 'low' : 'out') : product.status }
          : product
      )
    )
  }, [])

  // Delete product
  const deleteProduct = useCallback((productId) => {
    setProducts(prev => prev.filter(product => product.id !== productId))
  }, [])

  const value = {
    branches,
    operators,
    products,
    setProducts,
    shifts,
    orders,
    setOrders,
    expenses,
    categories,
    salesChartData,
    currentBranch,
    setCurrentBranch,
    currentShift,
    setCurrentShift,
    currentOperator,
    setCurrentOperator,
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    cartCount,
    activeTab,
    setActiveTab,
    checkout,
    isCheckingOut,
    addProduct,
    editProduct,
    deleteProduct,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  return useContext(AppContext)
}
