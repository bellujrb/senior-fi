import { TokenMarketplace } from "@/components/token-marketplace"
import { NavBar } from "@/components/nav-bar"
import { Footer } from "@/components/footer"

export default function MarketplacePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <NavBar />
      <TokenMarketplace />
      <Footer />
    </div>
  )
} 