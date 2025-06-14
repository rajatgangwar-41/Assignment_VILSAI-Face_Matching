import React from "react"
import { useAppStore } from "../store"
import { Button } from "@/components/ui/button"
import { verifyMatch } from "../utils/verifyMatch"
import { PROFILE_PHOTO_URL } from "@/constants"

export const AvatarPreview: React.FC = () => {
  const avatar = useAppStore((s) => s.avatarImage)
  const matchResult = useAppStore((s) => s.matchResult)
  const isVerifyingImages = useAppStore((s) => s.isVerifyingImages)
  const setMatchResult = useAppStore((s) => s.setMatchResult)
  const setIsVerifyingImages = useAppStore((s) => s.setIsVerifyingImages)

  const handleVerify = async (): Promise<void> => {
    if (!avatar) {
      alert("No avatar to verify.")
      return
    }

    try {
      setIsVerifyingImages(true)
      setMatchResult(null)

      const profileUrl: string = "/profile.png" // Local static image in public folder
      // const profileUrl: string = PROFILE_PHOTO_URL // static image through external link

      // Storing the result of the verifyMatch function
      const isMatch: boolean = await verifyMatch(profileUrl, avatar)

      setMatchResult(isMatch ? "Match Successful!" : "Match Failed")
    } catch (error) {
      console.error("Verification failed:", error)
      setMatchResult("Verification Error")
    } finally {
      setIsVerifyingImages(false)
    }
  }

  if (!avatar) return null

  return (
    <div className="space-y-4">
      <img
        src={avatar}
        alt="Captured Avatar"
        className="w-[300px] h-auto rounded border shadow"
      />

      <Button onClick={handleVerify} disabled={isVerifyingImages}>
        {isVerifyingImages ? "Verifying..." : "Verify Avatar"}
      </Button>

      {/* Loaderr till the verifying is being done. */}
      {isVerifyingImages && (
        <p className="text-gray-500">Comparing Images...</p>
      )}

      {/* Show the result */}
      {matchResult && (
        <p
          className={`text-lg font-semibold ${
            matchResult === "Match Successful!"
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {matchResult}
        </p>
      )}
    </div>
  )
}
