import { kv } from '@vercel/kv';

async function testKV() {
  console.log('VERCEL_KV_REDIS_URL:', process.env.VERCEL_KV_REDIS_URL);
  try {
    await kv.set('test-key', 'hello world');
    const value = await kv.get('test-key');
    console.log('KV working! test-key =', value);
  } catch (err) {
    console.error('KV connection failed:', err);
  }
}

testKV();
