import NextAuth from "next-auth"
import Providers from "next-auth/providers"
import { FirebaseAdapter } from "@next-auth/firebase-adapter"

import firebase from "firebase/app"
import "firebase/firestore"

import { firebaseConfigData } from '../../../config/firebaseConfigData'

const firestore = (
    firebase.apps[0] ?? firebase.initializeApp(firebaseConfigData)
).firestore()

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth({
    // https://providers.authjs.dev
    providers: [
        Providers.Google({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
        }),
    ],
    adapter: FirebaseAdapter(firestore),
})