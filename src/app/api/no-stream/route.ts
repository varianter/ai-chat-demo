// ./app/api/chat/route.js
import { OpenAIStream, StreamingTextResponse } from "ai";
import { Configuration, OpenAIApi } from "openai-edge";

const config = new Configuration({
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  baseOptions: {
    headers: {
      "api-key": process.env.AZURE_OPENAI_API_KEY,
    },
  },
  basePath: process.env.AZURE_OPENAI_URL,
  defaultQueryParams: new URLSearchParams({
    "api-version": process.env.AZURE_OPENAI_API_VERSION ?? "",
  }),
});

const openai = new OpenAIApi(config);

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages } = await req.json();
  const response = await openai.createChatCompletion({
    model: "gpt-4",
    stream: false,
    messages,
  });
  return response;
}
