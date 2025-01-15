'use client'

import { useState } from 'react'
import { api } from '../services/api'
import { QRCodeSVG } from 'qrcode.react'
import Barcode from 'react-barcode'

export default function Register() {
  const [step, setStep] = useState<'user' | 'item' | 'complete'>('user')
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    gradeLevel: '',
    section: '',
    strand: '',
    building: '',
    profilePicture: '',
  })
  const [itemData, setItemData] = useState({
    name: '',
    description: '',
    category: '',
    codeType: 'barcode' as 'barcode' | 'qrcode',
  })
  const [registeredUser, setRegisteredUser] = useState<User | null>(null)
  const [registeredItem, setRegisteredItem] = useState<Item | null>(null)

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value })
  }

  const handleItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setItemData({ ...itemData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target) {
          setUserData({ ...userData, profilePicture: event.target.result as string })
        }
      }
      reader.readAsDataURL(e.target.files[0])
    }
  }

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newUser = api.registerUser(userData)
    setRegisteredUser(newUser)
    setStep('item')
  }

  const handleItemSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (registeredUser) {
      const newItem = api.registerItem({ ...itemData, ownerId: registeredUser.id })
      setRegisteredItem(newItem)
      setStep('complete')
    }
  }

  const renderUserForm = () => (
    <form onSubmit={handleUserSubmit} className="space-y-4">
      <div>
        <label htmlFor="fullName" className="block mb-1">Full Name</label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={userData.fullName}
          onChange={handleUserChange}
          required
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      <div>
        <label htmlFor="email" className="block mb-1">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={userData.email}
          onChange={handleUserChange}
          required
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      <div>
        <label htmlFor="gradeLevel" className="block mb-1">Grade Level</label>
        <input
          type="text"
          id="gradeLevel"
          name="gradeLevel"
          value={userData.gradeLevel}
          onChange={handleUserChange}
          required
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      <div>
        <label htmlFor="section" className="block mb-1">Section</label>
        <input
          type="text"
          id="section"
          name="section"
          value={userData.section}
          onChange={handleUserChange}
          required
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      <div>
        <label htmlFor="strand" className="block mb-1">Strand</label>
        <select
          id="strand"
          name="strand"
          value={userData.strand}
          onChange={handleUserChange}
          required
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value="">Select Strand</option>
          <option value="STEM">STEM</option>
          <option value="HUMSS">HUMSS</option>
          <option value="ICT">ICT</option>
          <option value="ABM">ABM</option>
          <option value="ALS">ALS</option>
          <option value="SPED">SPED</option>
        </select>
      </div>
      <div>
        <label htmlFor="building" className="block mb-1">Building Name/Location</label>
        <input
          type="text"
          id="building"
          name="building"
          value={userData.building}
          onChange={handleUserChange}
          required
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      <div>
        <label htmlFor="profilePicture" className="block mb-1">Profile Picture</label>
        <input
          type="file"
          id="profilePicture"
          name="profilePicture"
          accept="image/*"
          onChange={handleFileChange}
          required
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      {userData.profilePicture && (
        <div className="mt-4">
          <img src={userData.profilePicture} alt="Profile Preview" className="w-32 h-32 object-cover rounded-full mx-auto" />
        </div>
      )}
      <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300">
        Next: Register Item
      </button>
    </form>
  )

  const renderItemForm = () => (
    <form onSubmit={handleItemSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block mb-1">Item Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={itemData.name}
          onChange={handleItemChange}
          required
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      <div>
        <label htmlFor="description" className="block mb-1">Description</label>
        <input
          type="text"
          id="description"
          name="description"
          value={itemData.description}
          onChange={handleItemChange}
          required
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      <div>
        <label htmlFor="category" className="block mb-1">Category</label>
        <select
          id="category"
          name="category"
          value={itemData.category}
          onChange={handleItemChange}
          required
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value="">Select Category</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="books">Books</option>
          <option value="accessories">Accessories</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div>
        <label htmlFor="codeType" className="block mb-1">Code Type</label>
        <select
          id="codeType"
          name="codeType"
          value={itemData.codeType}
          onChange={handleItemChange}
          required
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value="barcode">Barcode</option>
          <option value="qrcode">QR Code</option>
        </select>
      </div>
      <button type="submit" className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300">
        Register Item and Generate Code
      </button>
    </form>
  )

  const renderComplete = () => (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-4">Registration Complete</h2>
      <p className="mb-4">Thank you for registering, {registeredUser?.fullName}!</p>
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <p className="font-bold">Generated Code for {registeredItem?.name}:</p>
        <p className="text-2xl font-mono mb-2">{registeredItem?.code}</p>
        {registeredItem?.codeType === 'qrcode' ? (
          <QRCodeSVG value={registeredItem.code} size={128} className="mx-auto" />
        ) : (
          <Barcode value={registeredItem?.code || ''} width={1.5} height={50} className="mx-auto" />
        )}
      </div>
      <p className="mb-4">Please print or save this code for your records. It will be used to identify your item if it's found.</p>
      <button onClick={() => window.print()} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 mr-4">
        Print Code
      </button>
      <a href="/" className="text-blue-500 hover:underline">Return to Home</a>
    </div>
  )

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        {step === 'user' ? 'User Registration' : step === 'item' ? 'Item Registration' : 'Registration Complete'}
      </h1>
      {step === 'user' && renderUserForm()}
      {step === 'item' && renderItemForm()}
      {step === 'complete' && renderComplete()}
    </div>
  )
}

