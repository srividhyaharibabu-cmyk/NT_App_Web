import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../api';
import './Auth.css';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(''); // Clear previous messages

        try {
            const response = await authAPI.forgotPassword({ email });
            console.log('Forgot password response:', response.data);

            // Backend returns { success: true, data: 'Email sent' }
            if (response.data.success) {
                setMessage('Password reset link has been sent to your email. Please check your inbox.');
                setIsError(false);
            } else {
                setMessage(response.data.data || 'Email sent successfully');
                setIsError(false);
            }
        } catch (err) {
            console.error('Forgot password error:', err);
            console.error('Error response:', err.response?.data);

            // Show specific error message from backend if available
            const errorMessage = err.response?.data?.message || 'An error occurred. Please try again.';
            setMessage(errorMessage);
            setIsError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>Nutrition Tracker</h1>
                <h2>Forgot Password</h2>

                {message && <div className={isError ? 'error-message' : 'info-message'}>{message}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary">
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>

                <div className="auth-links">
                    <Link to="/login">Back to Login</Link>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
