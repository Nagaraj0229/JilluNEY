import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

export const FirebaseAdminProvider = {
  provide: 'FIREBASE_ADMIN',
  inject: [ConfigService],
  useFactory: (cfg: ConfigService) => {
    const projectId = cfg.get<string>('FIREBASE_PROJECT_ID');
    const clientEmail = cfg.get<string>('FIREBASE_CLIENT_EMAIL');
    let privateKey = cfg.get<string>('FIREBASE_PRIVATE_KEY');

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error('Missing Firebase Admin env vars');
    }
    // Handle escaped newlines from .env
    if (privateKey.includes('\\n')) {
      privateKey = privateKey.replace(/\\n/g, '\n');
    }

    // Initialize once
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    }
    return admin.app();
  },
};
