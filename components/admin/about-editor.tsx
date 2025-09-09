"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageUpload } from "@/components/admin/image-upload"
import { Save, User, Mail, Award } from "lucide-react"
import { toast } from "sonner"

interface AboutData {
  company: {
    name: string
    tagline: string
    description: string
    mission: string
    vision: string
    founded: string
    teamSize: string
    experience: string
  }
  contact: {
    email: string
    phone: string
    address: string
    city: string
    hours: string
    socialMedia: {
      instagram: string
      facebook: string
      linkedin: string
    }
  }
  team: Array<{
    name: string
    role: string
    bio: string
    image: string
  }>
  achievements: Array<{
    title: string
    description: string
    year: string
  }>
}

export function AboutEditor() {
  const [aboutData, setAboutData] = useState<AboutData>({
    company: {
      name: "Parsa Decor",
      tagline: "Interior Design and Decor",
      description: "",
      mission: "",
      vision: "",
      founded: "",
      teamSize: "",
      experience: "",
    },
    contact: {
      email: "",
      phone: "",
      address: "",
      city: "",
      hours: "",
      socialMedia: {
        instagram: "",
        facebook: "",
        linkedin: "",
      },
    },
    team: [],
    achievements: [],
  })

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadAboutData()
  }, [])

  const loadAboutData = async () => {
    try {
      const response = await fetch("/api/admin/content")
      const data = await response.json()
      if (data.about) {
        setAboutData({ ...aboutData, ...data.about })
      }
    } catch (error) {
      toast.error("Failed to load about data")
    } finally {
      setIsLoading(false)
    }
  }

  const saveAboutData = async () => {
    setIsSaving(true)
    try {
      const response = await fetch("/api/admin/content", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ about: aboutData }),
      })

      if (response.ok) {
        toast.success("About section updated successfully!")
      } else {
        throw new Error("Failed to save")
      }
    } catch (error) {
      toast.error("Failed to save about data")
    } finally {
      setIsSaving(false)
    }
  }

  const updateCompany = (field: keyof AboutData["company"], value: string) => {
    setAboutData((prev) => ({
      ...prev,
      company: { ...prev.company, [field]: value },
    }))
  }

  const updateContact = (field: keyof AboutData["contact"], value: string) => {
    setAboutData((prev) => ({
      ...prev,
      contact: { ...prev.contact, [field]: value },
    }))
  }

  const updateSocialMedia = (platform: keyof AboutData["contact"]["socialMedia"], value: string) => {
    setAboutData((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        socialMedia: { ...prev.contact.socialMedia, [platform]: value },
      },
    }))
  }

  const addTeamMember = () => {
    setAboutData((prev) => ({
      ...prev,
      team: [...prev.team, { name: "", role: "", bio: "", image: "" }],
    }))
  }

  const updateTeamMember = (index: number, field: string, value: string) => {
    setAboutData((prev) => ({
      ...prev,
      team: prev.team.map((member, i) => (i === index ? { ...member, [field]: value } : member)),
    }))
  }

  const removeTeamMember = (index: number) => {
    setAboutData((prev) => ({
      ...prev,
      team: prev.team.filter((_, i) => i !== index),
    }))
  }

  const addAchievement = () => {
    setAboutData((prev) => ({
      ...prev,
      achievements: [...prev.achievements, { title: "", description: "", year: "" }],
    }))
  }

  const updateAchievement = (index: number, field: string, value: string) => {
    setAboutData((prev) => ({
      ...prev,
      achievements: prev.achievements.map((achievement, i) =>
        i === index ? { ...achievement, [field]: value } : achievement,
      ),
    }))
  }

  const removeAchievement = (index: number) => {
    setAboutData((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index),
    }))
  }

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading about data...</div>
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">About & Contact Information</h2>
        <Button onClick={saveAboutData} disabled={isSaving} className="bg-[#FF4500] hover:bg-[#E63E00]">
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-[#FF4500]" />
            Company Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Company Name</label>
              <Input
                value={aboutData.company.name}
                onChange={(e) => updateCompany("name", e.target.value)}
                placeholder="Company name"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Tagline</label>
              <Input
                value={aboutData.company.tagline}
                onChange={(e) => updateCompany("tagline", e.target.value)}
                placeholder="Company tagline"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Founded</label>
              <Input
                value={aboutData.company.founded}
                onChange={(e) => updateCompany("founded", e.target.value)}
                placeholder="Year founded"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Years of Experience</label>
              <Input
                value={aboutData.company.experience}
                onChange={(e) => updateCompany("experience", e.target.value)}
                placeholder="e.g., 15+ years"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Company Description</label>
            <Textarea
              value={aboutData.company.description}
              onChange={(e) => updateCompany("description", e.target.value)}
              placeholder="Brief company description"
              rows={3}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Mission Statement</label>
            <Textarea
              value={aboutData.company.mission}
              onChange={(e) => updateCompany("mission", e.target.value)}
              placeholder="Company mission"
              rows={2}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Vision Statement</label>
            <Textarea
              value={aboutData.company.vision}
              onChange={(e) => updateCompany("vision", e.target.value)}
              placeholder="Company vision"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-[#FF4500]" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Email</label>
              <Input
                type="email"
                value={aboutData.contact.email}
                onChange={(e) => updateContact("email", e.target.value)}
                placeholder="contact@parsadecor.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Phone</label>
              <Input
                value={aboutData.contact.phone}
                onChange={(e) => updateContact("phone", e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Address</label>
              <Input
                value={aboutData.contact.address}
                onChange={(e) => updateContact("address", e.target.value)}
                placeholder="Street address"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">City</label>
              <Input
                value={aboutData.contact.city}
                onChange={(e) => updateContact("city", e.target.value)}
                placeholder="City, State, ZIP"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Business Hours</label>
            <Input
              value={aboutData.contact.hours}
              onChange={(e) => updateContact("hours", e.target.value)}
              placeholder="Mon-Fri: 9AM-6PM, Sat: 10AM-4PM"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Social Media</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                value={aboutData.contact.socialMedia.instagram}
                onChange={(e) => updateSocialMedia("instagram", e.target.value)}
                placeholder="Instagram URL"
              />
              <Input
                value={aboutData.contact.socialMedia.facebook}
                onChange={(e) => updateSocialMedia("facebook", e.target.value)}
                placeholder="Facebook URL"
              />
              <Input
                value={aboutData.contact.socialMedia.linkedin}
                onChange={(e) => updateSocialMedia("linkedin", e.target.value)}
                placeholder="LinkedIn URL"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Members */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-[#FF4500]" />
              Team Members
            </CardTitle>
            <Button onClick={addTeamMember} variant="outline">
              Add Team Member
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {aboutData.team.map((member, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Team Member {index + 1}</h4>
                <Button variant="ghost" size="sm" onClick={() => removeTeamMember(index)} className="text-red-500">
                  Remove
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  value={member.name}
                  onChange={(e) => updateTeamMember(index, "name", e.target.value)}
                  placeholder="Full name"
                />
                <Input
                  value={member.role}
                  onChange={(e) => updateTeamMember(index, "role", e.target.value)}
                  placeholder="Job title/role"
                />
              </div>
              <Textarea
                value={member.bio}
                onChange={(e) => updateTeamMember(index, "bio", e.target.value)}
                placeholder="Brief bio"
                rows={2}
              />
              <ImageUpload
                onUpload={(url) => updateTeamMember(index, "image", url)}
                accept="image/*"
                maxSize={2 * 1024 * 1024}
              />
            </div>
          ))}

          {aboutData.team.length === 0 && (
            <div className="text-center py-4 text-gray-500">No team members added yet</div>
          )}
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-[#FF4500]" />
              Achievements & Awards
            </CardTitle>
            <Button onClick={addAchievement} variant="outline">
              Add Achievement
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {aboutData.achievements.map((achievement, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Achievement {index + 1}</h4>
                <Button variant="ghost" size="sm" onClick={() => removeAchievement(index)} className="text-red-500">
                  Remove
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input
                  value={achievement.title}
                  onChange={(e) => updateAchievement(index, "title", e.target.value)}
                  placeholder="Achievement title"
                  className="md:col-span-2"
                />
                <Input
                  value={achievement.year}
                  onChange={(e) => updateAchievement(index, "year", e.target.value)}
                  placeholder="Year"
                />
              </div>
              <Textarea
                value={achievement.description}
                onChange={(e) => updateAchievement(index, "description", e.target.value)}
                placeholder="Achievement description"
                rows={2}
              />
            </div>
          ))}

          {aboutData.achievements.length === 0 && (
            <div className="text-center py-4 text-gray-500">No achievements added yet</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
