import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../api';
import './AdminDashboard.css';

function AdminDashboard({ user, onLogout }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await adminAPI.getUsers({ limit: 50 });
            setUsers(response.data.data || []);
        } catch (err) {
            setError('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (userId, currentStatus) => {
        const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
        try {
            await adminAPI.updateStatus(userId, newStatus);
            fetchUsers();
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const handleRoleChange = async (userId, currentRole) => {
        const newRole = currentRole === 'User' ? 'Admin' : 'User';
        if (userId === user.id && newRole === 'User') {
            alert('You cannot remove your own admin privileges');
            return;
        }

        try {
            await adminAPI.changeRole(userId, newRole);
            fetchUsers();
        } catch (err) {
            alert('Failed to update role');
        }
    };

    return (
        <div className="admin-container">
            <nav className="navbar">
                <h1>👨‍💼 Admin Dashboard</h1>
                <div className="nav-right">
                    <span>Welcome, {user.name}</span>
                    <Link to="/home" className="home-link">Home</Link>
                    <button onClick={onLogout} className="btn-logout">Logout</button>
                </div>
            </nav>

            <div className="admin-content">
                <h2>User Management</h2>

                {error && <div className="error-message">{error}</div>}

                {loading ? (
                    <p>Loading users...</p>
                ) : (
                    <div className="table-container">
                        <table className="users-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u) => (
                                    <tr key={u.id}>
                                        <td>{u.id}</td>
                                        <td>{u.name}</td>
                                        <td>{u.email}</td>
                                        <td>
                                            <span className={`badge ${u.role.toLowerCase()}`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge ${u.status.toLowerCase()}`}>
                                                {u.status}
                                            </span>
                                        </td>
                                        <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <div className="action-buttons">
                                                <button
                                                    onClick={() => handleStatusChange(u.id, u.status)}
                                                    className="btn-action"
                                                >
                                                    {u.status === 'Active' ? 'Deactivate' : 'Activate'}
                                                </button>
                                                <button
                                                    onClick={() => handleRoleChange(u.id, u.role)}
                                                    className="btn-action"
                                                >
                                                    {u.role === 'User' ? 'Make Admin' : 'Remove Admin'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminDashboard;
