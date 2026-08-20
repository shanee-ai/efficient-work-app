import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        purpose: z.string().min(1),
        recipient: z.string().default(""),
        keyPoints: z.string().default(""),
        tone: z.string().default("Professional"),
        length: z.string().default("Medium"),
        adjustment: z.string().optional(),
        previous: z.string().optional(),
      })
      .parse(input))
  .handler(async ({ data }) => {
    const { streamText } = await import("ai");
    const { getGateway, MODEL } = await import("./ai-gateway.server");
    const gateway = getGateway();

    const base = `Purpose: ${data.purpose}
Recipient: ${data.recipient || "Not specified"}
Key points: ${data.keyPoints || "Not specified"}
Tone: ${data.tone}
Desired length: ${data.length}`;

    const prompt = data.previous
      ? `Rewrite the following email. Instruction: ${data.adjustment ?? "Rewrite it with a fresh angle."}\n\nContext:\n${base}\n\nExisting email:\n${data.previous}`
      : `Write a workplace email.\n\n${base}`;

    const result = streamText({
      model: gateway(MODEL),
      system:
        "You are a professional workplace writing assistant. Return ONLY the email, starting with a line 'Subject: <subject line>', then a blank line, then the email body including greeting and an appropriate closing with a signature placeholder. No commentary, no markdown fences.",
      prompt,
    });
    return { text: await result.text };
  });

export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        title: z.string().default(""),
        participants: z.string().default(""),
        notes: z.string().min(1),
      })
      .parse(input))
  .handler(async ({ data }) => {
    const { streamText } = await import("ai");
    const { getGateway, MODEL, extractJson } = await import("./ai-gateway.server");
    const gateway = getGateway();

    const result = streamText({
      model: gateway(MODEL),
      system:
        "You summarise meeting notes. Never invent decisions, deadlines, people or facts that are not present in the notes. If a section has nothing in the notes, return an empty array. Respond with raw JSON only, no markdown fences. Shape: {\"summary\": string, \"keyPoints\": string[], \"decisions\": string[], \"actionItems\": [{\"task\": string, \"owner\": string, \"deadline\": string}], \"followUps\": string[]}. Use an empty string for unknown owner or deadline.",
      prompt: `Meeting title: ${data.title || "Untitled"}\nParticipants: ${data.participants || "Not specified"}\n\nNotes:\n${data.notes}`,
    });

    return extractJson<{
      summary: string;
      keyPoints: string[];
      decisions: string[];
      actionItems: { task: string; owner: string; deadline: string }[];
      followUps: string[];
    }>(await result.text);
  });

export const planDay = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        tasks: z.array(
          z.object({
            name: z.string(),
            description: z.string().default(""),
            deadline: z.string().default(""),
            priority: z.string().default("Medium"),
            duration: z.string().default(""),
          }),
        ),
      })
      .parse(input))
  .handler(async ({ data }) => {
    const { streamText } = await import("ai");
    const { getGateway, MODEL, extractJson } = await import("./ai-gateway.server");
    const gateway = getGateway();

    const result = streamText({
      model: gateway(MODEL),
      system:
        "You are a workplace planning assistant. Order tasks by urgency, importance, deadlines and estimated duration. Only use the tasks provided. Respond with raw JSON only, no markdown fences. Shape: {\"topPriority\": {\"task\": string, \"reason\": string}, \"schedule\": [{\"time\": string, \"task\": string, \"priority\": \"Urgent\"|\"High\"|\"Medium\"|\"Low\", \"note\": string}], \"advice\": string}. Times should be realistic slots in a working day like \"09:00 - 10:30\".",
      prompt: `Plan my working day from these tasks:\n${data.tasks
        .map(
          (t, i) =>
            `${i + 1}. ${t.name} | description: ${t.description || "-"} | deadline: ${t.deadline || "-"} | priority: ${t.priority} | estimated duration: ${t.duration || "-"}`,
        )
        .join("\n")}`,
    });

    return extractJson<{
      topPriority: { task: string; reason: string };
      schedule: { time: string; task: string; priority: string; note: string }[];
      advice: string;
    }>(await result.text);
  });
