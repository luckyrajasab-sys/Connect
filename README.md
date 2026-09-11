# Connect — Smart Contact Hub

> 🌐 **Live Web Application**: [https://connect-two-topaz.vercel.app/](https://connect-two-topaz.vercel.app/)  
> 📱 **Mobile Application**: [React Native (Expo) App Documentation](./mobile/README.md)

**Connect** is a global, smart contact management platform with international dialing codes, multi-language & RTL support, cloud PostgreSQL sync (Supabase), vCard QR sharing, and interactive profile dossiers.

---

## 🚀 Live Deployment

The web application is deployed on Vercel at:
**[https://connect-two-topaz.vercel.app/](https://connect-two-topaz.vercel.app/)**

---

## 📱 Mobile App (Expo)

The cross-platform React Native mobile app is located in the [`/mobile`](./mobile) directory.

### Running the Mobile App:
```bash
cd mobile
npm install
npx expo start
```

---

## 🛠️ Tech Stack

- **Web**: React 18, Vite, Supabase REST API, CSS3 Glassmorphism
- **Mobile**: React Native, Expo SDK 51, React Navigation (Tabs + Stack), `expo-camera`, `expo-contacts`, `expo-sharing`, `expo-notifications`, AsyncStorage
- **Deployment**: Vercel (Web), Expo (Mobile)
