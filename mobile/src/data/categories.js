// Contact Categories & Color Themes for React Native

export const CATEGORIES = [
  {
    id: 'all',
    name: 'All Contacts',
    color: '#10B981',
    gradient: ['#10B981', '#059669'],
    border: 'rgba(16, 185, 129, 0.4)',
    glow: 'rgba(16, 185, 129, 0.3)',
    icon: 'people-outline'
  },
  {
    id: 'family',
    name: 'Family',
    color: '#FF7722',
    gradient: ['#FF7722', '#EA580C'],
    border: 'rgba(255, 119, 34, 0.4)',
    glow: 'rgba(255, 119, 34, 0.3)',
    icon: 'heart-outline'
  },
  {
    id: 'friends',
    name: 'Friends',
    color: '#00E5FF',
    gradient: ['#00E5FF', '#06B6D4'],
    border: 'rgba(0, 229, 255, 0.4)',
    glow: 'rgba(0, 229, 255, 0.3)',
    icon: 'person-add-outline'
  },
  {
    id: 'work',
    name: 'Work',
    color: '#3B82F6',
    gradient: ['#3B82F6', '#1D4ED8'],
    border: 'rgba(59, 130, 246, 0.4)',
    glow: 'rgba(59, 130, 246, 0.3)',
    icon: 'briefcase-outline'
  },
  {
    id: 'vip',
    name: 'VIP',
    color: '#A855F7',
    gradient: ['#A855F7', '#7E22CE'],
    border: 'rgba(168, 85, 247, 0.4)',
    glow: 'rgba(168, 85, 247, 0.3)',
    icon: 'ribbon-outline'
  },
  {
    id: 'emergency',
    name: 'Emergency',
    color: '#EF4444',
    gradient: ['#EF4444', '#B91C1C'],
    border: 'rgba(239, 68, 68, 0.45)',
    glow: 'rgba(239, 68, 68, 0.35)',
    icon: 'warning-outline'
  },
  {
    id: 'college',
    name: 'College',
    color: '#10B981',
    gradient: ['#10B981', '#047857'],
    border: 'rgba(16, 185, 129, 0.4)',
    glow: 'rgba(16, 185, 129, 0.3)',
    icon: 'school-outline'
  },
  {
    id: 'business',
    name: 'Business',
    color: '#F59E0B',
    gradient: ['#F59E0B', '#B45309'],
    border: 'rgba(245, 158, 11, 0.4)',
    glow: 'rgba(245, 158, 11, 0.3)',
    icon: 'trending-up-outline'
  },
  {
    id: 'other',
    name: 'Other',
    color: '#94A3B8',
    gradient: ['#94A3B8', '#475569'],
    border: 'rgba(148, 163, 184, 0.35)',
    glow: 'rgba(148, 163, 184, 0.2)',
    icon: 'pricetag-outline'
  }
];

export const getCategoryTheme = (categoryId) => {
  if (!categoryId) return CATEGORIES.find(c => c.id === 'friends');
  const normalized = categoryId.toLowerCase();
  return CATEGORIES.find(c => c.id === normalized || c.name.toLowerCase() === normalized) || CATEGORIES[CATEGORIES.length - 1];
};
