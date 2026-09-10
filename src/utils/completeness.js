// Profile Completeness Calculation Utility

export const COMPLETENESS_FIELDS = [
  { field: 'fullName', weight: 15, label: 'Full Name' },
  { field: 'phone', weight: 20, label: 'Primary Phone' },
  { field: 'email', weight: 15, label: 'Email Address' },
  { field: 'company', weight: 10, label: 'Company / Work' },
  { field: 'jobTitle', weight: 5, label: 'Job Title' },
  { field: 'address', weight: 10, label: 'Street Address' },
  { field: 'city', weight: 5, label: 'City' },
  { field: 'birthday', weight: 5, label: 'Birthday' },
  { field: 'website', weight: 5, label: 'Website' },
  { field: 'notes', weight: 5, label: 'Notes' },
  { field: 'tags', weight: 5, label: 'Tags' }
];

export const calculateCompleteness = (contact) => {
  if (!contact) return { score: 0, missing: [], filled: [] };

  let score = 0;
  const missing = [];
  const filled = [];

  COMPLETENESS_FIELDS.forEach(({ field, weight, label }) => {
    const value = contact[field];
    const isFilled = Array.isArray(value) ? value.length > 0 : Boolean(value && String(value).trim() !== '');

    if (isFilled) {
      score += weight;
      filled.push(label);
    } else {
      missing.push(label);
    }
  });

  return {
    score: Math.min(100, Math.round(score)),
    missing,
    filled
  };
};

export const getCompletenessColor = (score) => {
  if (score >= 80) return '#10B981'; // Teal / Green
  if (score >= 50) return '#FF7722'; // Orange Accent
  return '#EF4444'; // Red
};
