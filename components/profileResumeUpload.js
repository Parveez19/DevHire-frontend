// src/components/ProfileResumeUpload.js
import { useRef } from 'react';
export default function ProfileResumeUpload({ onUpload }) {
  const ref = useRef();
  return (
    <form
      onSubmit={async e => {
        e.preventDefault();
        const form = new FormData();
        form.append('resume', ref.current.files[0]);
        await onUpload(form);
      }}>
      <input type="file" accept=".pdf,.doc,.docx" ref={ref} required />
      <button type="submit">Upload Resume</button>
    </form>
  );
}
