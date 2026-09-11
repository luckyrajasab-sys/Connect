// Contact Completeness Calculation Engine

export const calculateCompleteness = (contact) => {
  if (!contact) return { score: 0, missingFields: ['Name', 'Phone'] };

  const checks = [
    { name: 'Full Name', weight: 20, isComplete: Boolean(contact.fullName || contact.name) },
    { name: 'Phone Number', weight: 25, isComplete: Boolean(contact.phone && contact.phone.trim().length > 3) },
    { name: 'Email Address', weight: 15, isComplete: Boolean(contact.email && contact.email.includes('@')) },
    { name: 'Company & Role', weight: 10, isComplete: Boolean(contact.company || contact.jobTitle) },
    { name: 'Address / Location', weight: 10, isComplete: Boolean(contact.address || contact.city || contact.state) },
    { name: 'Birthday', weight: 5, isComplete: Boolean(contact.birthday) },
    { name: 'Website / Social', weight: 5, isComplete: Boolean(contact.website || contact.linkedin || contact.twitter) },
    { name: 'Tags / Keywords', weight: 5, isComplete: Boolean(contact.tags && contact.tags.length > 0) },
    { name: 'Notes & Dossier', weight: 5, isComplete: Boolean(contact.notes && contact.notes.trim().length > 0) }
  ];

  let score = 0;
  const missingFields = [];

  checks.forEach(check => {
    if (check.isComplete) {
      score += check.weight;
    } else {
      missingFields.push(check.name);
    }
  });

  return {
    score: Math.min(100, Math.max(0, score)),
    missingFields,
    isComplete: score >= 85
  };
};
