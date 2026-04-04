export const CATEGORY_COLORS = {
  Food: "#1D9E75",
  Housing: "#378ADD",
  Transport: "#BA7517",
  Entertainment: "#7F77DD",
  Shopping: "#D4537E",
  Health: "#E24B4A",
  Utilities: "#888780",
  Salary: "#0F6E56",
  Freelance: "#185FA5",
  Other: "#5F5E5A",
};

export const INITIAL_TRANSACTIONS = [
  { id: 1,  date: "2026-03-28", desc: "Monthly salary",      cat: "Salary",        type: "income",  amount: 85000 },
  { id: 2,  date: "2026-03-26", desc: "Grocery store",       cat: "Food",          type: "expense", amount: 3200  },
  { id: 3,  date: "2026-03-24", desc: "Electricity bill",    cat: "Utilities",     type: "expense", amount: 1800  },
  { id: 4,  date: "2026-03-22", desc: "Freelance project",   cat: "Freelance",     type: "income",  amount: 22000 },
  { id: 5,  date: "2026-03-20", desc: "Restaurant dinner",   cat: "Food",          type: "expense", amount: 2100  },
  { id: 6,  date: "2026-03-18", desc: "Metro card recharge", cat: "Transport",     type: "expense", amount: 500   },
  { id: 7,  date: "2026-03-15", desc: "Netflix subscription",cat: "Entertainment", type: "expense", amount: 649   },
  { id: 8,  date: "2026-03-14", desc: "Pharmacy",            cat: "Health",        type: "expense", amount: 1200  },
  { id: 9,  date: "2026-03-12", desc: "Clothing purchase",   cat: "Shopping",      type: "expense", amount: 4500  },
  { id: 10, date: "2026-03-10", desc: "House rent",          cat: "Housing",       type: "expense", amount: 18000 },
  { id: 11, date: "2026-03-08", desc: "Cab rides",           cat: "Transport",     type: "expense", amount: 1200  },
  { id: 12, date: "2026-03-05", desc: "Online course",       cat: "Entertainment", type: "expense", amount: 2999  },
  { id: 13, date: "2026-02-28", desc: "Monthly salary",      cat: "Salary",        type: "income",  amount: 85000 },
  { id: 14, date: "2026-02-25", desc: "Grocery store",       cat: "Food",          type: "expense", amount: 2900  },
  { id: 15, date: "2026-02-22", desc: "Freelance project",   cat: "Freelance",     type: "income",  amount: 15000 },
  { id: 16, date: "2026-02-20", desc: "House rent",          cat: "Housing",       type: "expense", amount: 18000 },
  { id: 17, date: "2026-02-18", desc: "Utilities",           cat: "Utilities",     type: "expense", amount: 1600  },
  { id: 18, date: "2026-02-15", desc: "Doctor visit",        cat: "Health",        type: "expense", amount: 800   },
  { id: 19, date: "2026-02-12", desc: "Dining out",          cat: "Food",          type: "expense", amount: 1800  },
  { id: 20, date: "2026-02-10", desc: "Shopping",            cat: "Shopping",      type: "expense", amount: 6200  },
  { id: 21, date: "2026-01-28", desc: "Monthly salary",      cat: "Salary",        type: "income",  amount: 85000 },
  { id: 22, date: "2026-01-25", desc: "Freelance payment",   cat: "Freelance",     type: "income",  amount: 18000 },
  { id: 23, date: "2026-01-22", desc: "House rent",          cat: "Housing",       type: "expense", amount: 18000 },
  { id: 24, date: "2026-01-18", desc: "Groceries",           cat: "Food",          type: "expense", amount: 3400  },
  { id: 25, date: "2026-01-15", desc: "Transport",           cat: "Transport",     type: "expense", amount: 900   },
  { id: 26, date: "2025-12-28", desc: "Monthly salary",      cat: "Salary",        type: "income",  amount: 85000 },
  { id: 27, date: "2025-12-25", desc: "Holiday shopping",    cat: "Shopping",      type: "expense", amount: 9800  },
  { id: 28, date: "2025-12-22", desc: "House rent",          cat: "Housing",       type: "expense", amount: 18000 },
  { id: 29, date: "2025-12-20", desc: "Freelance",           cat: "Freelance",     type: "income",  amount: 25000 },
  { id: 30, date: "2025-11-28", desc: "Monthly salary",      cat: "Salary",        type: "income",  amount: 85000 },
  { id: 31, date: "2025-11-22", desc: "House rent",          cat: "Housing",       type: "expense", amount: 18000 },
  { id: 32, date: "2025-11-18", desc: "Groceries",           cat: "Food",          type: "expense", amount: 3100  },
  { id: 33, date: "2025-10-28", desc: "Monthly salary",      cat: "Salary",        type: "income",  amount: 85000 },
  { id: 34, date: "2025-10-22", desc: "House rent",          cat: "Housing",       type: "expense", amount: 18000 },
  { id: 35, date: "2025-10-18", desc: "Freelance",           cat: "Freelance",     type: "income",  amount: 20000 },
];

export const INITIAL_BUDGETS = [
  { cat: "Food",          limit: 5000,  period: "monthly" },
  { cat: "Shopping",      limit: 5000,  period: "monthly" },
  { cat: "Entertainment", limit: 3000,  period: "monthly" },
  { cat: "Transport",     limit: 2000,  period: "monthly" },
  { cat: "Housing",       limit: 20000, period: "monthly" },
  { cat: "Health",        limit: 2000,  period: "monthly" },
  { cat: "Utilities",     limit: 2500,  period: "monthly" },
];

export const MONTHS        = ["Oct 25", "Nov 25", "Dec 25", "Jan 26", "Feb 26", "Mar 26"];
export const MONTH_KEYS    = ["2025-10", "2025-11", "2025-12", "2026-01", "2026-02", "2026-03"];
export const CURRENT_MONTH = "2026-03";
export const CURRENT_YEAR  = "2026";

export const ALL_CATEGORIES = [
  "Food", "Housing", "Transport", "Entertainment",
  "Shopping", "Health", "Utilities", "Salary", "Freelance", "Other",
];
