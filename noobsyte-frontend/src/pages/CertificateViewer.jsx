import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { registry } from '../curriculum/curriculumRegistry';
import './CertificateViewer.css';

function CertificateViewer({ courseSlug, onClose, theme }) {
  const { token } = useContext(AuthContext);
  const [certData, setCertData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchCertificate = async () => {
      setLoading(true);
      try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.post(`${API_URL}/api/v1/users/courses/${courseSlug}/certificate`);
        setCertData(response.data.data);
      } catch (error) {
        setErrorMsg(error.response?.data?.message || 'Verification failed. Complete all curriculum modules.');
      } finally {
        setLoading(false);
      }
    };
    fetchCertificate();
  }, [courseSlug]);

  const handlePrint = () => {
    window.print();
  };

  // Mock certificate template seeder for development fallbacks (excellent layout visual test-bed!)
  const getMockedCert = () => {
    const course = registry[courseSlug] || {};
    return {
      studentName: 'Shivam Kumar',
      courseTitle: course.title || 'Interactive Programming Course',
      verificationHash: 'NS-9982-F84D-77A1',
      issueDate: 'June 1, 2026',
      totalLessons: 4
    };
  };

  const displayedCert = certData || (errorMsg ? null : getMockedCert());

  return (
    <div className={`cert-overlay ${theme}-theme`}>
      <div className={`cert-modal-card no-print ${theme}-theme`}>
        <div className="cert-modal-header">
          <h3><i className="fa-solid fa-graduation-cap" style={{ color: 'var(--brand-cyan)', marginRight: '0.55rem' }}></i> Verified Completion Certificate</h3>
          <button className="btn-close-cert" onClick={onClose}>×</button>
        </div>

        {loading ? (
          <div className="loading-spinner">Auditing course completions state...</div>
        ) : errorMsg ? (
          /* Locked overlay view if syllabus is uncompleted */
          <div className="cert-locked-box">
            <p className="locked-icon">
              <i className="fa-solid fa-lock" style={{ color: 'var(--brand-cyan)' }}></i>
            </p>
            <h4>Completion Certificate Locked</h4>
            <p className="locked-subtext">{errorMsg}</p>
            <p className="locked-advice">
              Finish all modules narrative pages, visual simulator steps, and MCQ quizzes inside the course catalog to claim your verified credentials!
            </p>
            <button className="btn-close-cert-action" onClick={onClose}>
              Return to Syllabus
            </button>
          </div>
        ) : (
          /* High-Fidelity Verified Certificate Layout Frame */
          <div className="cert-view-workspace">
            {/* SVG/HTML Printable Template */}
            <div className="printable-cert-frame" id="noobsyte-certificate">
              <div className="cert-border-outer">
                <div className="cert-border-inner">
                  {/* Branding Header */}
                  <div className="cert-header">
                    <span className="cert-logo-glow">noob</span>
                    <span className="cert-logo-text">Syte</span>
                    <div className="cert-subtitle">VERIFIED COMPLETION CREDENTIAL</div>
                  </div>

                  {/* Body Contents */}
                  <div className="cert-body">
                    <p className="cert-award-text">This is to officially certify that</p>
                    <h2 className="cert-student-name">{displayedCert.studentName}</h2>
                    <p className="cert-achievement-text">
                      has successfully completed the interactive learning track and validated all self-assessment quizzes for
                    </p>
                    <h3 className="cert-course-title">{displayedCert.courseTitle}</h3>
                    <p className="cert-congrats">
                      Demonstrating a solid comprehension of programming syntax, variable references, memory management models, and object-oriented architecture.
                    </p>
                  </div>

                  {/* Verification Credentials Footer */}
                  <div className="cert-footer">
                    <div className="footer-col">
                      <span className="footer-label">ISSUED DATE</span>
                      <span className="footer-val">{displayedCert.issueDate}</span>
                    </div>

                    <div className="footer-seal">
                      <div className="seal-outer">
                        <div className="seal-inner">
                          <span>VERIFIED</span>
                        </div>
                      </div>
                    </div>

                    <div className="footer-col">
                      <span className="footer-label">CREDENTIAL ID</span>
                      <span className="footer-val cert-hash">{displayedCert.verificationHash}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Verification download buttons toolbar */}
            <div className="cert-actions-row">
              <button className="btn-download-pdf" onClick={handlePrint}>
                <i className="fa-solid fa-print"></i> Download PDF / Print
              </button>
              <button className="btn-cancel-view" onClick={onClose}>
                Back to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Hidden printable frame that replaces full body on window.print() */}
      {!loading && displayedCert && (
        <div className={`print-only-cert-wrapper ${theme}-theme`}>
          <div className="cert-border-outer">
            <div className="cert-border-inner">
              <div className="cert-header">
                <span className="cert-logo-glow" style={{ color: 'var(--brand-cyan)' }}>noob</span>
                <span className="cert-logo-text" style={{ color: 'var(--text-primary)' }}>Syte</span>
                <div className="cert-subtitle" style={{ letterSpacing: '2px', color: 'var(--text-secondary)' }}>
                  VERIFIED COMPLETION CREDENTIAL
                </div>
              </div>
              <div className="cert-body">
                <p className="cert-award-text" style={{ color: 'var(--text-secondary)' }}>This is to officially certify that</p>
                <h2 className="cert-student-name" style={{ color: 'var(--text-primary)' }}>{displayedCert.studentName}</h2>
                <p className="cert-achievement-text" style={{ color: 'var(--text-secondary)' }}>
                  has successfully completed the interactive learning track and validated all self-assessment quizzes for
                </p>
                <h3 className="cert-course-title" style={{ color: 'var(--brand-cyan)' }}>{displayedCert.courseTitle}</h3>
              </div>
              <div className="cert-footer" style={{ borderTop: '1px solid var(--bg-tertiary)' }}>
                <div className="footer-col">
                  <span className="footer-label" style={{ color: 'var(--text-secondary)' }}>ISSUED DATE</span>
                  <span className="footer-val" style={{ color: 'var(--text-primary)' }}>{displayedCert.issueDate}</span>
                </div>
                <div className="footer-col">
                  <span className="footer-label" style={{ color: 'var(--text-secondary)' }}>CREDENTIAL ID</span>
                  <span className="footer-val cert-hash" style={{ color: 'var(--brand-cyan)' }}>{displayedCert.verificationHash}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CertificateViewer;
