/**
 * End-to-end smoke test for getFieldTypes / getFieldType against configured Blazeo API.
 * Run from appointment-client root: node scripts/verifyFieldTypes.mjs
 */
import {
  applyBlazeoClientConfig,
  blazeoClientConfig,
  getFieldType,
  getFieldTypes,
} from "../dist/index.js";

applyBlazeoClientConfig(blazeoClientConfig);

const connection = {
  baseUrl: blazeoClientConfig.baseUrl,
  consumer: blazeoClientConfig.consumer,
};

console.log("Connection:", connection);

const allRes = await getFieldTypes(connection);
if (!allRes.ok) {
  console.error("getFieldTypes failed:", allRes);
  process.exit(1);
}
console.log("\ngetFieldTypes OK. Sample:", JSON.stringify(allRes.fieldTypes)?.slice(0, 500));

const types = Array.isArray(allRes.fieldTypes) ? allRes.fieldTypes : [];
const firstType = types[0] ?? "Text";

const oneRes = await getFieldType(String(firstType), connection);
if (!oneRes.ok) {
  console.error("getFieldType failed:", oneRes);
  process.exit(1);
}
console.log(`\ngetFieldType("${firstType}") OK. Sample:`, JSON.stringify(oneRes.fieldType)?.slice(0, 500));

const allDefs = await getFieldType(
  "Checkbox, Date, Dropdown, Email, MultilineText, MultiselectList, Number, Phone, RadioButton, Text",
  connection
);
if (!allDefs.ok || !Array.isArray(allDefs.fieldType) || allDefs.fieldType.length < 2) {
  console.error("Comma-separated list should return all definition objects:", allDefs.fieldType);
  process.exit(1);
}
console.log(`\ngetFieldType(full list) → ${allDefs.fieldType.length} definition(s). OK.`);

const returnedType = oneRes.fieldType?.Type ?? oneRes.fieldType?.type;
if (returnedType && String(returnedType).toLowerCase() !== String(firstType).toLowerCase()) {
  console.error(`Expected Type "${firstType}", got "${returnedType}"`);
  process.exit(1);
}
if (Array.isArray(oneRes.fieldType)) {
  console.error("getFieldType must return a single object, not an array");
  process.exit(1);
}

if (oneRes.fieldType == null && allRes.fieldTypes == null) {
  console.error("Both calls returned null — API may have failed silently.");
  process.exit(1);
}

console.log("\nAll field type checks passed.");
