export function normalizeLines(input: string) {
  return input.replace(/\r\n/g, "\n").replace(/\r/g, "\n")
}

export function splitLines(input: string) {
  return normalizeLines(input).split("\n")
}

export async function tryCopyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

export function base64EncodeUtf8(text: string) {
  const bytes = new TextEncoder().encode(text)
  let binary = ""
  for (const b of bytes) binary += String.fromCharCode(b)
  return btoa(binary)
}

export function base64DecodeUtf8(base64: string) {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return new TextDecoder().decode(bytes)
}

