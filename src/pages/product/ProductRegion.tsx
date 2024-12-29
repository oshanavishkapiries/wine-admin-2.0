"use client"

import { useState } from "react"
import { ArrowLeft, Pencil, Trash2, Plus, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, 
         AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, 
         AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useGetMetaQuery } from "@/features/api/metaSlice"
import { toast } from 'sonner'
import { useAddWineRegionMutation, useUpdateWineRegionMutation, 
         useDeleteWineRegionMutation } from '@/features/api/regionSlice'
import { useNavigate } from "react-router-dom"

interface SubRegion {
  _id: string;
  name: string;
}

interface Region {
  _id: string;
  region: string;
  subRegions: SubRegion[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface NewRegion {
  name: string;
  subRegions: string[];
}

// Custom hook for region management
const useRegionManager = () => {
  const [editingRegion, setEditingRegion] = useState<Region | null>(null)
  const [newRegion, setNewRegion] = useState<NewRegion>({ name: '', subRegions: [] })
  const [newSubRegion, setNewSubRegion] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const [updateRegion] = useUpdateWineRegionMutation()
  const [deleteRegion] = useDeleteWineRegionMutation()
  const [addRegion] = useAddWineRegionMutation()

  return {
    editingRegion,
    setEditingRegion,
    newRegion,
    setNewRegion,
    newSubRegion,
    setNewSubRegion,
    isAddDialogOpen,
    setIsAddDialogOpen,
    updateRegion,
    deleteRegion,
    addRegion
  }
}

export default function RegionManager() {
  const navigate = useNavigate()
  const { data: meta, isLoading } = useGetMetaQuery(undefined, {
    pollingInterval: 40000,
    refetchOnMountOrArgChange: true,
  })

  const {
    editingRegion,
    setEditingRegion,
    newRegion,
    setNewRegion,
    newSubRegion,
    setNewSubRegion,
    isAddDialogOpen,
    setIsAddDialogOpen,
    updateRegion,
    deleteRegion,
    addRegion
  } = useRegionManager()

  const handleEdit = (region: Region) => setEditingRegion(region)

  const handleDelete = async (id: string) => {
    try {
      await deleteRegion({ id }).unwrap()
      toast.success('Region deleted successfully')
      setTimeout(() => window.location.reload(), 1500)
    } catch (error) {
      toast.error('Failed to delete region')
    }
  }

  const handleSave = async (updatedRegion: Region) => {
    try {
      await updateRegion({
        id: updatedRegion._id,
        region: updatedRegion.region,
        subRegions: updatedRegion.subRegions.map(sr => sr.name)
      }).unwrap()
      toast.success('Region updated successfully')
      setTimeout(() => window.location.reload(), 1500)
      setEditingRegion(null)
    } catch (error) {
      toast.error('Failed to update region')
    }
  }

  const handleAddNewRegion = async () => {
    try {
      await addRegion({ 
        region: newRegion.name, 
        subRegions: newRegion.subRegions 
      }).unwrap()
      toast.success('Region added successfully')
      setTimeout(() => window.location.reload(), 1500)
      setIsAddDialogOpen(false)
      setNewRegion({ name: '', subRegions: [] })
    } catch (error) {
      toast.error('Failed to add region')
    }
  }

  const handleAddSubRegion = (isNewRegion = false) => {
    if (!newSubRegion.trim()) return
    
    if (isNewRegion) {
      setNewRegion(prev => ({
        ...prev,
        subRegions: [...prev.subRegions, newSubRegion]
      }))
    } else if (editingRegion) {
      setEditingRegion({
        ...editingRegion,
        subRegions: [...editingRegion.subRegions, { _id: Date.now().toString(), name: newSubRegion }]
      })
    }
    setNewSubRegion('')
  }

  const removeSubRegion = (index: number, isNewRegion = false) => {
    if (isNewRegion) {
      setNewRegion(prev => ({
        ...prev,
        subRegions: prev.subRegions.filter((_, i) => i !== index)
      }))
    } else if (editingRegion) {
      setEditingRegion({
        ...editingRegion,
        subRegions: editingRegion.subRegions.filter((_, i) => i !== index)
      })
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  const regions = meta?.data?.wineRegions

  return (
    <div className="w-full p-6">
      <Button className="mb-6" onClick={() => {navigate(-1)}}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="flex justify-between items-center mb-6">
       
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant={"ghost"}>
              <Plus className="h-4 w-4 mr-1" />
              Add Region
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Region</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Region Name</label>
                <Input
                  value={newRegion.name}
                  onChange={(e) => setNewRegion(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Sub Regions</label>
                <div className="flex gap-2">
                  <Input
                    value={newSubRegion}
                    onChange={(e) => setNewSubRegion(e.target.value)}
                    placeholder="Add sub region"
                  />
                  <Button onClick={() => handleAddSubRegion(true)} type="button">Add</Button>
                </div>
                <div className="border rounded-lg p-4 min-h-[100px]">
                  {newRegion?.subRegions?.map((subRegion, index) => (
                    <div key={index} className="flex items-center justify-between mb-2">
                      <span>{subRegion}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSubRegion(index, true)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              <Button 
                className="w-full"
                onClick={handleAddNewRegion}
              >
                Add Region
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {regions?.map((region:Region) => (
          <Card key={region._id} className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-lg">{region.region}</span>
              <div className="space-x-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(region)}
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Region</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Region Name</label>
                        <Input
                          value={editingRegion?.region}
                          onChange={(e) =>
                            setEditingRegion(
                              prev => prev ? { ...prev, region: e.target.value } : null
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Sub Regions</label>
                        <div className="flex gap-2">
                          <Input
                            value={newSubRegion}
                            onChange={(e) => setNewSubRegion(e.target.value)}
                            placeholder="Add sub region"
                          />
                          <Button onClick={() => handleAddSubRegion(false)} type="button">Add</Button>
                        </div>
                        <div className="border rounded-lg p-4 min-h-[100px]">
                          {editingRegion?.subRegions?.map((subRegion, index) => (
                            <div key={index} className="flex items-center justify-between mb-2">
                              <span>{subRegion.name}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeSubRegion(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                      <Button 
                        className="w-full"
                        onClick={() => editingRegion && handleSave(editingRegion)}
                      >
                        Save Changes
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the
                        region and all its sub-regions.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(region._id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

