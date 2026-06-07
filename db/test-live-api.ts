async function test() {
  const r = await fetch("http://localhost:3000/api/agent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: "你好，用一句话介绍一下你自己" }),
  }).then((r) => r.json());
  console.log("usedMock:", r.usedMock);
  console.log("usedModel:", r.usedModel);
  console.log("answer:", r.answer?.slice(0, 300));
  if (r.answer?.includes("Mock")) console.log("WARNING: Still in mock mode");
  else console.log("SUCCESS: Real DeepSeek response");
}
test().catch((e) => console.error("FAIL:", e.message));
