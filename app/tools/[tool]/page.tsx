import Link from "next/link"
import { getToolDefinition } from "@/components/tools/registry"
import { ToolLayout } from "@/components/tool-layout"
import { Button } from "@/components/ui/button"
import { Metadata } from "next"

type PageProps = {
  params: Promise<{ tool: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tool } = await params
  const def = getToolDefinition(tool)

  if (!def) {
    return {
      title: "Tool Not Found | ToolBox",
      description: "The requested tool could not be found."
    }
  }

  const title = `${def.title} – Free Online Tool | ToolBox`
  const description = def.description || `Use our free ${def.title.toLowerCase()} to quickly complete tasks directly in your browser. No installation required.`
  const url = `https://toolbox.com/tools/${def.slug}`

  return {
    title,
    description,
    keywords: `${def.title.toLowerCase()}, online ${def.title.toLowerCase()}, free ${def.title.toLowerCase()}, toolbox tools, ${def.category.name.toLowerCase()}`,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: "ToolBox",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    }
  }
}

function ToolNotFound({ slug }: { slug: string }) {
  return (
    <ToolLayout
      title="Tool Not Found"
      description={`We couldn't find a tool named "${slug}".`}
      category="Tools"
      categoryHref="/tools"
    >
      <div className="space-y-4">
        <p className="text-gray-300">
          Check the URL or browse all tools to find what you need.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild className="rounded-full">
            <Link href="/tools">Browse tools</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="rounded-full border-gray-700 bg-white/5 hover:bg-cyan-500/10 hover:border-cyan-500/50 text-white"
          >
            <Link href="/">Go home</Link>
          </Button>
        </div>
      </div>
    </ToolLayout>
  )
}

export default async function ToolPage({ params }: PageProps) {
  const { tool } = await params
  const def = getToolDefinition(tool)

  if (!def) return <ToolNotFound slug={tool} />

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: def.title,
            description: def.description,
            applicationCategory: def.category.name,
            operatingSystem: "Web",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD"
            }
          })
        }}
      />
      <ToolLayout
        title={def.title}
        description={def.description}
        category={def.category.name}
        categoryHref={def.category.href}
      >
        <def.Component />
        
        <div className="mt-16 pt-12 border-t border-white/10 text-gray-300 space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">About {def.title}</h2>
            <p className="leading-relaxed">
              {def.description || `The ${def.title} tool provides a quick and free way to accomplish digital tasks within your browser. 
              Designed for speed and simplicity, it requires no installation, extensions, or account creation.`}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">How to Use</h2>
            <ol className="list-decimal pl-5 space-y-3 leading-relaxed">
              <li>Input exactly what you want to process into the main interface.</li>
              <li>Wait for the tool to automatically execute securely within your browser's local memory.</li>
              <li>Instantly review or copy the generated results from the output panel.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Why Use This Tool?</h2>
            <ul className="list-disc pl-5 space-y-3 leading-relaxed">
              <li><strong>Lightning Fast:</strong> Executes almost instantly.</li>
              <li><strong>Completely Free:</strong> Absolute zero paywalls or subscriptions.</li>
              <li><strong>Secure Sandbox:</strong> Computations occur securely in your computer's browser, preventing external data logging.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Related Tools</h2>
            <p className="leading-relaxed mb-4">Looking for something similar? Explore more utilities inside the <Link href={def.category.slug ? `/categories/${def.category.slug}` : def.category.href} className="text-cyan-400 hover:text-cyan-300 font-medium">{def.category.name}</Link> classification.</p>
          </section>
        </div>
      </ToolLayout>
    </>
  )
}