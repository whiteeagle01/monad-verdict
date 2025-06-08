// pages/api/firebase-test.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { firestore } from '@/lib/firebase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const testRef = firestore.collection('test_data').doc('connection_check');
    await testRef.set({
      timestamp: new Date().toISOString(),
      status: 'success',
    });

    const snapshot = await testRef.get();

    res.status(200).json({
      ok: true,
      message: 'Firestore bağlantısı başarılı!',
      data: snapshot.data(),
    });
  } catch (error) {
    console.error('Firestore test hatası:', error);
    res.status(500).json({ ok: false, error: 'Firestore bağlantı hatası' });
  }
}
