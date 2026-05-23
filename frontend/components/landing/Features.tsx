import { Zap, Shield, BarChart3, Clock, CheckCircle, TrendingDown } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Instant Results",
    description:
      "No waiting, no API calls. Our audit engine runs entirely in your browser and returns results in under a second.",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
  },
  {
    icon: TrendingDown,
    title: "Deterministic Rules",
    description:
      "Savings calculations are based on real pricing data and proven optimization patterns — not AI guesses.",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
  },
  {
    icon: BarChart3,
    title: "Per-Tool Breakdown",
    description:
      "See exactly which subscriptions are costing you the most and get specific, actionable recommendations for each.",
    color: "text-violet-400",
    bg: "bg-violet-400/10",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description:
      "Your data never leaves your browser unless you choose to save it. No tracking, no data selling.",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    icon: Clock,
    title: "Auto-Saved",
    description:
      "Your form data is automatically saved locally. Come back later and pick up right where you left off.",
    color: "text-orange-400",
    bg: "bg-orange-400/10",
  },
  {
    icon: CheckCircle,
    title: "Honest Assessments",
    description:
      "If your spend is already optimized, we'll tell you. No inflated savings numbers to make us look good.",
    color: "text-pink-400",
    bg: "bg-pink-400/10",
  },
];

export function Features() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Built for real teams, not demos
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            A no-nonsense tool that gives you straight answers about your AI spend.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group rounded-xl border border-white/8 bg-white/3 p-6 hover:border-white/15 hover:bg-white/5 transition-all duration-200"
              >
                <div
                  className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${feature.bg} mb-4`}
                >
                  <Icon className={`h-5 w-5 ${feature.color}`} />
                </div>
                <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
