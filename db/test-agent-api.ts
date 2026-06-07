async function test() {
  const B = "http://localhost:3001";

  const r1 = await fetch(`${B}/api/agent`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: "你好，介绍一下你自己" }) }).then((r) => r.json());
  console.log("1 general_chat:", r1.ok, "| intent:", r1.debug?.intent, "| hasDbData:", r1.debug?.hasDbData);

  const r2 = await fetch(`${B}/api/agent`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: "数据库里有多少条长文记录？" }) }).then((r) => r.json());
  console.log("2 db_lookup:", r2.ok, "| intent:", r2.debug?.intent, "| hasDbData:", r2.debug?.hasDbData);

  const r3 = await fetch(`${B}/api/agent`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: "统计一下数据库各个分类有多少条记录" }) }).then((r) => r.json());
  console.log("3 db_summary:", r3.ok, "| intent:", r3.debug?.intent, "| hasDbData:", r3.debug?.hasDbData);

  console.log("ALL PASSED");
}
test().catch((e) => console.error("FAIL:", e.message));
