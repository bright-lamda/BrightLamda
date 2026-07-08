import { User } from '@supabase/supabase-js';
import { profileRepository } from '../repositories/profile.repository.js';
import { supabaseAdmin } from '../lib/supabase.js';
import { AuthUser } from '../domain/types.js';
import { HttpError } from '../utils/httpError.js';

export type VerifiedSupabaseUser = {
  id: string;
  email: string;
  raw: User;
};

export const extractBearerToken = (authorizationHeader?: string) => {
  if (!authorizationHeader?.startsWith('Bearer ')) {
    return undefined;
  }

  return authorizationHeader.slice(7).trim();
};

export const authService = {
  async verifySupabaseAccessToken(token: string): Promise<VerifiedSupabaseUser> {
    const { data, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !data.user) {
      throw new HttpError(401, 'Invalid or expired token', 'invalid_token');
    }

    if (!data.user.email) {
      throw new HttpError(401, 'Authenticated user has no email address', 'missing_email');
    }

    return {
      id: data.user.id,
      email: data.user.email,
      raw: data.user,
    };
  },

  async resolveProfile(token: string): Promise<AuthUser> {
    const supabaseUser = await this.verifySupabaseAccessToken(token);
    const profile = await profileRepository.findActiveAuthUserBySupabaseId(supabaseUser.id);

    if (!profile) {
      throw new HttpError(403, 'Bright Lamda profile has not been completed', 'profile_not_found');
    }

    return profile;
  },
};
