import React from 'react';
import './WeeklyScore.css';

const WeeklyScore = ({ score }) => {
    // score is a percentage (0-100)

    const getScoreColor = (s) => {
        if (s >= 80) return '#4caf50'; // Green
        if (s >= 50) return '#ff9800'; // Orange
        return '#f44336'; // Red
    };

    const strokeDashoffset = 440 - (440 * score) / 100;

    return (
        <div className="weekly-score-card">
            <h3>Weekly Health Score</h3>
            <div className="score-circle-container">
                <svg className="score-svg" width="160" height="160">
                    <circle
                        className="score-bg"
                        cx="80"
                        cy="80"
                        r="70"
                    />
                    <circle
                        className="score-progress"
                        cx="80"
                        cy="80"
                        r="70"
                        style={{
                            strokeDashoffset,
                            stroke: getScoreColor(score)
                        }}
                    />
                </svg>
                <div className="score-text">
                    <span className="score-number">{score}%</span>
                    <span className="score-label">Adherence</span>
                </div>
            </div>
            <p className="score-message">
                {score >= 80 ? 'Excellent work! Keep it up!' :
                    score >= 50 ? 'Good effort, but room to improve.' :
                        'Let\'s focus on healthier choices.'}
            </p>
        </div>
    );
};

export default WeeklyScore;
