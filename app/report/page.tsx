'use client'

import { useState } from 'react'

export default function Report() {
  const [reportType, setReportType] = useState('lost')
  const [barcodeId, setBarcodeId] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the report to your backend
    console.log('Report submitted:', { type: reportType, barcodeId })
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">Report Lost/Found Item</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Report Type</label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="lost"
                checked={reportType === 'lost'}
                onChange={() => setReportType('lost')}
                className="mr-2"
              />
              Lost Item
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="found"
                checked={reportType === 'found'}
                onChange={() => setReportType('found')}
                className="mr-2"
              />
              Found Item
            </label>
          </div>
        </div>
        <div>
          <label htmlFor="barcodeId" className="block mb-1">Barcode ID</label>
          <input
            type="text"
            id="barcodeId"
            value={barcodeId}
            onChange={(e) => setBarcodeId(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Enter barcode ID or scan"
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300">
          Submit Report
        </button>
      </form>
      {/* Placeholder for barcode scanner */}
      <div className="mt-8 p-4 border-2 border-dashed border-gray-300 text-center">
        <p>Barcode Scanner Placeholder</p>
        <p className="text-sm text-gray-500">Integration with camera for scanning barcodes would go here</p>
      </div>
    </div>
  )
}

