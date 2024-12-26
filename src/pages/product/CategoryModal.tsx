import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface CategoryModalProps {
  open: boolean
  onClose: () => void
  onSave: (data: { name: string; mainCategory: string }) => void
  category?: { id: string; name: string; mainCategory: string } | null
}

export function CategoryModal({ open, onClose, onSave, category }: CategoryModalProps) {
  const [name, setName] = useState('')
  const [mainCategory, setMainCategory] = useState('')

  // Example main categories - in a real app, these would come from your backend
  const mainCategories = ['Electronics', 'Sports', 'Fashion', 'Home & Garden']

  useEffect(() => {
    if (category) {
      setName(category.name)
      setMainCategory(category.mainCategory)
    } else {
      setName('')
      setMainCategory('')
    }
  }, [category])

  const handleSave = () => {
    if (name && mainCategory) {
      onSave({ name, mainCategory })
      setName('')
      setMainCategory('')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {category ? 'Edit Category' : 'Add New Category'}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label htmlFor="mainCategory" className="text-sm font-medium">
              Main Category
            </label>
            <Select
              value={mainCategory}
              onValueChange={setMainCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select main category" />
              </SelectTrigger>
              <SelectContent>
                {mainCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Sub-category Name
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter sub-category name"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={!name || !mainCategory}>
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

