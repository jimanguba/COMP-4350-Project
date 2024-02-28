import React from 'react';
import '../assets/styles/ProgressBar.css';

function ProgressBar({ progress }) {
    return (
        <div className="progress-container">
            <div className="progress-bar" style={{ width: `${progress}%` }}>
                <span className="progress-label">{progress}%</span>
            </div>
        </div>
    );
}

export default ProgressBar;
