
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ctzpksnwaoaeaisoawwp.supabase.co';
const supabaseKey = 'sb_publishable_5lBiFMv6c2UHtH3pPl8aDg__PrrPXmU';

export const supabase = createClient(supabaseUrl, supabaseKey);
