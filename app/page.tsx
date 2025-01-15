import Link from 'next/link'

export default function Home() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-8">Welcome to the Lost and Found System</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Link href="/register" className="bg-blue-500 text-white p-6 rounded-lg shadow-md hover:bg-blue-600 transition duration-300">
          <h2 className="text-2xl font-semibold mb-2">Register an Item</h2>
          <p>Add your belongings to the system and generate unique barcodes.</p>
        </Link>
        <Link href="/report-found" className="bg-green-500 text-white p-6 rounded-lg shadow-md hover:bg-green-600 transition duration-300">
          <h2 className="text-2xl font-semibold mb-2">Report Found Item</h2>
          <p>Scan a found item's barcode or manually enter the ID.</p>
        </Link>
      </div>
    </div>
  )
}

