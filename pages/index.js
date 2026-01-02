import { useState } from 'react';

export default function Home() {
  const [form, setForm] = useState({
    first_name: '',
    middle_name: '',
    surname: '',
    class_name: '',
    college_name: '',
    last_year_percent: '',
    medium: {
      semi: false,
      english: false,
      cbse: false,
      icse: false
    },
    date_of_birth: '',
    mobile_parent: '',
    mobile_student: '',
    whatsapp: '',
    father_occupation: '',
    address: '',
    foundation: {
      scholarship: false,
      dr_homibhbha: false,
      olympiad: false,
      mtse: false
    },
    courses: {
      NEET: false,
      JEE: false,
      MHTCET: false,
      REPT: false,
      TEST_SERIES: false,
      CRASH: false
    },
    remark: ''
  });
  const [status, setStatus] = useState(null);
  const [sending, setSending] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const toggleNested = (group, key) => {
    setForm(prev => ({
      ...prev,
      [group]: {
        ...prev[group],
        [key]: !prev[group][key]
      }
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setSending(true);

    if (!form.first_name || !form.surname) {
      setStatus({ type: 'error', message: 'Please provide first name and surname.' });
      setSending(false);
      return;
    }

    const payload = {
      ...form,
      medium: Object.keys(form.medium).filter(k => form.medium[k]).join(', '),
      foundation: Object.keys(form.foundation).filter(k => form.foundation[k]).join(', '),
      courses: Object.keys(form.courses).filter(k => form.courses[k]).join(', ')
    };

    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const j = await res.json();
      if (res.ok) {
        setStatus({ type: 'success', message: 'Enquiry submitted — thank you.' });
        setForm({
          first_name: '',
          middle_name: '',
          surname: '',
          class_name: '',
          college_name: '',
          last_year_percent: '',
          medium: { semi: false, english: false, cbse: false, icse: false },
          date_of_birth: '',
          mobile_parent: '',
          mobile_student: '',
          whatsapp: '',
          father_occupation: '',
          address: '',
          foundation: { scholarship: false, dr_homibhbha: false, olympiad: false, mtse: false },
          courses: { NEET: false, JEE: false, MHTCET: false, REPT: false, TEST_SERIES: false, CRASH: false },
          remark: ''
        });
      } else {
        setStatus({ type: 'error', message: j.error || 'Failed to submit. Try again.' });
      }
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', message: 'Network or server error.' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="container">
      <div className="card header">
        <div className="brand">
          {/* Ensure ./public/bansal-logo.png exists */}
          <img src="/bansal-logo.png" alt="Bansal Classes" style={{ width: 110, height: 'auto', objectFit: 'contain', borderRadius: 6 }} />
          <div>
            <div className="title">Bansal Classes — Enquiry Form</div>
            <div className="subtitle">Moshi Study Center</div>
          </div>
        </div>
        <div className="small">Contact: 9145541134</div>
      </div>

      {/* Main card only — right column removed */}
      <div className="card" style={{ marginTop: 20 }}>
        <h2 style={{ marginTop: 0 }}>ENQUIRY FORM</h2>
        <form onSubmit={submit} autoComplete="off">
          <div className="form-row">
            <div className="field" style={{ flex: 1 }}>
              <label className="label">First Name *</label>
              <input className="input" name="first_name" value={form.first_name} onChange={onChange} />
            </div>
            <div className="field" style={{ flex: 1 }}>
              <label className="label">Middle Name</label>
              <input className="input" name="middle_name" value={form.middle_name} onChange={onChange} />
            </div>
            <div className="field" style={{ flex: 1 }}>
              <label className="label">Surname *</label>
              <input className="input" name="surname" value={form.surname} onChange={onChange} />
            </div>
          </div>

          <div className="row-two">
            <div className="field">
              <label className="label">Class</label>
              <select className="select" name="class_name" value={form.class_name} onChange={onChange}>
                <option value="">Select class</option>
                <option value="7th">7th</option>
                <option value="8th">8th</option>
                <option value="9th">9th</option>
                <option value="10th">10th</option>
                <option value="11th">11th</option>
                <option value="12th">12th</option>
              </select>
            </div>

            <div className="field">
              <label className="label">College / School Name</label>
              <input className="input" name="college_name" value={form.college_name} onChange={onChange} />
            </div>
          </div>

          <div className="row-two">
            <div className="field">
              <label className="label">Last Year %</label>
              <input className="input" name="last_year_percent" value={form.last_year_percent} onChange={onChange} placeholder="e.g. 78.5" />
            </div>
            <div className="field">
              <label className="label">Medium</label>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <label><input type="checkbox" checked={form.medium.semi} onChange={() => toggleNested('medium', 'semi')} /> Semi Medium</label>
                <label><input type="checkbox" checked={form.medium.english} onChange={() => toggleNested('medium', 'english')} /> English Medium</label>
                <label><input type="checkbox" checked={form.medium.cbse} onChange={() => toggleNested('medium', 'cbse')} /> CBSE</label>
                <label><input type="checkbox" checked={form.medium.icse} onChange={() => toggleNested('medium', 'icse')} /> ICSE</label>
              </div>
            </div>
          </div>

          <div className="row-two">
            <div className="field">
              <label className="label">Date of Birth</label>
              <input className="input" type="date" name="date_of_birth" value={form.date_of_birth} onChange={onChange} />
            </div>
            <div className="field">
              <label className="label">Father's Occupation</label>
              <input className="input" name="father_occupation" value={form.father_occupation} onChange={onChange} />
            </div>
          </div>

          <div className="row-two">
            <div className="field">
              <label className="label">Mobile No. (Parent)</label>
              <input className="input" name="mobile_parent" value={form.mobile_parent} onChange={onChange} />
            </div>
            <div className="field">
              <label className="label">Mobile No. (Student)</label>
              <input className="input" name="mobile_student" value={form.mobile_student} onChange={onChange} />
            </div>
          </div>

          <div className="row-two">
            <div className="field">
              <label className="label">WhatsApp No.</label>
              <input className="input" name="whatsapp" value={form.whatsapp} onChange={onChange} />
            </div>
            <div className="field">
              <label className="label">Address</label>
              <input className="input" name="address" value={form.address} onChange={onChange} />
            </div>
          </div>

          <div className="field">
            <label className="label">Foundation</label>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <label><input type="checkbox" checked={form.foundation.scholarship} onChange={() => toggleNested('foundation', 'scholarship')} /> Scholarship</label>
              <label><input type="checkbox" checked={form.foundation.dr_homibhbha} onChange={() => toggleNested('foundation', 'dr_homibhbha')} /> Dr. Homibhbha</label>
              <label><input type="checkbox" checked={form.foundation.olympiad} onChange={() => toggleNested('foundation', 'olympiad')} /> Olympiad</label>
              <label><input type="checkbox" checked={form.foundation.mtse} onChange={() => toggleNested('foundation', 'mtse')} /> MTSE</label>
            </div>
          </div>

          <div className="field">
            <label className="label">Course</label>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <label><input type="checkbox" checked={form.courses.NEET} onChange={() => toggleNested('courses', 'NEET')} /> NEET</label>
              <label><input type="checkbox" checked={form.courses.JEE} onChange={() => toggleNested('courses', 'JEE')} /> JEE</label>
              <label><input type="checkbox" checked={form.courses.MHTCET} onChange={() => toggleNested('courses', 'MHTCET')} /> MHT-CET</label>
              <label><input type="checkbox" checked={form.courses.REPT} onChange={() => toggleNested('courses', 'REPT')} /> REPT</label>
              <label><input type="checkbox" checked={form.courses.TEST_SERIES} onChange={() => toggleNested('courses', 'TEST_SERIES')} /> TEST SERIES</label>
              <label><input type="checkbox" checked={form.courses.CRASH} onChange={() => toggleNested('courses', 'CRASH')} /> CRASH C.</label>
            </div>
          </div>

          <div className="field">
            <label className="label">How do you know about us?</label>
            <input className="input" name="reference_info" value={form.reference_info || ''} onChange={onChange} placeholder="Boost/TSE Exam, Paper Advt, TV Advt, Student's Ref, Employee Ref, Other" />
          </div>

          <div className="field">
            <label className="label">Remark</label>
            <textarea className="textarea" name="remark" value={form.remark} onChange={onChange}></textarea>
          </div>

          <div className="actions">
            <button className="btn" type="submit" disabled={sending}>{sending ? 'Sending...' : 'Submit Enquiry'}</button>
            <button type="button" className="btn secondary" onClick={() => {
              setForm({
                first_name: '',
                middle_name: '',
                surname: '',
                class_name: '',
                college_name: '',
                last_year_percent: '',
                medium: { semi: false, english: false, cbse: false, icse: false },
                date_of_birth: '',
                mobile_parent: '',
                mobile_student: '',
                whatsapp: '',
                father_occupation: '',
                address: '',
                foundation: { scholarship: false, dr_homibhbha: false, olympiad: false, mtse: false },
                courses: { NEET: false, JEE: false, MHTCET: false, REPT: false, TEST_SERIES: false, CRASH: false },
                remark: ''
              });
              setStatus(null);
            }}>Reset</button>
          </div>

          {status && (
            <div className={`status ${status.type === 'success' ? 'success' : 'error'}`}>
              {status.message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}