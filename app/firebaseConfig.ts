// app/firebaseConfig.ts
import Constants from "expo-constants";
import { getApp, getApps, initializeApp } from "firebase/app";

const firebaseConfig = Constants.expoConfig?.extra?.firebase

console.log('🔥 Firebase Config:', firebaseConfig);

export const firebaseApp = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApp();
