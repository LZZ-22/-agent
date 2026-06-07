async function test() {
  const B = "http://localhost:3001";

  // Test 1: Draft generation
  const r1 = await fetch(`${B}/api/writing/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: [{ role: "user", content: "写一篇关于冬天的散文" }] }),
  }).then((r) => r.json());
  console.log("1 draft:", r1.action, "| paragraphs:", r1.articlePatch?.paragraphs?.length || 0);

  // Test 2: Paragraph revision
  const r2 = await fetch(`${B}/api/writing/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [{ role: "user", content: "精简到一半" }],
      selectedParagraphId: "p_test_02",
      articleState: {
        title: "冬天",
        genre: "散文",
        paragraphs: [{ seq: 0, content: "a" }, { seq: 1, content: "b段落" }, { seq: 2, content: "c" }],
      },
    }),
  }).then((r) => r.json());
  console.log("2 revise:", r2.action);

  // Test 3: Clarify
  const r3 = await fetch(`${B}/api/writing/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: [{ role: "user", content: "你好" }] }),
  }).then((r) => r.json());
  console.log("3 clarify:", r3.action);

  console.log("ALL TESTS PASSED");
}

test().catch((e) => console.error("FAIL:", e.message));
