import { pool } from '../db/pool.js';
import { supabaseAdmin } from '../lib/supabase.js';
import { profileRepository } from '../repositories/profile.repository.js';

const requiredEnv = (name: string) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return value;
};

const findUserByEmail = async (email: string) => {
  let page = 1;

  while (page <= 20) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 100 });
    if (error) throw error;

    const user = data.users.find((item) => item.email?.toLowerCase() === email.toLowerCase());
    if (user) return user;
    if (data.users.length < 100) return null;
    page += 1;
  }

  return null;
};

const run = async () => {
  const email = requiredEnv('BOOTSTRAP_SYSTEM_ADMIN_EMAIL');
  const password = requiredEnv('BOOTSTRAP_SYSTEM_ADMIN_PASSWORD');
  const fullName = requiredEnv('BOOTSTRAP_SYSTEM_ADMIN_FULL_NAME');
  const whatsappNumber = requiredEnv('BOOTSTRAP_SYSTEM_ADMIN_WHATSAPP');

  const existingUser = await findUserByEmail(email);
  const authUser = existingUser
    ? existingUser
    : (
        await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: {
            full_name: fullName,
            whatsapp_number: whatsappNumber,
            role: 'system_admin',
          },
        })
      ).data.user;

  if (!authUser) {
    throw new Error('Supabase did not return a bootstrap auth user');
  }

  const profile = await profileRepository.upsertAdminProfile({
    authUserId: authUser.id,
    email,
    fullName,
    whatsappNumber,
    role: 'system_admin',
  });

  console.log(
    JSON.stringify(
      {
        status: existingUser ? 'profile_synced_for_existing_auth_user' : 'created_auth_user_and_profile',
        profile: {
          id: profile.id,
          authUserId: profile.authUserId,
          email: profile.email,
          fullName: profile.fullName,
          role: profile.role,
        },
      },
      null,
      2,
    ),
  );
};

run()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
