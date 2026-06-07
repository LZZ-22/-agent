async function test() {
  const B = "http://localhost:3001";
  const r = await fetch(`${B}/api/agent`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: "统计一下数据库各个分类有多少条记录" }) }).then((r) => r.json());
  console.log(JSON.stringify(r, null, 2));
}
test().catch((e) => console.error(e));
