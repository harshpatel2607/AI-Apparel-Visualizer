import { GoogleGenAI, Modality } from "@google/genai";
import { base64ToParts } from '../utils/fileUtils';

// Helper function to create placement instructions
const getPlacementInstructionText = (position: string, size: string): string => {
    let positionText = '';
    switch (position) {
        case 'front-center':
            positionText = "on the center of the T-shirt's chest.";
            break;
        case 'back-center':
            positionText = "on the center of the T-shirt's back.";
            break;
        case 'front-pocket-left':
            positionText = 'on the left chest area, where a pocket would be.';
            break;
        case 'front-pocket-right':
            positionText = 'on the right chest area, where a pocket would be.';
            break;
        default:
            positionText = 'on the front of the T-shirt, placed attractively.';
    }

    let sizeText = '';
    switch (size) {
        case 'small':
            sizeText = 'The design should be small, like a logo (approximately 4x4 inches).';
            break;
        case 'medium':
            sizeText = 'The design should be a standard medium size (approximately 10x12 inches).';
            break;
        case 'large':
            sizeText = 'The design should be large, covering a significant portion of the printable area.';
            break;
        case 'full-chest':
            sizeText = 'The design should cover the entire front chest or back area, edge-to-edge if appropriate.';
            break;
        default:
            sizeText = 'The design should be sized appropriately for the T-shirt.';
    }

    return `Place the design ${positionText} ${sizeText}`;
};

const generateSingleView = async (
    ai: GoogleGenAI,
    view: 'front' | 'back',
    modelImage: string,
    tshirtImage: string,
    designs: { image: string, position: string, size: string }[]
): Promise<string> => {

    const viewInstruction = view === 'back'
        ? "You MUST generate the back view of the model wearing the T-shirt."
        : "You MUST generate the front view of the model wearing the T-shirt.";

    let designsInstructions = '';
    const designParts: any[] = [];
    designs.forEach((design, index) => {
        if (design.image) {
            designsInstructions += `- **Design ${index + 1}:** ${getPlacementInstructionText(design.position, design.size)}\n`;
            const designImgParts = base64ToParts(design.image);
            designParts.push({ inlineData: { data: designImgParts.data, mimeType: designImgParts.mimeType } });
        }
    });

    const prompt = `Task: Generate a photorealistic image of a model wearing a custom-designed T-shirt.

Inputs:
1.  **Model Image:** A photo of a person.
2.  **T-shirt Image:** A photo of a plain T-shirt (use for color, texture, and style reference).
3.  **Design Image(s):** The artwork to be placed on the T-shirt.

Instructions:
1.  **Determine View:** ${viewInstruction}
2.  **Prepare the Design(s):** Analyze the design image(s). If a design has a solid, non-essential background (e.g., plain white), remove it to isolate the artwork.
3.  **Combine Model and T-shirt:** Superimpose the T-shirt from the T-shirt Image onto the specified view (${view}) of the model from the Model Image. The fit must be natural and realistic.
    **NON-NEGOTIABLE REQUIREMENT:** The model's face, hair, and facial features from the original Model Image MUST be preserved with 100% accuracy if the front view is generated. Do NOT alter, regenerate, or change the person's face. The final image must show the *exact same person* with the *exact same facial expression*. This is the most important instruction. For a back view, the face will not be visible, but maintain the model's general build and hair.
4.  **Place the Design(s):**
    ${designsInstructions}
    - **Crucially, make the design(s) conform realistically to the T-shirt's wrinkles, folds, shadows, and lighting.**
5.  **Finalize Realism:**
    - Use a neutral grey studio background.
6.  **Output:** The final output must be a single, high-quality, combined image. Do not include any text or labels. Just the final picture.`;

    const modelImgParts = base64ToParts(modelImage);
    const tshirtImgParts = base64ToParts(tshirtImage);

    const allParts = [
        { text: prompt },
        { inlineData: { data: modelImgParts.data, mimeType: modelImgParts.mimeType } },
        { inlineData: { data: tshirtImgParts.data, mimeType: tshirtImgParts.mimeType } },
        ...designParts
    ];

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: allParts },
        config: { responseModalities: [Modality.IMAGE] },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
    }
    throw new Error(`The AI did not return an image for the ${view} view.`);
};


export const generateApparelImage = async (
  modelImage: string,
  tshirtImage: string,
  designImage: string,
  design1Position: string,
  design1Size: string,
  designImage2: string | null,
  design2Position: string | null,
  design2Size: string | null
): Promise<string[]> => {
    if (!process.env.API_KEY) {
        throw new Error("API key is not configured. Please set the API_KEY environment variable.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
        const frontPositions = ['front-center', 'front-pocket-left', 'front-pocket-right'];
        const isDesign1Front = frontPositions.includes(design1Position);
        const isDesign1Back = design1Position === 'back-center';
        
        const isDesign2Front = designImage2 && design2Position && frontPositions.includes(design2Position);
        const isDesign2Back = designImage2 && design2Position === 'back-center';

        const needsFrontView = isDesign1Front || isDesign2Front;
        const needsBackView = isDesign1Back || isDesign2Back;
        
        if (needsFrontView && needsBackView) {
             // Generate both front and back views
            const frontDesigns = [];
            if(isDesign1Front) frontDesigns.push({ image: designImage, position: design1Position, size: design1Size });
            if(isDesign2Front && designImage2 && design2Position && design2Size) frontDesigns.push({ image: designImage2, position: design2Position, size: design2Size });

            const backDesigns = [];
            if(isDesign1Back) backDesigns.push({ image: designImage, position: design1Position, size: design1Size });
            if(isDesign2Back && designImage2 && design2Position && design2Size) backDesigns.push({ image: designImage2, position: design2Position, size: design2Size });

            const [frontImage, backImage] = await Promise.all([
                generateSingleView(ai, 'front', modelImage, tshirtImage, frontDesigns),
                generateSingleView(ai, 'back', modelImage, tshirtImage, backDesigns)
            ]);
            return [frontImage, backImage];

        } else {
            // Generate a single view (either front or back)
            const allDesigns = [{ image: designImage, position: design1Position, size: design1Size }];
            if (designImage2 && design2Position && design2Size) {
                allDesigns.push({ image: designImage2, position: design2Position, size: design2Size });
            }
            const view = needsBackView ? 'back' : 'front';
            const resultImage = await generateSingleView(ai, view, modelImage, tshirtImage, allDesigns);
            return [resultImage];
        }

    } catch (error) {
        console.error("Error generating image(s):", error);
        if(error instanceof Error && error.message.includes("400")){
             throw new Error("The request was invalid. Please check your uploaded images and try again.");
        }
        throw new Error("Failed to generate image due to an API error. Please try again later.");
    }
};