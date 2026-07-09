# Cottonil POS System

نظام نقاط البيع (POS) لمطعم/محل Cottonil

## 🎯 Features

- ✅ 5 Dashboards (Start Screen, Cashier, Inventory, Owner, Orders/Tables)
- ✅ React 18 + Vite + Tailwind CSS
- ✅ RTL Arabic Support
- ✅ Checkout with stock management
- ✅ Security improvements (no hardcoded passwords)

## 🚀 Quick Start

```bash
npm install
npm run dev
```

## 🔐 Authentication

Authentication is handled server-side via `/api/auth/verify` endpoint.
For development, set `VITE_MOCK_AUTH=true` in your `.env` file.
Never commit real credentials to the repository.

## 📁 Project Structure

```
src/
├── components/     # Header, BottomNav
├── context/        # AppContext (state management)
├── data/           # Mock data
└── pages/          # 5 Dashboards
```

## 🛠️ Tech Stack

- React 18
- Vite
- Tailwind CSS
- React Router DOM v6
- Lucide React Icons

## 📝 Recent Fixes (v3)

1. **Bug Fix**: Added missing `categories` and `salesChartData` to context
2. **Security**: Removed hardcoded password, added operator PIN verification
3. **Checkout**: Added real checkout function with stock update
