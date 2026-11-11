import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import {
  Database,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Server,
  Terminal,
  Key
} from 'lucide-react';

export const AdminFirebaseGuide: React.FC = () => {
  const { isFirebaseActive } = useAuth();
  const { addToast } = useStore();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    addToast('success', 'Copied to Clipboard', label);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const envTemplate = `# KEYORA STUDIO Firebase Configuration
VITE_FIREBASE_API_KEY="AIzaSy..."
VITE_FIREBASE_AUTH_DOMAIN="keyora-studio.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="keyora-studio"
VITE_FIREBASE_STORAGE_BUCKET="keyora-studio.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="1234567890"
VITE_FIREBASE_APP_ID="1:1234567890:web:abcdef"
VITE_ADMIN_EMAIL="admin@keyora.studio"`;

  const firestoreRulesCode = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAdmin() {
      return request.auth != null;
    }
    match /products/{productId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /settings/{settingId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /orders/{orderId} {
      allow create: if true;
      allow read, update, delete: if isAdmin();
    }
  }
}`;

  const storageRulesCode = `rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}`;

  return (
    <div className="space-y-8 max-w-4xl mx-auto text-[#F5F0E6]">
      {/* Header */}
      <div className="pb-4 border-b border-neutral-800">
        <span className="text-xs uppercase tracking-[0.25em] text-[#C9A24B] font-semibold">
          Infrastructure & Cloud
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-medium mt-1">
          Firebase Production Setup
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Complete guide for integrating your own Google Firebase project and deploying live.
        </p>
      </div>

      {/* Current System Status Card */}
      <div className="p-6 rounded-2xl bg-[#121212] border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
              isFirebaseActive
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
            }`}
          >
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Database Connection Status:</span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-semibold ${
                  isFirebaseActive
                    ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40'
                    : 'bg-amber-950/60 text-amber-300 border border-amber-500/40'
                }`}
              >
                {isFirebaseActive ? 'Live Firebase Connected' : 'Persistent Local Storage Mode'}
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              {isFirebaseActive
                ? 'All transactions, products, and images synchronize with your Google Cloud Firestore and Storage buckets.'
                : 'The store is currently running with full local persistence. Pasting your Firebase keys into .env connects it to your cloud instance instantly.'}
            </p>
          </div>
        </div>

        <a
          href="https://console.firebase.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-[#1A1A1A] hover:bg-[#222222] border border-neutral-700 text-xs rounded-xl flex items-center gap-1.5 shrink-0"
        >
          <span>Firebase Console</span>
          <ExternalLink className="w-3.5 h-3.5 text-[#C9A24B]" />
        </a>
      </div>

      {/* Step by Step Setup Instructions */}
      <div className="space-y-6">
        <h2 className="text-lg font-serif font-medium text-[#F5F0E6]">
          Step-by-Step Production Deployment
        </h2>

        {/* Step 1 */}
        <div className="p-6 bg-[#121212] border border-neutral-800 rounded-2xl space-y-3">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-[#C9A24B] text-[#0B0B0B] font-bold text-xs flex items-center justify-center">
              1
            </span>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#F5F0E6]">
              Create Firebase Project & Web App
            </h3>
          </div>
          <p className="text-xs text-neutral-400 pl-10 leading-relaxed">
            Go to the <strong className="text-neutral-200">Firebase Console</strong>, click <em>&quot;Add project&quot;</em>, name it (e.g. <code>keyora-studio</code>), and create a Web App (<code>&lt;/&gt;</code> icon). Firebase will generate your project credentials.
          </p>
        </div>

        {/* Step 2 */}
        <div className="p-6 bg-[#121212] border border-neutral-800 rounded-2xl space-y-3">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-[#C9A24B] text-[#0B0B0B] font-bold text-xs flex items-center justify-center">
              2
            </span>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#F5F0E6]">
              Enable Authentication & Create Admin User
            </h3>
          </div>
          <p className="text-xs text-neutral-400 pl-10 leading-relaxed">
            In Firebase Console sidebar, navigate to <strong>Build → Authentication</strong>. Enable the <strong>Email/Password</strong> sign-in provider. In the <em>&quot;Users&quot;</em> tab, click <em>&quot;Add user&quot;</em> and create your store manager account: <code>admin@keyora.studio</code>.
          </p>
        </div>

        {/* Step 3 */}
        <div className="p-6 bg-[#121212] border border-neutral-800 rounded-2xl space-y-3">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-[#C9A24B] text-[#0B0B0B] font-bold text-xs flex items-center justify-center">
              3
            </span>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#F5F0E6]">
              Enable Firestore Database & Security Rules
            </h3>
          </div>
          <p className="text-xs text-neutral-400 pl-10 leading-relaxed">
            Navigate to <strong>Build → Firestore Database</strong>, choose your region, and create database. Then paste the security rules below in the <em>Rules</em> tab:
          </p>
          <div className="ml-10 relative">
            <pre className="p-4 bg-[#0A0A0A] border border-neutral-800 rounded-xl text-[11px] font-mono text-neutral-300 overflow-x-auto">
              {firestoreRulesCode}
            </pre>
            <button
              onClick={() => copyToClipboard(firestoreRulesCode, 'Firestore Rules')}
              className="absolute top-3 right-3 p-1.5 bg-[#181818] hover:bg-[#252525] border border-neutral-700 text-xs rounded-lg flex items-center gap-1"
            >
              {copiedKey === 'Firestore Rules' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-neutral-400" />}
              <span>Copy</span>
            </button>
          </div>
        </div>

        {/* Step 4 */}
        <div className="p-6 bg-[#121212] border border-neutral-800 rounded-2xl space-y-3">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-[#C9A24B] text-[#0B0B0B] font-bold text-xs flex items-center justify-center">
              4
            </span>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#F5F0E6]">
              Enable Storage & Paste .env Keys
            </h3>
          </div>
          <p className="text-xs text-neutral-400 pl-10 leading-relaxed">
            Enable <strong>Build → Storage</strong> in Firebase Console, then copy your config into your <code>.env</code> file:
          </p>
          <div className="ml-10 relative">
            <pre className="p-4 bg-[#0A0A0A] border border-neutral-800 rounded-xl text-[11px] font-mono text-[#E6C97A] overflow-x-auto">
              {envTemplate}
            </pre>
            <button
              onClick={() => copyToClipboard(envTemplate, 'Environment Template')}
              className="absolute top-3 right-3 p-1.5 bg-[#181818] hover:bg-[#252525] border border-neutral-700 text-xs rounded-lg flex items-center gap-1"
            >
              {copiedKey === 'Environment Template' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-neutral-400" />}
              <span>Copy</span>
            </button>
          </div>
        </div>

        {/* Step 5 */}
        <div className="p-6 bg-[#121212] border border-neutral-800 rounded-2xl space-y-3">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-[#C9A24B] text-[#0B0B0B] font-bold text-xs flex items-center justify-center">
              5
            </span>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#F5F0E6]">
              Deploy to Firebase Hosting or Vercel
            </h3>
          </div>
          <p className="text-xs text-neutral-400 pl-10 leading-relaxed">
            Run the build command to generate production assets:
          </p>
          <div className="ml-10 p-3 bg-[#0A0A0A] border border-neutral-800 rounded-xl font-mono text-xs text-neutral-300">
            <code>npm run build</code>
          </div>
          <p className="text-xs text-neutral-400 pl-10 leading-relaxed">
            For Firebase Hosting, run: <code>firebase init hosting</code> (select <code>dist</code> as public folder, configure as single-page app), then <code>firebase deploy --only hosting</code>.
          </p>
        </div>
      </div>
    </div>
  );
};
