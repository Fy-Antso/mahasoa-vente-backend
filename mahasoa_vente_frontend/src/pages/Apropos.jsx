import React from 'react';
import mpdImage from '../assets/mpd.png';

export default function APropos() {
  return (
    <div style={{
      backgroundColor: '#F7F6F1',
      minHeight: 'calc(100vh - 70px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        maxWidth: '100%',
        maxHeight: '85vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <img 
          src={mpdImage} 
          alt="Modèle Physique de Données (MPD)" 
          style={{
            maxWidth: '100%',
            maxHeight: '75vh',
            width: 'auto',
            height: 'auto',
            objectFit: 'contain',
            borderRadius: '8px'
          }}
        />
      </div>
    </div>
  );
}