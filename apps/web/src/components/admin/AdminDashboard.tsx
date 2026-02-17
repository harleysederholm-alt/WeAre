import React, { useEffect, useState } from 'react';
import { getAllRestaurants, createRestaurant, assignRole } from '../../lib/api';

export const AdminDashboard: React.FC = () => {
    const [restaurants, setRestaurants] = useState<any[]>([]);
    const [newRestName, setNewRestName] = useState('');
    const [newRestDomain, setNewRestDomain] = useState('');
    const [roleEmail, setRoleEmail] = useState('');
    const [roleRestId, setRoleRestId] = useState('');
    const [roleType, setRoleType] = useState('STAFF');

    const loadData = async () => {
        try {
            const data = await getAllRestaurants();
            setRestaurants(data);
            if (data.length > 0 && !roleRestId) setRoleRestId(data[0].id);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleCreateRestaurant = async () => {
        try {
            await createRestaurant(newRestName, newRestDomain);
            alert('Restaurant Created');
            setNewRestName('');
            setNewRestDomain('');
            loadData();
        } catch (e) {
            alert('Failed');
        }
    };

    const handleAssignRole = async () => {
        try {
            await assignRole(roleEmail, roleRestId, roleType);
            alert('Role Assigned');
            setRoleEmail('');
        } catch (e) {
            alert('Failed');
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold">Admin Dashboard</h2>

            {/* Create Restaurant */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                <h3 className="font-bold mb-4">Onboard New Restaurant</h3>
                <div className="flex gap-4">
                    <input
                        className="border p-2 rounded w-1/3"
                        placeholder="Restaurant Name"
                        value={newRestName}
                        onChange={e => setNewRestName(e.target.value)}
                    />
                    <input
                        className="border p-2 rounded w-1/3"
                        placeholder="Domain (e.g. panchovilla.fi)"
                        value={newRestDomain}
                        onChange={e => setNewRestDomain(e.target.value)}
                    />
                    <button
                        onClick={handleCreateRestaurant}
                        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                    >
                        Create Unit
                    </button>
                </div>
            </div>

            {/* Assign Roles */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                <h3 className="font-bold mb-4">Assign User Roles</h3>
                <div className="flex gap-4">
                    <input
                        className="border p-2 rounded w-1/3"
                        placeholder="User Email"
                        value={roleEmail}
                        onChange={e => setRoleEmail(e.target.value)}
                    />
                    <select
                        className="border p-2 rounded"
                        value={roleRestId}
                        onChange={e => setRoleRestId(e.target.value)}
                    >
                        {restaurants.map(r => (
                            <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                    </select>
                    <select
                        className="border p-2 rounded"
                        value={roleType}
                        onChange={e => setRoleType(e.target.value)}
                    >
                        <option value="STAFF">STAFF</option>
                        <option value="MANAGER">MANAGER</option>
                        <option value="ADMIN">ADMIN</option>
                    </select>
                    <button
                        onClick={handleAssignRole}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Assign Role
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                <h3 className="font-bold mb-4">Active Restaurants</h3>
                <table className="w-full text-sm text-left">
                    <thead>
                        <tr className="bg-slate-50 border-b">
                            <th className="p-2">ID</th>
                            <th className="p-2">Name</th>
                            <th className="p-2">Domain</th>
                            <th className="p-2">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {restaurants.map(r => (
                            <tr key={r.id} className="border-b">
                                <td className="p-2 font-mono text-xs">{r.id}</td>
                                <td className="p-2 font-bold">{r.name}</td>
                                <td className="p-2">{r.domain}</td>
                                <td className="p-2 text-green-600">Active</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
