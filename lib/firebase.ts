
import { apps, auth, credential, firestore } from "firebase-admin"
import { initializeApp } from "firebase-admin/app"

if (!apps.length) {
  if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT is missing")
  }

  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)

  initializeApp({
    credential: credential.cert({
      ...serviceAccount,
      private_key: serviceAccount.private_key?.replace(/\\n/g, "\n"),
    }),
    databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
  })
}

export const _auth = auth()
export const _firestore = firestore()