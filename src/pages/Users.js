// src/pages/Users.js
import React, { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import UserTable from '../components/tables/UserTable';
import UserForm from '../components/form/UserForm';

const Users = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleSave = () => {
    setShowModal(false);
    setSelectedUser(null);
    // Refresh table data
    window.location.reload();
  };

  const handleCancel = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
      </div>

      <div className="bg-white shadow rounded-lg">
        <UserTable onEdit={handleEdit} />
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-medium mb-4">Edit User</h2>
            <UserForm 
              user={selectedUser}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;