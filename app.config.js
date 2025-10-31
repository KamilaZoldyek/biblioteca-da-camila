import "dotenv/config";
export default ({ config }) => ({
  ...config,
  scheme: "bibliotecadacamila",
  extra: {
    eas: {
      projectId: "4af5cd3c-519c-40a8-99d1-32e188c0cf14",
    },
    firebase: {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: "biblioteca-da-camila-e2523",
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
    },
  },
});
