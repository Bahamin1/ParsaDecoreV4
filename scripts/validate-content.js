const fs = require("fs")
const path = require("path")
const Ajv = require("ajv")
const addFormats = require("ajv-formats")

// Load schema and content
const schemaPath = path.join(__dirname, "..", "data", "content-schema.json")
const contentPath = path.join(__dirname, "..", "data", "content.json")

const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"))
const content = JSON.parse(fs.readFileSync(contentPath, "utf8"))

// Validate
const ajv = new Ajv()
addFormats(ajv)
const validate = ajv.compile(schema)

const isValid = validate(content)

if (isValid) {
  console.log("✅ Content validation passed!")
  process.exit(0)
} else {
  console.error("❌ Content validation failed:")
  validate.errors.forEach((error) => {
    console.error(`  - ${error.instancePath}: ${error.message}`)
  })
  process.exit(1)
}
