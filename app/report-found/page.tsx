'use client'

import { useState, useRef, useEffect } from 'react'
import { api } from '../services/api'
import Quagga from 'quagga'
import { QrReader } from 'react-qr-reader'
import { FoundReport } from '../types'

export default function ReportFound() {
  const [code, setCode] = useState('')
  const [isScanning, setIsScanning] = useState(false)
  const [scanType, setScanType] = useState<'barcode' | 'qrcode'>('barcode')
  const [isReported, setIsReported] = useState(false)
  const [ownerInfo, setOwnerInfo] = useState<any>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // In a real app, you would get the current user's ID from a global state or context
  const currentUserId = '1' // This is a placeholder. Replace with actual user ID in a real app.

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    api.reportFoundItem({
      itemId: code,
      foundBy: currentUserId,
      foundAt: new Date().toISOString(),
    })
    setIsReported(true)
    if (ownerInfo) {
      api.sendNotification(ownerInfo.owner.id, `Your item "${ownerInfo.item.name}" has been found!`)
    }
  }

  const startScanning = () => {
    if (scanType === 'barcode') {
      Quagga.init(
        {
          inputStream: {
            name: 'Live',
            type: 'LiveStream',
            target: videoRef.current,
          },
          decoder: {
            readers: ['ean_reader', 'code_128_reader', 'code_39_reader'],
          },
        },
        (err) => {
          if (err) {
            console.error('Error initializing Quagga:', err)
            return
          }
          Quagga.start()
          setIsScanning(true)
        }
      )

      Quagga.onDetected((result) => {
        if (result.codeResult.code) {
          setCode(result.codeResult.code)
          stopScanning()
        }
      })
    } else {
      setIsScanning(true)
    }
  }

  const stopScanning = () => {
    if (scanType === 'barcode') {
      Quagga.stop()
    }
    setIsScanning(false)
  }

  useEffect(() => {
    const fetchOwnerInfo = async () => {
      const item = api.getItemByCode(code)
      if (item) {
        const owner = api.getUserById(item.ownerId)
        if (owner) {
          setOwnerInfo({ item, owner })
        }
      }
    }

    if (code) {
      fetchOwnerInfo()
    }
  }, [code])

  if (isReported) {
    return (
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-3xl font-bold mb-6">Item Reported as Found</h1>
        <p className="mb-4">Thank you for reporting the found item!</p>
        <a href="/" className="text-blue-500 hover:underline">Return to Home</a>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">Report Found Item</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="code" className="block mb-1">Item Code</label>
          <input
            type="text"
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Enter code or scan"
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300">
          Submit Report
        </button>
      </form>
      <div className="mt-8 space-y-4">
        <div>
          <label className="block mb-1">Scan Type</label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="barcode"
                checked={scanType === 'barcode'}
                onChange={() => setScanType('barcode')}
                className="mr-2"
              />
              Barcode
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="qrcode"
                checked={scanType === 'qrcode'}
                onChange={() => setScanType('qrcode')}
                className="mr-2"
              />
              QR Code
            </label>
          </div>
        </div>
        {!isScanning ? (
          <button onClick={startScanning} className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300">
            Start {scanType === 'barcode' ? 'Barcode' : 'QR Code'} Scanner
          </button>
        ) : (
          <button onClick={stopScanning} className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-300">
            Stop Scanner
          </button>
        )}
      </div>
      {isScanning && (
        <div className="mt-4">
          {scanType === 'barcode' ? (
            <video ref={videoRef} autoPlay playsInline className="w-full h-64 object-cover" />
          ) : (
            <QrReader
              onResult={(result, error) => {
                if (result) {
                  setCode(result.getText());
                  stopScanning();
                }
                if (error) {
                  console.info(error);
                }
              }}
              constraints={{ facingMode: 'environment' }}
              className="w-full h-64"
            />
          )}
        </div>
      )}
      {ownerInfo && (
        <div className="mt-8 bg-gray-100 p-4 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Owner Information</h2>
          <p><strong>Name:</strong> {ownerInfo.owner.fullName}</p>
          <p><strong>Email:</strong> {ownerInfo.owner.email}</p>
          <p><strong>Grade Level:</strong> {ownerInfo.owner.gradeLevel}</p>
          <p><strong>Section:</strong> {ownerInfo.owner.section}</p>
          <p><strong>Strand:</strong> {ownerInfo.owner.strand}</p>
          <p><strong>Building:</strong> {ownerInfo.owner.building}</p>
          <h3 className="text-xl font-bold mt-4 mb-2">Item Details</h3>
          <p><strong>Name:</strong> {ownerInfo.item.name}</p>
          <p><strong>Description:</strong> {ownerInfo.item.description}</p>
          <p><strong>Category:</strong> {ownerInfo.item.category}</p>
          <h3 className="text-xl font-bold mt-4 mb-2">Item History</h3>
          {ownerInfo.item.history.length > 0 ? (
            <ul className="list-disc list-inside">
              {ownerInfo.item.history.map((report: FoundReport) => (
                <li key={report.id}>
                  Found on {new Date(report.foundAt).toLocaleDateString()} by {report.foundBy}
                </li>
              ))}
            </ul>
          ) : (
            <p>No previous reports for this item.</p>
          )}
        </div>
      )}
    </div>
  )
}

