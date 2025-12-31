import { useState } from 'react';

export default function Home() {
  const [form, setForm] = useState({
    first_name: '',
    middle_name: '',
    surname: '',
    class_name: '',
    college_name: '',
    medium: '',
    date_of_birth: '',
    mobile_parent: '',
    mobile_student: '',
    whatsapp: '',
    father_occupation: '',
    address: '',
    foundation: '',
    courses: '',
    siblings: '',
    reference: '',
    remark: ''
  });
  const [status, setStatus] = useState(null);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const j = await res.json();
      if (res.ok) {
        setStatus('success');
        setForm({
          first_name: '',
          middle_name: '',
          surname: '',
          class_name: '',
          college_name: '',
          medium: '',
          date_of_birth: '',
          mobile_parent: '',
          mobile_student: '',
          whatsapp: '',
          father_occupation: '',
          address: '',
          foundation: '',
          courses: '',
          siblings: '',
          reference: '',
          remark: ''
        });
      } else {
        setStatus('error: ' + (j.error || JSON.stringify(j)));
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '24px auto', padding: 20 }}>
      <h1>Student Enquiry Form</h1>
      <form onSubmit={submit}>
        <div>
          <label>First name</label><br />
          <input name="first_name" value={form.first_name} onChange={onChange} required />
        </div>
        <div>
          <label>Middle name</label><br />
          <input name="middle_name" value={form.middle_name} onChange={onChange} />
        </div>
        <div>
          <label>Surname</label><br />
          <input name="surname" value={form.surname} onChange={onChange} required />
        </div>

        <div>
          <label>Class</label><br />
          <input name="class_name" value={form.class_name} onChange={onChange} />
        </div>

        <div>
          <label>College/School</label><br />
          <input name="college_name" value={form.college_name} onChange={onChange} />
        </div>

        <div>
          <label>Medium</label><br />
          <input name="medium" value={form.medium} onChange={onChange} />
        </div>

        <div>
          <label>Date of Birth</label><br />
          <input name="date_of_birth" type="date" value={form.date_of_birth} onChange={onChange} />
        </div>

        <div>
          <label>Mobile (Parent)</label><br />
          <input name="mobile_parent" value={form.mobile_parent} onChange={onChange} />
        </div>

        <div>
          <label>Mobile (Student)</label><br />
          <input name="mobile_student" value={form.mobile_student} onChange={onChange} />
        </div>

        <div>
          <label>WhatsApp</label><br />
          <input name="whatsapp" value={form.whatsapp} onChange={onChange} />
        </div>

        <div>
          <label>Father's Occupation</label><br />
          <input name="father_occupation" value={form.father_occupation} onChange={onChange} />
        </div>

        <div>
          <label>Address</label><br />
          <textarea name="address" value={form.address} onChange={onChange} />
        </div>

        <div>
          <label>Foundation / Scholarship etc.</label><br />
          <input name="foundation" value={form.foundation} onChange={onChange} />
        </div>

        <div>
          <label>Courses of interest</label><br />
          <input name="courses" value={form.courses} onChange={onChange} placeholder="NEET, JEE, MHT-CET..." />
        </div>

        <div>
          <label>Siblings</label><br />
          <input name="siblings" value={form.siblings} onChange={onChange} />
        </div>

        <div>
          <label>How did you hear about us?</label><br />
          <input name="reference" value={form.reference} onChange={onChange} />
        </div>

        <div>
          <label>Remark</label><br />
          <textarea name="remark" value={form.remark} onChange={onChange} />
        </div>

        <div style={{ marginTop: 12 }}>
          <button type="submit">Submit Enquiry</button>
        </div>
      </form>

      <div style={{ marginTop: 12 }}>
        {status === 'sending' && <p>Sending...</p>}
        {status === 'success' && <p style={{ color: 'green' }}>Enquiry submitted — thank you.</p>}
        {status && status !== 'sending' && status !== 'success' && <p style={{ color: 'red' }}>{status}</p>}
      </div>
    </div>
  );
}