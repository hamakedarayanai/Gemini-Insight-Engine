import { GoogleGenAI } from "@google/genai";
import type { SynthesizedResponse } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getPrompt = (query: string) => `
You are an expert research AI assistant. Your task is to process a complex query and return a comprehensive, multi-modal analysis. You must use Google Search grounding to ensure the information is up-to-date and accurate.

The user's query is: "${query}"

Based on this query, perform the following tasks and structure your entire response as a single JSON object. Your entire output must be only the JSON object, enclosed in a JSON markdown block (\`\`\`json ... \`\`\`).

Here is a description of the required JSON structure:
- **synthesis**: (string) A comprehensive summary of the topic, covering key aspects, recent developments, and implications.
- **diagramSVG**: (string) A self-contained SVG string for a diagram or infographic explaining a core concept. It must be valid SVG markup, use a color palette suitable for a dark background (light strokes/fills like '#e5e7eb', '#a78bfa', '#f472b6'), and contain no scripts or external links. The SVG viewBox should be around "0 0 200 100".
- **keyFigures**: (object)
  - **people**: (array of strings) A list of up to 5 key individuals related to the topic.
  - **organizations**: (array of strings) A list of up to 5 influential organizations or companies.
  - **quotes**: (array of strings) A list of up to 3 significant quotes from experts.
- **knowledgeGraph**: (object)
  - **nodes**: (array of objects, 5-10 items) Each object represents a concept and has:
    - **id**: (string) Unique identifier for the node.
    - **label**: (string) The name of the concept.
    - **x**: (number) A suggested x-coordinate for layout (0-100).
    - **y**: (number) A suggested y-coordinate for layout (0-100).
  - **edges**: (array of objects) Each object represents a relationship and has:
    - **from**: (string) The id of the source node.
    - **to**: (string) The id of the target node.
    - **label**: (string) The relationship between the nodes.
`;

export const fetchSynthesizedResponse = async (query: string): Promise<SynthesizedResponse> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: getPrompt(query),
            config: {
                tools: [{ googleSearch: {} }],
            },
        });
        
        let jsonStr = response.text.trim();
        
        // The model might return the JSON inside a markdown block. Extract it.
        const match = jsonStr.match(/```json\n([\s\S]*?)\n```/);
        if (match && match[1]) {
            jsonStr = match[1];
        }

        const parsedJson = JSON.parse(jsonStr);

        const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
        const sources = groundingMetadata?.groundingChunks
            ?.filter((chunk: any) => chunk.web)
            .map((chunk: any) => ({
                title: chunk.web.title,
                uri: chunk.web.uri,
            })) || [];
        
        // Remove duplicate sources
        const uniqueSources = Array.from(new Map(sources.map(item => [item.uri, item])).values());

        return { ...parsedJson, sources: uniqueSources };

    } catch (error) {
        console.error("Error fetching from Gemini API:", error);
        if (error instanceof SyntaxError) {
             throw new Error("Failed to parse the AI's response. The generated JSON was malformed.");
        }
        throw new Error("Failed to get a valid response from the AI. The model may have been unable to generate content for the given query.");
    }
};
