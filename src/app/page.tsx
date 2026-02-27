import { prisma } from "@/lib/prisma";
import { ExternalLink, Github, Sparkles, CheckCircle, Clock, XCircle, Code, Rocket } from "lucide-react";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function Home() {
  const websites = await prisma.website.findMany({
    orderBy: { createdAt: "desc" },
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "DEPLOYED":
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case "PENDING":
        return <Clock className="w-4 h-4 text-amber-400 animate-pulse" />;
      case "FAILED":
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DEPLOYED":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "PENDING":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "FAILED":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  return (
    <main className="min-h-screen bg-[#030303] text-zinc-100 font-sans selection:bg-indigo-500/30">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] pointer-events-none" />
      <div className="fixed inset-0 z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 lg:px-8">

        {/* Header Section */}
        <div className="text-center mb-24 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>AI-Generated Landing Pages</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Openpages</span>
          </h1>
          <p className="text-lg text-zinc-400 leading-relaxed">
            A curated marketplace of production-ready landing pages generated fully autonomously by Openclaw agents. Browse, preview, and acquire the source code instantly.
          </p>
        </div>

        {/* Grid Section */}
        {websites.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 mt-12 border border-zinc-800/50 rounded-2xl bg-zinc-900/20 backdrop-blur-sm">
            <Rocket className="w-12 h-12 text-zinc-600 mb-4" />
            <h3 className="text-xl font-medium text-zinc-300 mb-2">No pages generated yet</h3>
            <p className="text-zinc-500 text-center max-w-md">
              The Openclaw agents are currently dormant. Kick off a generation pipeline to see new websites appear here automatically.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {websites.map((site: any) => (
              <div
                key={site.id}
                className="group relative flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-xl overflow-hidden hover:border-indigo-500/50 transition-all duration-500 hover:shadow-[0_0_40px_-15px_rgba(99,102,241,0.3)]"
              >
                {/* Image Placeholder / Screenshot */}
                <div className="relative aspect-video bg-zinc-950 border-b border-zinc-800 overflow-hidden">
                  {site.screenshot ? (
                    <img
                      src={site.screenshot}
                      alt={site.name}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-in-out"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-zinc-900 to-zinc-950">
                      <Code className="w-12 h-12 text-zinc-800" />
                    </div>
                  )}
                  {/* Status overlay */}
                  <div className="absolute top-4 right-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border backdrop-blur-md ${getStatusColor(site.status)}`}>
                      {getStatusIcon(site.status)}
                      {site.status}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col flex-1 p-6">
                  <h3 className="text-xl font-semibold text-zinc-100 mb-2 group-hover:text-indigo-300 transition-colors">
                    {site.name}
                  </h3>
                  <p className="text-sm text-zinc-400 mb-6 flex-1">
                    Generated on {new Date(site.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>

                  <div className="flex items-center gap-3 mt-auto">
                    {site.vercelUrl ? (
                      <a
                        href={site.vercelUrl.startsWith('http') ? site.vercelUrl : `https://${site.vercelUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex justify-center items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-400 hover:shadow-[0_0_20px_-5px_rgba(99,102,241,0.5)] transition-all duration-300"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Live Preview
                      </a>
                    ) : (
                      <button disabled className="flex-1 flex justify-center items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 text-zinc-500 text-sm font-medium cursor-not-allowed border border-zinc-700/50">
                        <ExternalLink className="w-4 h-4" />
                        Preview Unavailable
                      </button>
                    )}

                    {site.githubUrl ? (
                      <a
                        href={site.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-11 h-11 rounded-xl bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white border border-zinc-700 transition-all duration-300"
                      >
                        <Github className="w-5 h-5" />
                      </a>
                    ) : (
                      <button disabled className="flex items-center justify-center w-11 h-11 rounded-xl bg-zinc-800/50 text-zinc-600 border border-zinc-800 cursor-not-allowed">
                        <Github className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
