import { DeviceSelector } from "./components/DeviceSelector"
import { VideoStream } from "./components/VideoStream"
import { AvatarPreview } from "./components/AvatarPreview"

const App: React.FC = () => {
  return (
    <div className="p-10 space-y-6 max-w-5xl mx-auto flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold">
        VILS AI Task: Face Match Verification
      </h1>
      <DeviceSelector />
      <VideoStream />
      <AvatarPreview />
    </div>
  )
}

export default App
