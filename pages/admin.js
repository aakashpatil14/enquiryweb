import React from 'react';
import { getSupabaseServer } from '../lib/supabaseServer';

export default function Admin({ enquiries, unauthorized, debug }) {
  if (unauthorized) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Unauthorized</h2>
        <p>Provide correct Basic auth credentials to view.</p>
        {debug && (
          <>
            <h3>Debug info (server-side)</h3>
            <pre>{JSON.stringify(debug, null, 2)}</pre>
            <p>Check server terminal for more logs.</p>
          </>
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Enquiries (Admin)</h1>
      <p>Total: {enquiries.length}</p>
      <table border="1" cellPadding="4" cellSpacing="0">
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Class</th><th>College</th><th>Mobile (Parent)</th><th>Mobile (Student)</th><th>WhatsApp</th><th>Courses</th><th>Remark</th><th>Created</th>
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
      <p style={{ marginTop: 12 }}><strong>Important:</strong> Use HTTPS and real auth for production.</p>
    </div>
  );
}

export async function getServerSideProps({ req, res }) {
  try {
    // DEBUG: print incoming Authorization header to server console (server-side only)
    console.log('admin getServerSideProps - Authorization header:', req.headers.authorization || '(none)');
    console.log('ADMIN_USER set?', !!process.env.ADMIN_USER, 'ADMIN_PASS set?', !!process.env.ADMIN_PASS);

    // Optional: if you set ADMIN_BYPASS=1 in .env.local, skip auth for local development only
    const bypass = process.env.ADMIN_BYPASS === '1';
    if (bypass) {
      console.log('ADMIN_BYPASS is enabled - skipping Basic Auth (local only).');
      const supabaseServer = getSupabaseServer();
      const { data, error } = await supabaseServer
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1000);
      if (error) console.error('Supabase fetch error (bypass):', error);
      return { props: { enquiries: data || [], unauthorized: false } };
    }

    // Normal Basic Auth check
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
      // Provide debug info to the client page to help you diagnose - safe values only (booleans)
      return {
        props: {
          enquiries: [],
          unauthorized: true,
          debug: {
            authHeaderPresent: !!auth,
            expectedUserPresent: !!process.env.ADMIN_USER,
            expectedPassPresent: !!process.env.ADMIN_PASS,
            adminBypassEnv: process.env.ADMIN_BYPASS || null
          }
        }
      };
    }

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
    console.error('getServerSideProps admin error:', err);
    return { props: { enquiries: [], unauthorized: true, debug: { error: String(err) } } };
  }
}