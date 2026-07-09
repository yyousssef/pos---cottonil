// Branches
export const branches = [
  { id: 1, name: 'Cottonil al-Marg', location: 'المرج', status: 'active' },
  { id: 2, name: 'Cottonil al-Khosous', location: 'الخصوص', status: 'active' },
]

// Operators
export const operators = [
  { id: 1, name: 'أحمد محمد', branchId: 1, role: 'كاشير', status: 'active', shifts: 8, sales: 12400 },
  { id: 2, name: 'سارة أحمد', branchId: 1, role: 'كاشير', status: 'active', shifts: 5, sales: 8200 },
  { id: 3, name: 'محمد علي', branchId: 2, role: 'كاشير', status: 'active', shifts: 6, sales: 9800 },
  { id: 4, name: 'فاطمة حسن', branchId: 2, role: 'مخزن', status: 'active', shifts: 7, sales: 0 },
  { id: 5, name: 'عمر خالد', branchId: 1, role: 'كاشير', status: 'inactive', shifts: 0, sales: 0 },
]

// Products
export const products = [
  { id: 1, name: 'تيشيرت قطن أبيض', price: 350, stock: 45, category: 'ملابس', image: '👕', status: 'available' },
  { id: 2, name: 'بنطلون جينز', price: 520, stock: 8, category: 'ملابس', image: '👖', status: 'low' },
  { id: 3, name: 'جاكيت شتوي', price: 1200, stock: 0, category: 'ملابس', image: '🧥', status: 'out' },
  { id: 4, name: 'حذاء رياضي', price: 680, stock: 5, category: 'أحذية', image: '👟', status: 'low' },
  { id: 5, name: 'قميص رسمي', price: 450, stock: 32, category: 'ملابس', image: '👔', status: 'available' },
  { id: 6, name: 'حذاء كلاسيك', price: 850, stock: 18, category: 'أحذية', image: '👞', status: 'available' },
  { id: 7, name: 'ساعة يد', price: 1500, stock: 12, category: 'إكسسوارات', image: '⌚', status: 'available' },
  { id: 8, name: 'نظارة شمسية', price: 380, stock: 3, category: 'إكسسوارات', image: '🕶️', status: 'low' },
]

// Shifts
export const shifts = [
  { id: 1, branchId: 1, operators: ['أحمد محمد', 'سارة أحمد'], startTime: '08:00', endTime: null, status: 'active', openingBalance: 2500 },
  { id: 2, branchId: 2, operators: ['محمد علي'], startTime: '09:00', endTime: null, status: 'active', openingBalance: 1800 },
  { id: 3, branchId: 1, operators: ['عمر خالد'], startTime: '14:00', endTime: null, status: 'scheduled', openingBalance: 0 },
]

// Orders
export const orders = [
  { id: 1001, branchId: 1, operator: 'أحمد محمد', items: 3, total: 1050, status: 'completed', time: '10:30', type: 'sale' },
  { id: 1002, branchId: 1, operator: 'سارة أحمد', items: 2, total: 680, status: 'completed', time: '11:15', type: 'sale' },
  { id: 1003, branchId: 2, operator: 'محمد علي', items: 1, total: 350, status: 'pending', time: '12:00', type: 'sale' },
  { id: 1004, branchId: 1, operator: 'أحمد محمد', items: 1, total: -350, status: 'completed', time: '12:30', type: 'return' },
  { id: 1005, branchId: 2, operator: 'محمد علي', items: 2, total: 1700, status: 'completed', time: '13:00', type: 'sale' },
]

// Expenses
export const expenses = [
  { id: 1, type: 'rent', name: 'إيجار الفرعين', amount: 8000, date: '2026-07-01' },
  { id: 2, type: 'utilities', name: 'فاتورة كهربا', amount: 1200, date: '2026-07-05' },
  { id: 3, type: 'salary', name: 'مرتبات الموظفين', amount: 15000, date: '2026-07-01' },
]

// Sales data for chart
export const salesChartData = [
  { day: 'السبت', amount: 32000, branch1: 18000, branch2: 14000 },
  { day: 'الأحد', amount: 41000, branch1: 24000, branch2: 17000 },
  { day: 'الإثنين', amount: 28000, branch1: 15000, branch2: 13000 },
  { day: 'الثلاثاء', amount: 45000, branch1: 28000, branch2: 17000 },
  { day: 'الأربعاء', amount: 38000, branch1: 22000, branch2: 16000 },
  { day: 'الخميس', amount: 35000, branch1: 20000, branch2: 15000 },
  { day: 'اليوم', amount: 47850, branch1: 28500, branch2: 19350 },
]

// Categories
export const categories = [
  { id: 1, name: 'ملابس', count: 45, color: 'bg-blue-100 text-blue-800' },
  { id: 2, name: 'أحذية', count: 23, color: 'bg-pink-100 text-pink-800' },
  { id: 3, name: 'إكسسوارات', count: 67, color: 'bg-green-100 text-green-800' },
]
