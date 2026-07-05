import { getOpenAI, campusFunctions, MCP_URLS, SOURCE_LABELS } from '@/lib/gemini';
import OpenAI from 'openai';

export const runtime = 'nodejs';
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

async function callMcpServer(functionName: string, args: Record<string, string>): Promise<unknown> {
  const urlFn = MCP_URLS[functionName as keyof typeof MCP_URLS];
  if (!urlFn) {
    return { error: `Unknown function: ${functionName}` };
  }

  const url = urlFn(args as never);

  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(8000),
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    if (!res.ok) {
      return { error: `MCP server returned ${res.status}`, url };
    }

    return await res.json();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return {
      error: `Failed to reach MCP server: ${message}`,
      url,
      fallback: true,
    };
  }
}

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query || typeof query !== 'string') {
      return Response.json({ error: 'query field is required' }, { status: 400 });
    }

    const openai = getOpenAI();

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: `You are CampusIQ, a friendly and intelligent campus assistant for an Indian engineering college. 
You help students with library book searches, cafeteria menu queries, campus events, and academic information.
Always be helpful, concise, and accurate. When presenting data, format it clearly using markdown.
Refer to the student warmly. Use Indian context (rupees for prices, Indian food names, Indian exam formats).
If multiple data sources were queried, synthesize the information into a coherent, unified response.`
      },
      {
        role: 'user',
        content: query
      }
    ];

    const allToolsCalled: string[] = [];

    // Make initial call
    let response = await openai.chat.completions.create({
        model: 'openrouter/free',
      messages: messages,
      tools: campusFunctions,
      tool_choice: 'auto',
    });

    let responseMessage = response.choices[0].message;

    // Handle function calling loop
    while (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
      messages.push(responseMessage); // Add assistant's tool call message

      const toolCalls = responseMessage.tool_calls;

      const toolResults = await Promise.all(
        toolCalls.map(async (toolCall) => {
          if (toolCall.type !== 'function') return null;
          allToolsCalled.push(toolCall.function.name);
          const args = JSON.parse(toolCall.function.arguments);
          const mcpResult = await callMcpServer(toolCall.function.name, args);

          return {
            tool_call_id: toolCall.id,
            role: 'tool' as const,
            name: toolCall.function.name,
            content: JSON.stringify(mcpResult)
          } as OpenAI.Chat.ChatCompletionToolMessageParam;
        })
      );

      // Add tool results to messages
      const validToolResults = toolResults.filter((r): r is OpenAI.Chat.ChatCompletionToolMessageParam => r !== null);
      messages.push(...validToolResults);

      // Send results back to model
      response = await openai.chat.completions.create({
        model: 'openrouter/free',
        messages: messages,
        tools: campusFunctions,
        tool_choice: 'auto',
      });

      responseMessage = response.choices[0].message;
    }

    const sources = [...new Set(allToolsCalled)].map(
      (tool) => SOURCE_LABELS[tool] || tool
    );

    return Response.json({
      answer: responseMessage.content,
      toolsCalled: [...new Set(allToolsCalled)],
      sources,
    });
  } catch (err: unknown) {
    console.error('AI Query Error:', err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    return Response.json(
      { error: message, answer: null, toolsCalled: [], sources: [] },
      { status: 500 }
    );
  }
}
