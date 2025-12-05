import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { foodAPI } from '../api';
import WeeklyTrendGraph from '../components/WeeklyTrendGraph';
import WeeklyScore from '../components/WeeklyScore';
import './Home.css';

function Home({ user, onLogout }) {
    const [message, setMessage] = useState('');
    const [foodLogs, setFoodLogs] = useState([]);
    const [weeklyStats, setWeeklyStats] = useState({ graphData: [], weeklyScorePercentage: 0 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchFoodHistory();
        fetchWeeklyStats();
    }, []);

    const fetchFoodHistory = async () => {
        try {
            const response = await foodAPI.getHistory({ limit: 10 });
            setFoodLogs(response.data.data || []);
        } catch (err) {
            console.error('Failed to fetch history:', err);
        }
    };

    const fetchWeeklyStats = async () => {
        try {
            const response = await foodAPI.getWeeklyStats();
            setWeeklyStats(response.data);
        } catch (err) {
            console.error('Failed to fetch weekly stats:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        setLoading(true);
        setError('');

        try {
            await foodAPI.logFood({ message_text: message });
            setMessage('');
            fetchFoodHistory();
            fetchWeeklyStats(); // Refresh stats after logging
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to log food');
        } finally {
            setLoading(false);
        }
    };

    const getRatingColor = (rating) => {
        if (rating >= 8) return '#4caf50'; // Green for Excellent
        if (rating >= 4) return '#ff9800'; // Orange for Moderate
        return '#f44336'; // Red for Unhealthy
    };

    const getRatingLabel = (rating) => {
        if (rating >= 8) return 'Excellent';
        if (rating >= 4) return 'Moderate';
        return 'Unhealthy';
    };

    return (
        <div className="home-container">
            <nav className="navbar">
                <h1>🥗 Nutrition Tracker</h1>
                <div className="nav-right">
                    <span>Welcome, {user.name}</span>
                    {user.role === 'Admin' && <Link to="/admin" className="admin-link">Admin Panel</Link>}
                    <button onClick={onLogout} className="btn-logout">Logout</button>
                </div>
            </nav>

            <div className="content">
                <div className="dashboard-left">
                    <div className="food-input-section">
                        <h2>What did you eat?</h2>
                        {error && <div className="error-message">{error}</div>}

                        <form onSubmit={handleSubmit}>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="e.g., I had 2 idlis with sambar and a cup of coffee"
                                rows="4"
                                required
                            />
                            <button type="submit" disabled={loading} className="btn-primary">
                                {loading ? 'Analyzing...' : 'Log Food'}
                            </button>
                        </form>
                    </div>

                    <div className="stats-section">
                        <WeeklyScore score={weeklyStats.weeklyScorePercentage} />
                        <WeeklyTrendGraph data={weeklyStats.graphData} />
                    </div>
                </div>

                <div className="food-history-section">
                    <h2>Recent Food Logs</h2>
                    {foodLogs.length === 0 ? (
                        <p className="no-logs">No food logs yet. Start logging your meals!</p>
                    ) : (
                        <div className="food-logs">
                            {foodLogs.map((log) => (
                                <div key={log.id} className="food-log-card">
                                    <div className="log-header">
                                        <span className="log-date">{new Date(log.createdAt).toLocaleDateString()}</span>
                                        <span
                                            className="log-rating"
                                            style={{ backgroundColor: getRatingColor(log.rating) }}
                                        >
                                            {log.rating}/10 - {getRatingLabel(log.rating)}
                                        </span>
                                    </div>

                                    <p className="log-message">{log.message_text}</p>

                                    <div className="nutrition-grid">
                                        <div className="nutrition-item">
                                            <span className="nutrition-label">Calories</span>
                                            <span className="nutrition-value">{log.calories} kcal</span>
                                        </div>
                                        <div className="nutrition-item">
                                            <span className="nutrition-label">Fat</span>
                                            <span className="nutrition-value">{log.fat}g</span>
                                        </div>
                                        <div className="nutrition-item">
                                            <span className="nutrition-label">Protein</span>
                                            <span className="nutrition-value">{log.protein}g</span>
                                        </div>
                                        <div className="nutrition-item">
                                            <span className="nutrition-label">Fiber</span>
                                            <span className="nutrition-value">{log.fiber}g</span>
                                        </div>
                                    </div>

                                    {log.note && <p className="log-note">💡 {log.note}</p>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;
