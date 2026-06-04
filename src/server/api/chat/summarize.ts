import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export async function summarizeResult(
  question: string,
  data: unknown
): Promise<string> {
  try {
    const { text } = await generateText({
      model: google("gemini-2.5-flash"),

      system: `
        You are Tasky AI.

        Your job is to convert raw task-management data into a concise,
        helpful, human-readable response.

        Rules:
        - Only use the data provided.
        - Never invent information.
        - Never fabricate users, tasks, projects, teams, or statuses.
        - If the result is empty, explain that clearly.
        - Keep responses concise and professional.
        - Use bullet points when listing multiple items.
        - Mention counts where appropriate.
        - Explain task status and priority in simple language.
        - When a task is created, updated, or deleted, clearly confirm the action.
        `,
      prompt: `User Question: ${question} Database Result: ${JSON.stringify(data, null, 2)}`
    });

    return text;
  } catch (error) {
    console.error("Error generating AI summary:", error);

    if (Array.isArray(data)) {
      if (data.length === 0) {
        return "No records were found.";
      }

      return `Found ${data.length} record${data.length === 1 ? "" : "s"
        }.`;
    }

    if (data && typeof data === "object") {
      return "Operation completed successfully.";
    }

    return "Unable to generate a summary.";
  }
}