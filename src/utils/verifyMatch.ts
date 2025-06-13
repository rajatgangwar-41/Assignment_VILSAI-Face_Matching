import {
  ImageEmbedder,
  FilesetResolver,
  type ImageEmbedderResult,
} from "@mediapipe/tasks-vision"
import {
  VISION_TASK_URL,
  EMBEDDING_MODEL_URL,
  THRESHOLD_VALUE,
} from "@/constants"

// Initialize it once
let embedder: ImageEmbedder | undefined

const initEmbedder = async (): Promise<void> => {
  try {
    // Get the Web ASsembly files needed for vision task.
    const vision = await FilesetResolver.forVisionTasks(VISION_TASK_URL)

    // Get the IMageEmbedder Model to embed the images into vector
    embedder = await ImageEmbedder.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: EMBEDDING_MODEL_URL,
      },
      runningMode: "IMAGE",
    })
  } catch (error) {
    console.error("Failed to initialize MediaPipe ImageEmbedder:", error)
    throw error
  }
}

// Function to embed the image into vectors
const getEmbedding = async (
  image: HTMLImageElement
): Promise<ImageEmbedderResult> => {
  if (!embedder) {
    throw new Error("Embedder is not initialized")
  }
  return await embedder.embed(image)
}

// Functoin to load the images fully before embedding them to vectors.
const loadImage = async (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = src
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`))
  })
}

// Function to verify the face
export const verifyMatch = async (
  profileUrl: string,
  avatarUrl: string
): Promise<boolean> => {
  try {
    if (!embedder) await initEmbedder()

    const [profileImg, avatarImg] = await Promise.all([
      loadImage(profileUrl),
      loadImage(avatarUrl),
    ])

    const [profileEmbedding, avatarEmbedding] = await Promise.all([
      getEmbedding(profileImg),
      getEmbedding(avatarImg),
    ])

    // Main criteria to decide whether the captured face from video matched the profile image or not.
    // cosineSimilarity only compared the direction of the vector and not magnitude.
    const similarity = ImageEmbedder.cosineSimilarity(
      profileEmbedding.embeddings[0],
      avatarEmbedding.embeddings[0]
    )

    console.log("Similarity Score:", similarity)

    return similarity >= THRESHOLD_VALUE
  } catch (error) {
    console.error("Error during face verification:", error)
    return false
  }
}
