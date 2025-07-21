"use client"

import { useState } from "react"
import { uploadImage } from "@/lib/storage"
import { addFoodLog } from "@/lib/firestore"
import toast from "react-hot-toast"

export default function FoodLogger({ uid }: { uid: string }) {
  const [foodItem, setFoodItem] = useState("")
  const [calories, setCalories] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleSubmit = async () => {
    if (!foodItem || !calories) {
      toast.error("Fill all fields")
      return
    }

    setIsUploading(true)

    try {
      let imageUrl: string | undefined
      if (file) {
        imageUrl = await uploadImage(file, uid)
      }

      await addFoodLog({
        uid,
        foodItem,
        calories: parseInt(calories),
        imageUrl
      })

      toast.success("Food logged!")
      setFoodItem("")
      setCalories("")
      setFile(null)
    } catch (err) {
      toast.error("Error uploading")
      console.error(err)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="p-4 rounded-xl bg-white shadow space-y-4">
      <input
        type="text"
        placeholder="Food item"
        className="w-full p-2 border rounded"
        value={foodItem}
        onChange={(e) => setFoodItem(e.target.value)}
      />
      <input
        type="number"
        placeholder="Calories"
        className="w-full p-2 border rounded"
        value={calories}
        onChange={(e) => setCalories(e.target.value)}
      />
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button
        className="bg-blue-600 text-white p-2 rounded w-full disabled:opacity-50"
        onClick={handleSubmit}
        disabled={isUploading}
      >
        {isUploading ? "Uploading..." : "Log Food"}
      </button>
    </div>
  )
}
