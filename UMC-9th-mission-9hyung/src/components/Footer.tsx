import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2025 9hyung's Page. All Rights Reserved.</p>
          <div className={"flex justify-center space-x-4 mt-4"}>
            <Link to={'#'}>Privacy Policy</Link>
            <Link to={'#'}>Terms of Service</Link>
            <Link to={'#'}>Contact</Link>
          </div>
        </div>
      </footer>
  )
}

export default Footer