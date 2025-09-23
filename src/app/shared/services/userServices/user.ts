import { Injectable } from '@angular/core';
import {
  Firestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
} from '@angular/fire/firestore';
import { Auth, authState, User as FirebaseUser } from '@angular/fire/auth';
import { Observable, of, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
export interface User {
  uid: string;
  email: string;
  name?: string;
  lastname?: string;
}
@Injectable({
  providedIn: 'root',
})
export class User {
  constructor(private firestore: Firestore, private authSrv: Auth) {}

  getCurrentUser(): Observable<User | null> {
    return authState(this.authSrv).pipe(
      switchMap((fbUser: FirebaseUser | null) => {
        if (!fbUser) return of(null);
        const docRef = doc(this.firestore, `users/${fbUser.uid}`);
        return from(
          getDoc(docRef).then((snapshot) =>
            snapshot.exists()
              ? ({
                  uid: fbUser.uid,
                  email: fbUser.email,
                  ...snapshot.data(),
                } as User)
              : null
          )
        );
      })
    );
  }

  async getUserByUID(uid: string): Promise<User | null> {
    const docRef = doc(this.firestore, `users/${uid}`);
    const snapshot = await getDoc(docRef);
    return snapshot.exists() ? (snapshot.data() as User) : null;
  }

  async updateUser(uid: string, data: Partial<User>): Promise<void> {
    const docRef = doc(this.firestore, `users/${uid}`);
    await updateDoc(docRef, data);
  }
}
