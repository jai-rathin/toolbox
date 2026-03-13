"use client"

import { useState } from "react"
import { ToolLayout } from "@/components/tool-layout"
import { Button } from "@/components/ui/button"
import { Calculator, RefreshCw } from "lucide-react"

export default function DiscountCalculator() {
  const [price, setPrice] = useState("")
  const [discount, setDiscount] = useState("")
  
  const [savings, setSavings] = useState<number | null>(null)
  const [finalPrice, setFinalPrice] = useState<number | null>(null)

  const calculate = () => {
    const p = parseFloat(price)
    const d = parseFloat(discount)

    if (!isNaN(p) && !isNaN(d) && p >= 0 && d >= 0 && d <= 100) {
      const savedAmount = (p * d) / 100
      setSavings(savedAmount)
      setFinalPrice(p - savedAmount)
    }
  }

  const reset = () => {
    setPrice("")
    setDiscount("")
    setSavings(null)
    setFinalPrice(null)
  }

  return (
    <ToolLayout
      title="Discount Calculator"
      description="Quickly calculate the final price after a percentage discount and see exactly how much you save."
      category="Calculators"
      categoryHref="/tools?category=calculators"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400 ml-1">Original Price</label>
            <input
              type="number"
              placeholder="e.g. 199.99"
              value={price}
              onChange={(e) => { setPrice(e.target.value); setSavings(null); }}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400 ml-1">Discount (% off)</label>
            <input
              type="number"
              min="0"
              max="100"
              placeholder="e.g. 20"
              value={discount}
              onChange={(e) => { setDiscount(e.target.value); setSavings(null); }}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>

        {finalPrice !== null && savings !== null && (
          <div className="glass p-8 rounded-2xl border border-rose-500/30 animate-scale-in space-y-6">
            <div className="text-center">
              <h3 className="text-gray-400 font-medium mb-2">Final Price</h3>
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-500">
                {finalPrice.toFixed(2)}
              </div>
            </div>
            
            <div className="border-t border-white/10 pt-6 text-center">
              <div className="text-gray-500 text-sm mb-1">You Save</div>
              <div className="text-2xl font-semibold text-emerald-400">
                {savings.toFixed(2)}
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <Button 
            onClick={reset} 
            variant="outline" 
            className="flex-1 bg-black/20 border-white/10 text-white rounded-xl py-6 hover:bg-white/5"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Reset
          </Button>
          <Button 
            onClick={calculate} 
            className="flex-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl py-6 border-0 shadow-lg shadow-rose-500/20 hover:from-rose-600 hover:to-pink-600"
            disabled={!price || !discount}
          >
            <Calculator className="w-5 h-5 mr-2" />
            Calculate
          </Button>
        </div>
      </div>
    </ToolLayout>
  )
}
