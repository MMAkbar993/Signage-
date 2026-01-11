// User Management and Tracking System

export interface User {
  id: string;
  email: string;
  name: string;
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'suspended' | 'banned';
  registeredDate: string;
  lastActive: string;
  usage: {
    signageGenerated: number;
    templatesUsed: number;
    aiGenerations: number;
    exports: number;
  };
  quota: {
    signageLimit: number;
    templateLimit: number;
    aiLimit: number;
    exportLimit: number;
  };
  features: {
    aiGenerator: boolean;
    templateLibrary: boolean;
    companyBranding: boolean;
    multiLanguage: boolean;
    highResExport: boolean;
    bulkExport: boolean;
  };
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  timestamp: string;
  category: 'signage' | 'template' | 'user' | 'system' | 'export' | 'ai';
}

export interface PlanConfig {
  name: 'free' | 'pro' | 'enterprise';
  displayName: string;
  price: string;
  limits: {
    signageLimit: number;
    templateLimit: number;
    aiLimit: number;
    exportLimit: number;
  };
  features: {
    aiGenerator: boolean;
    templateLibrary: boolean;
    companyBranding: boolean;
    multiLanguage: boolean;
    highResExport: boolean;
    bulkExport: boolean;
  };
}

// Default plan configurations
export const PLAN_CONFIGS: Record<string, PlanConfig> = {
  free: {
    name: 'free',
    displayName: 'Free Plan',
    price: '$0/month',
    limits: {
      signageLimit: 3, // 3 per day
      templateLimit: 50,
      aiLimit: 1, // 1 per day
      exportLimit: 10,
    },
    features: {
      aiGenerator: true, // Changed to true - 1 per day
      templateLibrary: true,
      companyBranding: false,
      multiLanguage: false,
      highResExport: false,
      bulkExport: false,
    },
  },
  pro: {
    name: 'pro',
    displayName: 'Pro Plan',
    price: '$5/month', // Changed from $29
    limits: {
      signageLimit: -1, // Unlimited
      templateLimit: -1, // Unlimited
      aiLimit: -1, // Unlimited
      exportLimit: -1, // Unlimited
    },
    features: {
      aiGenerator: true,
      templateLibrary: true,
      companyBranding: true,
      multiLanguage: true,
      highResExport: true,
      bulkExport: true,
    },
  },
  enterprise: {
    name: 'enterprise',
    displayName: 'Enterprise Plan',
    price: '$50/month', // Changed from $99
    limits: {
      signageLimit: -1, // unlimited
      templateLimit: -1,
      aiLimit: -1,
      exportLimit: -1,
    },
    features: {
      aiGenerator: true,
      templateLibrary: true,
      companyBranding: true,
      multiLanguage: true,
      highResExport: true,
      bulkExport: true,
    },
  },
};

// Get current user (session-based, simplified)
export const getCurrentUser = (): User => {
  const userSession = localStorage.getItem('currentUser');
  
  if (!userSession) {
    // Create a default user session
    const defaultUser: User = {
      id: 'user_' + Date.now(),
      email: 'user@example.com',
      name: 'Guest User',
      plan: 'pro', // Default to pro for demo
      status: 'active',
      registeredDate: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      usage: {
        signageGenerated: 0,
        templatesUsed: 0,
        aiGenerations: 0,
        exports: 0,
      },
      quota: PLAN_CONFIGS.pro.limits,
      features: PLAN_CONFIGS.pro.features,
    };
    
    localStorage.setItem('currentUser', JSON.stringify(defaultUser));
    return defaultUser;
  }
  
  return JSON.parse(userSession);
};

// Update current user
export const updateCurrentUser = (updates: Partial<User>): void => {
  const currentUser = getCurrentUser();
  const updatedUser = { ...currentUser, ...updates, lastActive: new Date().toISOString() };
  localStorage.setItem('currentUser', JSON.stringify(updatedUser));
};

// Get all users (for admin)
export const getAllUsers = (): User[] => {
  const users = localStorage.getItem('allUsers');
  if (!users) {
    // Initialize with current user
    const currentUser = getCurrentUser();
    const userList = [currentUser];
    localStorage.setItem('allUsers', JSON.stringify(userList));
    return userList;
  }
  return JSON.parse(users);
};

// Update user (admin function)
export const updateUser = (userId: string, updates: Partial<User>): void => {
  const users = getAllUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...updates };
    localStorage.setItem('allUsers', JSON.stringify(users));
    
    // If updating current user, update their session too
    const currentUser = getCurrentUser();
    if (currentUser.id === userId) {
      localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
    }
  }
};

// Add new user (admin function)
export const addUser = (user: Omit<User, 'id'>): User => {
  const users = getAllUsers();
  const newUser: User = {
    ...user,
    id: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
  };
  
  users.push(newUser);
  localStorage.setItem('allUsers', JSON.stringify(users));
  return newUser;
};

// Delete user (admin function)
export const deleteUser = (userId: string): void => {
  const users = getAllUsers();
  const filteredUsers = users.filter(u => u.id !== userId);
  localStorage.setItem('allUsers', JSON.stringify(filteredUsers));
};

// Log activity
export const logActivity = (action: string, details: string, category: ActivityLog['category']): void => {
  const currentUser = getCurrentUser();
  const logs = getActivityLogs();
  
  const newLog: ActivityLog = {
    id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
    userId: currentUser.id,
    userName: currentUser.name,
    action,
    details,
    timestamp: new Date().toISOString(),
    category,
  };
  
  logs.unshift(newLog); // Add to beginning
  
  // Keep only last 1000 logs
  if (logs.length > 1000) {
    logs.splice(1000);
  }
  
  localStorage.setItem('activityLogs', JSON.stringify(logs));
};

// Get activity logs
export const getActivityLogs = (limit?: number): ActivityLog[] => {
  const logs = localStorage.getItem('activityLogs');
  const allLogs = logs ? JSON.parse(logs) : [];
  return limit ? allLogs.slice(0, limit) : allLogs;
};

// Clear activity logs (admin function)
export const clearActivityLogs = (): void => {
  localStorage.setItem('activityLogs', JSON.stringify([]));
};

// Track usage
export const trackUsage = (type: keyof User['usage']): void => {
  const currentUser = getCurrentUser();
  currentUser.usage[type] += 1;
  updateCurrentUser(currentUser);
  
  // Also update in all users list
  const users = getAllUsers();
  const userIndex = users.findIndex(u => u.id === currentUser.id);
  if (userIndex !== -1) {
    users[userIndex] = currentUser;
    localStorage.setItem('allUsers', JSON.stringify(users));
  }
};

// Check if user has reached quota
export const checkQuota = (type: keyof User['usage']): boolean => {
  const currentUser = getCurrentUser();
  
  // Reset daily quotas if it's a new day
  resetDailyQuotasIfNeeded();
  
  const quotaKey = type + 'Limit' as keyof User['quota'];
  const limit = currentUser.quota[quotaKey];
  
  // -1 means unlimited
  if (limit === -1) return true;
  
  // For free plan, signage and AI are daily limits
  if (currentUser.plan === 'free') {
    const today = new Date().toDateString();
    const dailyUsage = getDailyUsage(today);
    
    if (type === 'signageGenerated') {
      return dailyUsage.signage < limit;
    }
    if (type === 'aiGenerations') {
      return dailyUsage.ai < limit;
    }
  }
  
  return currentUser.usage[type] < limit;
};

// Get daily usage for free plan users
export const getDailyUsage = (date: string) => {
  const dailyUsageKey = `dailyUsage_${date}`;
  const stored = localStorage.getItem(dailyUsageKey);
  
  if (!stored) {
    return { signage: 0, ai: 0 };
  }
  
  return JSON.parse(stored);
};

// Track daily usage for free plan
export const trackDailyUsage = (type: 'signage' | 'ai') => {
  const today = new Date().toDateString();
  const dailyUsageKey = `dailyUsage_${today}`;
  const currentUsage = getDailyUsage(today);
  
  if (type === 'signage') {
    currentUsage.signage += 1;
  } else if (type === 'ai') {
    currentUsage.ai += 1;
  }
  
  localStorage.setItem(dailyUsageKey, JSON.stringify(currentUsage));
};

// Reset daily quotas if it's a new day
export const resetDailyQuotasIfNeeded = () => {
  const lastResetDate = localStorage.getItem('lastQuotaReset');
  const today = new Date().toDateString();
  
  if (lastResetDate !== today) {
    // It's a new day, reset quotas
    localStorage.setItem('lastQuotaReset', today);
    
    // Clean up old daily usage records (keep only today's)
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('dailyUsage_') && key !== `dailyUsage_${today}`) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
  }
};

// Get remaining daily quota
export const getRemainingDailyQuota = (type: 'signage' | 'ai'): number => {
  const currentUser = getCurrentUser();
  
  if (currentUser.plan !== 'free') {
    return -1; // Unlimited
  }
  
  const today = new Date().toDateString();
  const dailyUsage = getDailyUsage(today);
  const limit = type === 'signage' ? currentUser.quota.signageLimit : currentUser.quota.aiLimit;
  const used = type === 'signage' ? dailyUsage.signage : dailyUsage.ai;
  
  return Math.max(0, limit - used);
};

// Check if user has feature access
export const hasFeatureAccess = (feature: keyof User['features']): boolean => {
  const currentUser = getCurrentUser();
  return currentUser.features[feature];
};

// Get system statistics
export const getSystemStats = () => {
  const users = getAllUsers();
  const logs = getActivityLogs();
  
  return {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'active').length,
    suspendedUsers: users.filter(u => u.status === 'suspended').length,
    bannedUsers: users.filter(u => u.status === 'banned').length,
    freeUsers: users.filter(u => u.plan === 'free').length,
    proUsers: users.filter(u => u.plan === 'pro').length,
    enterpriseUsers: users.filter(u => u.plan === 'enterprise').length,
    totalSignageGenerated: users.reduce((sum, u) => sum + u.usage.signageGenerated, 0),
    totalTemplatesUsed: users.reduce((sum, u) => sum + u.usage.templatesUsed, 0),
    totalAIGenerations: users.reduce((sum, u) => sum + u.usage.aiGenerations, 0),
    totalExports: users.reduce((sum, u) => sum + u.usage.exports, 0),
    totalActivityLogs: logs.length,
  };
};