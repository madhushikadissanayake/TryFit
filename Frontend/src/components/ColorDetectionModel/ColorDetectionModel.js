// ColorDetectionModal.jsx
import React from 'react';
import '../ColorDetectionModel/ColorDetectionModel.css'; // Optional: You can style your modal here.
import SkinColorDetection from '../skinColor.js'; // Update the path accordingly


const ColorDetectionModal = ({ isOpen, onClose, onSubmit, hexColor }) => {
  if (!isOpen) return null; // Render nothing if the modal is closed

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          X
        </button>
        <h2>Skin Color Detection</h2>
        <SkinColorDetection onSubmit={onSubmit} />
        <button 
            onClick={onClose} 
            style={{
                backgroundColor: '#910128', // Change the background color
                color: 'white', // Change the text color
                border: 'none', // Remove border
                borderRadius: '5px', // Add rounded corners
                padding: '5px 20px', // Add padding
                cursor: 'pointer', // Change cursor on hover
                fontSize: '16px', // Change font size
                transition: 'background-color 0.3s', // Add transition effect
                margin: '10px'
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#420515')} // Change color on hover
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#910128')} // Reset color on mouse out
            >
            Close
            </button>

      </div>
    </div>
  );
};

export default ColorDetectionModal;
