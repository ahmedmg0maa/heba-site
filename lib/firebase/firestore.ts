import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from './config';

// ─── Generic CRUD ───────────────────────────────────────────────────────────

export const createDoc = async (collectionName: string, data: Record<string, unknown>) => {
  const ref = await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
};

export const setDocById = async (collectionName: string, id: string, data: Record<string, unknown>) => {
  await setDoc(doc(db, collectionName, id), {
    ...data,
    updatedAt: serverTimestamp(),
  }, { merge: true });
};

export const getDocById = async (collectionName: string, id: string) => {
  const snap = await getDoc(doc(db, collectionName, id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const updateDocById = async (collectionName: string, id: string, data: Record<string, unknown>) => {
  await updateDoc(doc(db, collectionName, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const deleteDocById = async (collectionName: string, id: string) => {
  await deleteDoc(doc(db, collectionName, id));
};

export const queryCollection = async (
  collectionName: string,
  constraints: QueryConstraint[] = []
) => {
  const q = query(collection(db, collectionName), ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

// ─── Courses ─────────────────────────────────────────────────────────────────

export const getCourses = (publishedOnly = true) =>
  queryCollection('courses', publishedOnly
    ? [where('published', '==', true), orderBy('createdAt', 'desc')]
    : [orderBy('createdAt', 'desc')]
  );

export const getCourse = (id: string) => getDocById('courses', id);

// ─── Books ────────────────────────────────────────────────────────────────────

export const getBooks = (publishedOnly = true) =>
  queryCollection('books', publishedOnly
    ? [where('published', '==', true), orderBy('createdAt', 'desc')]
    : [orderBy('createdAt', 'desc')]
  );

// ─── Blog ─────────────────────────────────────────────────────────────────────

export const getPosts = (publishedOnly = true) =>
  queryCollection('posts', publishedOnly
    ? [where('published', '==', true), orderBy('createdAt', 'desc')]
    : [orderBy('createdAt', 'desc')]
  );

export const getPost = (id: string) => getDocById('posts', id);

export const getLatestPosts = (n = 3) =>
  queryCollection('posts', [where('published', '==', true), orderBy('createdAt', 'desc'), limit(n)]);

// ─── Bookings ─────────────────────────────────────────────────────────────────

export const getBookingsForDate = (date: string) =>
  queryCollection('bookings', [where('date', '==', date), where('status', '!=', 'cancelled')]);

export const getUserBookings = (uid: string) =>
  queryCollection('bookings', [where('userId', '==', uid), orderBy('createdAt', 'desc')]);

// ─── Orders ───────────────────────────────────────────────────────────────────

export const getUserOrders = (uid: string) =>
  queryCollection('orders', [where('userId', '==', uid), orderBy('createdAt', 'desc')]);

// ─── Coupons ──────────────────────────────────────────────────────────────────

export const getCoupon = (code: string) =>
  queryCollection('coupons', [where('code', '==', code.toUpperCase()), where('active', '==', true)]);

// ─── Testimonials ─────────────────────────────────────────────────────────────

export const getTestimonials = () =>
  queryCollection('testimonials', [where('published', '==', true), orderBy('order', 'asc')]);

// ─── Users ────────────────────────────────────────────────────────────────────

export const getUsers = () => queryCollection('users', [orderBy('createdAt', 'desc')]);

export { where, orderBy, limit, Timestamp };
