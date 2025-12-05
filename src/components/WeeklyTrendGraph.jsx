import React from 'react';
import './WeeklyTrendGraph.css';

const WeeklyTrendGraph = ({ data }) => {
    // data structure: [{ day: 'Mon', calories: 2000, averageRating: 5 }, ...]

    const maxCalories = Math.max(...data.map(d => d.calories), 2500); // Default max to 2500 if lower

    return (
        <div className="weekly-trend-card">
            <h3>Weekly Calorie Trend</h3>
            <div className="graph-container">
                {data.map((dayData, index) => (
                    <div key={index} className="graph-bar-group">
                        <div
                            className="graph-bar"
                            style={{
                                height: `${(dayData.calories / maxCalories) * 100}%`,
                                backgroundColor: dayData.calories > 2500 ? '#ff4d4d' : '#4caf50'
                            }}
                            title={`${dayData.calories} kcal`}
                        ></div>
                        <span className="day-label">{dayData.day}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WeeklyTrendGraph;
