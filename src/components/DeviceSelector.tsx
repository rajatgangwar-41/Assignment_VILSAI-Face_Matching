import { useEffect } from "react"
import { useAppStore } from "../store"
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select"

export const DeviceSelector: React.FC = () => {
  const devices = useAppStore((state) => state.devices)
  const selectedDeviceId = useAppStore((state) => state.selectedDeviceId)
  const setDevices = useAppStore((state) => state.setDevices)
  const setSelectedDeviceId = useAppStore((state) => state.setSelectedDeviceId)

  useEffect(() => {
    const initDevices = async (): Promise<void> => {
      try {
        // Request camera access to unlock device labels
        const stream: MediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        })

        // Immediately stop the camera; we just needed permission
        stream.getTracks().forEach((track: MediaStreamTrack) => track.stop())

        // List all media devices
        const devs: MediaDeviceInfo[] =
          await navigator.mediaDevices.enumerateDevices()

        // We select only the videoDevices
        const videoDevices: MediaDeviceInfo[] = devs.filter(
          (device: MediaDeviceInfo) =>
            device.kind === "videoinput" && device.deviceId.trim() !== ""
        )
        // Set the enumerated devices
        setDevices(videoDevices)
      } catch (error: unknown) {
        console.error("Failed to initialize video devices:", error)
      }
    }
    initDevices()
  }, [setDevices])

  return (
    <Select value={selectedDeviceId || ""} onValueChange={setSelectedDeviceId}>
      <SelectTrigger>
        {selectedDeviceId
          ? devices.find(
              (device: MediaDeviceInfo) => device.deviceId === selectedDeviceId
            )?.label
          : "Select Camera"}
      </SelectTrigger>

      <SelectContent>
        {devices.map((device: MediaDeviceInfo) => (
          <SelectItem key={device.deviceId} value={device.deviceId}>
            {device.label || `Camera (${device.deviceId.slice(0, 4)})`}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
