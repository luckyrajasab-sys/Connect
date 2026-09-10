// Coordinate lookup table for major Indian and International cities

export const CITY_COORDINATES = {
  // Indian Metro & Major Cities
  mumbai: { lat: 19.0760, lng: 72.8777, name: 'Mumbai' },
  delhi: { lat: 28.7041, lng: 77.1025, name: 'Delhi' },
  bengaluru: { lat: 12.9716, lng: 77.5946, name: 'Bengaluru' },
  bangalore: { lat: 12.9716, lng: 77.5946, name: 'Bengaluru' },
  chennai: { lat: 13.0827, lng: 80.2707, name: 'Chennai' },
  hyderabad: { lat: 17.3850, lng: 78.4867, name: 'Hyderabad' },
  kolkata: { lat: 22.5726, lng: 88.3639, name: 'Kolkata' },
  pune: { lat: 18.5204, lng: 73.8567, name: 'Pune' },
  ahmedabad: { lat: 23.0225, lng: 72.5714, name: 'Ahmedabad' },
  jaipur: { lat: 26.9124, lng: 75.7873, name: 'Jaipur' },
  surat: { lat: 21.1702, lng: 72.8311, name: 'Surat' },
  lucknow: { lat: 26.8467, lng: 80.9462, name: 'Lucknow' },
  kanpur: { lat: 26.4499, lng: 80.3319, name: 'Kanpur' },
  nagpur: { lat: 21.1458, lng: 79.0882, name: 'Nagpur' },
  indore: { lat: 22.7196, lng: 75.8577, name: 'Indore' },
  thane: { lat: 19.2183, lng: 72.9781, name: 'Thane' },
  bhopal: { lat: 23.2599, lng: 77.4126, name: 'Bhopal' },
  visakhapatnam: { lat: 17.6868, lng: 83.2185, name: 'Visakhapatnam' },
  patna: { lat: 25.5941, lng: 85.1376, name: 'Patna' },
  vadodara: { lat: 22.3072, lng: 73.1812, name: 'Vadodara' },
  ghaziabad: { lat: 28.6692, lng: 77.4538, name: 'Ghaziabad' },
  ludhiana: { lat: 30.9010, lng: 75.8573, name: 'Ludhiana' },
  coimbatore: { lat: 11.0168, lng: 76.9558, name: 'Coimbatore' },
  kochi: { lat: 9.9312, lng: 76.2673, name: 'Kochi' },
  chandigarh: { lat: 30.7333, lng: 76.7794, name: 'Chandigarh' },
  noida: { lat: 28.5355, lng: 77.3910, name: 'Noida' },
  gurgaon: { lat: 28.4595, lng: 77.0266, name: 'Gurugram' },
  gurugram: { lat: 28.4595, lng: 77.0266, name: 'Gurugram' },
  varanasi: { lat: 25.3176, lng: 82.9739, name: 'Varanasi' },
  goa: { lat: 15.2993, lng: 74.1240, name: 'Goa' },

  // Global Hubs
  singapore: { lat: 1.3521, lng: 103.8198, name: 'Singapore' },
  dubai: { lat: 25.2048, lng: 55.2708, name: 'Dubai' },
  london: { lat: 51.5074, lng: -0.1278, name: 'London' },
  newyork: { lat: 40.7128, lng: -74.0060, name: 'New York' },
  sanfrancisco: { lat: 37.7749, lng: -122.4194, name: 'San Francisco' }
};

export const getCoordinatesForContact = (contact, index = 0) => {
  if (contact.lat && contact.lng) {
    return [Number(contact.lat), Number(contact.lng)];
  }

  const cityKey = (contact.city || '').toLowerCase().trim().replace(/[^a-z]/g, '');
  if (CITY_COORDINATES[cityKey]) {
    const base = CITY_COORDINATES[cityKey];
    // Add small jitter so multiple contacts in same city don't completely overlap
    const jitterLat = ((index % 5) - 2) * 0.012;
    const jitterLng = (((index * 3) % 5) - 2) * 0.012;
    return [base.lat + jitterLat, base.lng + jitterLng];
  }

  // Default fallback: India center (Nagpur / Central) with jitter
  const defaultBaseLat = 20.5937;
  const defaultBaseLng = 78.9629;
  const jitterLat = ((index % 7) - 3) * 0.4;
  const jitterLng = (((index * 4) % 7) - 3) * 0.4;
  return [defaultBaseLat + jitterLat, defaultBaseLng + jitterLng];
};
