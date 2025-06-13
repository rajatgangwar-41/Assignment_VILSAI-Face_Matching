import { create } from "zustand"

interface AppState {
  devices: MediaDeviceInfo[]
  selectedDeviceId: string | null
  avatarImage: string | null
  isVideoReady: boolean
  isVerifyingImages: boolean
  matchResult: string | null
  setDevices: (devices: MediaDeviceInfo[]) => void
  setSelectedDeviceId: (id: string) => void
  setAvatarImage: (image: string) => void
  setIsVideoReady: (ready: boolean) => void
  setIsVerifyingImages: (verifying: boolean) => void
  setMatchResult: (result: string | null) => void
}

export const useAppStore = create<AppState>((set) => ({
  devices: [],
  selectedDeviceId: null,
  avatarImage: null,
  isVideoReady: false,
  isVerifyingImages: false,
  matchResult: null,
  setDevices: (devices) => set({ devices }),
  setSelectedDeviceId: (id) => set({ selectedDeviceId: id }),
  setAvatarImage: (image) => set({ avatarImage: image }),
  setIsVideoReady: (ready) => set({ isVideoReady: ready }),
  setIsVerifyingImages: (verifying) => set({ isVerifyingImages: verifying }),
  setMatchResult: (result) => set({ matchResult: result }),
}))
