# Connect — Smart Contact Hub (React Native / Expo Mobile App)

The official cross-platform mobile application for **Connect — Smart Contact Hub**, built with **React Native** and **Expo**.

---

## 🌟 Core Feature Parity (Web App Parity)

- **Bottom Tab Navigation**: Profile page is the primary (1st) navigation item, followed by Contacts Directory, QR Hub & Camera Scanner, Emergency Helplines, and Tools & Sync.
- **Interactive Contact Dossier**: Complete dossier view featuring category glow accents, completeness score calculation bar (0–100%), direct Action Buttons Grid (Call, WhatsApp, SMS, Email, QR vCard, Share), work coordinates, address with 1-tap Google Maps directions, birthday, tags cloud, and dossier notes.
- **International Dial Code Picker**: Interactive modal sheet supporting 35+ global dialing codes with flag emojis, search filtering, and international formatting.
- **Multi-Language & RTL Layout Support**: Full internationalization engine supporting English, Hindi, Arabic (with complete Right-to-Left RTL layout flip), and Spanish.
- **Unified Cloud PostgreSQL Sync**: Direct REST API integration with Supabase (`public.contacts`, `public.profiles`) alongside an offline-first secure local store (`AsyncStorage`) that auto-syncs upon reconnecting.

---

## 📱 Mobile-Specific Additions

1. **Native Contacts Book Sync (`expo-contacts`)**:
   - 1-tap import from device address book into Connect Cloud Hub.
   - 1-tap export from Connect Hub directly to native iOS/Android phonebook.
2. **Live Camera QR Barcode Scanner (`expo-camera`)**:
   - Real-time targeting reticle overlay with torch flashlight toggle.
   - Automatic vCard 3.0 decoding with instant contact preview modal and 1-tap directory import.
3. **vCard QR Generator (`react-native-qrcode-svg`)**:
   - Generates standard vCard 3.0 QR codes for any contact in your directory or your personal profile card.
4. **Native OS Share Sheet (`expo-sharing` & `expo-file-system`)**:
   - Exports contact `.vcf` files and passes them directly to the native OS share dialog.
5. **Local Notifications & Alerts (`expo-notifications`)**:
   - Push and local banner alerts for sync updates, contact imports, and backup confirmations.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd mobile
npm install
```

### 2. Start the Expo Development Server
```bash
npx expo start
```

- Press `a` to open in Android Emulator / Device.
- Press `i` to open in iOS Simulator.
- Press `w` to run on Web.
- Scan the terminal QR code using the **Expo Go** app on your physical iPhone or Android device.

---

## 🏗️ Project Structure

```
mobile/
├── App.js                   # Root entry point & Context providers
├── app.json                 # Expo config & device permissions
├── package.json             # Dependencies
├── src/
│   ├── components/          # GlassCard, AvatarBadge, CompletenessBar, ContactCard, etc.
│   ├── context/             # ContactContext, I18nContext, ThemeContext
│   ├── data/                # categories, countries, emergencyContacts, sampleContacts
│   ├── locales/             # en, hi, ar (RTL), es, index.js
│   ├── navigation/          # AppNavigator (Tabs + Stack)
│   ├── screens/             # Profile, Contacts, ContactDetail, AddEditContact, QRHub, Emergency, Tools
│   ├── services/            # cloudDb, nativeContacts, vcardService, shareService, notificationService
│   └── utils/               # avatarHelper, completeness, validation
```
