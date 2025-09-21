import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, setDoc, doc } from '@angular/fire/firestore';
import { AuthWeakPasswordError } from '@supabase/supabase-js';
@Injectable({
  providedIn: 'root'
})
export class Query {
  constructor(private readonly fb: Firestore) { }

  async create(collectionName: string, data: any, uuid: string) {
  try {
    const collect = collection(this.fb, collectionName);
    // await addDoc(collect, data);
    await setDoc(doc(collect, uuid), data);
  } catch (error) {
    console.log((error as any).message);
  }
}
}
