/**
 * Per-tool SEO data: custom meta descriptions, keywords, FAQs, related tools, how-to steps.
 * This file powers rich SEO content, FAQPage schema, and internal linking on every tool page.
 */

export interface ToolSEOData {
  metaDescription: string
  keywords: string[]
  howToSteps: string[]
  features: string[]
  whyUse: string[]
  faqs: { question: string; answer: string }[]
  relatedSlugs: string[]
}

// ─── Helper: default data generator ─────────────────────────────────────────
function defaultSEO(title: string, category: string): ToolSEOData {
  return {
    metaDescription: `Use our free ${title} tool online. Fast, secure, and works entirely in your browser. No signup required.`,
    keywords: [title.toLowerCase(), `online ${title.toLowerCase()}`, `free ${title.toLowerCase()}`, category.toLowerCase(), "toolbox"],
    howToSteps: [
      `Open the ${title} tool on ToolBox.`,
      "Provide your input using the main interface.",
      "The tool processes everything securely in your browser.",
      "Review the results and download or copy your output.",
    ],
    features: [
      "Works entirely in your browser — no data uploaded to servers",
      "Completely free with no signup required",
      "Fast, instant processing",
      "Mobile-friendly and responsive design",
    ],
    whyUse: [
      "Zero cost — no subscriptions or hidden fees",
      "Privacy-first — your data never leaves your device",
      "No installation needed — works on any modern browser",
      "Professional-quality results in seconds",
    ],
    faqs: [
      { question: `Is ${title} free to use?`, answer: `Yes, ${title} is completely free. There are no hidden charges, subscriptions, or signup requirements.` },
      { question: `Is my data safe?`, answer: `Absolutely. All processing happens directly in your browser. Your files and data are never uploaded to any server.` },
      { question: `Do I need to create an account?`, answer: `No. You can use ${title} instantly without creating an account or providing any personal information.` },
      { question: `Does it work on mobile?`, answer: `Yes. ${title} is fully responsive and works on smartphones, tablets, and desktop computers.` },
      { question: `What browsers are supported?`, answer: `${title} works on all modern browsers including Chrome, Firefox, Safari, and Edge.` },
    ],
    relatedSlugs: [],
  }
}

// ─── Tool-specific SEO data ─────────────────────────────────────────────────
export const TOOL_SEO: Record<string, ToolSEOData> = {
  // ═══ PDF TOOLS ═══
  "image-to-pdf": {
    metaDescription: "Convert JPG, PNG, and WebP images to PDF online for free. Drag to reorder, set page size, orientation, and margins. Fast, private, no signup required.",
    keywords: ["image to pdf", "jpg to pdf", "png to pdf", "webp to pdf", "convert images to pdf", "photo to pdf", "image to pdf converter", "free pdf converter"],
    howToSteps: [
      "Upload your JPG, PNG, or WebP images using drag-and-drop or the file browser.",
      "Reorder images by dragging them into your desired sequence.",
      "Choose page size (A4, Letter, or Fit to Image), orientation, and margins.",
      "Click 'Create PDF' and wait for the progress bar to complete.",
      "Download your high-quality PDF file.",
    ],
    features: [
      "Supports JPG, PNG, and WebP image formats",
      "Drag-and-drop reordering for perfect page sequence",
      "Page size options: A4, Letter, or Fit to Image",
      "Orientation control: Auto, Portrait, or Landscape",
      "Adjustable margins: None, Small, Medium, Large",
      "Preserves original image resolution for high-quality output",
      "Real-time progress bar during PDF generation",
    ],
    whyUse: [
      "Convert multiple images into a single professional PDF document",
      "Perfect for creating photo albums, portfolios, or document scans",
      "All processing happens in your browser — files never leave your device",
      "No watermarks, no file size limits, no signup required",
    ],
    faqs: [
      { question: "Is Image to PDF free?", answer: "Yes, our Image to PDF converter is 100% free with no hidden charges or watermarks." },
      { question: "What image formats are supported?", answer: "We support JPG/JPEG, PNG, and WebP image formats. WebP images are automatically converted for maximum PDF compatibility." },
      { question: "Can I convert multiple images to PDF?", answer: "Yes! You can upload and arrange multiple images. Drag and drop to reorder them before generating your PDF." },
      { question: "Are my files secure?", answer: "Completely secure. All image processing happens locally in your browser. Your files are never uploaded to any server." },
      { question: "Can I set the page size?", answer: "Yes. Choose from A4, US Letter, or 'Fit to Image' which uses the original image dimensions as the page size." },
      { question: "Is there a file size limit?", answer: "No hard limit. Since processing happens in your browser, it depends on your device's memory. Most devices handle files up to 100MB easily." },
    ],
    relatedSlugs: ["pdf-to-image", "pdf-merger", "pdf-compressor", "image-compressor", "image-resizer"],
  },
  "pdf-to-image": {
    metaDescription: "Convert PDF pages to high-quality PNG or JPG images online for free. Select specific pages, choose quality, and download all as ZIP. No signup needed.",
    keywords: ["pdf to image", "pdf to png", "pdf to jpg", "convert pdf to image", "extract images from pdf", "pdf converter", "free pdf to image"],
    howToSteps: [
      "Upload your PDF file using drag-and-drop or the file browser.",
      "Select quality (Low, Medium, or High) and output format (PNG or JPG).",
      "Choose to convert all pages or specify custom page ranges.",
      "Click 'Convert to Images' and watch the progress bar.",
      "Download individual page images or all pages as a ZIP file.",
    ],
    features: [
      "Convert PDF pages to PNG (lossless) or JPG (smaller files)",
      "Three quality presets: Low (1x), Medium (2x), High (3x)",
      "Select specific pages using ranges like '1,3,5-8'",
      "Download all extracted images as a single ZIP file",
      "Responsive grid preview of all converted pages",
    ],
    whyUse: [
      "Extract high-quality images from PDF presentations or documents",
      "Perfect for sharing PDF content on social media as images",
      "Privacy-first — your PDF never leaves your browser",
      "No registration, no watermarks, completely free",
    ],
    faqs: [
      { question: "Is PDF to Image free?", answer: "Yes, completely free. Convert unlimited pages with no watermarks or signup required." },
      { question: "What output formats are available?", answer: "You can convert PDF pages to PNG (lossless quality) or JPG (smaller file size)." },
      { question: "Can I select specific pages?", answer: "Yes. Choose 'Select Pages' and enter page numbers like '1,3,5-8' to convert only the pages you need." },
      { question: "Can I download all images at once?", answer: "Yes! Click 'Download All as ZIP' to get all converted page images in a single ZIP file." },
      { question: "Are my PDF files secure?", answer: "Absolutely. All conversion happens locally in your browser. Your files are never uploaded to any server." },
      { question: "What quality should I choose?", answer: "Medium (2x) is recommended for most uses. Choose High (3x) for print-quality images, or Low (1x) for fast, small files." },
    ],
    relatedSlugs: ["image-to-pdf", "pdf-image-extractor", "pdf-merger", "pdf-splitter", "image-compressor"],
  },
  "pdf-merger": {
    metaDescription: "Merge multiple PDF files into one document online for free. Drag to reorder, preview, and download. Fast, secure, no signup required.",
    keywords: ["merge pdf", "combine pdf", "join pdf", "pdf merger", "merge pdf online", "combine pdf files", "free pdf merger"],
    howToSteps: [
      "Upload your first PDF file using drag-and-drop or the file browser.",
      "Add more PDF files — they appear in the sequence list.",
      "Reorder PDFs using the up/down arrows to set the desired order.",
      "Click 'Merge PDFs' to combine them into a single document.",
      "Download your merged PDF file.",
    ],
    features: [
      "Merge unlimited PDF files into one document",
      "Drag-and-reorder files before merging",
      "Preview merged result before downloading",
      "Maintains original formatting and quality",
      "Works entirely in your browser for maximum privacy",
    ],
    whyUse: [
      "Combine multiple reports, invoices, or documents into one PDF",
      "Perfect for assembling application packages or portfolios",
      "No file size limits or page restrictions",
      "Completely free with no watermarks",
    ],
    faqs: [
      { question: "Is PDF Merger free?", answer: "Yes, our PDF merger is completely free with no limits on file count or size." },
      { question: "Can I reorder the PDFs before merging?", answer: "Yes. Use the arrow buttons to rearrange the order of your PDF files before merging." },
      { question: "Is there a limit on how many PDFs I can merge?", answer: "No hard limit. You can merge as many PDFs as your browser's memory allows." },
      { question: "Will the quality be preserved?", answer: "Yes. The merger copies pages exactly as they are, preserving all formatting, images, and text." },
      { question: "Are my files secure?", answer: "Completely. All merging happens in your browser. Files are never uploaded to a server." },
    ],
    relatedSlugs: ["pdf-splitter", "pdf-compressor", "pdf-page-extractor", "image-to-pdf", "pdf-rotator"],
  },
  "pdf-splitter": {
    metaDescription: "Split PDF files by page range online for free. Extract specific pages from any PDF document. Secure, browser-based, no signup required.",
    keywords: ["split pdf", "pdf splitter", "extract pdf pages", "split pdf online", "separate pdf pages", "free pdf splitter"],
    howToSteps: [
      "Upload your PDF file.",
      "Set the start and end page numbers for the range you want to extract.",
      "Click 'Extract Pages' to create a new PDF with the selected pages.",
      "Preview the result and download the extracted document.",
    ],
    features: [
      "Split PDFs by custom page ranges",
      "Preview both original and extracted documents",
      "Preserves original quality and formatting",
      "Fast client-side processing",
    ],
    whyUse: [
      "Extract specific chapters or sections from large documents",
      "Share only relevant pages instead of entire documents",
      "Remove unwanted pages from PDF files",
      "Completely free and private",
    ],
    faqs: [
      { question: "Is PDF Splitter free?", answer: "Yes, completely free. Split unlimited PDFs with no watermarks." },
      { question: "Can I extract non-consecutive pages?", answer: "The splitter extracts a continuous range. For non-consecutive pages, use our PDF Page Extractor tool." },
      { question: "Will splitting reduce quality?", answer: "No. Pages are copied exactly as they are, preserving all content and formatting." },
      { question: "Are encrypted PDFs supported?", answer: "Lightly encrypted PDFs may work, but heavily encrypted files require the password first." },
      { question: "Are my files secure?", answer: "Yes. Everything is processed in your browser. No files are uploaded to any server." },
    ],
    relatedSlugs: ["pdf-merger", "pdf-page-extractor", "pdf-compressor", "pdf-to-image", "pdf-rotator"],
  },
  "pdf-compressor": {
    metaDescription: "Compress PDF files online for free. Reduce PDF file size while maintaining readable quality. Fast, secure, browser-based compression.",
    keywords: ["compress pdf", "pdf compressor", "reduce pdf size", "shrink pdf", "compress pdf online", "free pdf compressor", "pdf optimizer"],
    howToSteps: [
      "Upload your PDF file using drag-and-drop or file browser.",
      "Click 'Compress Document' to optimize the PDF structure.",
      "Review the compression results showing original and new file sizes.",
      "Download the compressed PDF file.",
    ],
    features: [
      "Instant PDF structure optimization",
      "Shows original vs compressed file size comparison",
      "Maintains readable document quality",
      "Uses object stream compression for smaller output",
    ],
    whyUse: [
      "Reduce PDF file size for email attachments",
      "Optimize PDFs for web download and faster loading",
      "Save storage space on your devices",
      "Free alternative to paid PDF compression services",
    ],
    faqs: [
      { question: "How much can it compress?", answer: "Compression varies by PDF content. Text-heavy PDFs typically compress 10-40%. Image-heavy PDFs may see less reduction." },
      { question: "Will compression reduce quality?", answer: "The compressor optimizes PDF structure without altering images. Document readability is fully preserved." },
      { question: "Is PDF Compressor free?", answer: "Yes, completely free with no file size limits or watermarks." },
      { question: "Are my files secure?", answer: "Absolutely. Compression happens entirely in your browser. Files never touch our servers." },
      { question: "Can I compress encrypted PDFs?", answer: "Lightly protected PDFs can be compressed. Heavily encrypted files may require the password first." },
    ],
    relatedSlugs: ["pdf-merger", "pdf-splitter", "image-compressor", "pdf-protect", "image-to-pdf"],
  },
  "pdf-page-extractor": {
    metaDescription: "Extract specific pages from a PDF online for free. Select individual pages or ranges like 1,3,5-8. Secure browser processing, no signup.",
    keywords: ["extract pdf pages", "pdf page extractor", "remove pages from pdf", "select pdf pages", "pdf page selector"],
    howToSteps: [
      "Upload your PDF file.",
      "Enter the page numbers you want to extract (e.g., 1,3,5-8).",
      "Click 'Extract Pages' to create a new PDF.",
      "Download the extracted document.",
    ],
    features: ["Select individual pages or ranges", "Comma-separated and range syntax support", "Preview extracted results", "Preserves original quality"],
    whyUse: ["Extract specific pages without installing software", "Create custom documents from existing PDFs", "Free, private, and instant"],
    faqs: [
      { question: "What page format can I use?", answer: "Use comma-separated numbers (1,3,5) or ranges (5-8), or combine them (1,3,5-8,12)." },
      { question: "Is it free?", answer: "Yes, completely free with no limits." },
      { question: "Are my files safe?", answer: "Yes. Processing happens in your browser." },
      { question: "Can I extract non-consecutive pages?", answer: "Yes! Enter pages like 1,3,7,12 to extract only those specific pages." },
      { question: "Will the extracted PDF keep formatting?", answer: "Yes, pages are copied exactly with all formatting preserved." },
    ],
    relatedSlugs: ["pdf-splitter", "pdf-merger", "pdf-rotator", "pdf-to-image", "pdf-compressor"],
  },
  "pdf-rotator": {
    metaDescription: "Rotate PDF pages online for free. Rotate all or selected pages by 90°, 180°, or 270°. Secure browser processing, no signup required.",
    keywords: ["rotate pdf", "pdf rotator", "rotate pdf pages", "rotate pdf online", "pdf rotation tool"],
    howToSteps: ["Upload your PDF file.", "Choose the rotation angle (90°, 180°, or 270°).", "Select all pages or specific pages to rotate.", "Click 'Rotate PDF' and download the result."],
    features: ["Rotate by 90°, 180°, or 270°", "Rotate all pages or select specific ones", "Preview rotated result", "Maintains original quality"],
    whyUse: ["Fix wrongly oriented scanned documents", "Rotate landscape pages to portrait or vice versa", "Free and private browser-based tool"],
    faqs: [
      { question: "Can I rotate specific pages only?", answer: "Yes! Select 'Select Pages' and enter page numbers like 1,3,5-8 to rotate only those pages." },
      { question: "Is it free?", answer: "Yes, completely free with no watermarks." },
      { question: "Are my files secure?", answer: "Yes. All processing happens in your browser." },
      { question: "What rotation angles are supported?", answer: "You can rotate pages by 90° clockwise, 180°, or 90° counter-clockwise (270°)." },
      { question: "Will it change the PDF quality?", answer: "No. Rotation only changes the page orientation metadata without re-encoding content." },
    ],
    relatedSlugs: ["pdf-merger", "pdf-splitter", "pdf-page-extractor", "pdf-watermark", "pdf-compressor"],
  },
  "pdf-watermark": {
    metaDescription: "Add text watermarks to PDF files online for free. Customize font size, opacity, color, and position. Secure, browser-based, no signup needed.",
    keywords: ["pdf watermark", "add watermark to pdf", "watermark pdf online", "pdf watermark tool", "text watermark pdf"],
    howToSteps: ["Upload your PDF file.", "Enter your watermark text (e.g., CONFIDENTIAL).", "Adjust font size, opacity, color, and position.", "Click 'Add Watermark' and download the result."],
    features: ["Custom watermark text", "Adjustable opacity and font size", "Color picker for watermark color", "6 position options including diagonal"],
    whyUse: ["Protect confidential documents", "Brand your PDF files", "Mark drafts to prevent unauthorized use", "Free alternative to paid watermarking tools"],
    faqs: [
      { question: "Can I customize the watermark text?", answer: "Yes! Enter any text and adjust font size, opacity, color, and position." },
      { question: "Is it free?", answer: "Yes, completely free with no limits." },
      { question: "Can I make the watermark semi-transparent?", answer: "Yes. Use the opacity slider to set transparency from 5% to 80%." },
      { question: "What positions are available?", answer: "Diagonal, Center, Top Left, Top Right, Bottom Left, and Bottom Right." },
      { question: "Are my files secure?", answer: "Yes. All processing happens in your browser." },
    ],
    relatedSlugs: ["pdf-protect", "pdf-merger", "pdf-compressor", "image-watermark-tool", "pdf-rotator"],
  },
  "pdf-image-extractor": {
    metaDescription: "Extract images from PDF pages online for free. Get high-quality PNG images from every page and download as ZIP. No signup required.",
    keywords: ["extract images from pdf", "pdf image extractor", "pdf to png", "get images from pdf", "extract pdf images"],
    howToSteps: ["Upload your PDF file.", "Click 'Extract All Page Images' to render each page.", "Preview extracted images in the grid.", "Download individual images or all as ZIP."],
    features: ["Extract every page as a high-quality PNG", "Preview grid layout", "Individual or bulk ZIP download", "Progress bar during extraction"],
    whyUse: ["Extract visuals from PDF presentations", "Convert PDF pages to shareable images", "Free and private — no file uploads to servers"],
    faqs: [
      { question: "What format are the extracted images?", answer: "Images are extracted as high-quality PNG files at 2x resolution." },
      { question: "Can I download all images at once?", answer: "Yes! Use 'Download All as ZIP' to get every page image in a single file." },
      { question: "Is it free?", answer: "Yes, completely free." },
      { question: "Are my PDF files secure?", answer: "Yes. All extraction happens in your browser." },
      { question: "What's the difference from PDF to Image?", answer: "This tool focuses on extracting all pages as images in bulk. PDF to Image offers more options like quality presets and format selection." },
    ],
    relatedSlugs: ["pdf-to-image", "image-to-pdf", "pdf-merger", "image-compressor", "pdf-metadata-viewer"],
  },
  "pdf-metadata-viewer": {
    metaDescription: "View PDF metadata online for free. See title, author, creation date, page count, and file size of any PDF document. No signup required.",
    keywords: ["pdf metadata", "pdf metadata viewer", "pdf info", "pdf properties", "view pdf metadata", "pdf details"],
    howToSteps: ["Upload your PDF file.", "Instantly view metadata: title, author, dates, page count, file size.", "Use the information for document management or verification."],
    features: ["Shows title, author, subject, creator, producer", "Displays creation and modification dates", "Shows page count and file size", "PDF preview alongside metadata"],
    whyUse: ["Quickly check PDF properties without opening in a reader", "Verify document authenticity and authorship", "Check page count and file size before sharing"],
    faqs: [
      { question: "What metadata can I see?", answer: "Title, author, subject, creator, producer, creation date, modification date, page count, and file size." },
      { question: "Is it free?", answer: "Yes, completely free." },
      { question: "Are my files secure?", answer: "Yes. The PDF is read entirely in your browser." },
      { question: "Can I edit the metadata?", answer: "This tool is read-only. It displays metadata but doesn't modify it." },
      { question: "What if my PDF has no metadata?", answer: "Fields without metadata will show a dash (—). Not all PDFs contain complete metadata." },
    ],
    relatedSlugs: ["pdf-compressor", "pdf-protect", "pdf-page-extractor", "pdf-merger", "image-metadata-viewer"],
  },
  "pdf-protect": {
    metaDescription: "Add or remove password protection from PDF files online for free. Encrypt PDFs with user and owner passwords. Secure browser processing.",
    keywords: ["protect pdf", "pdf password", "encrypt pdf", "lock pdf", "password protect pdf", "remove pdf password", "pdf security"],
    howToSteps: ["Upload your PDF file.", "Choose 'Protect' to add a password or 'Remove' to try removing protection.", "Enter user and optional owner passwords.", "Click 'Encrypt PDF' and download your protected file."],
    features: ["Add user and owner password encryption", "Remove light PDF protection", "Permission controls for printing, copying, modifying", "Preview protected result"],
    whyUse: ["Secure confidential PDF documents with passwords", "Control who can print or copy your PDFs", "Free alternative to Adobe Acrobat password protection", "Remove passwords from lightly protected PDFs"],
    faqs: [
      { question: "Can I set different user and owner passwords?", answer: "Yes. The user password opens the PDF, while the owner password grants full editing permissions." },
      { question: "Can I remove any PDF password?", answer: "This tool can remove light protection. Heavily encrypted PDFs may require the original password." },
      { question: "Is it free?", answer: "Yes, completely free." },
      { question: "Are my passwords secure?", answer: "Yes. Encryption happens in your browser. Passwords are never transmitted anywhere." },
      { question: "What permissions can I control?", answer: "You can restrict printing, copying, modifying, and annotating while allowing form filling." },
    ],
    relatedSlugs: ["pdf-watermark", "pdf-compressor", "pdf-metadata-viewer", "pdf-merger", "password-generator"],
  },

  // ═══ TEXT TOOLS ═══
  "word-counter": {
    metaDescription: "Count words, characters, sentences, and paragraphs instantly. Free online word counter with real-time statistics. No signup required.",
    keywords: ["word counter", "character counter", "word count", "text counter", "paragraph counter", "sentence counter", "free word counter"],
    howToSteps: ["Paste or type your text into the input area.", "View real-time word, character, sentence, and paragraph counts.", "Use the statistics for your writing needs."],
    features: ["Real-time word and character counting", "Sentence and paragraph detection", "Clean, distraction-free interface", "Works offline in your browser"],
    whyUse: ["Check essay or article word counts", "Meet character limits for social media posts", "Count paragraphs for academic formatting", "Instant results with no signup"],
    faqs: [
      { question: "How accurate is the word count?", answer: "Very accurate. We count words separated by spaces, handling punctuation and special characters correctly." },
      { question: "Does it count spaces?", answer: "Character count includes spaces. We also show character count without spaces for platforms that exclude them." },
      { question: "Is there a text length limit?", answer: "No practical limit. The counter handles texts of any length." },
      { question: "Is it free?", answer: "Yes, completely free with no signup required." },
      { question: "Does it work offline?", answer: "Yes. Once the page loads, counting works without an internet connection." },
    ],
    relatedSlugs: ["line-counter", "text-cleaner", "case-converter", "capitalize-text", "lorem-ipsum-generator"],
  },
  "case-converter": {
    metaDescription: "Convert text to uppercase, lowercase, title case, sentence case, and more. Free online case converter tool. No signup required.",
    keywords: ["case converter", "text case converter", "uppercase converter", "lowercase converter", "title case", "sentence case"],
    howToSteps: ["Paste your text into the input area.", "Select the case format you want.", "Copy the converted result."],
    features: ["Multiple case options: upper, lower, title, sentence", "Instant conversion", "One-click copy to clipboard"],
    whyUse: ["Quickly fix text casing for documents", "Convert headings to title case", "Standardize text formatting"],
    faqs: [
      { question: "What case options are available?", answer: "Uppercase, lowercase, title case, sentence case, and more." },
      { question: "Is it free?", answer: "Yes, completely free." },
      { question: "Can I convert long texts?", answer: "Yes, there's no practical text length limit." },
      { question: "Does it handle special characters?", answer: "Yes. Special characters and numbers are preserved during conversion." },
      { question: "Is my text stored?", answer: "No. All processing happens in your browser." },
    ],
    relatedSlugs: ["capitalize-text", "text-cleaner", "word-counter", "text-reverser", "text-sorter"],
  },

  // ═══ DEVELOPER TOOLS ═══
  "json-formatter": {
    metaDescription: "Format and beautify JSON data online for free. Pretty-print JSON with syntax highlighting and error detection. No signup required.",
    keywords: ["json formatter", "json beautifier", "format json", "pretty print json", "json viewer", "json prettifier"],
    howToSteps: ["Paste your JSON data into the input area.", "The tool automatically formats and validates your JSON.", "Copy the formatted output or fix any detected errors."],
    features: ["Auto-formatting with proper indentation", "Syntax error detection with helpful messages", "Clean pretty-printed output", "One-click copy"],
    whyUse: ["Debug API responses quickly", "Clean up minified JSON for readability", "Validate JSON structure before using in code"],
    faqs: [
      { question: "Does it validate JSON?", answer: "Yes. Invalid JSON is detected and error messages help you fix syntax issues." },
      { question: "Is it free?", answer: "Yes, completely free." },
      { question: "Can it handle large JSON files?", answer: "Yes. Processing happens in your browser with no size limits." },
      { question: "Is my data secure?", answer: "Yes. JSON is processed locally in your browser." },
      { question: "Does it support nested JSON?", answer: "Yes. Deeply nested structures are formatted with proper indentation." },
    ],
    relatedSlugs: ["json-validator", "base64-encoder", "url-encoder", "jwt-decoder", "regex-tester"],
  },
  "json-validator": {
    metaDescription: "Validate JSON syntax and structure online for free. Instantly find errors in your JSON data with clear error messages. No signup required.",
    keywords: ["json validator", "validate json", "json syntax checker", "json lint", "json error checker"],
    howToSteps: ["Paste your JSON into the input.", "The validator instantly checks for syntax errors.", "Fix any reported issues using the error messages."],
    features: ["Instant JSON syntax validation", "Clear error messages with line numbers", "Handles large JSON structures"],
    whyUse: ["Quickly validate API payloads", "Debug JSON configuration files", "Ensure data integrity before processing"],
    faqs: [
      { question: "What errors does it detect?", answer: "Missing brackets, trailing commas, invalid characters, unquoted keys, and other JSON syntax issues." },
      { question: "Is it free?", answer: "Yes, completely free." },
      { question: "Is my data secure?", answer: "Yes. Validation happens in your browser." },
      { question: "Can it validate large JSON?", answer: "Yes. There are no size restrictions." },
      { question: "Does it auto-fix errors?", answer: "It reports errors with clear messages so you can fix them manually." },
    ],
    relatedSlugs: ["json-formatter", "regex-tester", "base64-encoder", "url-encoder", "jwt-decoder"],
  },

  // ═══ SECURITY TOOLS ═══
  "password-generator": {
    metaDescription: "Generate secure, random passwords with custom length and complexity. Free online password generator with no signup required.",
    keywords: ["password generator", "random password", "secure password", "strong password generator", "free password generator"],
    howToSteps: ["Set your desired password length.", "Choose complexity options (uppercase, numbers, symbols).", "Click generate to create a secure password.", "Copy the password to your clipboard."],
    features: ["Custom password length", "Include/exclude uppercase, numbers, symbols", "Cryptographically random generation", "One-click copy to clipboard"],
    whyUse: ["Create strong passwords for online accounts", "Generate unique passwords for each service", "Ensure password meets complexity requirements"],
    faqs: [
      { question: "How secure are the generated passwords?", answer: "Passwords are generated using cryptographically secure randomness in your browser." },
      { question: "Is it free?", answer: "Yes, completely free." },
      { question: "Are passwords stored?", answer: "No. Passwords are generated locally and never transmitted or stored." },
      { question: "What's a good password length?", answer: "We recommend at least 16 characters with a mix of uppercase, lowercase, numbers, and symbols." },
      { question: "Can I customize which characters to include?", answer: "Yes. Toggle uppercase letters, numbers, and special symbols on or off." },
    ],
    relatedSlugs: ["hash-generator", "uuid-generator", "base64-encoder", "jwt-decoder", "qr-code-generator"],
  },
  "hash-generator": {
    metaDescription: "Generate SHA-1, SHA-256, SHA-384, and SHA-512 hashes online for free. Secure hash generation entirely in your browser.",
    keywords: ["hash generator", "sha256 hash", "sha512 hash", "md5 hash", "generate hash online", "hash calculator"],
    howToSteps: ["Enter or paste your text.", "View instantly generated hashes for multiple algorithms.", "Copy the hash you need."],
    features: ["SHA-1, SHA-256, SHA-384, SHA-512 support", "Instant real-time hashing", "Copy individual hashes"],
    whyUse: ["Verify file integrity", "Generate checksums for security", "Compare text hashes for data verification"],
    faqs: [
      { question: "What hash algorithms are supported?", answer: "SHA-1, SHA-256, SHA-384, and SHA-512." },
      { question: "Is it free?", answer: "Yes, completely free." },
      { question: "Is my data secure?", answer: "Yes. Hashing happens entirely in your browser using the Web Crypto API." },
      { question: "Can I hash files?", answer: "Currently text-only. For file hashing, paste the file content." },
      { question: "Which hash should I use?", answer: "SHA-256 is recommended for most purposes. SHA-512 for maximum security." },
    ],
    relatedSlugs: ["password-generator", "base64-encoder", "uuid-generator", "jwt-decoder", "base64-decoder"],
  },

  // ═══ IMAGE TOOLS ═══
  "image-resizer": {
    metaDescription: "Resize images online for free. Set custom dimensions while maintaining aspect ratio. Supports JPG, PNG, WebP. No signup required.",
    keywords: ["image resizer", "resize image online", "resize photo", "image dimensions", "resize jpg", "resize png"],
    howToSteps: ["Upload your image.", "Enter the desired width and height or use aspect ratio lock.", "Preview the resized image.", "Download the resized image."],
    features: ["Custom width and height", "Aspect ratio lock", "Supports multiple image formats", "Real-time preview"],
    whyUse: ["Resize photos for social media profiles", "Meet specific dimension requirements", "Reduce image dimensions for web use"],
    faqs: [
      { question: "Will resizing reduce quality?", answer: "Resizing preserves quality as much as possible. Enlarging beyond original size may reduce sharpness." },
      { question: "Is it free?", answer: "Yes, completely free." },
      { question: "What formats are supported?", answer: "JPG, PNG, WebP, and other common image formats." },
      { question: "Can I maintain aspect ratio?", answer: "Yes. Lock the aspect ratio to resize proportionally." },
      { question: "Is there a size limit?", answer: "No hard limit. Processing depends on your device's capabilities." },
    ],
    relatedSlugs: ["image-compressor", "image-cropper", "image-rotator", "image-flipper", "universal-image-converter"],
  },
  "image-compressor": {
    metaDescription: "Compress images online for free. Reduce JPEG and PNG file sizes without losing visible quality. No signup required.",
    keywords: ["image compressor", "compress image", "reduce image size", "image optimizer", "compress jpg", "compress png"],
    howToSteps: ["Upload your image.", "Adjust the compression quality slider.", "Preview the compressed result.", "Download the optimized image."],
    features: ["Adjustable quality slider", "Before/after file size comparison", "Supports JPG and PNG", "Maintains visual quality"],
    whyUse: ["Reduce image file sizes for faster website loading", "Compress photos for email attachments", "Optimize images for social media upload limits"],
    faqs: [
      { question: "How much can it compress?", answer: "Typically 40-80% reduction depending on image content and quality setting." },
      { question: "Will compression reduce quality?", answer: "Minor quality reduction at high compression. The preview lets you find the best balance." },
      { question: "Is it free?", answer: "Yes, completely free." },
      { question: "What formats are supported?", answer: "JPG, JPEG, and PNG images." },
      { question: "Are my images stored?", answer: "No. Compression happens in your browser." },
    ],
    relatedSlugs: ["image-resizer", "image-cropper", "universal-image-converter", "image-to-pdf", "pdf-compressor"],
  },

  // ═══ DESIGN TOOLS ═══
  "gradient-generator": {
    metaDescription: "Create beautiful CSS linear gradients visually and copy the code instantly. Free online gradient generator for web designers.",
    keywords: ["gradient generator", "css gradient", "linear gradient", "gradient maker", "css gradient generator"],
    howToSteps: ["Choose your gradient colors using the color pickers.", "Adjust the gradient angle and direction.", "Copy the generated CSS code."],
    features: ["Visual gradient builder", "Custom angle control", "Ready-to-use CSS code", "Real-time preview"],
    whyUse: ["Design beautiful backgrounds for websites", "Generate CSS gradients without coding", "Experiment with color combinations visually"],
    faqs: [
      { question: "What type of gradients can I create?", answer: "Linear gradients with custom colors, angles, and multiple color stops." },
      { question: "Is it free?", answer: "Yes, completely free." },
      { question: "Can I copy the CSS code?", answer: "Yes. One-click copy of the generated CSS code." },
      { question: "Does it work with all browsers?", answer: "The generated CSS is compatible with all modern browsers." },
      { question: "Can I add more than 2 colors?", answer: "Yes. Add multiple color stops for complex gradient effects." },
    ],
    relatedSlugs: ["box-shadow-generator", "css-border-radius", "color-palette-generator", "color-picker", "color-converter"],
  },

  // ═══ CALCULATOR TOOLS ═══
  "percentage-calculator": {
    metaDescription: "Calculate percentages, increases, and decreases instantly. Free online percentage calculator. No signup required.",
    keywords: ["percentage calculator", "percent calculator", "calculate percentage", "percentage increase", "percentage decrease"],
    howToSteps: ["Enter the values to calculate.", "View instant percentage results.", "Use for discounts, tips, markups, and more."],
    features: ["Calculate percentage of a number", "Percentage increase/decrease", "Multiple calculation modes"],
    whyUse: ["Calculate discounts and tips", "Figure out exam grade percentages", "Compute markup and margins"],
    faqs: [
      { question: "What calculations can I do?", answer: "Percentage of a number, percentage increase/decrease, and what percent one number is of another." },
      { question: "Is it free?", answer: "Yes, completely free." },
      { question: "How accurate is it?", answer: "Calculations are precise to multiple decimal places." },
      { question: "Can I use decimal percentages?", answer: "Yes. Enter any decimal percentage value." },
      { question: "Is there a mobile version?", answer: "Yes. The calculator is fully responsive on all devices." },
    ],
    relatedSlugs: ["discount-calculator", "loan-emi-calculator", "average-calculator", "gpa-calculator", "age-calculator"],
  },

  // ═══ UTILITY TOOLS ═══
  "qr-code-generator": {
    metaDescription: "Generate QR codes from any text or URL online for free. Create scannable QR codes instantly. No signup required.",
    keywords: ["qr code generator", "create qr code", "qr code maker", "generate qr code", "free qr code", "qr code online"],
    howToSteps: ["Enter your text or URL.", "The QR code is generated instantly.", "Download or scan the QR code."],
    features: ["Instant QR code generation", "Supports text and URLs", "Downloadable as image", "Works on mobile"],
    whyUse: ["Create QR codes for business cards", "Share URLs quickly via QR", "Generate codes for product labels"],
    faqs: [
      { question: "What can I encode in a QR code?", answer: "Any text, URL, email, phone number, or message." },
      { question: "Is it free?", answer: "Yes, completely free." },
      { question: "Can I download the QR code?", answer: "Yes. Download as an image file." },
      { question: "Is there a character limit?", answer: "QR codes can hold up to ~4,000 characters, though shorter content creates better-scanning codes." },
      { question: "Do generated QR codes expire?", answer: "No. QR codes are static and never expire." },
    ],
    relatedSlugs: ["password-generator", "uuid-generator", "random-number-generator", "color-picker", "lorem-ipsum-generator"],
  },
}

/**
 * Get SEO data for a tool slug. Returns custom data if available, otherwise auto-generates defaults.
 */
export function getToolSEO(slug: string, title: string, category: string): ToolSEOData {
  return TOOL_SEO[slug] || defaultSEO(title, category)
}
