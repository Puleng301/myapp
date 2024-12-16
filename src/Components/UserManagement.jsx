import React, { useState } from 'react';
import './UserManagement.css';
import useLogout from '../hooks/useLogout';
import useAuth from '../hooks/use-auth';
import useFetchData from '../hooks/useFetchData';
import useAxiosIntercepters from '../hooks/useAxiosIntercepters';

const UserManagement = ({ users, setUsers, currentUser, setCurrentUser, handleLogout }) => {
    const [updatedUsername, setUpdatedUsername] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const userss = useFetchData('/users');
    const [passwordInput, setPasswordInput] = useState('');
    const [passwordRequired, setPasswordRequired] = useState(false);
    const [userToSwitch, setUserToSwitch] = useState(null);
    const [passwordForEdit, setPasswordForEdit] = useState('');
    const logout = useLogout();
    const { user } = useAuth();
    const axios = useAxiosIntercepters();

    
    const deleteUser = async (username) => {
        try {
            

         const res=await axios.delete("/user")   
            
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("Error deleting user.");
        }
    };

    
    const startEditing = (user) => {
        setUpdatedUsername(user.username); 
        setEditingUser(user);
        setPasswordRequired(true); 
    };

    
    const handleUpdateUser = () => {
        if (!updatedUsername) {
            alert("Enter a new username.");
            return;
        }

        
        const updatedUsers = users?.map(user =>
            user.username === editingUser.username ? { ...user, username: updatedUsername } : user
        );

        setUsers(updatedUsers);
        localStorage.setItem("users", JSON.stringify(updatedUsers));
        alert("User updated!");

        if (currentUser.username === editingUser.username) {
            const updatedCurrentUser = { ...currentUser, username: updatedUsername };
            setCurrentUser(updatedCurrentUser);
            localStorage.setItem("currentUser", JSON.stringify(updatedCurrentUser));
        }

        resetEditing(); 
    };

    
    const resetEditing = () => {
        setEditingUser(null);
        setUpdatedUsername('');
        setPasswordRequired(false);
        setPasswordForEdit('');
    };

    
    const switchToUser = (user) => {
        setUserToSwitch(user); 
        setPasswordRequired(true); 
    };

    
    const handleSwitchUser = (e) => {
        e.preventDefault();

        const currentUserToSwitch = users?.find(u => u.username === userToSwitch.username);

        if (currentUserToSwitch && currentUserToSwitch.password === passwordInput) {
            setCurrentUser(currentUserToSwitch);
            localStorage.setItem("currentUser", JSON.stringify(currentUserToSwitch));

            alert(`Switched to user: ${currentUserToSwitch.username}`);

            setUserToSwitch(null); 
            setPasswordInput('');
            setPasswordRequired(false); 
        } else {
            alert("Incorrect password. Please try again.");
        }
    };

    
    const handleEditPasswordSubmit = (e) => {
        e.preventDefault();

        const currentUserEditing = users?.find(u => u.username === editingUser.username);

        if (currentUserEditing && currentUserEditing.password === passwordForEdit) {
            
            setUpdatedUsername(currentUserEditing.username); 
            setPasswordRequired(false); 
        } else {
            alert("Incorrect password. You cannot edit this user.");
        }
    };

    return (
        <div>
            <h2>User Management</h2>
            <button onClick={logout}>Logout</button>
            <h3>Currently logged in as: {user ? user.username : 'None'}</h3>
            <table style={{ color: 'grey' }}>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {userss?.data?.map(user => (
                        <tr key={user.username}>
                            <td>{user.username}</td>
                            <td>
                                <button onClick={() => deleteUser(user.username)}>Delete</button>
                                <button onClick={() => startEditing(user)}>Edit</button>
                                <button onClick={() => switchToUser(user)}>Switch</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            
            {editingUser && passwordRequired && (
                <div>
                    <h3>Enter Password to Edit User</h3>
                    <form onSubmit={handleEditPasswordSubmit}>
                        <input
                            type="password"
                            value={passwordForEdit}
                            onChange={(e) => setPasswordForEdit(e.target.value)}
                            placeholder="Password"
                            required
                        />
                        <button type="submit">Verify</button>
                        <button type="button" onClick={resetEditing}>Cancel</button>
                    </form>
                </div>
            )}

        
            {editingUser && !passwordRequired && (
                <div>
                    <h3>Update User</h3>
                    <input
                        type="text"
                        value={updatedUsername}
                        onChange={(e) => setUpdatedUsername(e.target.value)}
                        placeholder="New Username"
                    />
                    <button onClick={handleUpdateUser}>Update</button>
                    <button onClick={resetEditing}>Cancel</button>
                </div>
            )}

    
            {passwordRequired && userToSwitch !== null && (
                <div>
                    <h3>Enter Password to Switch User</h3>
                    <form onSubmit={handleSwitchUser}>
                        <input
                            type="password"
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            placeholder="Password"
                            required
                        />
                        <button type="submit">Switch User</button>
                        <button type="button" onClick={() => setPasswordRequired(false)}>Cancel</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default UserManagement;



