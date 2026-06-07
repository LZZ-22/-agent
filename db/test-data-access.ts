import { getCategoryStats, searchProjectData, getRecentRecords } from "../lib/data-access";

async function test() {
  const r1 = await getCategoryStats();
  console.log("getCategoryStats:", r1.ok, "| rows:", r1.rowCount);

  const r2 = await searchProjectData("长文");
  console.log("searchProjectData('长文'):", r2.ok, "| rows:", r2.rowCount);

  const r3 = await getRecentRecords(5);
  console.log("getRecentRecords:", r3.ok, "| rows:", r3.rowCount);
}
test().catch((e) => console.error("FAIL:", e));
