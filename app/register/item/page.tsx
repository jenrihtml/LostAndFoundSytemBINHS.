'use client'

import { useState } from 'react'
import { api } from '../../services/api'
import { QRCodeSVG } from 'qrcode.react'
import Barcode from 'react-barcode'

export default function RegisterItem() {
  const [itemData, setItemData] = useState({
    name: '',
    description: '',
    category: '',
    ownerId: '1', // This should be set to the current user's ID in a real app
    codeType: 'barcode' as 'barcode' | 'qrcode',
  })
  const [isRegistered, setIsRegistered] = useState(false)
  const [registeredItem, setRegisteredItem] = useState<any>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setItemData({ ...itemData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newItem = api.registerItem(itemData)
    setRegisteredItem(newItem)
    setIsRegistered(true)
  }

  if (isRegistered) {
    return (
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-3xl font-bold mb-6">Item Registered</h1>
        <p className="mb-4">Your item has been successfully registered.</p>
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <p className="font-bold">Generated Code:</p>
          <p className="text-2xl font-mono mb-2">{registeredItem.code}</p>
          {registeredItem.codeType === 'qrcode' ? (
            <QRCodeSVG value={registeredItem.code} size={128} className="mx-auto" />
          ) : (
            <Barcode value={registeredItem.code} width={1.5} height={50} className="mx-auto" />
          )}
        </div>
        <p className="mb-4">Please print or save this code for your records. It will be used to identify your item if it's found.</p>
        <button onClick={() => window.print()} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 mr-4">
          Print Code
        </button>
        <a href="/" className="text-blue-500 hover:underline">Return to Home</a>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">Register an Item</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1">Item Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={itemData.name}
            onChange={handleChange}
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
            onChange={handleChange}
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
            onChange={handleChange}
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
            onChange={handleChange}
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
    </div>
  )
}

