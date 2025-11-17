import { db } from '@/lib/db';

async function createDemoUser() {
  try {
    const user = await db.user.upsert({
      where: { email: 'demo@example.com' },
      update: {},
      create: {
        email: 'demo@example.com',
        name: 'Demo User'
      }
    });
    
    console.log('Demo user created:', user);
  } catch (error) {
    console.error('Error creating demo user:', error);
  }
}

createDemoUser();