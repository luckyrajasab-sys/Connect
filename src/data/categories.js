// Contact Categories & Color Themes

export const CATEGORIES = [
  {
    id: 'family',
    name: 'Family',
    color: '#FF7722',
    gradient: 'linear-gradient(135deg, rgba(255, 119, 34, 0.25) 0%, rgba(234, 88, 12, 0.1) 100%)',
    border: 'rgba(255, 119, 34, 0.4)',
    glow: 'rgba(255, 119, 34, 0.3)',
    icon: 'heart'
  },
  {
    id: 'friends',
    name: 'Friends',
    color: '#00E5FF',
    gradient: 'linear-gradient(135deg, rgba(0, 229, 255, 0.22) 0%, rgba(6, 182, 212, 0.08) 100%)',
    border: 'rgba(0, 229, 255, 0.4)',
    glow: 'rgba(0, 229, 255, 0.3)',
    icon: 'users'
  },
  {
    id: 'work',
    name: 'Work',
    color: '#3B82F6',
    gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.22) 0%, rgba(29, 78, 216, 0.08) 100%)',
    border: 'rgba(59, 130, 246, 0.4)',
    glow: 'rgba(59, 130, 246, 0.3)',
    icon: 'briefcase'
  },
  {
    id: 'vip',
    name: 'VIP',
    color: '#A855F7',
    gradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.25) 0%, rgba(126, 34, 206, 0.1) 100%)',
    border: 'rgba(168, 85, 247, 0.4)',
    glow: 'rgba(168, 85, 247, 0.3)',
    icon: 'award'
  },
  {
    id: 'emergency',
    name: 'Emergency',
    color: '#EF4444',
    gradient: 'linear-gradient(135deg, rgba(239, 68, 68, 0.25) 0%, rgba(185, 28, 28, 0.1) 100%)',
    border: 'rgba(239, 68, 68, 0.45)',
    glow: 'rgba(239, 68, 68, 0.35)',
    icon: 'alert-triangle'
  },
  {
    id: 'college',
    name: 'College',
    color: '#10B981',
    gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.22) 0%, rgba(4, 120, 87, 0.08) 100%)',
    border: 'rgba(16, 185, 129, 0.4)',
    glow: 'rgba(16, 185, 129, 0.3)',
    icon: 'book'
  },
  {
    id: 'business',
    name: 'Business',
    color: '#F59E0B',
    gradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.22) 0%, rgba(180, 83, 9, 0.08) 100%)',
    border: 'rgba(245, 158, 11, 0.4)',
    glow: 'rgba(245, 158, 11, 0.3)',
    icon: 'trending-up'
  },
  {
    id: 'other',
    name: 'Other',
    color: '#94A3B8',
    gradient: 'linear-gradient(135deg, rgba(148, 163, 184, 0.18) 0%, rgba(71, 85, 105, 0.08) 100%)',
    border: 'rgba(148, 163, 184, 0.35)',
    glow: 'rgba(148, 163, 184, 0.2)',
    icon: 'tag'
  }
];

export const getCategoryTheme = (categoryId) => {
  return CATEGORIES.find(c => c.id === categoryId) || CATEGORIES[CATEGORIES.length - 1];
};
