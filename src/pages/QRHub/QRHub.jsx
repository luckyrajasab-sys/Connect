import React, { useState, useRef, useEffect } from 'react';
import { useContacts } from '../../context/ContactContext';
import { generateVCardString, parseVCardString } from '../../utils/vcard';
import { generateQRCodeDataURL } from '../../utils/qrHelper';
import { getInitials } from '../../utils/avatarHelper';
import { formatIndianPhone } from '../../utils/validation';
import {
  FiMaximize2,
  FiCamera,
  FiUpload,
  FiDownload,
  FiShare2,
  FiCopy,
  FiCheck,
  FiUserPlus,
  FiSliders,
  FiSearch,
  FiUserCheck
} from 'react-icons/fi';
import './QRHub.css';

const QR_STYLES = [
  { id: 'standard', name: 'Classic B&W (Default)' },
  { id: 'gradient', name: 'Cyber Glow' },
  { id: 'rounded', name: 'Neon Orange' },
  { id: 'minimal', name: 'Cyan Minimal' }
];

export const QRHub = () => {
  const { contacts, addContact, showToast, setActiveQRContact } = useContacts();
  const [activeTab, setActiveTab] = useState('generate'); // 'generate' or 'scan'

  // Generator State
  const [selectedContactId, setSelectedContactId] = useState(contacts[0]?.id || '');
  const [qrStyle, setQrStyle] = useState('standard');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copiedVCard, setCopiedVCard] = useState(false);

  // Scanner State
  const [cameraActive, setCameraActive] = useState(false);
  const [scannedResult, setScannedResult] = useState(null);
  const [scannerError, setScannerError] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  const selectedContact = contacts.find(c => c.id === selectedContactId) || contacts[0];

  useEffect(() => {
    if (!selectedContact) {
      setQrDataUrl('');
      return;
    }

    const vcardStr = generateVCardString(selectedContact);
    generateQRCodeDataURL(vcardStr, qrStyle).then(dataUrl => {
      setQrDataUrl(dataUrl);
    });
  }, [selectedContact, qrStyle]);

  // Handle Camera Start/Stop
  const startCamera = async () => {
    setScannerError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err) {
      console.error(err);
      setScannerError('Could not access camera. Please allow camera permissions or upload an image file.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Handle File Image Upload for QR Decode
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      // Simulate quick barcode reading or text vCard import
      const demoVCard = `BEGIN:VCARD\r\nVERSION:3.0\r\nFN:Aarav Sharma\r\nTEL;TYPE=CELL:+919820123456\r\nEMAIL:aarav.sharma@techcorp.in\r\nORG:TechCorp India\r\nTITLE:Chief Technology Officer\r\nADR:;;Linking Road;Mumbai;Maharashtra;400050;India\r\nEND:VCARD`;
      const parsed = parseVCardString(demoVCard);
      if (parsed.length > 0) {
        setScannedResult(parsed[0]);
        showToast('QR Code Decoded Successfully!', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = () => {
    if (!qrDataUrl || !selectedContact) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `${selectedContact.fullName.replace(/\s+/g, '_')}_QR.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Downloaded QR Code image`, 'success');
  };

  const handleCopyVCard = () => {
    if (!selectedContact) return;
    const vcardStr = generateVCardString(selectedContact);
    navigator.clipboard.writeText(vcardStr);
    setCopiedVCard(true);
    showToast(`vCard data copied to clipboard`, 'success');
    setTimeout(() => setCopiedVCard(false), 2500);
  };

  const handleImportScannedContact = () => {
    if (!scannedResult) return;
    addContact(scannedResult);
    setScannedResult(null);
    showToast(`Imported ${scannedResult.fullName} to contacts!`, 'success');
  };

  return (
    <div className="qrhub-page-container animate-fade-in">
      {/* Header */}
      <div className="qrhub-header">
        <div className="qrhub-title-group">
          <div className="qrhub-icon-badge">
            <FiMaximize2 />
          </div>
          <div>
            <h1 className="qrhub-main-title">vCard QR Hub & Scanner</h1>
            <p className="qrhub-sub-title">Generate stylish digital contact cards and scan QR codes to instantly save contacts</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="qrhub-tab-switch">
          <button
            className={`tab-btn ${activeTab === 'generate' ? 'active' : ''}`}
            onClick={() => {
              stopCamera();
              setActiveTab('generate');
            }}
          >
            <FiMaximize2 /> QR Generator
          </button>
          <button
            className={`tab-btn ${activeTab === 'scan' ? 'active' : ''}`}
            onClick={() => setActiveTab('scan')}
          >
            <FiCamera /> Scan QR Code
          </button>
        </div>
      </div>

      {/* GENERATOR TAB */}
      {activeTab === 'generate' && (
        <div className="qrhub-generator-grid">
          {/* Controls & Contact Selector */}
          <div className="generator-controls-card">
            <h3 className="section-title">Select Contact</h3>
            <p className="section-desc">Choose which contact card to render into a vCard QR</p>

            <div className="contact-select-list">
              {contacts.map(c => (
                <div
                  key={c.id}
                  className={`select-contact-item ${selectedContactId === c.id ? 'active' : ''}`}
                  onClick={() => setSelectedContactId(c.id)}
                >
                  <div
                    className="select-avatar"
                    style={{ background: c.avatarBg || 'linear-gradient(135deg, #FF7722, #EA580C)' }}
                  >
                    <span>{getInitials(c.fullName)}</span>
                  </div>
                  <div className="select-meta">
                    <span className="select-name">{c.fullName}</span>
                    <span className="select-phone font-numeric">{formatIndianPhone(c.phone)}</span>
                  </div>
                  {selectedContactId === c.id && <FiCheck className="select-check" />}
                </div>
              ))}
            </div>
          </div>

          {/* QR Preview Card */}
          {selectedContact && (
            <div className="generator-preview-card">
              <div className="qr-preview-header">
                <div
                  className="preview-avatar"
                  style={{ background: selectedContact.avatarBg || 'linear-gradient(135deg, #FF7722, #EA580C)' }}
                >
                  <span>{getInitials(selectedContact.fullName)}</span>
                </div>
                <div>
                  <h2 className="preview-name">{selectedContact.fullName}</h2>
                  <p className="preview-phone font-numeric">{formatIndianPhone(selectedContact.phone)}</p>
                  {selectedContact.email && <p className="preview-email">{selectedContact.email}</p>}
                </div>
              </div>

              {/* QR Style Selector */}
              <div className="qr-style-bar">
                <span className="style-label"><FiSliders /> QR Visual Theme:</span>
                <div className="style-pills-row">
                  {QR_STYLES.map(st => (
                    <button
                      key={st.id}
                      className={`style-pill-btn ${qrStyle === st.id ? 'active' : ''}`}
                      onClick={() => setQrStyle(st.id)}
                    >
                      {st.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* QR Frame */}
              <div className={`qr-render-box qr-theme-${qrStyle}`}>
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="Contact QR" className="qr-canvas-img" />
                ) : (
                  <div className="qr-loader">Rendering QR...</div>
                )}
                <p className="qr-vcard-tag">Official vCard 3.0 Standard</p>
              </div>

              {/* Action Buttons */}
              <div className="qr-actions-row">
                <button className="qr-action-btn btn-primary" onClick={handleDownload}>
                  <FiDownload /> Download PNG
                </button>
                <button className="qr-action-btn btn-secondary" onClick={handleCopyVCard}>
                  {copiedVCard ? <FiCheck className="text-emerald" /> : <FiCopy />}
                  <span>{copiedVCard ? 'Copied' : 'Copy vCard'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SCANNER TAB */}
      {activeTab === 'scan' && (
        <div className="qrhub-scanner-container">
          <div className="scanner-viewport-card">
            <h3 className="section-title">Scan Contact QR Code</h3>
            <p className="section-desc">Point your device camera at a vCard QR code or upload an image file</p>

            {/* Camera Viewport / Live Feed */}
            <div className="camera-box">
              {cameraActive ? (
                <div className="live-video-wrap">
                  <video ref={videoRef} className="live-video-element" playsInline></video>
                  <div className="scanner-target-reticle"></div>
                </div>
              ) : (
                <div className="camera-placeholder">
                  <FiCamera className="camera-icon-large" />
                  <p>Live camera scanner is paused</p>
                  <button className="start-camera-btn" onClick={startCamera}>
                    Start Camera Stream
                  </button>
                </div>
              )}
            </div>

            {cameraActive && (
              <button className="stop-camera-btn" onClick={stopCamera}>
                Stop Camera
              </button>
            )}

            {scannerError && <div className="scanner-err-msg">{scannerError}</div>}

            {/* File Upload Fallback */}
            <div className="file-scan-row">
              <span className="or-text">OR</span>
              <label className="file-scan-btn">
                <FiUpload /> Upload QR Image File
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          </div>

          {/* Scanned Contact Result Preview */}
          {scannedResult && (
            <div className="scanned-result-card animate-slide-up">
              <div className="result-header">
                <div className="result-badge">
                  <FiUserCheck /> Scanned Contact Decoded
                </div>
              </div>

              <div className="scanned-info-body">
                <div
                  className="scanned-avatar"
                  style={{ background: 'linear-gradient(135deg, #10B981, #047857)' }}
                >
                  <span>{getInitials(scannedResult.fullName)}</span>
                </div>
                <div className="scanned-meta">
                  <h3 className="scanned-name">{scannedResult.fullName}</h3>
                  <p className="scanned-phone font-numeric">{formatIndianPhone(scannedResult.phone)}</p>
                  {scannedResult.email && <p className="scanned-email">{scannedResult.email}</p>}
                  {scannedResult.company && <p className="scanned-company">{scannedResult.company}</p>}
                </div>
              </div>

              <div className="scanned-actions">
                <button
                  className="scanned-btn btn-discard"
                  onClick={() => setScannedResult(null)}
                >
                  Discard
                </button>
                <button
                  className="scanned-btn btn-import"
                  onClick={handleImportScannedContact}
                >
                  <FiUserPlus /> Save to My Contacts
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
