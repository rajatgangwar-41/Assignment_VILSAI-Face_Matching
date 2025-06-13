import React, { useRef } from "react"
import { useAppStore } from "../store"
import { Button } from "@/components/ui/button"

export const VideoStream: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null)

  const selectedDeviceId = useAppStore((state) => state.selectedDeviceId)
  const setAvatarImage = useAppStore((state) => state.setAvatarImage)
  const isVideoReady = useAppStore((state) => state.isVideoReady)
  const setIsVideoReady = useAppStore((state) => state.setIsVideoReady)

  const startStream = async (): Promise<void> => {
    if (!selectedDeviceId) {
      console.log("Please select a camera first.")
      alert("Please select a camera first.")
      return
    }

    try {
      // Get the stream from the devices for the selected deviceId
      const stream: MediaStream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: selectedDeviceId } },
      })

      // Set the source for the video Elemnet to the videoRef
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        setIsVideoReady(true)
      }
    } catch (error: unknown) {
      setIsVideoReady(false)
      console.error("Error starting camera stream:", error)
      alert(
        "Could not start video. Please check camera permissions or try a different device."
      )
    }
  }

  const captureAvatar = (): void => {
    const video = videoRef.current
    if (!video || !video.srcObject) {
      console.log("Video reference is null")
      alert("Video reference is null")
      return
    }

    // We make a canvas element to draw the captured face
    const canvas: HTMLCanvasElement = document.createElement("canvas")
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // We take the 2d context
    const ctx = canvas.getContext("2d")
    if (!ctx) {
      console.error("Failed to get canvas 2D context")
      alert("Failed to get canvas 2D context")
      return
    }
    // We draw the avatar with same width and height as of the video
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    // We store the image as base64 string so as to store it
    const dataURL: string = canvas.toDataURL("image/png")

    setAvatarImage(dataURL)
  }

  return (
    <div className="space-y-4">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-[300px] h-auto rounded border shadow"
      />
      <div className="flex gap-4">
        <Button onClick={startStream}>Start Video</Button>
        <Button
          onClick={captureAvatar}
          variant="outline"
          disabled={!isVideoReady} // We make the button disabled till the video is not streaming.
        >
          Capture Avatar
        </Button>
      </div>
    </div>
  )
}
