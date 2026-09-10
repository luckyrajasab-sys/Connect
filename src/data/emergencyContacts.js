// Built-in Indian National Emergency Helpline Directory
export const emergencyContacts = [
  {
    id: "nat-112",
    name: "National Emergency Number (All-in-One)",
    number: "112",
    category: "National Priority",
    iconType: "emergency",
    badge: "Universal",
    description: "Single emergency response number across India for Police, Fire, and Ambulance (ERSS).",
    priority: "highest",
    color: "#DC2626"
  },
  {
    id: "police-100",
    name: "Police Emergency Control Room",
    number: "100",
    category: "Law Enforcement",
    iconType: "police",
    badge: "Police",
    description: "Direct line to nearest police station and PCR patrol vans for immediate security support.",
    priority: "high",
    color: "#1E40AF"
  },
  {
    id: "fire-101",
    name: "Fire & Rescue Service",
    number: "101",
    category: "Fire & Disaster",
    iconType: "fire",
    badge: "Fire Brigade",
    description: "Emergency fire response, structural collapse rescue, and disaster mitigation.",
    priority: "high",
    color: "#EA580C"
  },
  {
    id: "amb-108",
    name: "Emergency Medical & Disaster Ambulance",
    number: "108",
    category: "Medical Priority",
    iconType: "ambulance",
    badge: "24x7 Ambulance",
    description: "Toll-free emergency medical response service equipped with advanced life support.",
    priority: "high",
    color: "#059669"
  },
  {
    id: "amb-102",
    name: "Maternal & Child Health Ambulance",
    number: "102",
    category: "Medical Transport",
    iconType: "hospital",
    badge: "Maternity/Infant",
    description: "Free medical transport support for pregnant women and sick neonates.",
    priority: "medium",
    color: "#0D9488"
  },
  {
    id: "women-181",
    name: "Women's Helpline (Domestic & Safety)",
    number: "181",
    category: "Women Safety",
    iconType: "women",
    badge: "Women Safety",
    description: "24-hour emergency response for women facing harassment, domestic abuse, or distress.",
    priority: "high",
    color: "#DB2777"
  },
  {
    id: "child-1098",
    name: "CHILDLINE India",
    number: "1098",
    category: "Child Protection",
    iconType: "child",
    badge: "Child Care",
    description: "24-hour, free emergency phone service for children in need of aid and assistance.",
    priority: "medium",
    color: "#7C3AED"
  },
  {
    id: "cyber-1930",
    name: "Cyber Crime Financial Fraud Helpline",
    number: "1930",
    category: "Cyber Safety",
    iconType: "cyber",
    badge: "Cyber Crime",
    description: "National citizen financial cyber fraud reporting helpline (Indian Cyber Crime Coordination Centre).",
    priority: "medium",
    color: "#0284C7"
  }
];

// No pre-built personal contacts - users add their own personal emergency contacts
export const DEFAULT_PERSONAL_EMERGENCY = [];
