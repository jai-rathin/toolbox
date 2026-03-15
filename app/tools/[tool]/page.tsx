import Link from "next/link"
import { getToolDefinition, TOOLS } from "@/components/tools/registry"
import { ToolLayout } from "@/components/tool-layout"
import { Button } from "@/components/ui/button"
import { Metadata } from "next"
import { generateToolSEO, generateToolSchemas } from "@/lib/seo"
import { getToolSEO } from "@/lib/seo-data"

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

  return generateToolSEO({
    slug: def.slug,
    title: def.title,
    description: def.description,
    categoryName: def.category.name,
  })
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

  const seo = getToolSEO(def.slug, def.title, def.category.name)
  const schemas = generateToolSchemas({
    slug: def.slug,
    title: def.title,
    description: def.description,
    categoryName: def.category.name,
  })

  // Get related tools with full data
  const relatedTools = seo.relatedSlugs
    .map((s) => TOOLS[s])
    .filter(Boolean)
    .slice(0, 5)

  return (
    <>
      {/* JSON-LD: SoftwareApplication */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.softwareApp) }}
      />
      {/* JSON-LD: BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.breadcrumb) }}
      />
      {/* JSON-LD: FAQPage */}
      {schemas.faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.faqSchema) }}
        />
      )}

      <ToolLayout
        title={def.title}
        description={def.description}
        category={def.category.name}
        categoryHref={def.category.href}
      >
        <def.Component />

        {/* ─── SEO Content Section ─── */}
        <div className="mt-16 pt-12 border-t border-white/10 text-gray-300 space-y-12">
          {/* About */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">About {def.title}</h2>
            <p className="leading-relaxed">{seo.metaDescription}</p>
          </section>

          {/* How To Use */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">How to Use {def.title}</h2>
            <ol className="list-decimal pl-5 space-y-3 leading-relaxed">
              {seo.howToSteps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </section>

          {/* Features */}
          {seo.features.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Features</h2>
              <ul className="list-disc pl-5 space-y-2 leading-relaxed">
                {seo.features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Why Use */}
          {seo.whyUse.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Why Use This Tool?</h2>
              <ul className="list-disc pl-5 space-y-2 leading-relaxed">
                {seo.whyUse.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </section>
          )}

          {/* FAQ Accordion */}
          {seo.faqs.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                {seo.faqs.map((faq, i) => (
                  <details
                    key={i}
                    className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden"
                  >
                    <summary className="px-5 py-4 cursor-pointer text-white font-medium hover:bg-white/5 transition-colors flex items-center justify-between">
                      {faq.question}
                      <span className="text-gray-500 group-open:rotate-180 transition-transform text-sm ml-4">▼</span>
                    </summary>
                    <div className="px-5 pb-4 text-gray-400 leading-relaxed">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* Related Tools (Internal Links) */}
          {relatedTools.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-white mb-6">Related Tools</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {relatedTools.map((rt) => (
                  <Link
                    key={rt.slug}
                    href={`/tools/${rt.slug}`}
                    className="group p-4 bg-white/5 border border-white/10 rounded-xl hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all"
                  >
                    <h3 className="font-semibold text-white group-hover:text-cyan-400 transition-colors mb-1">
                      {rt.title}
                    </h3>
                    <p className="text-sm text-gray-400 line-clamp-2">{rt.description}</p>
                  </Link>
                ))}
              </div>
              <p className="mt-4 text-sm text-gray-500">
                Explore more tools in the{" "}
                <Link
                  href={def.category.slug ? `/categories/${def.category.slug}` : def.category.href}
                  className="text-cyan-400 hover:text-cyan-300 font-medium"
                >
                  {def.category.name}
                </Link>{" "}
                category.
              </p>
            </section>
          )}
        </div>
      </ToolLayout>
    </>
  )
}