import { summarize } from "@/lib/summary";
import { SummarizeSchema } from "@/lib/validation";

export const maxDuration = 30;

export async function POST(req: Request): Promise<Response> {
  try {
    const body = await req.json().catch(() => ({}));
    const result = SummarizeSchema.safeParse(body);

    if (!result.success) {
      return new Response(JSON.stringify({ error: "Invalid request: Prompt is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { prompt, provider } = result.data;

    return await summarize(prompt, provider);
  } catch (error) {
    console.error("Error in summarize route:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred while generating the summary" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
