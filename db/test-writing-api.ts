async function test() {
  const base = "http://localhost:3001";

  // Test 1: Draft generation
  const r1 = await fetch(`${base}/api/writing/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [{ role: "user", content: "写一篇散文" }],
    }),
  }).then((r) => r.json());
  console.log("Test 1 (draft):", r1.action, "| debug:", r1._debug?.lastMsg);
  console.log("  hasPatch:", !!r1.articlePatch, "| paragraphs:", r1.articlePatch?.paragraphs?.length);

  // Test 2: Paragraph revision
  const r2 = await fetch(`${base}/api/writing/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [{ role: "user", content: "精简到一半" }],
      selectedParagraphId: "p_test_02",
      articleState: {
        title: "测试文章",
        genre: "散文",
        paragraphs: [
          { seq: 0, content: "第一段" },
          { seq: 1, content: "第二段内容要修改" },
          { seq: 2, content: "第三段" },
        ],
      },
    }),
  }).then((r) => r.json());
  console.log("Test 2 (revise):", r2.action, "| reply:", r2.reply?.slice(0, 50));
  console.log("  hasPatch:", !!r2.articlePatch);
}

test().catch((e) => console.error("ERR:", e.message));
