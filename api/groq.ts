export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  try {
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
    }

    const { key, messages, model = "llama3-8b-8192" } = await request.json();

    if (!key) {
      return new Response(JSON.stringify({ error: "Missing API Key" }), { status: 400 });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${key}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 4096,
        top_p: 1,
        stream: false,
        stop: null
      })
    });

    const data = await response.json();
    
    return new Response(JSON.stringify(data), { 
      status: response.status,
      headers: { 'Content-Type': 'application/json' } 
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || "Internal Server Error" }), { status: 500 });
  }
}
