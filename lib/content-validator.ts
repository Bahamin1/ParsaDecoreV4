import Ajv from "ajv"
import addFormats from "ajv-formats"
import contentSchema from "@/data/content-schema.json"
import type { ContentData } from "./content"

const ajv = new Ajv()
addFormats(ajv)

const validate = ajv.compile(contentSchema)

export function validateContent(data: unknown): data is ContentData {
  const isValid = validate(data)

  if (!isValid) {
    console.error("Content validation errors:", validate.errors)
    return false
  }

  return true
}

export function getValidationErrors(data: unknown) {
  validate(data)
  return validate.errors || []
}
