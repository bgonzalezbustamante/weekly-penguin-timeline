import { createPublicSupabaseClient } from '@/lib/supabase'
import { parsePublicTeachingSettings } from '@/lib/teaching-settings-data'
import type { PublicTeachingSettings } from '@/types/timeline'

export async function getPublicTeachingSettings(): Promise<PublicTeachingSettings> {
  const supabase = createPublicSupabaseClient()
  const { data, error } = await supabase.rpc('get_public_teaching_settings')

  if (error) {
    throw new Error(`Could not load public teaching settings: ${error.message}`)
  }

  return parsePublicTeachingSettings(data)
}
