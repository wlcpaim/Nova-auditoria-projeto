// @ts-ignore
import { createGeneratedAppClient } from './generated-app-client';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';
const projectId = import.meta.env.VITE_WLC_PROJECT_ID || 'barber-saas';

export const supabase = createGeneratedAppClient(supabaseUrl, supabaseKey, projectId);