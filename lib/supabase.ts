import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xfbxuhpferguhdncmgeu.supabase.co';
const supabaseKey = 'sb_publishable_e_M6WgO_3apKPprF-KzS9g_tOGdKQP-';

export const supabase = createClient(supabaseUrl, supabaseKey);