import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://gjethaahualvpzgnwxgy.supabase.co'
const SUPABASE_KEY = 'sb_publishable_fkM5Tf6GQddH3UX0QB2tKA_2j2eOJss'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
