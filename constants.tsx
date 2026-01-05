
import React from 'react';
import { Category } from './types';

export const CATEGORIES: Category[] = [
  { id: 'cat-1', name: '飲食', icon: '🍔', color: 'bg-orange-100 text-orange-600' },
  { id: 'cat-2', name: '交通', icon: '🚗', color: 'bg-blue-100 text-blue-600' },
  { id: 'cat-3', name: '薪資', icon: '💰', color: 'bg-green-100 text-green-600' },
  { id: 'cat-4', name: '購物', icon: '🛍️', color: 'bg-purple-100 text-purple-600' },
  { id: 'cat-5', name: '娛樂', icon: '🎮', color: 'bg-pink-100 text-pink-600' },
  { id: 'cat-6', name: '住房', icon: '🏠', color: 'bg-amber-100 text-amber-600' },
  { id: 'cat-7', name: '醫療', icon: '🏥', color: 'bg-red-100 text-red-600' },
  { id: 'cat-8', name: '投資', icon: '📈', color: 'bg-emerald-100 text-emerald-600' },
  { id: 'cat-other', name: '其他', icon: '✨', color: 'bg-slate-100 text-slate-600' },
];

export const ACCOUNT_COLORS = [
  'bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-rose-500', 'bg-orange-500'
];

export const APP_STORAGE_KEY = 'zenwealth_local_db';
