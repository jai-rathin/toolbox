import WordCounter from "@/components/tools/WordCounter"
import CaseConverter from "@/components/tools/CaseConverter"
import PasswordGenerator from "@/components/tools/PasswordGenerator"
import TextSorter from "@/components/tools/TextSorter"
import RemoveDuplicateLines from "@/components/tools/RemoveDuplicateLines"
import TextReverser from "@/components/tools/TextReverser"
import CapitalizeText from "@/components/tools/CapitalizeText"
import LineCounter from "@/components/tools/LineCounter"
import TextDiffChecker from "@/components/tools/TextDiffChecker"
import RandomTextGenerator from "@/components/tools/RandomTextGenerator"
import TextCleaner from "@/components/tools/TextCleaner"
import JsonFormatter from "@/components/tools/JsonFormatter"
import JsonValidator from "@/components/tools/JsonValidator"
import Base64Encoder from "@/components/tools/Base64Encoder"
import Base64Decoder from "@/components/tools/Base64Decoder"
import UrlEncoder from "@/components/tools/UrlEncoder"
import UrlDecoder from "@/components/tools/UrlDecoder"
import UuidGenerator from "@/components/tools/UuidGenerator"
import HashGenerator from "@/components/tools/HashGenerator"
import RegexTester from "@/components/tools/RegexTester"
import JwtDecoder from "@/components/tools/JwtDecoder"
import RandomNumberGenerator from "@/components/tools/RandomNumberGenerator"
import QrCodeGenerator from "@/components/tools/QrCodeGenerator"
import ColorPickerTool from "@/components/tools/ColorPicker"
import TimestampConverter from "@/components/tools/TimestampConverter"
import ColorConverter from "@/components/tools/ColorConverter"
import UnitConverter from "@/components/tools/UnitConverter"
import PercentageCalculator from "@/components/tools/PercentageCalculator"
import AgeCalculator from "@/components/tools/AgeCalculator"
// Calculators
import CgpaCalculator from "@/components/tools/calculators/CgpaCalculator"
import GpaToPercentage from "@/components/tools/calculators/GpaToPercentage"
import StudyTimeCalculator from "@/components/tools/calculators/StudyTimeCalculator"
import LoanEmiCalculator from "@/components/tools/calculators/LoanEmiCalculator"
import DiscountCalculator from "@/components/tools/calculators/DiscountCalculator"
import AverageCalculator from "@/components/tools/calculators/AverageCalculator"
import LoremIpsumGenerator from "@/components/tools/LoremIpsumGenerator"
import DiceRoller from "@/components/tools/DiceRoller"
import ImageResizer from "@/components/tools/image/ImageResizer"
import ImageCompressor from "@/components/tools/ImageCompressor"
import ImageCropper from "@/components/tools/image/ImageCropper"
import ImageRotator from "@/components/tools/image/ImageRotator"
import ImageFlipper from "@/components/tools/ImageFlipper"
import ImageMetadataViewer from "@/components/tools/ImageMetadataViewer"
import ImageColorPicker from "@/components/tools/ImageColorPicker"
import ImageGrayscaleConverter from "@/components/tools/ImageGrayscaleConverter"
import ImageBlur from "@/components/tools/image/ImageBlur"
import ImageBrightnessAdjuster from "@/components/tools/ImageBrightnessAdjuster"
import ImageBorderTool from "@/components/tools/ImageBorderTool"
import ImageWatermark from "@/components/tools/image/ImageWatermark"
import UniversalImageConverter from "@/components/tools/image/UniversalImageConverter"

// Video Tools
import VideoCompressor from "@/components/tools/media/video/VideoCompressor"
import VideoConverter from "@/components/tools/media/video/VideoConverter"
import VideoTrimmer from "@/components/tools/media/video/VideoTrimmer"
import VideoToGif from "@/components/tools/media/video/VideoToGif"
import VideoToAudio from "@/components/tools/media/audio/VideoToAudio"

// Audio Tools
import AudioConverter from "@/components/tools/media/audio/AudioConverter"
import AudioCutter from "@/components/tools/media/audio/AudioCutter"
import AudioJoiner from "@/components/tools/media/audio/AudioJoiner"
import VolumeBooster from "@/components/tools/media/audio/VolumeBooster"

// Document Tools
import PdfMerger from "@/components/tools/media/document/PdfMerger"
import PdfSplitter from "@/components/tools/media/document/PdfSplitter"
import PdfCompressor from "@/components/tools/media/document/PdfCompressor"
import ImageToPdf from "@/components/tools/media/document/ImageToPdf"
import PdfToImage from "@/components/tools/media/document/PdfToImage"
import PdfPageExtractor from "@/components/tools/media/document/PdfPageExtractor"
import PdfRotator from "@/components/tools/media/document/PdfRotator"
import PdfWatermark from "@/components/tools/media/document/PdfWatermark"
import PdfImageExtractor from "@/components/tools/media/document/PdfImageExtractor"
import PdfMetadataViewer from "@/components/tools/media/document/PdfMetadataViewer"
import GpaCalculator from "@/components/tools/calculators/GpaCalculator"
import GradeCalculator from "@/components/tools/calculators/GradeCalculator"
import GradientGenerator from "@/components/tools/design/GradientGenerator"
import BoxShadowGenerator from "@/components/tools/design/BoxShadowGenerator"
import CssBorderRadius from "@/components/tools/design/CssBorderRadius"
import ColorPaletteGenerator from "@/components/tools/design/ColorPaletteGenerator"

import type { ToolDefinition } from "@/components/tools/types"

export const TOOLS: Record<string, ToolDefinition> = {
  "word-counter": {
    slug: "word-counter",
    title: "Word Counter",
    description: "Count words, characters, sentences, and paragraphs instantly.",
    category: { name: "Text Tools", slug: "text-tools", href: "/categories/text-tools" },
    Component: WordCounter,
  },
  "case-converter": {
    slug: "case-converter",
    title: "Case Converter",
    description: "Convert text to uppercase, lowercase, title case, and more.",
    category: { name: "Text Tools", slug: "text-tools", href: "/categories/text-tools" },
    Component: CaseConverter,
  },
  "text-sorter": {
    slug: "text-sorter",
    title: "Text Sorter",
    description: "Sort lines alphabetically in ascending or descending order.",
    category: { name: "Text Tools", slug: "text-tools", href: "/categories/text-tools" },
    Component: TextSorter,
  },
  "remove-duplicate-lines": {
    slug: "remove-duplicate-lines",
    title: "Remove Duplicate Lines",
    description: "Remove repeated lines while keeping the first occurrence.",
    category: { name: "Text Tools", slug: "text-tools", href: "/categories/text-tools" },
    Component: RemoveDuplicateLines,
  },
  "text-reverser": {
    slug: "text-reverser",
    title: "Text Reverser",
    description: "Reverse the entire text by characters or by words.",
    category: { name: "Text Tools", slug: "text-tools", href: "/categories/text-tools" },
    Component: TextReverser,
  },
  "capitalize-text": {
    slug: "capitalize-text",
    title: "Capitalize Text",
    description: "Capitalize the first letter of each word.",
    category: { name: "Text Tools", slug: "text-tools", href: "/categories/text-tools" },
    Component: CapitalizeText,
  },
  "line-counter": {
    slug: "line-counter",
    title: "Line Counter",
    description: "Count the number of lines in your input text instantly.",
    category: { name: "Text Tools", slug: "text-tools", href: "/categories/text-tools" },
    Component: LineCounter,
  },
  "text-diff-checker": {
    slug: "text-diff-checker",
    title: "Text Diff Checker",
    description: "Compare two pieces of text and see differences line by line.",
    category: { name: "Text Tools", slug: "text-tools", href: "/categories/text-tools" },
    Component: TextDiffChecker,
  },
  "random-text-generator": {
    slug: "random-text-generator",
    title: "Random Text Generator",
    description: "Generate dummy random text instantly.",
    category: { name: "Text Tools", slug: "text-tools", href: "/categories/text-tools" },
    Component: RandomTextGenerator,
  },
  "text-cleaner": {
    slug: "text-cleaner",
    title: "Text Cleaner",
    description: "Remove extra spaces, empty lines, and clean up messy text.",
    category: { name: "Text Tools", slug: "text-tools", href: "/categories/text-tools" },
    Component: TextCleaner,
  },

  "json-formatter": {
    slug: "json-formatter",
    title: "JSON Formatter",
    description: "Pretty-format JSON and show helpful errors for invalid input.",
    category: { name: "Developer Tools", slug: "developer-tools", href: "/categories/developer-tools" },
    Component: JsonFormatter,
  },
  "base64-encoder": {
    slug: "base64-encoder",
    title: "Base64 Encoder",
    description: "Encode text to Base64 (UTF-8 safe).",
    category: { name: "Security Tools", slug: "security-tools", href: "/categories/security-tools" },
    Component: Base64Encoder,
  },
  "base64-decoder": {
    slug: "base64-decoder",
    title: "Base64 Decoder",
    description: "Decode a Base64 string back to text (UTF-8 safe).",
    category: { name: "Security Tools", slug: "security-tools", href: "/categories/security-tools" },
    Component: Base64Decoder,
  },
  "url-encoder": {
    slug: "url-encoder",
    title: "URL Encoder",
    description: "Encode text to a URL-safe format.",
    category: { name: "Developer Tools", slug: "developer-tools", href: "/categories/developer-tools" },
    Component: UrlEncoder,
  },
  "url-decoder": {
    slug: "url-decoder",
    title: "URL Decoder",
    description: "Decode URL-encoded text back to readable format.",
    category: { name: "Developer Tools", slug: "developer-tools", href: "/categories/developer-tools" },
    Component: UrlDecoder,
  },
  "uuid-generator": {
    slug: "uuid-generator",
    title: "UUID Generator",
    description: "Generate a random UUID (v4).",
    category: { name: "Security Tools", slug: "security-tools", href: "/categories/security-tools" },
    Component: UuidGenerator,
  },
  "json-validator": {
    slug: "json-validator",
    title: "JSON Validator",
    description: "Validate JSON structure and find syntax errors instantly.",
    category: { name: "Developer Tools", slug: "developer-tools", href: "/categories/developer-tools" },
    Component: JsonValidator,
  },
  "hash-generator": {
    slug: "hash-generator",
    title: "Hash Generator",
    description: "Quickly generate SHA-1, SHA-256, SHA-384, and SHA-512 hashes.",
    category: { name: "Security Tools", slug: "security-tools", href: "/categories/security-tools" },
    Component: HashGenerator,
  },
  "regex-tester": {
    slug: "regex-tester",
    title: "Regex Tester",
    description: "Test your regular expressions against test strings.",
    category: { name: "Developer Tools", slug: "developer-tools", href: "/categories/developer-tools" },
    Component: RegexTester,
  },
  "jwt-decoder": {
    slug: "jwt-decoder",
    title: "JWT Decoder",
    description: "Decode a JSON Web Token to view its header and payload.",
    category: { name: "Security Tools", slug: "security-tools", href: "/categories/security-tools" },
    Component: JwtDecoder,
  },

  "random-number-generator": {
    slug: "random-number-generator",
    title: "Random Number Generator",
    description: "Generate a random number between min and max values.",
    category: { name: "Utility Tools", slug: "utility-tools", href: "/categories/utility-tools" },
    Component: RandomNumberGenerator,
  },
  "qr-code-generator": {
    slug: "qr-code-generator",
    title: "QR Code Generator",
    description: "Generate a QR code from any text or URL.",
    category: { name: "Utility Tools", slug: "utility-tools", href: "/categories/utility-tools" },
    Component: QrCodeGenerator,
  },
  "color-picker": {
    slug: "color-picker",
    title: "Color Picker",
    description: "Pick a color and instantly get HEX and RGB values.",
    category: { name: "Design Tools", slug: "design-tools", href: "/categories/design-tools" },
    Component: ColorPickerTool,
  },
  "timestamp-converter": {
    slug: "timestamp-converter",
    title: "Timestamp Converter",
    description: "Convert Unix timestamps to dates and dates to Unix timestamps.",
    category: { name: "Utility Tools", slug: "utility-tools", href: "/categories/utility-tools" },
    Component: TimestampConverter,
  },
  "image-resizer": {
    slug: "image-resizer",
    title: "Image Resizer",
    description: "Resize images to custom dimensions while maintaining aspect ratio.",
    category: { name: "Image Tools", slug: "image-tools", href: "/categories/image-tools" },
    Component: ImageResizer,
  },
  "image-compressor": {
    slug: "image-compressor",
    title: "Image Compressor",
    description: "Compress images locally without losing too much quality.",
    category: { name: "Image Tools", slug: "image-tools", href: "/categories/image-tools" },
    Component: ImageCompressor,
  },
  "image-cropper": {
    slug: "image-cropper",
    title: "Image Cropper",
    description: "Crop specific areas of an image accurately.",
    category: { name: "Image Tools", slug: "image-tools", href: "/categories/image-tools" },
    Component: ImageCropper,
  },
  "image-rotator": {
    slug: "image-rotator",
    title: "Image Rotator",
    description: "Rotate images by various degrees instantly.",
    category: { name: "Image Tools", slug: "image-tools", href: "/categories/image-tools" },
    Component: ImageRotator,
  },
  "image-flipper": {
    slug: "image-flipper",
    title: "Image Flipper",
    description: "Flip images horizontally or vertically.",
    category: { name: "Image Tools", slug: "image-tools", href: "/categories/image-tools" },
    Component: ImageFlipper,
  },

  "image-metadata-viewer": {
    slug: "image-metadata-viewer",
    title: "Image Metadata Viewer",
    description: "View basic technical details and dimensions of an image.",
    category: { name: "Image Tools", slug: "image-tools", href: "/categories/image-tools" },
    Component: ImageMetadataViewer,
  },
  "image-color-picker": {
    slug: "image-color-picker",
    title: "Image Color Picker",
    description: "Pick colors from an image to get their HEX and RGB values.",
    category: { name: "Design Tools", slug: "design-tools", href: "/categories/design-tools" },
    Component: ImageColorPicker,
  },
  "image-grayscale-converter": {
    slug: "image-grayscale-converter",
    title: "Image Grayscale Converter",
    description: "Convert colorful images into black and white grayscale.",
    category: { name: "Image Tools", slug: "image-tools", href: "/categories/image-tools" },
    Component: ImageGrayscaleConverter,
  },
  "image-blur-tool": {
    slug: "image-blur-tool",
    title: "Image Blur Tool",
    description: "Apply a blur effect to an image and download it.",
    category: { name: "Image Tools", slug: "image-tools", href: "/categories/image-tools" },
    Component: ImageBlur,
  },
  "image-brightness-adjuster": {
    slug: "image-brightness-adjuster",
    title: "Brightness Adjuster",
    description: "Adjust brightness and contrast of your images locally.",
    category: { name: "Image Tools", slug: "image-tools", href: "/categories/image-tools" },
    Component: ImageBrightnessAdjuster,
  },
  "image-border-tool": {
    slug: "image-border-tool",
    title: "Image Border Tool",
    description: "Add beautiful colored borders to your pictures.",
    category: { name: "Image Tools", slug: "image-tools", href: "/categories/image-tools" },
    Component: ImageBorderTool,
  },
  "image-watermark-tool": {
    slug: "image-watermark-tool",
    title: "Image Watermark",
    description: "Add text/image watermarks to your images to protect your work.",
    category: { name: "Image Tools", slug: "image-tools", href: "/categories/image-tools" },
    Component: ImageWatermark,
  },
  "universal-image-converter": {
    slug: "universal-image-converter",
    title: "Universal Converter",
    description: "Convert images between any standard formats.",
    category: { name: "Image Tools", slug: "image-tools", href: "/categories/image-tools" },
    Component: UniversalImageConverter,
  },
  "color-converter": {
    slug: "color-converter",
    title: "Color Converter",
    description: "Convert colors between HEX, RGB, and HSL formats.",
    category: { name: "Utility Tools", slug: "utility-tools", href: "/categories/utility-tools" },
    Component: ColorConverter,
  },
  "unit-converter": {
    slug: "unit-converter",
    title: "Unit Converter",
    description: "Convert between various categories like length, weight, and temperature.",
    category: { name: "Utility Tools", slug: "utility-tools", href: "/categories/utility-tools" },
    Component: UnitConverter,
  },
  "percentage-calculator": {
    slug: "percentage-calculator",
    title: "Percentage Calculator",
    description: "Easily calculate percentages, increases, and decreases.",
    category: { name: "Calculator Tools", slug: "calculator-tools", href: "/categories/calculator-tools" },
    Component: PercentageCalculator,
  },
  "age-calculator": {
    slug: "age-calculator",
    title: "Age Calculator",
    description: "Calculate exact age in years, months, days, weeks.",
    category: { name: "Calculator Tools", slug: "calculator-tools", href: "/categories/calculator-tools" },
    Component: AgeCalculator,
  },
  "cgpa-calculator": {
    slug: "cgpa-calculator",
    title: "CGPA Calculator",
    description: "Calculate your Cumulative Grade Point Average accurately.",
    category: { name: "Calculator Tools", slug: "calculator-tools", href: "/categories/calculator-tools" },
    Component: CgpaCalculator,
  },
  "gpa-to-percentage": {
    slug: "gpa-to-percentage",
    title: "GPA to Percentage",
    description: "Convert 10-point GPA scale to standard percentage.",
    category: { name: "Calculator Tools", slug: "calculator-tools", href: "/categories/calculator-tools" },
    Component: GpaToPercentage,
  },
  "study-time-calculator": {
    slug: "study-time-calculator",
    title: "Study Time Calculator",
    description: "Estimate required weekly study hours based on credits.",
    category: { name: "Calculator Tools", slug: "calculator-tools", href: "/categories/calculator-tools" },
    Component: StudyTimeCalculator,
  },
  "loan-emi-calculator": {
    slug: "loan-emi-calculator",
    title: "Loan EMI Calculator",
    description: "Calculate your Equated Monthly Installment for loans.",
    category: { name: "Calculator Tools", slug: "calculator-tools", href: "/categories/calculator-tools" },
    Component: LoanEmiCalculator,
  },
  "discount-calculator": {
    slug: "discount-calculator",
    title: "Discount Calculator",
    description: "Calculate final price after a percentage discount.",
    category: { name: "Calculator Tools", slug: "calculator-tools", href: "/categories/calculator-tools" },
    Component: DiscountCalculator,
  },
  "average-calculator": {
    slug: "average-calculator",
    title: "Average Calculator",
    description: "Quickly calculate mean, median, sum, and count of a dataset.",
    category: { name: "Calculator Tools", slug: "calculator-tools", href: "/categories/calculator-tools" },
    Component: AverageCalculator,
  },
  "lorem-ipsum-generator": {
    slug: "lorem-ipsum-generator",
    title: "Lorem Ipsum Generator",
    description: "Generate dummy text paragraphs and sentences.",
    category: { name: "Utility Tools", slug: "utility-tools", href: "/categories/utility-tools" },
    Component: LoremIpsumGenerator,
  },
  "dice-roller": {
    slug: "dice-roller",
    title: "Dice Roller",
    description: "Roll multiple polyhedral dice instantly.",
    category: { name: "Utility Tools", slug: "utility-tools", href: "/categories/utility-tools" },
    Component: DiceRoller,
  },
  "password-generator": {
    slug: "password-generator",
    title: "Password Generator",
    description: "Generate secure, random passwords with custom rules.",
    category: { name: "Security Tools", slug: "security-tools", href: "/categories/security-tools" },
    Component: PasswordGenerator,
  },
  
  // Video Tools 
  "video-compressor": {
    slug: "video-compressor",
    title: "Video Compressor",
    description: "Reduce video size efficiently using FFmpeg entirely in your browser.",
    category: { name: "Media Tools", slug: "media-tools", href: "/categories/media-tools" },
    Component: VideoCompressor,
  },
  "video-converter": {
    slug: "video-converter",
    title: "Video Converter",
    description: "Convert video between MP4, WebM, and MOV formats.",
    category: { name: "Media Tools", slug: "media-tools", href: "/categories/media-tools" },
    Component: VideoConverter,
  },
  "video-trimmer": {
    slug: "video-trimmer",
    title: "Video Trimmer",
    description: "Quickly trim videos locally without quality loss.",
    category: { name: "Media Tools", slug: "media-tools", href: "/categories/media-tools" },
    Component: VideoTrimmer,
  },
  "video-to-gif": {
    slug: "video-to-gif",
    title: "Video to GIF",
    description: "Extract high quality GIFs natively from Video clips.",
    category: { name: "Media Tools", slug: "media-tools", href: "/categories/media-tools" },
    Component: VideoToGif,
  },
  "video-to-audio": {
    slug: "video-to-audio",
    title: "Video to Audio",
    description: "Extract MP3 or WAV audio tracks directly from video files.",
    category: { name: "Media Tools", slug: "media-tools", href: "/categories/media-tools" },
    Component: VideoToAudio,
  },

  // Audio Tools
  "audio-converter": {
    slug: "audio-converter",
    title: "Audio Converter",
    description: "Convert tracks smoothly between MP3, WAV, and OGG formats.",
    category: { name: "Media Tools", slug: "media-tools", href: "/categories/media-tools" },
    Component: AudioConverter,
  },
  "audio-cutter": {
    slug: "audio-cutter",
    title: "Audio Cutter",
    description: "Trim audio tracks with millisecond precision natively.",
    category: { name: "Media Tools", slug: "media-tools", href: "/categories/media-tools" },
    Component: AudioCutter,
  },
  "audio-joiner": {
    slug: "audio-joiner",
    title: "Audio Joiner",
    description: "Splice multiple audio tracks together seamlessly.",
    category: { name: "Media Tools", slug: "media-tools", href: "/categories/media-tools" },
    Component: AudioJoiner,
  },
  "volume-booster": {
    slug: "volume-booster",
    title: "Volume Booster",
    description: "Safely increase the volume level of quiet MP3 / WAV files.",
    category: { name: "Media Tools", slug: "media-tools", href: "/categories/media-tools" },
    Component: VolumeBooster,
  },

  // Document Tools
  "pdf-merger": {
    slug: "pdf-merger",
    title: "PDF Merger",
    description: "Combine multiple PDF documents into a single chronological PDF file.",
    category: { name: "PDF Tools", slug: "pdf-tools", href: "/categories/pdf-tools" },
    Component: PdfMerger,
  },
  "pdf-splitter": {
    slug: "pdf-splitter",
    title: "PDF Splitter",
    description: "Extract individual page sets from a large PDF document.",
    category: { name: "PDF Tools", slug: "pdf-tools", href: "/categories/pdf-tools" },
    Component: PdfSplitter,
  },
  "pdf-compressor": {
    slug: "pdf-compressor",
    title: "PDF Compressor",
    description: "Optimize PDF structure and compress file size instantly.",
    category: { name: "PDF Tools", slug: "pdf-tools", href: "/categories/pdf-tools" },
    Component: PdfCompressor,
  },
  "image-to-pdf": {
    slug: "image-to-pdf",
    title: "Image To PDF",
    description: "Compile several JPG and PNG images sequentially into a standard PDF page sequence.",
    category: { name: "PDF Tools", slug: "pdf-tools", href: "/categories/pdf-tools" },
    Component: ImageToPdf,
  },
  "pdf-to-image": {
    slug: "pdf-to-image",
    title: "PDF To Image",
    description: "Locally extract beautiful full-resolution PNG images from any uploaded PDF.",
    category: { name: "PDF Tools", slug: "pdf-tools", href: "/categories/pdf-tools" },
    Component: PdfToImage,
  },
  "pdf-page-extractor": {
    slug: "pdf-page-extractor",
    title: "PDF Page Extractor",
    description: "Selectively extract specific pages from a PDF document securely in your browser.",
    category: { name: "PDF Tools", slug: "pdf-tools", href: "/categories/pdf-tools" },
    Component: PdfPageExtractor,
  },
  "pdf-rotator": {
    slug: "pdf-rotator",
    title: "Rotate PDF",
    description: "Rotate all or selected pages of a PDF by 90°, 180°, or 270° instantly.",
    category: { name: "PDF Tools", slug: "pdf-tools", href: "/categories/pdf-tools" },
    Component: PdfRotator,
  },
  "pdf-watermark": {
    slug: "pdf-watermark",
    title: "PDF Watermark",
    description: "Add customizable text watermarks with adjustable opacity and positioning to any PDF.",
    category: { name: "PDF Tools", slug: "pdf-tools", href: "/categories/pdf-tools" },
    Component: PdfWatermark,
  },
  "pdf-image-extractor": {
    slug: "pdf-image-extractor",
    title: "Extract Images from PDF",
    description: "Extract every page of a PDF as a high-quality PNG image and download as ZIP.",
    category: { name: "PDF Tools", slug: "pdf-tools", href: "/categories/pdf-tools" },
    Component: PdfImageExtractor,
  },
  "pdf-metadata-viewer": {
    slug: "pdf-metadata-viewer",
    title: "PDF Metadata Viewer",
    description: "View detailed metadata including author, title, creation date, and page count of any PDF.",
    category: { name: "PDF Tools", slug: "pdf-tools", href: "/categories/pdf-tools" },
    Component: PdfMetadataViewer,
  },
  "gpa-calculator": {
    slug: "gpa-calculator",
    title: "GPA Calculator",
    description: "Calculate your semester Grade Point Average (GPA) using standard US letter grades.",
    category: { name: "Calculator Tools", slug: "calculator-tools", href: "/categories/calculator-tools" },
    Component: GpaCalculator,
  },
  "grade-calculator": {
    slug: "grade-calculator",
    title: "Grade Calculator",
    description: "Calculate your current class grade based on weighted assignments and exams.",
    category: { name: "Calculator Tools", slug: "calculator-tools", href: "/categories/calculator-tools" },
    Component: GradeCalculator,
  },
  "gradient-generator": {
    slug: "gradient-generator",
    title: "Gradient Generator",
    description: "Create beautiful CSS linear gradients and copy the exact code instantly.",
    category: { name: "Design Tools", slug: "design-tools", href: "/categories/design-tools" },
    Component: GradientGenerator,
  },
  "box-shadow-generator": {
    slug: "box-shadow-generator",
    title: "Box Shadow Generator",
    description: "Design layered CSS box shadows visually and effortlessly generate copyable code.",
    category: { name: "Design Tools", slug: "design-tools", href: "/categories/design-tools" },
    Component: BoxShadowGenerator,
  },
  "css-border-radius": {
    slug: "css-border-radius",
    title: "CSS Border Radius Builder",
    description: "Visually generate perfect border-radius shapes and quickly copy the boilerplate.",
    category: { name: "Design Tools", slug: "design-tools", href: "/categories/design-tools" },
    Component: CssBorderRadius,
  },
  "color-palette-generator": {
    slug: "color-palette-generator",
    title: "Color Palette Generator",
    description: "Instantly create beautiful five-color harmonious palettes for your designs.",
    category: { name: "Design Tools", slug: "design-tools", href: "/categories/design-tools" },
    Component: ColorPaletteGenerator,
  },
}

export function getToolDefinition(slug: string): ToolDefinition | null {
  return TOOLS[slug] ?? null
}

