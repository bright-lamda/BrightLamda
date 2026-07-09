import { supabaseAdmin } from '../lib/supabase.js';
import { CreateAdminAccountInput } from '../schemas/admin.schema.js';
import { profileRepository } from '../repositories/profile.repository.js';
import { HttpError } from '../utils/httpError.js';

export const adminAccountService = {
  async inviteAdmin(input: CreateAdminAccountInput & { invitedBy: string }) {
    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(input.email, {
      data: {
        full_name: input.fullName,
        whatsapp_number: input.whatsappNumber,
        role: input.role,
      },
    });

    if (error) {
      throw new HttpError(502, error.message, 'supabase_admin_invite_failed');
    }

    if (!data.user) {
      throw new HttpError(502, 'Supabase did not return an invited user', 'supabase_invited_user_missing');
    }

    const profile = await profileRepository.upsertAdminProfile({
      authUserId: data.user.id,
      email: input.email,
      fullName: input.fullName,
      whatsappNumber: input.whatsappNumber,
      role: input.role,
    });

    const invitation = await profileRepository.createAdminInvitation({
      invitedBy: input.invitedBy,
      email: input.email,
      fullName: input.fullName,
      whatsappNumber: input.whatsappNumber,
      role: input.role,
    });

    return {
      profile,
      invitation,
      invitationStatus: 'sent',
    };
  },
};
