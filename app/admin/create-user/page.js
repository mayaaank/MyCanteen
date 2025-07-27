'use client';
import { supabase } from '@/lib/supabaseClient';
import { useState } from 'react';

export default function CreateUser() {
  const [email, setEmail] = useState('');
  const [userToken, setUserToken] = useState('');

  const handleCreate = async () => {
    const token = crypto.randomUUID();

    const { data, error } = await supabase
      .from('users')
      .insert([{ email, user_id_token: token, role: 'user', created_by_admin: true }]);

    if (error) {
      console.error(error);
    } else {
      setUserToken(token);
    }
  };

  return (
    <div>
      <h2>Create User</h2>
      <input type="email" placeholder="User Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button onClick={handleCreate}>Create</button>
      {userToken && <p>User Token: {userToken}</p>}
    </div>
  );
}
