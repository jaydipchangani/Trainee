"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import useProducts from "../hooks/useProducts"

const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { getProduct, updateProduct } = useProducts()
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")

  useEffect(() => {
    const product = getProduct(id!)
    if (product) {
      setName(product.name)
      setPrice(product.price.toString())
      setDescription(product.description)
    }
  }, [id, getProduct])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateProduct(id!, { name, price: Number.parseFloat(price), description })
    navigate("/products")
  }

  return (
    <div className="container">
      <h2 className="mb-4">Edit Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name:
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="price" className="form-label">
            Price:
          </label>
          <input
            type="number"
            className="form-control"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            step="0.01"
            min="0"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description:
          </label>
          <textarea
            className="form-control"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Update Product
        </button>
      </form>
    </div>
  )
}

export default EditProduct

