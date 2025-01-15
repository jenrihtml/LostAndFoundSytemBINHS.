'use client'

import { useState, useEffect } from 'react'
import { api } from '../services/api'

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [items, setItems] = useState<Item[]>([])
  const [reports, setReports] = useState<FoundReport[]>([])
  const [activeTab, setActiveTab] = useState<'users' | 'items' | 'reports'>('users')

  useEffect(() => {
    setUsers(api.getUsers())
    setItems(api.getItems())
    setReports(api.getFoundReports())
  }, [])

  const renderUserManagement = () => (
    <div>
      <h2 className="text-2xl font-semibold mb-4">User Management</h2>
      <table className="w-full bg-white rounded-lg shadow">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Grade</th>
            <th className="p-2 text-left">Section</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="p-2">{user.fullName}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">{user.gradeLevel}</td>
              <td className="p-2">{user.section}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  const renderItemManagement = () => (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Item Management</h2>
      <table className="w-full bg-white rounded-lg shadow">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Category</th>
            <th className="p-2 text-left">Code</th>
            <th className="p-2 text-left">Owner</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const owner = users.find(u => u.id === item.ownerId)
            return (
              <tr key={item.id}>
                <td className="p-2">{item.name}</td>
                <td className="p-2">{item.category}</td>
                <td className="p-2">{item.code}</td>
                <td className="p-2">{owner ? owner.fullName : 'Unknown'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )

  const renderReportManagement = () => (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Report Management</h2>
      <table className="w-full bg-white rounded-lg shadow">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Item</th>
            <th className="p-2 text-left">Found By</th>
            <th className="p-2 text-left">Date</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => {
            const item = items.find(i => i.id === report.itemId)
            const foundByUser = users.find(u => u.id === report.foundBy)
            return (
              <tr key={report.id}>
                <td className="p-2">{item ? item.name : 'Unknown Item'}</td>
                <td className="p-2">{foundByUser ? foundByUser.fullName : 'Unknown User'}</td>
                <td className="p-2">{new Date(report.foundAt).toLocaleDateString()}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="flex mb-4">
        <button
          className={`mr-2 px-4 py-2 rounded ${activeTab === 'users' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button
          className={`mr-2 px-4 py-2 rounded ${activeTab === 'items' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('items')}
        >
          Items
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === 'reports' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('reports')}
        >
          Reports
        </button>
      </div>
      {activeTab === 'users' && renderUserManagement()}
      {activeTab === 'items' && renderItemManagement()}
      {activeTab === 'reports' && renderReportManagement()}
    </div>
  )
}

