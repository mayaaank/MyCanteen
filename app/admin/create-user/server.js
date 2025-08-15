'use server'

import { createClient } from '@supabase/supabase-js'

export async function createUserServerAction(formData) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  // 1️⃣ Create in auth.users
  const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: formData.email,
    password: formData.password,
    email_confirm: true,
    user_metadata: { role: 'user' }
  })

  if (authError) {
    return { error: `Auth creation failed: ${authError.message}` }
  }

  const authUserId = authUser.user.id

  // 2️⃣ Insert or update into profiles
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .upsert({
      id: authUserId,
      full_name: formData.name,
      department: formData.department,
      academic_year: formData.academic_year,
      contact_number: formData.contact_number
    })

  if (profileError) {
    return { error: `Profile creation failed: ${profileError.message}` }
  }

  return { success: true }
}
