import { getSupabaseServer } from '../../lib/supabaseServer';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const supabaseServer = getSupabaseServer();

    const payload = req.body;
    if (!payload.first_name || !payload.surname) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data, error } = await supabaseServer.from('enquiries').insert([{
      first_name: payload.first_name || null,
      middle_name: payload.middle_name || null,
      surname: payload.surname || null,
      class_name: payload.class_name || null,
      college_name: payload.college_name || null,
      medium: payload.medium || null,
      date_of_birth: payload.date_of_birth || null,
      mobile_parent: payload.mobile_parent || null,
      mobile_student: payload.mobile_student || null,
      whatsapp: payload.whatsapp || null,
      father_occupation: payload.father_occupation || null,
      address: payload.address || null,
      foundation: payload.foundation || null,
      courses: payload.courses || null,
      siblings: payload.siblings || null,
      reference: payload.reference || null,
      remark: payload.remark || null
    }]);

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: 'Database insert failed' });
    }

    return res.status(200).json({ ok: true, inserted: data });
  } catch (err) {
    console.error('API handler error:', err.message || err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}