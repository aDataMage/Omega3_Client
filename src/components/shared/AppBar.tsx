import React from 'react'

type Props = {}

const AppBar = (props: Props) => {
  return (
    <div>
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
            <div className="text-white text-lg font-bold">OMEGA 3 Dashboard</div>
            <ul className="flex space-x-4">
                <li><a href="#" className="text-white hover:text-gray-400">Overview</a></li>
                <li><a href="#" className="text-white hover:text-gray-400">Stores</a></li>
                <li><a href="#" className="text-white hover:text-gray-400">Products</a></li>
                <li><a href="#" className="text-white hover:text-gray-400">Orders</a></li>
            </ul>
            </div>
        </nav>
    </div>
  )
}

export default AppBar