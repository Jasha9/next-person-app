'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Edit } from 'lucide-react'
import { toast } from "@/hooks/use-toast"

export default function ModifyButton({ userId }: { userId: string }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleModify = async () => {
    try {
      console.log('ModifyButton: Attempting to modify user with ID', userId, formData)
      // Simulate an API call to modify the user
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulated delay
      toast({
        title: "User Modified",
        description: `User with ID ${userId} has been successfully modified.`,
        variant: "default",
      })
      setIsDialogOpen(false) // Close the dialog after success
    } catch (error) {
      console.error('ModifyButton: Error modifying user', error)
      toast({
        title: "Error",
        description: "An error occurred while modifying the user.",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <Button onClick={() => setIsDialogOpen(true)} variant="secondary">
        <Edit className="w-4 h-4 mr-2" />
        Modify
      </Button>

      {isDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h2 className="text-lg font-bold mb-4">Modify User</h2>
            <form>
              <label className="block mb-2">
                Name:
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2 mt-1"
                  placeholder="Enter name"
                />
              </label>
              <label className="block mb-2">
                Email:
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2 mt-1"
                  placeholder="Enter email"
                />
              </label>
              <label className="block mb-2">
                Phone Number:
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2 mt-1"
                  placeholder="Enter phone number"
                />
              </label>
              <div className="flex justify-end space-x-2 mt-4">
                <Button onClick={() => setIsDialogOpen(false)} variant="ghost">
                  Cancel
                </Button>
                <Button onClick={handleModify} variant="default">
                  Save
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}