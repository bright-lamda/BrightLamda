import { QueryResultRow } from 'pg';
import { query } from '../db/pool.js';
import { AppRole, AuthUser, EducationCategory } from '../domain/types.js';

type ProfileRow = QueryResultRow & {
  id: string;
  auth_user_id: string;
  full_name: string;
  email: string;
  role: AppRole;
  education_category: EducationCategory | null;
  avatar_url: string | null;
  is_active: boolean;
};

export type UpsertStudentProfileInput = {
  authUserId: string;
  email: string;
  fullName: string;
  whatsappNumber: string;
  educationCategory: EducationCategory;
};

export type UpsertAdminProfileInput = {
  authUserId: string;
  email: string;
  fullName: string;
  whatsappNumber: string;
  role: Extract<AppRole, 'teacher_admin' | 'system_admin'>;
};

export type CreateAdminInvitationInput = {
  invitedBy: string;
  fullName: string;
  email: string;
  whatsappNumber: string;
  role: Extract<AppRole, 'teacher_admin' | 'system_admin'>;
};

const toAuthUser = (row: ProfileRow): AuthUser => ({
  id: row.id,
  authUserId: row.auth_user_id,
  role: row.role,
  email: row.email,
  fullName: row.full_name,
  educationCategory: row.education_category,
  avatarUrl: row.avatar_url,
});

export const profileRepository = {
  async findActiveAuthUserBySupabaseId(authUserId: string): Promise<AuthUser | null> {
    const result = await query<ProfileRow>(
      `
        select id, auth_user_id, full_name, email, role, education_category, avatar_url, is_active
        from profiles
        where auth_user_id = $1 and is_active = true
        limit 1
      `,
      [authUserId],
    );

    const row = result.rows[0];
    return row ? toAuthUser(row) : null;
  },

  async upsertStudentProfile(input: UpsertStudentProfileInput): Promise<AuthUser> {
    const result = await query<ProfileRow>(
      `
        insert into profiles (auth_user_id, full_name, email, whatsapp_number, role, education_category)
        values ($1, $2, $3, $4, 'student', $5)
        on conflict (auth_user_id) do update set
          full_name = excluded.full_name,
          email = excluded.email,
          whatsapp_number = excluded.whatsapp_number,
          education_category = excluded.education_category,
          updated_at = now()
        returning id, auth_user_id, full_name, email, role, education_category, avatar_url, is_active
      `,
      [input.authUserId, input.fullName, input.email, input.whatsappNumber, input.educationCategory],
    );

    return toAuthUser(result.rows[0]);
  },

  async upsertAdminProfile(input: UpsertAdminProfileInput): Promise<AuthUser> {
    const result = await query<ProfileRow>(
      `
        insert into profiles (auth_user_id, full_name, email, whatsapp_number, role, education_category, is_active)
        values ($1, $2, $3, $4, $5, null, true)
        on conflict (auth_user_id) do update set
          full_name = excluded.full_name,
          email = excluded.email,
          whatsapp_number = excluded.whatsapp_number,
          role = excluded.role,
          education_category = null,
          is_active = true,
          updated_at = now()
        returning id, auth_user_id, full_name, email, role, education_category, avatar_url, is_active
      `,
      [input.authUserId, input.fullName, input.email, input.whatsappNumber, input.role],
    );

    return toAuthUser(result.rows[0]);
  },

  async createAdminInvitation(input: CreateAdminInvitationInput) {
    const result = await query(
      `
        insert into admin_invitations (invited_by, full_name, email, whatsapp_number, role)
        values ($1, $2, $3, $4, $5)
        returning *
      `,
      [input.invitedBy, input.fullName, input.email, input.whatsappNumber, input.role],
    );

    return result.rows[0];
  },
};
