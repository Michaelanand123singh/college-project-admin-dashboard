// src/components/tables/UserTable.js
import React, { useState, useEffect } from 'react';
import { PencilIcon } from '@heroicons/react/24/outline';
import adminAPI from '../../services/adminAPI';
import { formatDate, getStatusColor, truncateText } from '../../utils/adminHelpers';

const UserTable = ({ onEdit }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await adminAPI.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (userId, currentStatus) => {
    try {
      await adminAPI.updateUserStatus(userId, !currentStatus);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user._id}>
              <td className="px-6 py-4 text-sm text-gray-900">
                {truncateText(user.name, 25)}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {truncateText(user.email, 30)}
              </td>
              <td className="px-6 py-4 text-sm">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => handleStatusToggle(user._id, user.isActive)}
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.isActive ? 'active' : 'inactive')}`}
                >
                  {user.isActive ? 'Active' : 'Inactive'}
                </button>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {formatDate(user.createdAt)}
              </td>
              <td className="px-6 py-4 text-sm">
                <button
                  onClick={() => onEdit(user)}
                  className="text-blue-600 hover:text-blue-900"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;