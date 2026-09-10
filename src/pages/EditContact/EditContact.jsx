import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useContacts } from '../../context/ContactContext';
import { ContactForm } from '../../components/ContactForm/ContactForm';

export const EditContact = () => {
  const { id } = useParams();
  const { contacts } = useContacts();
  const navigate = useNavigate();

  const contact = contacts.find(c => c.id === id);

  if (!contact) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h2>Contact Not Found</h2>
        <button
          style={{
            marginTop: '16px',
            padding: '10px 20px',
            background: 'var(--primary-saffron)',
            color: '#FFFFFF',
            borderRadius: '8px',
            fontWeight: 600
          }}
          onClick={() => navigate('/contacts')}
        >
          Return to Contacts
        </button>
      </div>
    );
  }

  return (
    <div className="edit-contact-page animate-fade-in">
      <ContactForm initialData={contact} isEditMode={true} />
    </div>
  );
};
