async function test() {
  const B = "http://localhost:3001";
  const r = await fetch(`${B}/api/evaluation/auto`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      responseContent: "好的，你想写什么类型的文章呢？比如散文、随笔——或者你已经有具体的主题了？",
      userMessage: "我想写一篇文章",
      sceneType: "general_chat",
    }),
  }).then((r) => r.json());
  console.log("overallScore:", r.overallScore);
  console.log("dimensions:", r.dimensionScores?.length, "items");
  console.log("failureTags:", r.failureTags?.length, "items");
  console.log("improvements:", r.improvements?.length, "items");
  if (r.dimensionScores?.[0]) console.log("  first dim:", r.dimensionScores[0].dimensionId, "=", r.dimensionScores[0].score);
  console.log("ALL OK");
}
test().catch((e) => console.error("FAIL:", e.message));
