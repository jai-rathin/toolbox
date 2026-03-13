"use client"

import { useState } from "react"
import { ToolLayout } from "@/components/tool-layout"
import { Button } from "@/components/ui/button"
import { Calculator, RefreshCw } from "lucide-react"

export default function LoanEmiCalculator() {
  const [principal, setPrincipal] = useState("")
  const [rate, setRate] = useState("")
  const [tenure, setTenure] = useState("")
  const [tenureType, setTenureType] = useState<"years" | "months">("years")
  
  const [emi, setEmi] = useState<number | null>(null)
  const [totalInterest, setTotalInterest] = useState<number | null>(null)
  const [totalAmount, setTotalAmount] = useState<number | null>(null)

  const calculate = () => {
    const p = parseFloat(principal)
    const r = parseFloat(rate) // Annual rate
    const t = parseFloat(tenure) // Time

    if (!isNaN(p) && !isNaN(r) && !isNaN(t) && p > 0 && r > 0 && t > 0) {
      const monthlyRate = r / (12 * 100)
      const months = tenureType === "years" ? t * 12 : t
      
      // EMI = [P x R x (1+R)^N]/[(1+R)^N-1]
      const emiVal = (p * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
      const totalAmt = emiVal * months
      const totalInt = totalAmt - p

      setEmi(emiVal)
      setTotalAmount(totalAmt)
      setTotalInterest(totalInt)
    }
  }

  const reset = () => {
    setPrincipal("")
    setRate("")
    setTenure("")
    setEmi(null)
    setTotalAmount(null)
    setTotalInterest(null)
  }

  return (
    <ToolLayout
      title="Loan EMI Calculator"
      description="Calculate your Equated Monthly Installment (EMI) for home loans, car loans, or personal loans."
      category="Calculators"
      categoryHref="/tools?category=calculators"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400 ml-1">Loan Amount (Principal)</label>
            <input
              type="number"
              placeholder="e.g. 50000"
              value={principal}
              onChange={(e) => { setPrincipal(e.target.value); setEmi(null); }}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400 ml-1">Interest Rate (% p.a.)</label>
            <input
              type="number"
              step="0.1"
              placeholder="e.g. 7.5"
              value={rate}
              onChange={(e) => { setRate(e.target.value); setEmi(null); }}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400 ml-1">Loan Tenure</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="e.g. 5"
                value={tenure}
                onChange={(e) => { setTenure(e.target.value); setEmi(null); }}
                className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500"
              />
              <select
                value={tenureType}
                onChange={(e) => { setTenureType(e.target.value as "years" | "months"); setEmi(null); }}
                className="w-32 bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500"
              >
                <option value="years">Years</option>
                <option value="months">Months</option>
              </select>
            </div>
          </div>
        </div>

        {emi !== null && totalAmount !== null && totalInterest !== null && (
          <div className="glass p-8 rounded-2xl border border-green-500/30 animate-scale-in space-y-6">
            <div className="text-center">
              <h3 className="text-gray-400 font-medium mb-2">Monthly EMI</h3>
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
                {emi.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
              <div className="text-center">
                <div className="text-gray-500 text-sm mb-1">Total Interest</div>
                <div className="text-xl font-semibold text-white">
                  {totalInterest.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-500 text-sm mb-1">Total Amount</div>
                <div className="text-xl font-semibold text-white">
                  {totalAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </div>
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
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl py-6 border-0 shadow-lg shadow-green-500/20 hover:from-green-600 hover:to-emerald-600"
            disabled={!principal || !rate || !tenure}
          >
            <Calculator className="w-5 h-5 mr-2" />
            Calculate EMI
          </Button>
        </div>
      </div>
    </ToolLayout>
  )
}
