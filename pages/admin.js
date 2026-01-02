import React from 'react';
import { getSupabaseServer } from '../lib/supabaseServer';

export default function Admin({ enquiries, unauthorized }) {
  if (unauthorized) {
    return (
      <div className="container">
        <div className="card">
          <h2>Unauthorized</h2>
          <p>Provide correct Basic auth credentials to view.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div>
            <h2 style={{margin:0}}>Enquiries</h2>
            <div className="small">Total: {enquiries.length}</div>
          </div>
          <div className="small">Last 1000 shown</div>
        </div>

        <table className="table" aria-label="Enquiries table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Class</th>
              <th>College</th>
              <th>Parent Mobile</th>
              <th>Student Mobile</th>
              <th>WhatsApp</th>
              <th>Courses</th>
              <th>Remark</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.first_name} {r.middle_name} {r.surname}</td>
                <td>{r.class_name}</td>
                <td>{r.college_name}</td>
                <td>{r.mobile_parent}</td>
                <td>{r.mobile_student}</td>
                <td>{r.whatsapp}</td>
                <td>{r.courses}</td>
                <td>{r.remark}</td>
                <td>{new Date(r.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}

export async function getServerSideProps({ req, res }) {
  const auth = req.headers.authorization || '';
  const expectedUser = process.env.ADMIN_USER || '';
  const expectedPass = process.env.ADMIN_PASS || '';
  let authorized = false;
  if (auth.startsWith('Basic ')) {
    const b = Buffer.from(auth.split(' ')[1], 'base64').toString();
    const [user, pass] = b.split(':');
    if (user === expectedUser && pass === expectedPass) authorized = true;
  }

  if (!authorized) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Admin Area"');
    return { props: { enquiries: [], unauthorized: true } };
  }

  try {
    const supabaseServer = getSupabaseServer();
    const { data, error } = await supabaseServer
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1000);

    if (error) {
      console.error('Supabase fetch error:', error);
      return { props: { enquiries: [], unauthorized: false } };
    }

    return { props: { enquiries: data || [], unauthorized: false } };
  } catch (err) {
    console.error('getServerSideProps error:', err);
    return { props: { enquiries: [], unauthorized: false } };
  }
}