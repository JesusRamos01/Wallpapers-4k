import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';

export interface UserImage {
  uid: string;
  url: string;
  name: string;
  createdAt: any;
}

@Injectable({
  providedIn: 'root'
})
export class UserImagesService {
  constructor(private auth: Auth, private firestore: Firestore) {}

  async getMyImages(): Promise<UserImage[]> {
    const currentUser = await this.auth.currentUser;
    if (!currentUser) return [];

    const imagesRef = collection(this.firestore, 'user_images');
    const q = query(imagesRef, where('uid', '==', currentUser.uid));
    const snapshot = await getDocs(q);

    const images: UserImage[] = [];
    snapshot.forEach(doc => {
      images.push(doc.data() as UserImage);
    });

    return images;
  }
}