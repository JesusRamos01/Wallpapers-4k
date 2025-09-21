import { Injectable } from '@angular/core';
import {Auth as AuthFirebase, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  constructor(private readonly afb: AuthFirebase) { 

  }
  async register(email: string, password: string): Promise<string> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.afb, email, password);
      console.log( userCredential.user);
      return userCredential.user.uid;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }

  async login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.afb, email, password);
      console.log('User logged in:', userCredential.user);
    } catch (error) {
      console.error('Error logging in user:', error);
    }
  }

  async logout() {
    try {
      await signOut(this.afb);
      console.log('User logged out');
    } catch (error) {
      console.error('Error logging out user:', error);
    }
  }

  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.afb, provider);
      console.log('User logged in with Google:', result.user);
    } catch (error) {
      console.error('Error logging in with Google:', error);
    }}
    
}
