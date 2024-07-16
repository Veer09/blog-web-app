
import { createClient } from '@supabase/supabase-js'

if(!process.env.STORAGE_URI || !process.env.SUPABASE_ANNONKEY){
    new Error(".env problem!!")
}
export const supabase = createClient(process.env.NEXT_PUBLIC_PROJECT_URI!, process.env.NEXT_PUBLIC_SUPABASE_ANNONKEY!);